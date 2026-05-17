import type { ReactNode } from 'react';

import { Caption } from '@/shared/ui/caption';

export function SectionTitle({ children }: { children: ReactNode }) {
    return <Caption className="mt-1 shrink-0">{children}</Caption>;
}
