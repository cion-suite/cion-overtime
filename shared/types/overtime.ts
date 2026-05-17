export interface Deduction {
    id: string;
    date: string;
    minutes: number;
    note: string;
    createdAt: number;
}

export interface OvertimeEntry {
    id: string;
    type: 'overtime';
    date: string;
    start: string;
    end: string;
    minutes: number;
    note: string;
    createdAt: number;
    deductions: Deduction[];
}

export interface AutoLogBreakdown {
    sourceDate: string;
    minutes: number;
}

export interface AutoLogEntry {
    id: string;
    date: string;
    createdAt: number;
    taken: number;
    breakdown: AutoLogBreakdown[];
}

export interface OvertimeSnapshot {
    version: number;
    savedAt: string;
    entries: OvertimeEntry[];
    autoLog: AutoLogEntry[];
}

export type OvertimeIpcResult<T = void> =
    | (T extends void ? { ok: true } : { ok: true; data: T })
    | { ok: false; error: string };

export interface OvertimeBridge {
    read: () => Promise<OvertimeSnapshot>;
    write: (snapshot: OvertimeSnapshot) => Promise<OvertimeIpcResult>;
    exportToFile: () => Promise<OvertimeIpcResult<{ path: string }>>;
    importFromFile: () => Promise<OvertimeIpcResult<{ snapshot: OvertimeSnapshot }>>;
}

export const OVERTIME_CHANNELS = {
    read: 'overtime:read',
    write: 'overtime:write',
    exportToFile: 'overtime:export-to-file',
    importFromFile: 'overtime:import-from-file',
} as const;
