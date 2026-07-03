import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

// --- Types ---

export interface StudySession {
  date: string; // YYYY-MM-DD
  startTime: number; // timestamp
  endTime: number; // timestamp
  duration: number; // seconds
  activity: string; // what they were doing
}

interface TimerState {
  sessions: StudySession[];
  currentActivity: string | null;
  currentStart: number | null;
  lastInteraction: number | null;
}

// --- Constants ---

const STORAGE_KEY = 'english-learn-study-time';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in ms
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_SESSION_AGE_DAYS = 365;
// 活動イベントによる lastInteraction 更新のスロットル間隔。
// 過剰な再レンダーと localStorage 書き込みを防ぐため最大30秒に1回だけ更新する。
const ACTIVITY_THROTTLE = 30 * 1000;

// --- Helpers ---

function getDateString(ts: number): string {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getToday(): string {
  return getDateString(Date.now());
}

function capSessions(sessions: StudySession[]): StudySession[] {
  const cutoff = Date.now() - MAX_SESSION_AGE_DAYS * DAY_MS;
  return sessions.filter((session) => session.startTime >= cutoff);
}

function loadState(): TimerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [], currentActivity: null, currentStart: null, lastInteraction: null };
    const parsed = JSON.parse(raw);
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      currentActivity: parsed.currentActivity ?? null,
      currentStart: parsed.currentStart ?? null,
      lastInteraction: parsed.lastInteraction ?? null,
    };
  } catch {
    return { sessions: [], currentActivity: null, currentStart: null, lastInteraction: null };
  }
}

function saveState(state: TimerState): void {
  try {
    const cappedState = {
      ...state,
      sessions: capSessions(state.sessions),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cappedState));
  } catch {
    // storage full or unavailable
  }
}

// Reconcile any stale session left over from a previous visit (e.g. the browser
// was closed while tracking). Performed at store-initialization so the hook
// renders with the already-finalized state.
function loadAndReconcileState(): TimerState {
  const loaded = loadState();
  const s = {
    ...loaded,
    sessions: capSessions(loaded.sessions),
  };
  if (s.currentStart && s.lastInteraction) {
    if (Date.now() - s.lastInteraction > INACTIVITY_TIMEOUT) {
      const endTime = s.lastInteraction;
      const duration = Math.floor((endTime - s.currentStart) / 1000);
      if (duration > 0) {
        const session: StudySession = {
          date: getDateString(s.currentStart),
          startTime: s.currentStart,
          endTime,
          duration,
          activity: s.currentActivity ?? 'unknown',
        };
        return {
          sessions: capSessions([...s.sessions, session]),
          currentActivity: null,
          currentStart: null,
          lastInteraction: null,
        };
      }
    }
  }
  return s;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ---------------------------------------------------------------------------
// モジュールレベルの共有ストア (single source of truth)
// ---------------------------------------------------------------------------
// バグB対策: per-instance useState では Layout とページのインスタンスが別々の
// 状態を持ち、片方の更新がもう片方に伝播しない(さらに stale snapshot の書き戻し
// で永続値を破壊する)。モジュール単一の状態 + useSyncExternalStore で、同一タブ
// 内の全インスタンスが必ず同じ真実源を共有するようにする。

// 起動時に stale セッションを復元した状態を初期値とする。
let storeState: TimerState = loadAndReconcileState();
const listeners = new Set<() => void>();

// 2つの TimerState がロジック上等しいか判定する。loadState は毎回新しい
// sessions 配列を作るため、参照ではなく中身(scalar フィールド + sessions の
// 長さ・要素参照)で比較する。
function statesEqual(a: TimerState, b: TimerState): boolean {
  if (
    a.currentActivity !== b.currentActivity ||
    a.currentStart !== b.currentStart ||
    a.lastInteraction !== b.lastInteraction ||
    a.sessions.length !== b.sessions.length
  ) {
    return false;
  }
  for (let i = 0; i < a.sessions.length; i++) {
    const x = a.sessions[i];
    const y = b.sessions[i];
    if (
      x.startTime !== y.startTime ||
      x.endTime !== y.endTime ||
      x.duration !== y.duration ||
      x.activity !== y.activity ||
      x.date !== y.date
    ) {
      return false;
    }
  }
  return true;
}

function getSnapshot(): TimerState {
  return storeState;
}

function subscribe(listener: () => void): () => void {
  // 購読者がゼロから1人目に切り替わるタイミングで localStorage を読み直して
  // ストアを同期する。全インスタンスがアンマウントされている間に別タブやテストの
  // セットアップが localStorage を書き換えても、新しい購読者が正しい値で開始できる。
  if (listeners.size === 0) {
    const loaded = loadAndReconcileState();
    if (!statesEqual(loaded, storeState)) {
      storeState = loaded;
      // reconcile で stale セッションが確定された場合などは localStorage にも
      // 書き戻して永続化する。
      saveState(storeState);
    }
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  for (const l of listeners) l();
}

// 状態更新の唯一の入り口。updater が現状と等しい(=変化なし)場合は
// 新しい参照を作らず通知もしない(useSyncExternalStore の無限ループ防止)。
// 変化があった場合のみ新しい state オブジェクトに差し替え、localStorage へ
// 永続化してから全 subscriber に通知する。
function setStoreState(updater: (prev: TimerState) => TimerState): void {
  const next = updater(storeState);
  if (next === storeState) return; // 参照が同じ = 変化なし
  storeState = next;
  saveState(storeState);
  notify();
}

// クロスタブ同期: 別タブが localStorage を書き換えたら読み直してストアを更新。
// (useBookmarks.ts の storage リスナー実装を参照)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const loaded = loadState();
      // saveState を再度呼ばないよう、ここでは直接ストアを差し替えて通知のみ行う。
      storeState = loaded;
      notify();
    }
  });
}

