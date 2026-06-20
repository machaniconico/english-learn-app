// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  BACKUP_PREFIX,
  BACKUP_VERSION,
  collectBackup,
  serializeBackup,
  parseBackup,
  applyBackup,
  summarizeBackup,
} from './backup';
import type { BackupFile } from './backup';

// ---------------------------------------------------------------------------
// Minimal in-memory Storage implementation for injection
// ---------------------------------------------------------------------------
class FakeStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

// ---------------------------------------------------------------------------
// collectBackup
// ---------------------------------------------------------------------------
describe('collectBackup', () => {
  it('collects only keys that start with the prefix', () => {
    const s = new FakeStorage();
    s.setItem('english-learn-progress', '{"level":3}');
    s.setItem('english-learn-theme', '"dark"');
    s.setItem('unrelated-key', 'should-be-ignored');
    s.setItem('another-app-key', 'also-ignored');

    const backup = collectBackup(s);

    expect(Object.keys(backup.data)).toHaveLength(2);
    expect(backup.data['english-learn-progress']).toBe('{"level":3}');
    expect(backup.data['english-learn-theme']).toBe('"dark"');
    expect(backup.data).not.toHaveProperty('unrelated-key');
  });

  it('returns an empty data object when no prefixed keys exist', () => {
    const s = new FakeStorage();
    s.setItem('foreign', 'value');
    const backup = collectBackup(s);
    expect(backup.data).toEqual({});
  });

  it('sets app to english-learn-app', () => {
    const s = new FakeStorage();
    const backup = collectBackup(s);
    expect(backup.app).toBe('english-learn-app');
  });

  it('sets version to BACKUP_VERSION', () => {
    const s = new FakeStorage();
    const backup = collectBackup(s);
    expect(backup.version).toBe(BACKUP_VERSION);
  });

  it('sets exportedAt to a recent timestamp', () => {
    const before = Date.now();
    const s = new FakeStorage();
    const backup = collectBackup(s);
    const after = Date.now();
    expect(backup.exportedAt).toBeGreaterThanOrEqual(before);
    expect(backup.exportedAt).toBeLessThanOrEqual(after);
  });

  it('auto-discovers keys by prefix without hardcoding', () => {
    const s = new FakeStorage();
    // Use a hypothetical future key — should still be collected
    s.setItem(`${BACKUP_PREFIX}future-feature`, 'value');
    const backup = collectBackup(s);
    expect(backup.data[`${BACKUP_PREFIX}future-feature`]).toBe('value');
  });
});

// ---------------------------------------------------------------------------
// serializeBackup / parseBackup round-trip
// ---------------------------------------------------------------------------
describe('serializeBackup + parseBackup round-trip', () => {
  it('round-trips a BackupFile losslessly', () => {
    const s = new FakeStorage();
    s.setItem('english-learn-progress', '{"score":42}');
    s.setItem('english-learn-srs', '{"cards":[]}');
    const original = collectBackup(s);
    const text = serializeBackup(original);
    const parsed = parseBackup(text);

    expect(parsed.app).toBe(original.app);
    expect(parsed.version).toBe(original.version);
    expect(parsed.exportedAt).toBe(original.exportedAt);
    expect(parsed.data).toEqual(original.data);
  });

  it('produces pretty-printed JSON (has newlines)', () => {
    const s = new FakeStorage();
    const text = serializeBackup(collectBackup(s));
    expect(text).toContain('\n');
  });
});

// ---------------------------------------------------------------------------
// parseBackup validation
// ---------------------------------------------------------------------------
describe('parseBackup validation', () => {
  it('throws on invalid JSON', () => {
    expect(() => parseBackup('not json')).toThrow();
  });

  it('throws a JP message when app field is wrong', () => {
    const bad = JSON.stringify({ app: 'other-app', version: 1, exportedAt: 0, data: {} });
    expect(() => parseBackup(bad)).toThrow(/app/);
  });

  it('throws when data is missing', () => {
    const bad = JSON.stringify({ app: 'english-learn-app', version: 1, exportedAt: 0 });
    expect(() => parseBackup(bad)).toThrow();
  });

  it('throws when data is an array instead of object', () => {
    const bad = JSON.stringify({ app: 'english-learn-app', version: 1, exportedAt: 0, data: [] });
    expect(() => parseBackup(bad)).toThrow();
  });

  it('throws when a data value is not a string', () => {
    const bad = JSON.stringify({
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-progress': 123 },
    });
    expect(() => parseBackup(bad)).toThrow();
  });

  it('throws when top-level is not an object', () => {
    expect(() => parseBackup('"string"')).toThrow();
    expect(() => parseBackup('null')).toThrow();
    expect(() => parseBackup('42')).toThrow();
  });

  it('accepts a valid minimal backup', () => {
    const valid: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 1000,
      data: { 'english-learn-theme': '"light"' },
    };
    const result = parseBackup(JSON.stringify(valid));
    expect(result.app).toBe('english-learn-app');
    expect(result.data['english-learn-theme']).toBe('"light"');
  });
});

