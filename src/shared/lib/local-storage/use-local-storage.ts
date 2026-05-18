import { useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    function setStoredValue(newValue: T) {
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
            // ignore quota/privacy errors
        }
        setValue(newValue);
    }

    return [value, setStoredValue] as const;
}
