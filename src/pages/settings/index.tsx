import { useTheme } from 'next-themes';

import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent } from '@/shared/ui/shadcn/card';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSet,
    FieldTitle,
} from '@/shared/ui/shadcn/field';
import {
    ToggleGroup,
    ToggleGroupItem,
} from '@/shared/ui/shadcn/toggle-group';
import { toast } from '@/shared/lib/toast';
import { i18n, SUPPORTED_LOCALES, useLocale, useT } from '@/shared/i18n';
import { useUpdaterCheckForUpdates } from '@/shared/lib/updater';

const THEMES = ['light', 'dark'] as const;

export function SettingsPage() {
    const t = useT();
    const { theme, setTheme } = useTheme();
    const locale = useLocale();

    const { supported, checking, check } = useUpdaterCheckForUpdates();

    const handleCheckNow = async () => {
        const r = await check();
        if (!r.ok) toast.error(r.error ?? t('error'));
    };

    return (
        <div className="mx-auto flex h-full w-full max-w-3xl min-h-0 flex-col">
            <Card className="flex h-full min-h-0 flex-col">
                <CardContent className="scroll-fade min-h-0 flex-1 overflow-y-auto">
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>{t('settings.groups.appearance')}</FieldLegend>
                            <FieldGroup>
                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldTitle>{t('settings.theme.label')}</FieldTitle>
                                        <FieldDescription>
                                            {t('settings.theme.description')}
                                        </FieldDescription>
                                    </FieldContent>
                                    <ToggleGroup
                                        type="single"
                                        variant="outline"
                                        size="sm"
                                        value={theme}
                                        onValueChange={(v) => v && setTheme(v)}
                                    >
                                        {THEMES.map((mode) => (
                                            <ToggleGroupItem key={mode} value={mode}>
                                                {t(`theme.${mode}`)}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </Field>

                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldTitle>{t('settings.locale.label')}</FieldTitle>
                                        <FieldDescription>
                                            {t('settings.locale.description')}
                                        </FieldDescription>
                                    </FieldContent>
                                    <ToggleGroup
                                        type="single"
                                        variant="outline"
                                        size="sm"
                                        value={locale}
                                        onValueChange={(v) =>
                                            v && void i18n.changeLanguage(v)
                                        }
                                    >
                                        {SUPPORTED_LOCALES.map((code) => (
                                            <ToggleGroupItem key={code} value={code}>
                                                {code.toUpperCase()}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </Field>
                            </FieldGroup>
                        </FieldSet>

                        <FieldSet>
                            <FieldLegend>{t('settings.groups.updates')}</FieldLegend>
                            <FieldGroup>
                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldTitle>{t('settings.updater.label')}</FieldTitle>
                                        <FieldDescription>
                                            {supported
                                                ? t('settings.updater.description')
                                                : t('settings.updater.unavailable')}
                                        </FieldDescription>
                                    </FieldContent>
                                    {supported && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={checking}
                                            onClick={() => void handleCheckNow()}
                                        >
                                            {checking
                                                ? t('settings.updater.checking')
                                                : t('settings.updater.checkNow')}
                                        </Button>
                                    )}
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </CardContent>
            </Card>
        </div>
    );
}
