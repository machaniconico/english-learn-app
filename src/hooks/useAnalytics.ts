import { useCallback, useRef } from 'react';

// --- Types ---

export interface LearningEvent {
  type: 'lesson_view' | 'quiz_complete' | 'flashcard_complete' | 'dictation_complete' | 'daily_challenge';
  score?: number;
  category?: string;
  timestamp: number;
  duration?: number;
}

export interface Stats {
  totalSessions: number;
  totalTime: number;
  avgScore: number;
  activeDays: number;
  byType: Record<string, number>;
}

// --- Constants ---

const STORAGE_KEY = 'english-learn-analytics';
const MAX_AGE_DAYS = 90;

// --- Helpers ---

function loadEvents(): LearningEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LearningEvent[];
  } catch {
    return [];
  }
}

function saveEvents(events: LearningEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // storage full or unavailable
  }
}

function cleanup(events: LearningEvent[]): LearningEvent[] {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return events.filter((e) => e.timestamp >= cutoff);
}

function getDateString(ts: number): string {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function computeStats(events: LearningEvent[]): Stats {
  const totalSessions = events.length;
  const totalTime = events.reduce((sum, e) => sum + (e.duration ?? 0), 0);

  const scores = events.filter((e) => e.score !== undefined).map((e) => e.score!);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const days = new Set(events.map((e) => getDateString(e.timestamp)));
  const activeDays = days.size;

  const byType: Record<string, number> = {};
  for (const e of events) {
    byType[e.type] = (byType[e.type] ?? 0) + 1;
  }

  return { totalSessions, totalTime, avgScore, activeDays, byType };
}

// --- Hook ---

export function useAnalytics() {
  const eventsRef = useRef<LearningEvent[]>(cleanup(loadEvents()));

  const logEvent = useCallback((event: Omit<LearningEvent, 'timestamp'>): void => {
    const full: LearningEvent = { ...event, timestamp: Date.now() };
    const events = cleanup(loadEvents());
    events.push(full);
    eventsRef.current = events;
    saveEvents(events);
  }, []);

  const getEventsForPeriod = useCallback((days: number): LearningEvent[] => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const events = cleanup(loadEvents());
    eventsRef.current = events;
    saveEvents(events);
    return events.filter((e) => e.timestamp >= cutoff);
  }, []);

  const getStats = useCallback((days: number): Stats => {
    const events = getEventsForPeriod(days);
    return computeStats(events);
  }, [getEventsForPeriod]);

  const getWeeklyComparison = useCallback((): {
    thisWeek: Stats;
    lastWeek: Stats;
    improvement: number;
  } => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const allEvents = cleanup(loadEvents());
    eventsRef.current = allEvents;
    saveEvents(allEvents);

    const thisWeekEvents = allEvents.filter((e) => e.timestamp >= now - oneWeek);
    const lastWeekEvents = allEvents.filter(
      (e) => e.timestamp >= now - 2 * oneWeek && e.timestamp < now - oneWeek,
    );

    const thisWeek = computeStats(thisWeekEvents);
    const lastWeek = computeStats(lastWeekEvents);

    let improvement = 0;
    if (lastWeek.avgScore > 0) {
      improvement = Math.round(
        ((thisWeek.avgScore - lastWeek.avgScore) / lastWeek.avgScore) * 100,
      );
    } else if (thisWeek.avgScore > 0) {
      improvement = 100;
    }

    return { thisWeek, lastWeek, improvement };
  }, []);

  return { logEvent, getEventsForPeriod, getStats, getWeeklyComparison };
}
