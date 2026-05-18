import { defineStorage } from '@/shared/lib/local-storage';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '@/shared/i18n';

export const STORAGE = {
    sidebarOpen: defineStorage<boolean>({
        key: 'cion-overtime:sidebar-open',
        default: true,
    }),
    lang: defineStorage<SupportedLocale>({
        key: 'cion-overtime:lang',
        default: DEFAULT_LOCALE,
        validate: (v): v is SupportedLocale =>
            typeof v === 'string' && SUPPORTED_LOCALES.includes(v as SupportedLocale),
    }),
    lastRoute: defineStorage<string>({
        key: 'cion-overtime:last-route',
        default: '/',
    }),
    threshold: defineStorage<number>({
        key: 'cion-overtime:threshold',
        default: 15,
        validate: (v): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 1,
    }),
};
