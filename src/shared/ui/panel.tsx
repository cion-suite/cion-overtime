import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

export function Panel({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'shrink-0 rounded-md border border-border/70 bg-card px-3.5 py-3',
                className,
            )}
            {...props}
        />
    );
}
