import { useState } from 'react';
import { useAppEvent } from '@cion-suite/core/ipc/renderer';

import { toast } from '@/shared/lib/toast';
import type { Outcome, UseUpdaterCheck } from '@/shared/types/updater';

export function useUpdaterCheckForUpdates(): UseUpdaterCheck {
    const updater = window.app?.updater;
    const supported = Boolean(updater);
    const [checking, setChecking] = useState(false);

    const check = async (): Promise<Outcome> => {
        if (!updater) return { ok: false, error: 'updater bridge not available' };
        setChecking(true);
        try {
            const r = await updater.checkForUpdates();
            if (!r.ok) return { ok: false, error: r.error };
            return { ok: true };
        } finally {
            setChecking(false);
        }
    };

    return { supported, checking, check };
}

export function useUpdaterErrorToast(): void {
    useAppEvent('updater:error', (data) => {
        toast.error(data.message);
    });
}
