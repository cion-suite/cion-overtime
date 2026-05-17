import { readFile, writeFile } from 'node:fs/promises';
import { BrowserWindow, dialog } from 'electron';
import { registerHandlers } from '@cion-suite/core/ipc';
import { OVERTIME_CHANNELS, type OvertimeSnapshot } from '@shared/types';
import { overtimeSnapshotSchema } from '../services/overtime-schema.js';
import type { AppServices } from '../types/services.js';

function parseSnapshot(raw: unknown): OvertimeSnapshot {
    return overtimeSnapshotSchema.parse(raw);
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export function registerOvertimeHandlers(services: AppServices): void {
    const log = services.logger.child('overtime');

    registerHandlers({
        [OVERTIME_CHANNELS.read]: () => services.overtime.get('snapshot'),
        [OVERTIME_CHANNELS.write]: (_event, payload: unknown) => {
            try {
                services.overtime.set('snapshot', parseSnapshot(payload));
                return { ok: true } as const;
            } catch (error) {
                const message = errorMessage(error);
                log.error('write failed', message);
                return { ok: false, error: message } as const;
            }
        },
        [OVERTIME_CHANNELS.exportToFile]: async (event) => {
            const win = BrowserWindow.fromWebContents(event.sender);
            const snapshot = services.overtime.get('snapshot');
            const options = {
                defaultPath: 'overtime-data.json',
                filters: [{ name: 'JSON', extensions: ['json'] }],
            };
            const result = win
                ? await dialog.showSaveDialog(win, options)
                : await dialog.showSaveDialog(options);
            if (result.canceled || !result.filePath) {
                return { ok: false, error: 'cancelled' } as const;
            }
            try {
                await writeFile(result.filePath, JSON.stringify(snapshot, null, 2), 'utf8');
                return { ok: true, data: { path: result.filePath } } as const;
            } catch (error) {
                const message = errorMessage(error);
                log.error('export failed', message);
                return { ok: false, error: message } as const;
            }
        },
        [OVERTIME_CHANNELS.importFromFile]: async (event) => {
            const win = BrowserWindow.fromWebContents(event.sender);
            const options: Electron.OpenDialogOptions = {
                properties: ['openFile'],
                filters: [{ name: 'JSON', extensions: ['json'] }],
            };
            const result = win
                ? await dialog.showOpenDialog(win, options)
                : await dialog.showOpenDialog(options);
            if (result.canceled || result.filePaths.length === 0) {
                return { ok: false, error: 'cancelled' } as const;
            }
            const [filePath] = result.filePaths;
            if (!filePath) return { ok: false, error: 'no path' } as const;
            try {
                const snapshot = parseSnapshot(JSON.parse(await readFile(filePath, 'utf8')));
                services.overtime.set('snapshot', snapshot);
                return { ok: true, data: { snapshot } } as const;
            } catch (error) {
                const message = errorMessage(error);
                log.error('import failed', message);
                return { ok: false, error: message } as const;
            }
        },
    });
}
