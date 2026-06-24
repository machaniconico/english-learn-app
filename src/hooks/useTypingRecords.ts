import { useCallback, useEffect, useState } from 'react';
import {
  emptyTypingRecord,
  recordTypingAttempt,
  type TypingAttempt,
  type TypingRecord,
} from '../utils/typingRecords';

const STORAGE_KEY = 'english-learn-typing-records';

function isValidRecord(value: unknown): value is TypingRecord {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.bestPct === 'number' &&
    typeof r.plays === 'number' &&
    Array.isArray(r.history)
  );
}

function loadRecord(): TypingRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyTypingRecord();
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidRecord(parsed)) return emptyTypingRecord();
    return parsed;
  } catch {
    return emptyTypingRecord();
  }
}

function saveRecord(record: TypingRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // ignore
  }
}

export function useTypingRecords() {
  const [record, setRecord] = useState<TypingRecord>(loadRecord);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setRecord(loadRecord());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addAttempt = useCallback((pct: number, correct: number, total: number) => {
    const attempt: TypingAttempt = { pct, correct, total, timestamp: Date.now() };
    setRecord((prev) => {
      const next = recordTypingAttempt(prev, attempt);
      saveRecord(next);
      return next;
    });
  }, []);

  return { record, addAttempt };
}
