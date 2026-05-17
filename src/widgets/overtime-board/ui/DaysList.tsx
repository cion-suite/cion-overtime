import { useState } from 'react';

import { DayRow, DeductionList } from '@/entities/overtime-day';
import { ManualDeductForm } from '@/features/overtime-manual-deduct';
import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';
import { fmtDateHuman } from '@/shared/lib/time';
import { Empty, EmptyDescription, EmptyTitle } from '@/shared/ui/shadcn/empty';
import { Input } from '@/shared/ui/shadcn/input';

export function DaysList() {
    const t = useT();
    const { entries, removeEntry, removeDeduction } = useOvertime();
    const [filter, setFilter] = useState('');
    const [openSet, setOpenSet] = useState<Set<string>>(() => new Set());

    const q = filter.trim().toLowerCase();
    const items = entries
        .filter(
            (e) =>
                !q ||
                (e.date && (e.date.includes(q) || fmtDateHuman(e.date).includes(q))) ||
                (e.note && e.note.toLowerCase().includes(q)),
        )
        .sort(
            (a, b) =>
                (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt,
        );

    function toggle(id: string) {
        setOpenSet((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function handleDelete(id: string) {
        if (!confirm(t('overtime.day.confirmDelete'))) return;
        setOpenSet((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
        removeEntry(id);
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2">
            <Input
                placeholder={t('overtime.list.search')}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="shrink-0"
            />

            <div className="scroll-fade min-h-0 flex-1 overflow-y-auto pr-1">
                {items.length === 0 ? (
                    <Empty>
                        <EmptyTitle>{t('overtime.list.emptyTitle')}</EmptyTitle>
                        <EmptyDescription>
                            {entries.length === 0
                                ? t('overtime.list.noDays')
                                : t('overtime.list.noMatches')}
                        </EmptyDescription>
                    </Empty>
                ) : (
                    <ul className="flex flex-col gap-1.5">
                        {items.map((entry) => {
                            const expanded = openSet.has(entry.id);
                            return (
                                <li key={entry.id}>
                                    <DayRow
                                        entry={entry}
                                        expanded={expanded}
                                        onToggle={toggle}
                                        onDelete={handleDelete}
                                    >
                                        <ManualDeductForm entryId={entry.id} />
                                        <DeductionList
                                            entryId={entry.id}
                                            deductions={entry.deductions}
                                            onRemove={removeDeduction}
                                        />
                                    </DayRow>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
