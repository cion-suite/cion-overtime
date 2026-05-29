import type { UpdaterInfo, UpdaterProgress } from './updater.js';

declare module '@cion-suite/core/events' {
    interface EventMap {
        'updater:available': UpdaterInfo;
        'updater:not-available': void;
        'updater:downloaded': UpdaterInfo;
        'updater:error': { message: string };
        'updater:progress': UpdaterProgress;
    }
}

export {};
