import type { ReactNode } from 'react';

import { useStorage } from '@/shared/lib/local-storage';
import { STORAGE } from '@/shared/config/storage-keys';
import { ThresholdContext } from '@/shared/lib/threshold';

export function ThresholdProvider({ children }: { children: ReactNode }) {
    const [threshold, setThreshold] = useStorage(STORAGE.threshold);
    return (
        <ThresholdContext.Provider value={{ threshold, setThreshold }}>
            {children}
        </ThresholdContext.Provider>
    );
}
