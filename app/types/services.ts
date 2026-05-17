import type { z } from 'zod';
import type { Logger } from '@cion-suite/core/log';
import type { SecureStorage } from '@cion-suite/core/storage';
import type { SettingsStore } from '@cion-suite/core/settings';
import type { settingsSchema } from '../services/settings-schema.js';
import type { overtimeStoreSchema } from '../services/overtime-schema.js';

export type AppSettings = z.infer<typeof settingsSchema>;
export type OvertimeStoreShape = z.infer<typeof overtimeStoreSchema>;

export interface AppServices {
    logger: Logger;
    storage: SecureStorage;
    settings: SettingsStore<AppSettings>;
    overtime: SettingsStore<OvertimeStoreShape>;
}
