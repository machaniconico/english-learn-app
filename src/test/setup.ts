import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees and clear localStorage between tests for isolation.
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// --- Web Speech API mock (jsdom/happy-dom provide neither) ---
// Components (AudioButton via useSpeechSynthesis) call window.speechSynthesis
// and `new SpeechSynthesisUtterance(...)`. Provide a minimal functional mock
// so speak() drives the utterance lifecycle (onstart -> onend) synchronously.
class MockSpeechSynthesisUtterance {
  text: string;
  lang = '';
  rate = 1;
  pitch = 1;
  voice: unknown = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text = '') {
    this.text = text;
  }
}

const speechSynthesisMock = {
  speak: vi.fn((u: MockSpeechSynthesisUtterance) => {
    u.onstart?.();
    u.onend?.();
  }),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => [] as unknown[]),
  speaking: false,
  paused: false,
  pending: false,
};

vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
vi.stubGlobal('speechSynthesis', speechSynthesisMock);
if (typeof window !== 'undefined') {
  // jsdom: ensure window.speechSynthesis is present too
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: speechSynthesisMock,
  });
}

// --- Browser API shims jsdom lacks (needed to render some pages in tests) ---
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  }
  if (!window.scrollTo) {
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: vi.fn() });
  }
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
}
