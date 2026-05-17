import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

const TRACKING = {
    normal: 'tracking-[0.05em]',
    wide: 'tracking-[0.08em]',
} as const;

interface CaptionProps extends ComponentProps<'div'> {
    tracking?: keyof typeof TRACKING;
}

export function Caption({ className, tracking = 'wide', ...props }: CaptionProps) {
    return (
        <div
            className={cn(
                'text-[11px] font-medium uppercase text-muted-foreground',
                TRACKING[tracking],
                className,
            )}
            {...props}
        />
    );
}
