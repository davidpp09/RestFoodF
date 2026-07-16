import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className={`flex size-11 shrink-0 items-center justify-center rounded-md border border-rf-border bg-rf-surface text-rf-text-3 hover:bg-rf-surface-2 transition-colors cursor-pointer ${className}`}
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
