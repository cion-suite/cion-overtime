export const uid = (): string =>
    globalThis.crypto?.randomUUID?.() ??
    `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const fmtMM = (total: number): string => {
    const sign = total < 0 ? '-' : '';
    const abs = Math.abs(total);
    return (
        sign +
        String(Math.floor(abs / 60)).padStart(2, '0') +
        ':' +
        String(abs % 60).padStart(2, '0')
    );
};

export const parseDur = (s: string): number | null => {
    const m = /^\s*(\d{1,3}):([0-5]\d)\s*$/.exec(s || '');
    return m ? parseInt(m[1]!, 10) * 60 + parseInt(m[2]!, 10) : null;
};

export const parseHM = (s: string): number | null => {
    const m = /^(\d{1,2}):([0-5]\d)$/.exec(s || '');
    return m ? parseInt(m[1]!, 10) * 60 + parseInt(m[2]!, 10) : null;
};

export const computeInterval = (start: string, end: string): number | null => {
    const s = parseHM(start);
    const e = parseHM(end);
    if (s == null || e == null) return null;
    let d = e - s;
    if (d < 0) d += 24 * 60;
    return d;
};

export const todayISO = (): string => {
    const d = new Date();
    return (
        d.getFullYear() +
        '-' +
        String(d.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(d.getDate()).padStart(2, '0')
    );
};

export const fmtDateHuman = (iso: string): string => {
    if (!iso) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : iso;
};

export interface DurationParts {
    sign: '−' | '';
    h: number;
    m: number;
}

export const fmtDurParts = (total: number): DurationParts => {
    const abs = Math.abs(total);
    return {
        sign: total < 0 ? '−' : '',
        h: Math.floor(abs / 60),
        m: abs % 60,
    };
};
