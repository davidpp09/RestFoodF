import { useSyncExternalStore } from 'react';

const KEY = 'restfood-theme';
const listeners = new Set();

const getTheme = () => localStorage.getItem(KEY) || 'light';
const apply = (t) => document.documentElement.classList.toggle('dark', t === 'dark');

// Aplica el tema guardado al arrancar la app (llamar una vez en main.jsx)
export function initTheme() {
    apply(getTheme());
}

export function toggleTheme() {
    const t = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, t);
    apply(t);
    listeners.forEach((l) => l());
}

export function useTheme() {
    const theme = useSyncExternalStore(
        (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
        getTheme
    );
    return { theme, toggleTheme };
}
