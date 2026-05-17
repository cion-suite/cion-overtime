export type Outcome = { ok: true } | { ok: false; error: string };

export interface UseUpdaterCheck {
    supported: boolean;
    checking: boolean;
    check: () => Promise<Outcome>;
}
