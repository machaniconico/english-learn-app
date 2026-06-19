import { describe, it, expect } from 'vitest';
import { sectionsMeta } from './sectionsMeta';
import { sections } from './sections';

// Drift guard: sectionsMeta carries precomputed counts so Home (and other
// navigation pages) can render section sizes without importing the heavy
// content. These tests fail if the content changes but the metadata counts
// are not updated to match — keeping the static counts honest.
describe('sectionsMeta drift guard', () => {
  it('has one metadata entry per section, in the same order', () => {
    expect(sectionsMeta.map((m) => m.id)).toEqual(sections.map((s) => s.id));
  });

  it('precomputed counts match the real content for every section', () => {
    for (const section of sections) {
      const meta = sectionsMeta.find((m) => m.id === section.id);
      expect(meta, `missing sectionsMeta entry for "${section.id}"`).toBeDefined();
      if (!meta) continue;

      const categoryCount = section.categories.length;
      const lessonCount = section.categories.reduce(
        (sum, c) => sum + c.lessons.length,
        0,
      );
      const itemCount = section.categories.reduce(
        (sum, c) => sum + c.lessons.reduce((s, l) => s + l.items.length, 0),
        0,
      );

      expect(meta.categoryCount, `${section.id} categoryCount`).toBe(categoryCount);
      expect(meta.lessonCount, `${section.id} lessonCount`).toBe(lessonCount);
      expect(meta.itemCount, `${section.id} itemCount`).toBe(itemCount);
    }
  });
});
