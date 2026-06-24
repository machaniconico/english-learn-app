// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSection, useAllSections } from './useSection';

// Valid section ids come from sectionsMeta.
const VALID_ID = 'phrases';
const ANOTHER_VALID_ID = 'grammar';
const UNKNOWN_ID = 'does-not-exist';

describe('useSection', () => {
  it('returns undefined immediately (loading state)', () => {
    const { result } = renderHook(() => useSection(VALID_ID));
    expect(result.current).toBeUndefined();
  });

  it('resolves to a Section whose id matches the requested id', async () => {
    const { result } = renderHook(() => useSection(VALID_ID));
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    expect(result.current).not.toBeNull();
    const section = result.current as NonNullable<typeof result.current>;
    expect(section.id).toBe(VALID_ID);
  });

  it('resolved Section has the expected shape (title, categories, etc.)', async () => {
    const { result } = renderHook(() => useSection(VALID_ID));
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    const section = result.current as NonNullable<typeof result.current>;
    expect(typeof section!.title).toBe('string');
    expect(typeof section!.titleJa).toBe('string');
    expect(typeof section!.description).toBe('string');
    expect(typeof section!.icon).toBe('string');
    expect(typeof section!.color).toBe('string');
    expect(Array.isArray(section!.categories)).toBe(true);
  });

  it('returns null for an unknown id (not found)', async () => {
    const { result } = renderHook(() => useSection(UNKNOWN_ID));
    await waitFor(() => expect(result.current !== undefined).toBe(true), { timeout: 5000 });
    expect(result.current).toBeNull();
  });

  it('returns undefined then null when id is undefined', async () => {
    const { result } = renderHook(() => useSection(undefined));
    // Initially loading
    expect(result.current).toBeUndefined();
    // loadSection('') returns null (no meta for empty string)
    await waitFor(() => expect(result.current !== undefined).toBe(true), { timeout: 5000 });
    expect(result.current).toBeNull();
  });

  it('resets to undefined (loading) and then resolves when id changes', async () => {
    let id = VALID_ID;
    const { result, rerender } = renderHook(() => useSection(id));

    // Wait for first resolution
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    expect((result.current as NonNullable<typeof result.current>)!.id).toBe(VALID_ID);

    // Change the id — hook should go back to undefined (loading)
    act(() => {
      id = ANOTHER_VALID_ID;
    });
    rerender();

    // Right after the id change and before async resolves, should be undefined
    expect(result.current).toBeUndefined();

    // Then resolves to the new section
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    expect((result.current as NonNullable<typeof result.current>)!.id).toBe(ANOTHER_VALID_ID);
  });

  it('resolves a different valid section (vocabulary)', async () => {
    const { result } = renderHook(() => useSection('vocabulary'));
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    const section = result.current as NonNullable<typeof result.current>;
    expect(section!.id).toBe('vocabulary');
  });
});

describe('useAllSections', () => {
  it('returns undefined immediately (loading state)', () => {
    const { result } = renderHook(() => useAllSections());
    expect(result.current).toBeUndefined();
  });

  it('resolves to an array of sections', async () => {
    const { result } = renderHook(() => useAllSections());
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    expect(Array.isArray(result.current)).toBe(true);
  });

  it('resolves to all 5 known sections', async () => {
    const { result } = renderHook(() => useAllSections());
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    expect(result.current!.length).toBe(5);
  });

  it('each resolved section has id, title, and categories array', async () => {
    const { result } = renderHook(() => useAllSections());
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    for (const section of result.current!) {
      expect(typeof section.id).toBe('string');
      expect(section.id.length).toBeGreaterThan(0);
      expect(typeof section.title).toBe('string');
      expect(Array.isArray(section.categories)).toBe(true);
    }
  });

  it('sections are returned in sectionsMeta order', async () => {
    const { result } = renderHook(() => useAllSections());
    await waitFor(() => expect(result.current).not.toBeUndefined(), { timeout: 5000 });
    const ids = result.current!.map((s) => s.id);
    expect(ids).toEqual(['phrases', 'vocabulary', 'idioms', 'grammar', 'toeic']);
  });
});
