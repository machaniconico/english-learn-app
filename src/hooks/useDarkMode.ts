import { useState, useEffect, useCallback } from 'react';

type Mode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'english-learn-theme';

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDark(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
}

export function useDarkMode() {
  const [mode, setModeState] = useState<Mode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch { /* ignore */ }
    return 'system';
  });

  const isDark = mode === 'dark' || (mode === 'system' && getSystemDark());

  // Apply dark class on mount and when mode changes
  useEffect(() => {
    applyDark(isDark);
  }, [isDark]);

  // Listen for system preference changes when mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => applyDark(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  return { isDark, toggle, setMode };
}
