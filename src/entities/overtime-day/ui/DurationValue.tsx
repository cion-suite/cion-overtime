import { fmtDurParts } from '@/shared/lib/time';
import { cn } from '@/shared/lib/utils';

interface DurationValueProps {
    minutes: number;
    className?: string;
    muted?: boolean;
}

export function DurationValue({ minutes, className, muted }: DurationValueProps) {
    const { sign, h, m } = fmtDurParts(minutes);
    return (
        <span className={cn('font-mono tabular-nums', className)}>
            {sign}
            {h === 0 ? null : (
                <>
                    {h}
                    <span className={cn('ml-0.5 font-normal', muted ? 'text-muted-foreground/70' : 'text-muted-foreground')}>
                        ч
                    </span>
                </>
            )}
            {h !== 0 && m !== 0 ? ' ' : null}
            {(h === 0 || m !== 0) && (
                <>
                    {m}
                    <span className={cn('ml-0.5 font-normal', muted ? 'text-muted-foreground/70' : 'text-muted-foreground')}>
                        м
                    </span>
                </>
            )}
        </span>
    );
}
