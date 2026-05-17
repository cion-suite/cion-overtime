import { contextBridge, ipcRenderer } from 'electron';
import { exposeAppEventsBridge } from '@cion-suite/core/ipc/preload';
import type { AppBridge } from '@shared/types';
import { OVERTIME_CHANNELS } from '@shared/types';

exposeAppEventsBridge();

const bridge: AppBridge = {
    signalReady: () => ipcRenderer.invoke('system:renderer-ready'),
    reportError: (payload) => ipcRenderer.invoke('errors:report', payload),
    updater: {
        getChannel: () => ipcRenderer.invoke('updater:get-channel'),
        setChannel: (isBeta) => ipcRenderer.invoke('updater:set-channel', isBeta),
        checkForUpdates: () => ipcRenderer.invoke('updater:check-for-updates'),
        quitAndInstall: () => ipcRenderer.invoke('updater:quit-and-install'),
    },
    overtime: {
        read: () => ipcRenderer.invoke(OVERTIME_CHANNELS.read),
        write: (snapshot) => ipcRenderer.invoke(OVERTIME_CHANNELS.write, snapshot),
        exportToFile: () => ipcRenderer.invoke(OVERTIME_CHANNELS.exportToFile),
        importFromFile: () => ipcRenderer.invoke(OVERTIME_CHANNELS.importFromFile),
    },
};

contextBridge.exposeInMainWorld('app', bridge);