// 起動直後(モジュール初期化時)に復元が発生していたら、永続化された状態を
// localStorage にも反映しておく(reconcile 結果の書き戻し)。
saveState(storeState);

// ---------------------------------------------------------------------------
// 活動イベントの購読 (バグA対策)
// ---------------------------------------------------------------------------
// 実ユーザー操作(pointerdown/pointermove/keydown/visibilitychange[visible時])
// を購読し、lastInteraction を更新する。これにより学習中は非アクティブタイマーが
// 実操作で再アームされ、誤って学習記録が破棄されない。
// トラッキング中のみリスナーを張り、停止したら必ず解除する。複数インスタンスが
// あっても window リスナーは一組だけにするためモジュールレベルで参照カウントする。

let activityListenerCount = 0;
let lastActivityUpdate = 0;

function touchInteraction(): void {
  const now = Date.now();
  // スロットル: 最後の更新から ACTIVITY_THROTTLE 未満なら無視。
  if (now - lastActivityUpdate < ACTIVITY_THROTTLE) return;
  lastActivityUpdate = now;
  setStoreState((prev) => {
    // トラッキングしていなければ何もしない。
    if (prev.currentStart === null) return prev;
    return { ...prev, lastInteraction: now };
  });
}

function handleActivity(): void {
  touchInteraction();
}

function handleVisibility(): void {
  // タブが可視になったときだけ操作とみなす。
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
    touchInteraction();
  }
}

function addActivityListeners(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('pointerdown', handleActivity);
  window.addEventListener('pointermove', handleActivity);
  window.addEventListener('keydown', handleActivity);
  window.addEventListener('visibilitychange', handleVisibility);
}

function removeActivityListeners(): void {
  if (typeof window === 'undefined') return;
  window.removeEventListener('pointerdown', handleActivity);
  window.removeEventListener('pointermove', handleActivity);
  window.removeEventListener('keydown', handleActivity);
  window.removeEventListener('visibilitychange', handleVisibility);
}

// トラッキング購読者を1つ増やす。最初の購読者で window リスナーを張る。
function acquireActivityListeners(): void {
  activityListenerCount += 1;
  if (activityListenerCount === 1) {
    lastActivityUpdate = 0; // スロットルをリセットして最初の操作を確実に拾う
    addActivityListeners();
  }
}

// トラッキング購読者を1つ減らす。最後の購読者が消えたら window リスナーを解除。
function releaseActivityListeners(): void {
  activityListenerCount -= 1;
  if (activityListenerCount <= 0) {
    activityListenerCount = 0;
    removeActivityListeners();
  }
}

// --- Hook ---

