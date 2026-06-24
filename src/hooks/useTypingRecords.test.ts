// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypingRecords } from './useTypingRecords';
import type { TypingRecord } from '../utils/typingRecords';

const STORAGE_KEY = 'english-learn-typing-records';

function stored(): TypingRecord {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as TypingRecord;
}

describe('useTypingRecords', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('is an empty record when localStorage has no data', () => {
      const { result } = renderHook(() => useTypingRecords());
      expect(result.current.record).toEqual({ bestPct: 0, plays: 0, history: [] });
    });

    it('loads a persisted record on mount', () => {
      const rec: TypingRecord = {
        bestPct: 80,
        plays: 3,
        history: [{ pct: 80, correct: 8, total: 10, timestamp: 1 }],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
      const { result } = renderHook(() => useTypingRecords());
      expect(result.current.record.bestPct).toBe(80);
      expect(result.current.record.plays).toBe(3);
    });

    it('falls back to empty for invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json{{{');
      const { result } = renderHook(() => useTypingRecords());
      expect(result.current.record).toEqual({ bestPct: 0, plays: 0, history: [] });
    });

    it('falls back to empty for a structurally invalid record', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestPct: 'x', plays: null }));
      const { result } = renderHook(() => useTypingRecords());
      expect(result.current.record).toEqual({ bestPct: 0, plays: 0, history: [] });
    });
  });

  describe('addAttempt', () => {
    it('updates the record and persists it', () => {
      const { result } = renderHook(() => useTypingRecords());

      act(() => {
        result.current.addAttempt(90, 9, 10);
      });

      expect(result.current.record.bestPct).toBe(90);
      expect(result.current.record.plays).toBe(1);
      expect(result.current.record.history).toHaveLength(1);
      expect(result.current.record.history[0].correct).toBe(9);

      const saved = stored();
      expect(saved.bestPct).toBe(90);
      expect(saved.plays).toBe(1);
    });

    it('keeps the best across lower subsequent attempts but counts plays', () => {
      const { result } = renderHook(() => useTypingRecords());

      act(() => { result.current.addAttempt(90, 9, 10); });
      act(() => { result.current.addAttempt(40, 4, 10); });

      expect(result.current.record.bestPct).toBe(90);
      expect(result.current.record.plays).toBe(2);
      expect(result.current.record.history[0].pct).toBe(40); // newest first
    });
  });

  describe('persistence across remounts', () => {
    it('a new hook instance restores a record saved by a previous one', () => {
      const { result: first, unmount } = renderHook(() => useTypingRecords());
      act(() => { first.current.addAttempt(75, 3, 4); });
      unmount();

      const { result: second } = renderHook(() => useTypingRecords());
      expect(second.current.record.bestPct).toBe(75);
      expect(second.current.record.plays).toBe(1);
    });
  });

  describe('cross-tab storage sync', () => {
    it('reacts to an external storage event for the key', () => {
      const { result } = renderHook(() => useTypingRecords());
      const external: TypingRecord = {
        bestPct: 100,
        plays: 5,
        history: [{ pct: 100, correct: 10, total: 10, timestamp: 9 }],
      };

      act(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(external));
        window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
      });

      expect(result.current.record.bestPct).toBe(100);
      expect(result.current.record.plays).toBe(5);
    });

    it('ignores storage events for unrelated keys', () => {
      const { result } = renderHook(() => useTypingRecords());
      act(() => { result.current.addAttempt(50, 5, 10); });

      act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key: 'other-key' }));
      });

      expect(result.current.record.plays).toBe(1);
    });
  });
});
