import { app } from 'electron';
import pkg from 'electron-updater';
import type { ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater';
import { appEvents, registerHandlers } from '@cion-suite/core/ipc';

import type { UpdaterIpcResult } from '@shared/types';

import type { AutoUpdaterController, CreateAutoUpdaterOptions } from '../types/updater.js';

const { autoUpdater } = pkg;

function notesToString(notes: UpdateInfo['releaseNotes']): string | undefined {
    return typeof notes === 'string' ? notes : undefined;
}

export function createAutoUpdater(opts: CreateAutoUpdaterOptions): AutoUpdaterController {
    const log = opts.logger;
    let updateDownloaded = false;
    let checkTimeoutId: NodeJS.Timeout | null = null;
    let checkIntervalId: NodeJS.Timeout | null = null;

    autoUpdater.autoDownload = true;
    // main.ts before-quit handler installs pending updates explicitly; autoInstallOnAppQuit=true
    // would race against that path on quitAndInstall.
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.allowDowngrade = false;

    const onChecking = (): void => log?.info('updater: checking');
    const onAvailable = (info: UpdateInfo): void => {
        log?.info('updater: available', info.version);
        appEvents.emit('updater:available', {
            version: info.version,
            releaseNotes: notesToString(info.releaseNotes),
            releaseName: info.releaseName ?? undefined,
            releaseDate: info.releaseDate,
        });
    };
    const onNotAvailable = (): void => {
        log?.info('updater: not available');
        appEvents.emit('updater:not-available');
    };
    const onError = (err: Error): void => {
        log?.error('updater error', err);
        appEvents.emit('updater:error', { message: err.message });
    };
    const onProgress = (p: ProgressInfo): void => {
        appEvents.emit('updater:progress', p);
    };
    const onDownloaded = (event: UpdateDownloadedEvent): void => {
        log?.info('updater: downloaded', event.version);
        updateDownloaded = true;
        if (checkIntervalId) {
            clearInterval(checkIntervalId);
            checkIntervalId = null;
        }
        appEvents.emit('updater:downloaded', {
            version: event.version,
            releaseNotes: notesToString(event.releaseNotes),
            releaseName: event.releaseName ?? undefined,
            releaseDate: event.releaseDate,
        });
    };

    autoUpdater.on('checking-for-update', onChecking);
    autoUpdater.on('update-available', onAvailable);
    autoUpdater.on('update-not-available', onNotAvailable);
    autoUpdater.on('error', onError);
    autoUpdater.on('download-progress', onProgress);
    autoUpdater.on('update-downloaded', onDownloaded);

    function installPendingUpdate(): void {
        try {
            autoUpdater.quitAndInstall(true, true);
        } catch (error) {
            log?.error('installPendingUpdate failed', error);
            // Bypass before-quit re-entry — quitAndInstall already failed once.
            app.exit(1);
        }
    }

    async function scheduledCheck(): Promise<void> {
        if (updateDownloaded) return;
        try {
            await autoUpdater.checkForUpdates();
        } catch (error) {
            log?.error('updater check failed', error);
        }
    }

    async function runCheck(): Promise<UpdaterIpcResult> {
        try {
            await autoUpdater.checkForUpdates();
            return { ok: true };
        } catch (error) {
            return { ok: false, error: (error as Error).message };
        }
    }

    registerHandlers({
        'updater:check-for-updates': runCheck,
        'updater:quit-and-install': () => {
            installPendingUpdate();
        },
    });

    if (app.isPackaged) {
        checkTimeoutId = setTimeout(() => {
            void scheduledCheck();
        }, opts.initialDelay ?? 3000);

        checkIntervalId = setInterval(
            () => {
                void scheduledCheck();
            },
            opts.checkInterval ?? 60 * 60 * 1000
        );
    } else {
        log?.info('updater: scheduling skipped (dev mode)');
    }

    function dispose(): void {
        if (checkTimeoutId) clearTimeout(checkTimeoutId);
        if (checkIntervalId) clearInterval(checkIntervalId);
        autoUpdater.off('checking-for-update', onChecking);
        autoUpdater.off('update-available', onAvailable);
        autoUpdater.off('update-not-available', onNotAvailable);
        autoUpdater.off('error', onError);
        autoUpdater.off('download-progress', onProgress);
        autoUpdater.off('update-downloaded', onDownloaded);
    }

    return {
        isUpdateDownloaded: () => updateDownloaded,
        installPendingUpdate,
        dispose,
    };
}
