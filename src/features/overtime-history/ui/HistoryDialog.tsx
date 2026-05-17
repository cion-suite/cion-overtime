import { ChevronRight, History } from 'lucide-react';
import { useState } from 'react';

import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';
import { fmtDateHuman, fmtMM } from '@/shared/lib/time';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/shadcn/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/shadcn/dialog';
import { Empty, EmptyDescription, EmptyTitle } from '@/shared/ui/shadcn/empty';
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area';
import { Separator } from '@/shared/ui/shadcn/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/shared/ui/shadcn/tooltip';

export function HistoryDialog() {
    const t = useT();
    const { autoLog, removeAutoLog } = useOvertime();
    const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

    const list = autoLog.slice().sort((a, b) => b.createdAt - a.createdAt);
    const summary = list.length
        ? t('overtime.history.summary', { count: list.length })
        : t('overtime.history.empty.description');

    function toggle(id: string) {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function handleRemove(id: string) {
        if (!confirm(t('overtime.history.confirmDelete'))) return;
        setOpenIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
        removeAutoLog(id);
    }

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label={t('overtime.history.buttonAria')}
                        >
                            <History />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>{t('overtime.history.tooltip')}</TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('overtime.history.title')}</DialogTitle>
                    <DialogDescription>{summary}</DialogDescription>
                </DialogHeader>
                {list.length === 0 ? (
                    <Empty>
                        <EmptyTitle>{t('overtime.history.empty.title')}</EmptyTitle>
                        <EmptyDescription>
                            {t('overtime.history.empty.description')}
                        </EmptyDescription>
                    </Empty>
                ) : (
                    <ScrollArea className="max-h-[60vh] pr-2">
                        <ul className="flex flex-col gap-2">
                            {list.map((h) => {
                                const isOpen = openIds.has(h.id);
                                const rows = h.breakdown
                                    .slice()
                                    .sort((a, b) =>
                                        (a.sourceDate || '').localeCompare(
                                            b.sourceDate || '',
                                        ),
                                    );
                                return (
                                    <li
                                        key={h.id}
                                        className="rounded-md border bg-card overflow-hidden"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggle(h.id)}
                                            aria-expanded={isOpen}
                                            className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-3 py-2 text-left font-mono tabular-nums text-sm transition-colors hover:bg-muted/50"
                                        >
                                            <span className="font-medium">
                                                {fmtDateHuman(h.date) || '—'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {t('overtime.history.breakdown', {
                                                    count: h.breakdown.length,
                                                })}
                                            </span>
                                            <span className="font-medium">
                                                {fmtMM(h.taken)}
                                            </span>
                                            <ChevronRight
                                                className={cn(
                                                    'size-4 text-muted-foreground transition-transform',
                                                    isOpen && 'rotate-90',
                                                )}
                                            />
                                        </button>
                                        {isOpen && (
                                            <>
                                                <Separator />
                                                <div className="p-3">
                                                    <ul className="divide-y">
                                                        {rows.map((b, i) => (
                                                            <li
                                                                key={`${b.sourceDate}-${i}`}
                                                                className="flex items-baseline justify-between gap-3 py-1.5 font-mono tabular-nums text-sm"
                                                            >
                                                                <span>
                                                                    {fmtDateHuman(
                                                                        b.sourceDate,
                                                                    ) || '—'}
                                                                </span>
                                                                <span className="font-medium">
                                                                    {fmtMM(b.minutes)}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="flex justify-end pt-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleRemove(h.id)
                                                            }
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            {t(
                                                                'overtime.history.deleteButton',
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
}
