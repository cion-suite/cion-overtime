import type { AutoLogBreakdown } from '@shared/types';

import { useT } from '@/shared/i18n';
import { fmtDateHuman, fmtMM } from '@/shared/lib/time';
import { Button } from '@/shared/ui/shadcn/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area';

export interface AutoDeductDialogState {
    requested: number;
    taken: number;
    breakdown: AutoLogBreakdown[];
}

interface AutoDeductResultDialogProps {
    state: AutoDeductDialogState | null;
    onOpenChange: (open: boolean) => void;
}

export function AutoDeductResultDialog({
    state,
    onOpenChange,
}: AutoDeductResultDialogProps) {
    const t = useT();
    const open = state != null;
    const summary = state
        ? state.taken < state.requested
            ? t('overtime.autoDeductResult.partial', {
                  requested: fmtMM(state.requested),
                  taken: fmtMM(state.taken),
              })
            : t('overtime.autoDeductResult.total', {
                  count: state.breakdown.length,
                  taken: fmtMM(state.taken),
              })
        : '';
    const rows = state
        ? state.breakdown
              .slice()
              .sort((a, b) => (a.sourceDate || '').localeCompare(b.sourceDate || ''))
        : [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('overtime.autoDeductResult.title')}</DialogTitle>
                    <DialogDescription className="font-mono tabular-nums">
                        {summary}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-72">
                    <ul className="divide-y">
                        {rows.map((b, idx) => (
                            <li
                                key={`${b.sourceDate}-${idx}`}
                                className="flex items-baseline justify-between gap-3 py-2 text-sm font-mono tabular-nums"
                            >
                                <span>{fmtDateHuman(b.sourceDate) || '—'}</span>
                                <span className="font-medium">{fmtMM(b.minutes)}</span>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>{t('overtime.autoDeductResult.ok')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
