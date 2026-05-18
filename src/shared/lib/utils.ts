import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function getErrorMessage(error: unknown, fallback = 'Unknown error'): string {
    return error instanceof Error ? error.message : fallback;
}

export const parsePositiveInt = (s: string): number | null => {
    const n = Number.parseInt(s, 10);
    return Number.isInteger(n) && n >= 1 ? n : null;
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
