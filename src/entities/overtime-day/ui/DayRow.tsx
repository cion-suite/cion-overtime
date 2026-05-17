import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import type { OvertimeEntry } from '@shared/types';

import { useT } from '@/shared/i18n';
import { deductedFor, isDead, remainingFor } from '@/shared/lib/overtime/helpers';
import { fmtDateHuman, fmtMM } from '@/shared/lib/time';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/shadcn/button';
import { Separator } from '@/shared/ui/shadcn/separator';

interface DayRowProps {
    entry: OvertimeEntry;
    expanded: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    children?: ReactNode;
}

export function DayRow({ entry, expanded, onToggle, onDelete, children }: DayRowProps) {
    const t = useT();
    const dead = isDead(entry);
    const left = remainingFor(entry);
    const ded = deductedFor(entry);

    return (
        <div
            className={cn(
                'rounded-md border border-border/70 bg-card overflow-hidden',
                dead && 'opacity-50',
            )}
        >
            <div className="grid grid-cols-[minmax(96px,auto)_1fr_auto_auto] items-center gap-3 px-3 py-2">
                <div className="font-mono text-[13px] tabular-nums font-medium">
                    {fmtDateHuman(entry.date) || t('overtime.day.noDate')}
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">
                    <span className="font-medium text-foreground">
                        {entry.start}–{entry.end}
                    </span>
                    <span className="mx-1.5 text-muted-foreground/60">·</span>
                    <span className="font-mono">{fmtMM(entry.minutes)}</span>
                    {ded > 0 && (
                        <>
                            <span className="mx-1.5 text-muted-foreground/60">·</span>
                            <span>{t('overtime.day.deducted', { value: fmtMM(ded) })}</span>
                        </>
                    )}
                </div>
                <div
                    className={cn(
                        'min-w-14 text-right font-mono text-[13px] tabular-nums font-medium',
                        left === 0 && 'text-muted-foreground',
                    )}
                >
                    {fmtMM(left)}
                </div>
                <div className="flex items-center gap-1">
                    {!dead && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onToggle(entry.id)}
                            aria-expanded={expanded}
                        >
                            {expanded
                                ? t('overtime.day.collapse')
                                : t('overtime.day.expand')}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(entry.id)}
                        aria-label={t('overtime.day.deleteAria')}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <X />
                    </Button>
                </div>
            </div>
            {expanded && !dead && children && (
                <>
                    <Separator />
                    <div className="bg-muted/30 px-3 py-3">{children}</div>
                </>
            )}
        </div>
    );
}
