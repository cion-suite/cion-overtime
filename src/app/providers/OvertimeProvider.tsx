import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import type { AutoLogEntry, OvertimeEntry, OvertimeSnapshot } from '@shared/types';

import { useT } from '@/shared/i18n';
import {
    OvertimeContext,
    type AutoDeductOutcome,
    type OvertimeContextValue,
} from '@/shared/lib/overtime/context';
import { computeAutoDeduct } from '@/shared/lib/overtime/helpers';
import { computeInterval, uid } from '@/shared/lib/time';
import { toast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/lib/utils';

const SAVE_DEBOUNCE_MS = 350;

interface OvertimeData {
    entries: OvertimeEntry[];
    autoLog: AutoLogEntry[];
}

const EMPTY: OvertimeData = { entries: [], autoLog: [] };

function buildSnapshot(data: OvertimeData): OvertimeSnapshot {
    return {
        version: 2,
        savedAt: new Date().toISOString(),
        entries: data.entries,
        autoLog: data.autoLog,
    };
}

// Signature for change-detection on debounced save — drops `savedAt`, which would
// otherwise force a write on every re-render even when domain data is unchanged.
function signature(data: OvertimeData): string {
    return JSON.stringify({ entries: data.entries, autoLog: data.autoLog });
}

export function OvertimeProvider({ children }: { children: ReactNode }) {
    const t = useT();
    const [data, setData] = useState<OvertimeData>(EMPTY);
    const [loading, setLoading] = useState(true);

    const bridge = window.app?.overtime;
    const saveTimerRef = useRef<number | null>(null);
    const dataRef = useRef(data);
    dataRef.current = data;
    const tRef = useRef(t);
    tRef.current = t;
    const lastSavedSigRef = useRef<string | null>(null);

    useEffect(() => {
        if (!bridge) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        bridge
            .read()
            .then((snap) => {
                if (cancelled) return;
                const loaded: OvertimeData = {
                    entries: snap.entries,
                    autoLog: snap.autoLog,
                };
                lastSavedSigRef.current = signature(loaded);
                setData(loaded);
            })
            .catch((e) => {
                toast.error(getErrorMessage(e, tRef.current('overtime.save.loadFailed')));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [bridge]);

    useEffect(() => {
        if (!bridge) return;
        const sig = signature(data);
        if (sig === lastSavedSigRef.current) return;
        if (saveTimerRef.current != null) window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = window.setTimeout(() => {
            saveTimerRef.current = null;
            const snap = buildSnapshot(dataRef.current);
            const nextSig = signature(dataRef.current);
            bridge
                .write(snap)
                .then((r) => {
                    if (r.ok) lastSavedSigRef.current = nextSig;
                    else toast.error(r.error);
                })
                .catch((e) => toast.error(getErrorMessage(e)));
        }, SAVE_DEBOUNCE_MS);
        return () => {
            if (saveTimerRef.current != null) {
                window.clearTimeout(saveTimerRef.current);
                saveTimerRef.current = null;
            }
        };
    }, [bridge, data]);

    useEffect(() => {
        if (!bridge) return;
        const flush = () => {
            if (saveTimerRef.current == null) return;
            window.clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
            const sig = signature(dataRef.current);
            if (sig === lastSavedSigRef.current) return;
            void bridge.write(buildSnapshot(dataRef.current)).then((r) => {
                if (r.ok) lastSavedSigRef.current = sig;
            });
        };
        const onVisibility = () => {
            if (document.visibilityState === 'hidden') flush();
        };
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('pagehide', flush);
        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pagehide', flush);
        };
    }, [bridge]);

    const addOvertime = useCallback((date: string, start: string, end: string) => {
        const minutes = computeInterval(start, end);
        if (minutes == null) {
            toast.error(tRef.current('overtime.save.invalidTime'));
            return;
        }
        setData((prev) => ({
            ...prev,
            entries: [
                ...prev.entries,
                {
                    id: uid(),
                    type: 'overtime',
                    date,
                    start,
                    end,
                    minutes,
                    note: '',
                    createdAt: Date.now(),
                    deductions: [],
                },
            ],
        }));
    }, []);

    const removeEntry = useCallback((id: string) => {
        setData((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.id !== id) }));
    }, []);

    const addDeduction = useCallback(
        (entryId: string, date: string, minutes: number) => {
            setData((prev) => ({
                ...prev,
                entries: prev.entries.map((e) =>
                    e.id === entryId
                        ? {
                              ...e,
                              deductions: [
                                  ...e.deductions,
                                  {
                                      id: uid(),
                                      date,
                                      minutes,
                                      note: '',
                                      createdAt: Date.now(),
                                  },
                              ],
                          }
                        : e,
                ),
            }));
        },
        [],
    );

    const removeDeduction = useCallback((entryId: string, dedId: string) => {
        setData((prev) => ({
            ...prev,
            entries: prev.entries.map((e) =>
                e.id === entryId
                    ? { ...e, deductions: e.deductions.filter((d) => d.id !== dedId) }
                    : e,
            ),
        }));
    }, []);

    const autoDeduct = useCallback((minutes: number, date: string): AutoDeductOutcome => {
        const r = computeAutoDeduct(
            dataRef.current.entries,
            dataRef.current.autoLog,
            minutes,
            date,
        );
        if (r.taken === 0) return { taken: 0, breakdown: [] };
        setData({ entries: r.entries, autoLog: r.autoLog });
        return { taken: r.taken, breakdown: r.breakdown };
    }, []);

    const removeAutoLog = useCallback((id: string) => {
        setData((prev) => ({ ...prev, autoLog: prev.autoLog.filter((x) => x.id !== id) }));
    }, []);

    const exportToFile = useCallback(async () => {
        if (!bridge) {
            toast.error(tRef.current('overtime.save.bridgeMissing'));
            return;
        }
        const r = await bridge.exportToFile();
        if (!r.ok) {
            if (r.error !== 'cancelled') toast.error(r.error);
            return;
        }
        toast.success(tRef.current('overtime.save.exported'));
    }, [bridge]);

    const importFromFile = useCallback(async () => {
        if (!bridge) {
            toast.error(tRef.current('overtime.save.bridgeMissing'));
            return;
        }
        const r = await bridge.importFromFile();
        if (!r.ok) {
            if (r.error !== 'cancelled') toast.error(r.error);
            return;
        }
        const next: OvertimeData = {
            entries: r.data.snapshot.entries,
            autoLog: r.data.snapshot.autoLog,
        };
        // Mark as already persisted (main wrote this snapshot itself) to suppress
        // the redundant save-back triggered by the resulting state change.
        lastSavedSigRef.current = signature(next);
        setData(next);
        toast.success(tRef.current('overtime.save.imported'));
    }, [bridge]);

    const value: OvertimeContextValue = {
        entries: data.entries,
        autoLog: data.autoLog,
        loading,
        addOvertime,
        removeEntry,
        addDeduction,
        removeDeduction,
        autoDeduct,
        removeAutoLog,
        exportToFile,
        importFromFile,
    };

    return <OvertimeContext.Provider value={value}>{children}</OvertimeContext.Provider>;
}
