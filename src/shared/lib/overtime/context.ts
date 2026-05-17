import { createContext, useContext } from 'react';
import type { AutoLogBreakdown, AutoLogEntry, OvertimeEntry } from '@shared/types';

export interface AutoDeductOutcome {
    taken: number;
    breakdown: AutoLogBreakdown[];
}

export interface OvertimeContextValue {
    entries: OvertimeEntry[];
    autoLog: AutoLogEntry[];
    loading: boolean;
    addOvertime: (date: string, start: string, end: string) => void;
    removeEntry: (id: string) => void;
    addDeduction: (entryId: string, date: string, minutes: number) => void;
    removeDeduction: (entryId: string, dedId: string) => void;
    autoDeduct: (minutes: number, date: string) => AutoDeductOutcome;
    removeAutoLog: (id: string) => void;
    exportToFile: () => Promise<void>;
    importFromFile: () => Promise<void>;
}

export const OvertimeContext = createContext<OvertimeContextValue | null>(null);

export function useOvertime(): OvertimeContextValue {
    const ctx = useContext(OvertimeContext);
    if (!ctx) throw new Error('useOvertime: missing OvertimeProvider');
    return ctx;
}
