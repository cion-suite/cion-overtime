import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';
import { computeTotals } from '@/shared/lib/overtime/helpers';
import { fmtMM } from '@/shared/lib/time';
import { cn } from '@/shared/lib/utils';
import { Caption } from '@/shared/ui/caption';
import { HistoryDialog } from '@/features/overtime-history';
import { ImportExportActions } from '@/features/overtime-import-export';

export function BalanceHeader() {
    const t = useT();
    const { entries } = useOvertime();
    const { balance, gross, deducted } = computeTotals(entries);
    const negative = balance < 0;

    return (
        <div className="flex shrink-0 items-start justify-between gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
                <Caption>{t('overtime.balance.label')}</Caption>
                <div
                    className={cn(
                        'text-[40px] leading-none font-semibold tabular-nums tracking-tight',
                        negative && 'text-destructive',
                    )}
                >
                    {fmtMM(balance)}
                </div>
                <div className="text-xs text-muted-foreground/80 tabular-nums">
                    {t('overtime.balance.sub', {
                        gross: fmtMM(gross),
                        ded: fmtMM(deducted),
                    })}
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <ImportExportActions />
                <HistoryDialog />
            </div>
        </div>
    );
}