export function useStudyTimer() {
  // 共有ストアを購読する。getSnapshot は状態が変わらない限り同一参照を返すため
  // 無限ループにならない。
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [currentDuration, setCurrentDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isTracking = state.currentStart !== null;

  // Live seconds counter — 各インスタンスのローカル state + interval(従来通り)。
  useEffect(() => {
    if (isTracking && state.currentStart) {
      const update = () => {
        setCurrentDuration(Math.floor((Date.now() - state.currentStart!) / 1000));
      };
      update();
      intervalRef.current = setInterval(update, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isTracking, state.currentStart]);

  // トラッキング中だけ活動イベントを購読する(バグA)。停止したら必ず解除する。
  useEffect(() => {
    if (!isTracking) return;
    acquireActivityListeners();
    return () => {
      releaseActivityListeners();
    };
  }, [isTracking]);

  // 非アクティブ自動停止(バグA)。30分操作が無ければセッションを確定する。
  // 経過1秒以上なら currentStart がある限り必ず sessions に push する
  // (無記録での破棄は行わない)。endTime は lastInteraction を用いる。
  useEffect(() => {
    if (!isTracking) return;

    const checkInactivity = () => {
      setStoreState((prev) => {
        if (prev.currentStart === null) return prev;
        // まだ操作から30分経っていなければ何もしない。
        // (setTimeout は最後の操作 + INACTIVITY_TIMEOUT ちょうどに発火するため、
        //  境界値 = 等しい場合も「経過した」とみなす。)
        if (prev.lastInteraction && Date.now() - prev.lastInteraction < INACTIVITY_TIMEOUT) {
          return prev;
        }
        const endTime = prev.lastInteraction ?? Date.now();
        const duration = Math.floor((endTime - prev.currentStart) / 1000);
        // 経過1秒以上ならセッションを必ず記録する(黙って破棄しない)。
        if (duration >= 1) {
          const session: StudySession = {
            date: getDateString(prev.currentStart),
            startTime: prev.currentStart,
            endTime,
            duration,
            activity: prev.currentActivity ?? 'unknown',
          };
          return {
            sessions: [...prev.sessions, session],
            currentActivity: null,
            currentStart: null,
            lastInteraction: null,
          };
        }
        // 1秒未満は記録に値しないため状態クリアのみ。
        return {
          ...prev,
          currentActivity: null,
          currentStart: null,
          lastInteraction: null,
        };
      });
    };

    const timer = setTimeout(checkInactivity, INACTIVITY_TIMEOUT);
    return () => clearTimeout(timer);
  }, [isTracking, state.lastInteraction]);

  const startTimer = useCallback((activity: string) => {
    setStoreState((prev) => {
      // 既にトラッキング中なら再開せず lastInteraction だけ更新する。
      if (prev.currentStart !== null) {
        return { ...prev, lastInteraction: Date.now() };
      }
      return {
        ...prev,
        currentActivity: activity,
        currentStart: Date.now(),
        lastInteraction: Date.now(),
      };
    });
  }, []);

  const stopTimer = useCallback(() => {
    setStoreState((prev) => {
      if (!prev.currentStart) return prev;
      const endTime = Date.now();
      const duration = Math.floor((endTime - prev.currentStart) / 1000);
      if (duration < 1) {
        return {
          ...prev,
          currentActivity: null,
          currentStart: null,
          lastInteraction: null,
        };
      }
      const session: StudySession = {
        date: getDateString(prev.currentStart),
        startTime: prev.currentStart,
        endTime,
        duration,
        activity: prev.currentActivity ?? 'unknown',
      };
      return {
        sessions: [...prev.sessions, session],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      };
    });
  }, []);

  const getTotalTime = useCallback(
    (days: number): number => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const total = state.sessions
        .filter((s) => s.startTime >= cutoff)
        .reduce((sum, s) => sum + s.duration, 0);
      return Math.round(total / 60); // minutes
    },
    [state.sessions],
  );

  const getDailyBreakdown = useCallback(
    (days: number): { date: string; minutes: number }[] => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const byDate: Record<string, number> = {};

      // Initialize all dates
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = getDateString(d.getTime());
        byDate[key] = 0;
      }

      for (const session of state.sessions) {
        if (session.startTime >= cutoff) {
          const key = session.date;
          byDate[key] = (byDate[key] ?? 0) + Math.round(session.duration / 60);
        }
      }

      return Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, minutes]) => ({ date, minutes }));
    },
    [state.sessions],
  );

  const getWeeklyTotal = useCallback((): number => {
    const weekStart = startOfWeek(new Date()).getTime();
    const total = state.sessions
      .filter((s) => s.startTime >= weekStart)
      .reduce((sum, s) => sum + s.duration, 0);
    return Math.round(total / 60);
  }, [state.sessions]);

  const getMonthlyTotal = useCallback((): number => {
    const monthStart = startOfMonth(new Date()).getTime();
    const total = state.sessions
      .filter((s) => s.startTime >= monthStart)
      .reduce((sum, s) => sum + s.duration, 0);
    return Math.round(total / 60);
  }, [state.sessions]);

  const getSessions = useCallback(
    (days: number): StudySession[] => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return state.sessions.filter((s) => s.startTime >= cutoff);
    },
    [state.sessions],
  );

  const getStreak = useCallback((): { current: number; longest: number } => {
    if (state.sessions.length === 0) return { current: 0, longest: 0 };

    const activeDates = new Set(state.sessions.map((s) => s.date));
    const sortedDates = [...activeDates].sort();

    let longest = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1] + 'T00:00:00');
      const curr = new Date(sortedDates[i] + 'T00:00:00');
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) {
        currentStreak++;
        if (currentStreak > longest) longest = currentStreak;
      } else {
        currentStreak = 1;
      }
    }

    // Check if current streak includes today or yesterday
    const today = getToday();
    const yesterday = getDateString(Date.now() - 24 * 60 * 60 * 1000);
    const lastDate = sortedDates[sortedDates.length - 1];

    let current = 0;
    if (lastDate === today || lastDate === yesterday) {
      current = 1;
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const prev = new Date(sortedDates[i] + 'T00:00:00');
        const curr = new Date(sortedDates[i + 1] + 'T00:00:00');
        const diffDays = Math.round(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    return { current, longest: Math.max(longest, current) };
  }, [state.sessions]);

  return {
    startTimer,
    stopTimer,
    isTracking,
    currentDuration: isTracking ? currentDuration : 0,
    getTotalTime,
    getDailyBreakdown,
    getWeeklyTotal,
    getMonthlyTotal,
    getSessions,
    getStreak,
  };
}
