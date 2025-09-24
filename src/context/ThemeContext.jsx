import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const LS_KEY = 'rf_theme'; // 'light' | 'dark' | 'system'

function getSystemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'system' && getSystemPrefersDark());
  document.documentElement.classList.toggle('dark', !!isDark);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem(LS_KEY) || 'system';
  });

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem(LS_KEY, theme); } catch {}
  }, [theme]);

  // React to OS theme changes when set to 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, [theme]);

  // Simple toggle (light <-> dark). If 'system', it toggles to the opposite of current system.
  const toggleTheme = () => {
    setTheme((t) => {
      if (t === 'system') return getSystemPrefersDark() ? 'light' : 'dark';
      return t === 'dark' ? 'light' : 'dark';
    });
  };

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}