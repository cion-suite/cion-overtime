import { useEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { i18n, type SupportedLocale } from '@/shared/i18n';

export function I18nProvider({
    children,
    locale,
}: {
    children: ReactNode;
    locale?: SupportedLocale;
}) {
    useEffect(() => {
        if (locale && i18n.language !== locale) void i18n.changeLanguage(locale);
    }, [locale]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
