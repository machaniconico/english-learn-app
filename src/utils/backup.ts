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

export function applyBackup(
  backup: BackupFile,
  mode: 'replace' | 'merge',
  storage: Storage = localStorage,
): { applied: number } {
  if (mode === 'replace') {
    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key !== null && key.startsWith(BACKUP_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      storage.removeItem(key);
    }
  }

  let applied = 0;
  for (const [key, value] of Object.entries(backup.data)) {
    if (key.startsWith(BACKUP_PREFIX)) {
      storage.setItem(key, value);
      applied++;
    }
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
