import { AddDayForm } from '@/features/overtime-add-day';
import { AutoDeductCard } from '@/features/overtime-auto-deduct';
import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';

import { BalanceHeader } from './BalanceHeader.js';
import { DaysList } from './DaysList.js';
import { SectionTitle } from './SectionTitle.js';

export function OvertimeBoard() {
    const t = useT();
    const { entries } = useOvertime();
    const count = entries.length;

    return (
        <div className="mx-auto flex h-full w-full max-w-3xl min-h-0 flex-col gap-2.5 pb-1">
            <BalanceHeader />

            <SectionTitle>{t('overtime.sections.add')}</SectionTitle>
            <AddDayForm />

            <SectionTitle>{t('overtime.sections.deduct')}</SectionTitle>
            <AutoDeductCard />

            <SectionTitle>
                {t('overtime.sections.days')}{' '}
                <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground/70">
                    ({count})
                </span>
            </SectionTitle>
            <DaysList />
        </div>
    );
}
