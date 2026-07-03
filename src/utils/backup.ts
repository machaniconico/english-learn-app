export const BACKUP_PREFIX = 'english-learn-';
export const BACKUP_VERSION = 1;

export interface BackupFile {
  app: 'english-learn-app';
  version: number;
  exportedAt: number;
  data: Record<string, string>;
}

export interface BackupEntry {
  key: string;
  label: string;
  bytes: number;
}

const LABEL_MAP: Record<string, string> = {
  progress: '学習進捗',
  srs: 'SRS（間隔反復）',
  bookmarks: 'ブックマーク',
  'custom-decks': 'カスタム単語帳',
  analytics: '学習イベント',
  accuracy: '正答率履歴',
  'daily-goal': '1日の目標',
  'score-history': 'スコア履歴',
  'study-time': '学習時間',
  theme: 'テーマ設定',
  'user-level': 'レベル診断',
  'weak-points': '苦手分野',
};

export function collectBackup(storage: Storage = localStorage): BackupFile {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key !== null && key.startsWith(BACKUP_PREFIX)) {
      const value = storage.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    }
  }
  return {
    app: 'english-learn-app',
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    data,
  };
}

export function serializeBackup(backup: BackupFile): string {
  return JSON.stringify(backup, null, 2);
}

export function parseBackup(text: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('バックアップファイルの形式が正しくありません（JSONの解析に失敗しました）。');
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as Record<string, unknown>)['app'] !== 'english-learn-app'
  ) {
    throw new Error(
      'このファイルはこのアプリのバックアップではありません（app フィールドが一致しません）。',
    );
  }

  const obj = parsed as Record<string, unknown>;
  const version = obj['version'];
  if (
    typeof version !== 'number' ||
    !Number.isInteger(version) ||
    version < 1 ||
    version > BACKUP_VERSION
  ) {
    throw new Error(
      `バックアップファイルの version フィールドが不正です。対応バージョンは 1〜${BACKUP_VERSION} です。`,
    );
  }

  if (typeof obj['data'] !== 'object' || obj['data'] === null || Array.isArray(obj['data'])) {
    throw new Error('バックアップファイルの data フィールドが不正です。');
  }

  const data = obj['data'] as Record<string, unknown>;
  for (const [k, v] of Object.entries(data)) {
    if (typeof v !== 'string') {
      throw new Error(
        `バックアップファイルの data["${k}"] が文字列ではありません。ファイルが破損している可能性があります。`,
      );
    }
  }

  return parsed as BackupFile;
}

function getPrefixedKeys(storage: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key !== null && key.startsWith(BACKUP_PREFIX)) {
      keys.push(key);
    }
  }
  return keys;
}

function takeSnapshot(storage: Storage): Map<string, string> {
  const snapshot = new Map<string, string>();
  for (const key of getPrefixedKeys(storage)) {
    const value = storage.getItem(key);
    if (value !== null) {
      snapshot.set(key, value);
    }
  }
  return snapshot;
}

function rollbackFromSnapshot(storage: Storage, snapshot: Map<string, string>): void {
  for (const key of getPrefixedKeys(storage)) {
    if (!snapshot.has(key)) {
      storage.removeItem(key);
    }
  }

  for (const [key, value] of snapshot) {
    storage.setItem(key, value);
  }
}

function restoreFailureMessage(key: string): string {
  return `復元中にエラーが発生したため元の状態に戻しました（キー: ${key}）。ストレージ容量が不足している可能性があります。`;
}

export function applyBackup(
  backup: BackupFile,
  mode: 'replace' | 'merge',
  storage: Storage = localStorage,
): { applied: number } {
  const entriesToApply = Object.entries(backup.data).filter(([key]) => key.startsWith(BACKUP_PREFIX));

  if (mode === 'replace') {
    const snapshot = takeSnapshot(storage);
    for (const key of getPrefixedKeys(storage)) {
      storage.removeItem(key);
    }

    let applied = 0;
    for (const [key, value] of entriesToApply) {
      try {
        storage.setItem(key, value);
      } catch {
        rollbackFromSnapshot(storage, snapshot);
        throw new Error(restoreFailureMessage(key));
      }
      applied++;
    }

    return { applied };
  }

  let applied = 0;
  for (const [key, value] of entriesToApply) {
    try {
      storage.setItem(key, value);
    } catch {
      throw new Error(
        `バックアップの復元中にエラーが発生しました（キー: ${key}）。ストレージ容量が不足している可能性があります。`,
      );
    }
    applied++;
  }

  return { applied };
}

export function summarizeBackup(backup: BackupFile): BackupEntry[] {
  const entries: BackupEntry[] = Object.entries(backup.data).map(([key, value]) => {
    const stripped = key.startsWith(BACKUP_PREFIX) ? key.slice(BACKUP_PREFIX.length) : key;
    const label = LABEL_MAP[stripped] ?? stripped;
    const bytes = new TextEncoder().encode(value).length;
    return { key, label, bytes };
  });

  entries.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  return entries;
}
