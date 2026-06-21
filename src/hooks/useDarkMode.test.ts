// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

const STORAGE_KEY = 'english-learn-theme';

/**
 * Override window.matchMedia for the duration of a test.
 * The global setup defines it with configurable:true, so we can redefine.
 */
function stubMatchMedia(matches: boolean) {
  const listeners: Array<(e: Partial<MediaQueryListEvent>) => void> = [];
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: (e: Partial<MediaQueryListEvent>) => void) => {
      listeners.push(listener);
    }),
    removeEventListener: vi.fn((_type: string, listener: (e: Partial<MediaQueryListEvent>) => void) => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    /** Test helper: fire a change event to all registered listeners */
    _fire(newMatches: boolean) {
      listeners.forEach((l) => l({ matches: newMatches } as Partial<MediaQueryListEvent>));
    },
  };
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => mql,
  });
  return mql;
}

beforeEach(() => {
  // Reset the documentElement class so tests don't bleed into each other.
  document.documentElement.classList.remove('dark');
});

describe('useDarkMode — initial state', () => {
  it('defaults to "system" mode (no localStorage) and isDark=false when system prefers light', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('defaults to isDark=true when system prefers dark and no persisted value', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('restores "dark" mode from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('restores "light" mode from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    stubMatchMedia(true); // system dark but explicit light wins
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('ignores an invalid localStorage value and falls back to "system"', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-value');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
  });
});

describe('useDarkMode — setMode', () => {
  it('setMode("dark") sets isDark=true and persists to localStorage', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('setMode("light") sets isDark=false and persists to localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setMode("system") sets isDark based on system preference and persists', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    stubMatchMedia(false); // system is light
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setMode('system');
    });

    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('system');
  });

  it('setMode("system") with system dark sets isDark=true', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setMode('system');
    });

    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('system');
  });
});

describe('useDarkMode — toggle', () => {
  it('toggle flips light -> dark', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggle flips dark -> light', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggle from system+dark -> light', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useDarkMode()); // system dark => isDark=true

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  it('multiple toggles alternate correctly', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    act(() => { result.current.toggle(); }); // -> dark
    expect(result.current.isDark).toBe(true);

    act(() => { result.current.toggle(); }); // -> light
    expect(result.current.isDark).toBe(false);

    act(() => { result.current.toggle(); }); // -> dark
    expect(result.current.isDark).toBe(true);
  });
});

describe('useDarkMode — document class effect', () => {
  it('applies "dark" class when isDark becomes true', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => {
      result.current.setMode('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes "dark" class when isDark becomes false', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.setMode('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('useDarkMode — mode export', () => {
  it('返り値に mode が含まれ、既定は "system"、setMode で更新される', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    // localStorage 無しの既定は system
    expect(result.current.mode).toBe('system');

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
  });

  it('mode 型として light/dark/system の3値すべてが返り値に出る', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useDarkMode());

    for (const m of ['light', 'dark', 'system'] as const) {
      act(() => {
        result.current.setMode(m);
      });
      expect(result.current.mode).toBe(m);
    }
  });
});

describe('useDarkMode — localStorage persistence round-trip', () => {
  it('value written in one hook instance is read back by a second instance', () => {
    stubMatchMedia(false);
    const first = renderHook(() => useDarkMode());

    act(() => {
      first.result.current.setMode('dark');
    });
    first.unmount();

    // Second instance reads from localStorage
    const second = renderHook(() => useDarkMode());
    expect(second.result.current.isDark).toBe(true);
    second.unmount();
  });

  it('all three Mode values round-trip correctly through localStorage', () => {
    stubMatchMedia(false);
    const modes = ['light', 'dark', 'system'] as const;

    for (const mode of modes) {
      localStorage.clear();
      document.documentElement.classList.remove('dark');

      const { result, unmount } = renderHook(() => useDarkMode());
      act(() => {
        result.current.setMode(mode);
      });
      expect(localStorage.getItem(STORAGE_KEY)).toBe(mode);
      unmount();
    }
  });
});
