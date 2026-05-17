import type {
    AutoLogBreakdown,
    AutoLogEntry,
    OvertimeEntry,
} from '@shared/types';

import { uid } from '@/shared/lib/time';

export const MIN_USABLE = 15;

export const deductedFor = (e: OvertimeEntry): number =>
    e.deductions.reduce((s, d) => s + d.minutes, 0);

export const remainingFor = (e: OvertimeEntry): number =>
    Math.max(0, e.minutes - deductedFor(e));

export const isDead = (e: OvertimeEntry): boolean =>
    e.type === 'overtime' && remainingFor(e) < MIN_USABLE;

export interface OvertimeTotals {
    balance: number;
    gross: number;
    deducted: number;
}

export function computeTotals(entries: OvertimeEntry[]): OvertimeTotals {
    let gross = 0;
    let deducted = 0;
    let balance = 0;
    for (const e of entries) {
        if (e.type !== 'overtime') continue;
        gross += e.minutes;
        const d = deductedFor(e);
        deducted += d;
        const left = e.minutes - d;
        if (left >= MIN_USABLE) balance += left;
    }
    return { balance, gross, deducted };
}

export interface AutoDeductResult {
    entries: OvertimeEntry[];
    autoLog: AutoLogEntry[];
    taken: number;
    breakdown: AutoLogBreakdown[];
}

export function computeAutoDeduct(
    entries: OvertimeEntry[],
    autoLog: AutoLogEntry[],
    total: number,
    date: string,
): AutoDeductResult {
    if (total <= 0) {
        return { entries, autoLog, taken: 0, breakdown: [] };
    }

    const ordered = entries
        .slice()
        .sort(
            (a, b) =>
                (a.date || '').localeCompare(b.date || '') || a.createdAt - b.createdAt,
        );

    const nextById = new Map<string, OvertimeEntry>();
    for (const e of entries) nextById.set(e.id, { ...e, deductions: [...e.deductions] });

    let need = total;
    let taken = 0;
    const breakdown: AutoLogBreakdown[] = [];

    for (const ord of ordered) {
        if (need <= 0) break;
        const e = nextById.get(ord.id)!;
        const avail = remainingFor(e);
        if (avail < MIN_USABLE) continue;
        let take = Math.min(need, avail);
        const leftover = avail - take;
        if (leftover > 0 && leftover < MIN_USABLE) take = avail;
        if (take <= 0) continue;
        e.deductions = [
            ...e.deductions,
            { id: uid(), date, minutes: take, note: '', createdAt: Date.now() },
        ];
        breakdown.push({ sourceDate: e.date, minutes: take });
        need -= take;
        taken += take;
    }

    if (taken === 0) {
        return { entries, autoLog, taken: 0, breakdown: [] };
    }

    const nextEntries = entries.map((e) => nextById.get(e.id)!);
    const log: AutoLogEntry = {
        id: uid(),
        date,
        createdAt: Date.now(),
        taken,
        breakdown,
    };
    return {
        entries: nextEntries,
        autoLog: [log, ...autoLog],
        taken,
        breakdown,
    };
}
