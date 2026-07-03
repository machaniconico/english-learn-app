import { useCallback, useSyncExternalStore } from 'react';

// テーマの選択モード。system は OS の prefers-color-scheme に追従する。
export type Mode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'english-learn-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

interface DarkModeSnapshot {
  mode: Mode;
  isDark: boolean;
}

function isMode(value: string | null): value is Mode {
  return value === 'light' || value === 'dark' || value === 'system';
}

function loadMode(): Mode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isMode(saved)) return saved;
  } catch { /* ignore */ }
  return 'system';
}

function saveMode(mode: Mode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch { /* ignore */ }
}

function getSystemDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(DARK_QUERY).matches;
}

function getIsDark(mode: Mode): boolean {
  return mode === 'dark' || (mode === 'system' && getSystemDark());
}

function applyDark(isDark: boolean) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isDark);
}

let storeMode: Mode = loadMode();
let snapshot: DarkModeSnapshot = {
  mode: storeMode,
  isDark: getIsDark(storeMode),
};
const listeners = new Set<() => void>();

applyDark(snapshot.isDark);

function getSnapshot(): DarkModeSnapshot {
  return snapshot;
}

function replaceSnapshot(nextMode: Mode, nextIsDark: boolean): boolean {
  if (snapshot.mode === nextMode && snapshot.isDark === nextIsDark) {
    return false;
  }
  snapshot = { mode: nextMode, isDark: nextIsDark };
  return true;
}

function notify(): void {
  for (const listener of listeners) listener();
}

function refreshSnapshot(): boolean {
  const nextIsDark = getIsDark(storeMode);
  applyDark(nextIsDark);
  return replaceSnapshot(storeMode, nextIsDark);
}

function syncStoreModeFromStorage(): void {
  storeMode = loadMode();
  refreshSnapshot();
}

function setStoreMode(newMode: Mode): void {
  storeMode = newMode;
  saveMode(storeMode);
  if (refreshSnapshot()) {
    notify();
  }
}

function handleSystemChange(): void {
  if (storeMode !== 'system') return;
  if (refreshSnapshot()) {
    notify();
  }
}

let systemMatchMedia: typeof window.matchMedia | null = null;
let systemMediaQueryList: MediaQueryList | null = null;

function ensureSystemListener(): void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return;
  }

  if (systemMatchMedia === window.matchMedia) return;

  if (systemMediaQueryList) {
    systemMediaQueryList.removeEventListener('change', handleSystemChange);
  }

  systemMatchMedia = window.matchMedia;
  systemMediaQueryList = window.matchMedia(DARK_QUERY);
  systemMediaQueryList.addEventListener('change', handleSystemChange);
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    syncStoreModeFromStorage();
  }
  ensureSystemListener();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDarkMode() {
  if (listeners.size === 0) {
    syncStoreModeFromStorage();
  }
  ensureSystemListener();

  const { mode, isDark } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setMode = useCallback((newMode: Mode) => {
    setStoreMode(newMode);
  }, []);

  const toggle = useCallback(() => {
    setStoreMode(isDark ? 'light' : 'dark');
  }, [isDark]);

  return { isDark, mode, toggle, setMode };
}
