// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechSynthesis } from './useSpeechSynthesis';

// setup.ts already provides window.speechSynthesis mock:
// speak(u) fires u.onstart() then u.onend() synchronously.
// cancel() is a vi.fn(). getVoices() returns [].

const synthMock = window.speechSynthesis as {
  speak: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  getVoices: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useSpeechSynthesis', () => {
  it('initialises with speaking=false and rate=1', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    expect(result.current.speaking).toBe(false);
    expect(result.current.rate).toBe(1);
  });

  it('speak() transitions speaking: false -> true -> false synchronously', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.speak('hello');
    });

    // After act: onstart and onend both fired synchronously → speaking ends up false
    expect(result.current.speaking).toBe(false);
    expect(synthMock.speak).toHaveBeenCalledTimes(1);
  });

  it('speak() calls window.speechSynthesis.cancel before speaking (clears previous)', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.speak('first');
    });
    const cancelCallsBefore = synthMock.cancel.mock.calls.length;

    act(() => {
      result.current.speak('second');
    });

    // cancel must have been called again before the second speak
    expect(synthMock.cancel.mock.calls.length).toBeGreaterThan(cancelCallsBefore);
  });

  it('speak() invokes the onEnd callback after the utterance ends', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    const onEnd = vi.fn();

    act(() => {
      result.current.speak('test', onEnd);
    });

    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('speak() does NOT invoke onEnd when none is provided', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    // Should not throw when no callback is given
    expect(() => {
      act(() => {
        result.current.speak('no callback');
      });
    }).not.toThrow();
  });

  it('speak() sets utterance.lang to en-US', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    let capturedUtterance: SpeechSynthesisUtterance | null = null;

    synthMock.speak.mockImplementationOnce((u: SpeechSynthesisUtterance) => {
      capturedUtterance = u;
      u.onstart?.();
      u.onend?.();
    });

    act(() => {
      result.current.speak('language test');
    });

    expect(capturedUtterance).not.toBeNull();
    expect((capturedUtterance as unknown as SpeechSynthesisUtterance).lang).toBe('en-US');
  });

  it('speak() applies the current rate to the utterance', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    let capturedUtterance: SpeechSynthesisUtterance | null = null;

    // Change rate to 0.75
    act(() => {
      result.current.setRate(0.75);
    });

    synthMock.speak.mockImplementationOnce((u: SpeechSynthesisUtterance) => {
      capturedUtterance = u;
      u.onstart?.();
      u.onend?.();
    });

    act(() => {
      result.current.speak('rate test');
    });

    expect((capturedUtterance as unknown as SpeechSynthesisUtterance).rate).toBe(0.75);
  });

  it('setRate() updates the rate value returned by the hook', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.setRate(1.5);
    });

    expect(result.current.rate).toBe(1.5);
  });

  it('stop() calls window.speechSynthesis.cancel and sets speaking to false', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.stop();
    });

    expect(synthMock.cancel).toHaveBeenCalled();
    expect(result.current.speaking).toBe(false);
  });

  it('stop() after speak() resets speaking to false and cancels synthesis', () => {
    // Make speak keep speaking=true by not firing onend until we call stop
    let storedUtterance: { onstart?: () => void; onend?: () => void } = {};
    synthMock.speak.mockImplementationOnce((u: { onstart?: () => void; onend?: () => void }) => {
      storedUtterance = u;
      u.onstart?.(); // sets speaking=true; intentionally skip onend
    });

    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.speak('long sentence');
    });

    // onstart fired → speaking should be true now
    expect(result.current.speaking).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(synthMock.cancel).toHaveBeenCalled();
    expect(result.current.speaking).toBe(false);

    // Prevent dangling effect: fire onend so we don't get a state update after unmount
    act(() => {
      storedUtterance.onend?.();
    });
  });

  it('cancel is called on unmount (cleanup effect)', () => {
    const { result, unmount } = renderHook(() => useSpeechSynthesis());
    void result.current; // ensure hook is active

    const cancelCountBefore = synthMock.cancel.mock.calls.length;

    act(() => {
      unmount();
    });

    expect(synthMock.cancel.mock.calls.length).toBeGreaterThan(cancelCountBefore);
  });

  it('getVoices is consulted during speak() for voice selection', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.speak('voice selection');
    });

    expect(synthMock.getVoices).toHaveBeenCalled();
  });

  it('speak() sets utterance.voice when a matching en-US voice is available', () => {
    const mockVoice = { lang: 'en-US', name: 'Google US English' } as SpeechSynthesisVoice;
    synthMock.getVoices.mockReturnValueOnce([mockVoice]);

    let capturedUtterance: SpeechSynthesisUtterance | null = null;
    synthMock.speak.mockImplementationOnce((u: SpeechSynthesisUtterance) => {
      capturedUtterance = u;
      u.onstart?.();
      u.onend?.();
    });

    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.speak('voice test');
    });

    expect((capturedUtterance as unknown as SpeechSynthesisUtterance).voice).toBe(mockVoice);
  });

  it('speak() prefers Samantha voice over generic en-US voice', () => {
    const genericVoice = { lang: 'en-US', name: 'Google US English' } as SpeechSynthesisVoice;
    const samanthaVoice = { lang: 'en-US', name: 'Samantha' } as SpeechSynthesisVoice;
    synthMock.getVoices.mockReturnValueOnce([genericVoice, samanthaVoice]);

    let capturedUtterance: SpeechSynthesisUtterance | null = null;
    synthMock.speak.mockImplementationOnce((u: SpeechSynthesisUtterance) => {
      capturedUtterance = u;
      u.onstart?.();
      u.onend?.();
    });

    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.speak('samantha test');
    });

    expect((capturedUtterance as unknown as SpeechSynthesisUtterance).voice).toBe(samanthaVoice);
  });
});