// ---------------------------------------------------------------------------
// applyBackup — replace mode
// ---------------------------------------------------------------------------
describe('applyBackup replace mode', () => {
  it('removes all existing prefixed keys before writing', () => {
    const s = new FakeStorage();
    s.setItem('english-learn-progress', 'old-progress');
    s.setItem('english-learn-srs', 'old-srs');

    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-progress': 'new-progress' },
    };

    applyBackup(backup, 'replace', s);

    expect(s.getItem('english-learn-progress')).toBe('new-progress');
    // stale key removed
    expect(s.getItem('english-learn-srs')).toBeNull();
  });

  it('does not remove non-prefixed keys', () => {
    const s = new FakeStorage();
    s.setItem('foreign-key', 'keep-me');
    s.setItem('english-learn-theme', '"dark"');

    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-theme': '"light"' },
    };

    applyBackup(backup, 'replace', s);

    expect(s.getItem('foreign-key')).toBe('keep-me');
    expect(s.getItem('english-learn-theme')).toBe('"light"');
  });

  it('returns the count of applied keys', () => {
    const s = new FakeStorage();
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: {
        'english-learn-progress': 'a',
        'english-learn-srs': 'b',
      },
    };
    const { applied } = applyBackup(backup, 'replace', s);
    expect(applied).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// applyBackup — merge mode
// ---------------------------------------------------------------------------
describe('applyBackup merge mode', () => {
  it('overwrites per-key but keeps untouched prefixed keys', () => {
    const s = new FakeStorage();
    s.setItem('english-learn-progress', 'old-progress');
    s.setItem('english-learn-srs', 'kept-srs');

    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-progress': 'new-progress' },
    };

    applyBackup(backup, 'merge', s);

    expect(s.getItem('english-learn-progress')).toBe('new-progress');
    // existing key NOT in backup must be preserved
    expect(s.getItem('english-learn-srs')).toBe('kept-srs');
  });

  it('returns correct applied count', () => {
    const s = new FakeStorage();
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: {
        'english-learn-theme': '"dark"',
        'english-learn-daily-goal': '10',
      },
    };
    const { applied } = applyBackup(backup, 'merge', s);
    expect(applied).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// applyBackup — defensive: never write foreign keys
// ---------------------------------------------------------------------------
describe('applyBackup foreign key defense', () => {
  it('ignores data entries whose keys lack the prefix', () => {
    const s = new FakeStorage();
    const backup = {
      app: 'english-learn-app' as const,
      version: 1,
      exportedAt: 0,
      data: {
        'english-learn-progress': 'ok',
        'foreign-key': 'should-not-be-written',
      },
    };

    applyBackup(backup, 'replace', s);

    expect(s.getItem('english-learn-progress')).toBe('ok');
    expect(s.getItem('foreign-key')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// summarizeBackup
// ---------------------------------------------------------------------------
describe('summarizeBackup', () => {
  it('maps known keys to Japanese labels', () => {
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: {
        'english-learn-progress': '{}',
        'english-learn-srs': '{}',
      },
    };
    const entries = summarizeBackup(backup);
    const labels = entries.map((e) => e.label);
    expect(labels).toContain('学習進捗');
    expect(labels).toContain('SRS（間隔反復）');
  });

  it('falls back to the stripped key for unknown keys', () => {
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-future-feature': 'value' },
    };
    const entries = summarizeBackup(backup);
    expect(entries[0].label).toBe('future-feature');
  });

  it('computes byte sizes of values', () => {
    const value = '{"a":1}';
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-progress': value },
    };
    const entries = summarizeBackup(backup);
    expect(entries[0].bytes).toBe(new TextEncoder().encode(value).length);
  });

  it('includes multibyte Japanese content in byte count correctly', () => {
    const value = '日本語テスト'; // 3 bytes each in UTF-8
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-progress': value },
    };
    const entries = summarizeBackup(backup);
    expect(entries[0].bytes).toBe(new TextEncoder().encode(value).length);
  });

  it('returns entries sorted by label (locale ja)', () => {
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: {
        'english-learn-theme': 'a',
        'english-learn-progress': 'b',
        'english-learn-bookmarks': 'c',
      },
    };
    const entries = summarizeBackup(backup);
    const labels = entries.map((e) => e.label);
    const sorted = [...labels].sort((a, b) => a.localeCompare(b, 'ja'));
    expect(labels).toEqual(sorted);
  });

  it('exposes the full key on each entry', () => {
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: { 'english-learn-theme': '"dark"' },
    };
    const entries = summarizeBackup(backup);
    expect(entries[0].key).toBe('english-learn-theme');
  });

  it('returns empty array for empty data', () => {
    const backup: BackupFile = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: 0,
      data: {},
    };
    expect(summarizeBackup(backup)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// version / exportedAt presence
// ---------------------------------------------------------------------------
describe('BackupFile metadata', () => {
  it('exportedAt is a number', () => {
    const s = new FakeStorage();
    const backup = collectBackup(s);
    expect(typeof backup.exportedAt).toBe('number');
  });

  it('version equals BACKUP_VERSION constant', () => {
    const s = new FakeStorage();
    const backup = collectBackup(s);
    expect(backup.version).toBe(BACKUP_VERSION);
  });
});
