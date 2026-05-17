import { X } from 'lucide-react';

import type { Deduction } from '@shared/types';

import { useT } from '@/shared/i18n';
import { fmtDateHuman, fmtMM } from '@/shared/lib/time';
import { Button } from '@/shared/ui/shadcn/button';

interface DeductionListProps {
    entryId: string;
    deductions: Deduction[];
    onRemove: (entryId: string, dedId: string) => void;
}

export function DeductionList({ entryId, deductions, onRemove }: DeductionListProps) {
    const t = useT();
    if (deductions.length === 0) return null;
    const sorted = deductions
        .slice()
        .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    return (
        <ul className="mt-3 flex flex-col gap-1 border-t pt-2">
            {sorted.map((d) => (
                <li
                    key={d.id}
                    className="flex items-center justify-between gap-2 text-xs"
                >
                    <div className="flex items-baseline gap-2 text-muted-foreground">
                        <span className="min-w-14 font-mono tabular-nums font-medium text-destructive">
                            −{fmtMM(d.minutes)}
                        </span>
                        <span className="font-mono tabular-nums">
                            {fmtDateHuman(d.date) || '—'}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(entryId, d.id)}
                        aria-label={t('overtime.day.deleteDeductionAria')}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <X />
                    </Button>
                </li>
            ))}
        </ul>
    );
}
