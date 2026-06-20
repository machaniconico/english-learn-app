// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechRecognition } from './useSpeechRecognition';

// ---------------------------------------------------------------------------
// Minimal SpeechRecognition stub
// ---------------------------------------------------------------------------

interface MockRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
}

function makeMockRecognitionClass() {
  const instances: MockRecognitionInstance[] = [];

  class MockSpeechRecognition {
    lang = '';
    interimResults = false;
    maxAlternatives = 1;
    onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null = null;
    onerror: ((e: { error: string }) => void) | null = null;
    onend: (() => void) | null = null;
    start = vi.fn();
    stop = vi.fn();

    constructor() {
      instances.push(this as unknown as MockRecognitionInstance);
    }
  }

  return { MockSpeechRecognition, instances };
}

// ---------------------------------------------------------------------------
// Tests: unsupported path (no SpeechRecognition in window)
// ---------------------------------------------------------------------------

describe('useSpeechRecognition — unsupported environment (jsdom default)', () => {
  beforeEach(() => {
    // Ensure neither SpeechRecognition nor webkitSpeechRecognition is present.
    vi.stubGlobal('SpeechRecognition', undefined);
    vi.stubGlobal('webkitSpeechRecognition', undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with supported=true and listening=false before any interaction', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    // supported initialises to true; it is only set to false when startListening is called
    expect(result.current.supported).toBe(true);
    expect(result.current.listening).toBe(false);
    expect(result.current.transcript).toBe('');
  });

  it('sets supported=false when startListening is called and SpeechRecognition is absent', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.supported).toBe(false);
    expect(result.current.listening).toBe(false);
  });

  it('stopListening is a no-op when recognition was never started', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    // Should not throw even though recognitionRef.current is null.
    expect(() => {
      act(() => {
        result.current.stopListening();
      });
    }).not.toThrow();

    expect(result.current.listening).toBe(false);
  });

  it('calling startListening multiple times keeps supported=false and does not throw', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });
    act(() => {
      result.current.startListening();
    });

    expect(result.current.supported).toBe(false);
    expect(result.current.listening).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests: supported path (stubbed SpeechRecognition)
// ---------------------------------------------------------------------------

describe('useSpeechRecognition — supported environment (stubbed SpeechRecognition)', () => {
  let instances: MockRecognitionInstance[];

  beforeEach(() => {
    const { MockSpeechRecognition, instances: inst } = makeMockRecognitionClass();
    instances = inst;
    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sets listening=true and clears transcript when startListening is called', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.supported).toBe(true);
    expect(result.current.listening).toBe(true);
    expect(result.current.transcript).toBe('');
    expect(instances).toHaveLength(1);
    expect(instances[0].start).toHaveBeenCalledOnce();
  });

  it('configures recognition with lang=en-US, interimResults=false, maxAlternatives=1', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    const rec = instances[0];
    expect(rec.lang).toBe('en-US');
    expect(rec.interimResults).toBe(false);
    expect(rec.maxAlternatives).toBe(1);
  });

  it('updates transcript when onresult fires', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    const rec = instances[0];

    act(() => {
      rec.onresult?.({ results: { 0: { 0: { transcript: 'hello world' } } } });
    });

    expect(result.current.transcript).toBe('hello world');
  });

  it('sets listening=false when onend fires', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.listening).toBe(true);

    act(() => {
      instances[0].onend?.();
    });

    expect(result.current.listening).toBe(false);
  });

  it('sets listening=false when onerror fires', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.listening).toBe(true);

    act(() => {
      instances[0].onerror?.({ error: 'no-speech' });
    });

    expect(result.current.listening).toBe(false);
  });

  it('stopListening calls stop() on the recognition instance and sets listening=false', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.listening).toBe(true);

    act(() => {
      result.current.stopListening();
    });

    expect(result.current.listening).toBe(false);
    expect(instances[0].stop).toHaveBeenCalledOnce();
  });

  it('startListening clears transcript from a previous session', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    // First session: produce a transcript.
    act(() => {
      result.current.startListening();
    });
    act(() => {
      instances[0].onresult?.({ results: { 0: { 0: { transcript: 'first' } } } });
    });
    expect(result.current.transcript).toBe('first');

    // End the session, then start a new one.
    act(() => {
      instances[0].onend?.();
    });
    act(() => {
      result.current.startListening();
    });

    expect(result.current.transcript).toBe('');
    expect(result.current.listening).toBe(true);
  });

  it('calls stop() on the recognition instance when the hook unmounts', () => {
    const { result, unmount } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    const rec = instances[0];
    expect(rec.stop).not.toHaveBeenCalled();

    unmount();

    expect(rec.stop).toHaveBeenCalledOnce();
  });

  it('uses webkitSpeechRecognition when SpeechRecognition is absent', () => {
    // Re-stub: remove SpeechRecognition, add webkit variant.
    vi.unstubAllGlobals();
    const { MockSpeechRecognition, instances: wkInstances } = makeMockRecognitionClass();
    vi.stubGlobal('SpeechRecognition', undefined);
    vi.stubGlobal('webkitSpeechRecognition', MockSpeechRecognition);

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.supported).toBe(true);
    expect(result.current.listening).toBe(true);
    expect(wkInstances).toHaveLength(1);
    expect(wkInstances[0].start).toHaveBeenCalledOnce();
  });
});
