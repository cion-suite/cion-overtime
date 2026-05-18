import { createContext, useContext } from 'react';

export interface ThresholdContextValue {
    threshold: number;
    setThreshold: (value: number) => void;
}

export const ThresholdContext = createContext<ThresholdContextValue | null>(null);

export function useThreshold(): ThresholdContextValue {
    const ctx = useContext(ThresholdContext);
    if (!ctx) throw new Error('useThreshold: missing ThresholdProvider');
    return ctx;
}
