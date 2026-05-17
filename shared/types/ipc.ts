import type { OvertimeBridge } from './overtime.js';

export type UpdaterIpcResult = { ok: true } | { ok: false; error: string };

export interface ErrorReport {
    message: string;
    stack?: string;
    componentStack?: string;
}

export interface AppBridge {
    signalReady: () => Promise<void>;
    reportError: (payload: ErrorReport) => Promise<void>;
    updater: {
        checkForUpdates: () => Promise<UpdaterIpcResult>;
        quitAndInstall: () => Promise<void>;
    };
    overtime: OvertimeBridge;
}
