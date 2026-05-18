import { useEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { i18n } from '@/shared/i18n';
import { STORAGE_KEYS } from '@/shared/config/storage-keys';

export function I18nProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        function onLangChange(lang: string) {
            try {
                localStorage.setItem(STORAGE_KEYS.LANG, lang);
            } catch {
                // ignore quota/privacy errors
            }
        }
        i18n.on('languageChanged', onLangChange);
        return () => {
            i18n.off('languageChanged', onLangChange);
        };
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
