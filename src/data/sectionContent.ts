import type { Section, Category } from "./types";
import { sectionsMeta } from "./sectionsMeta";

/**
 * Maps a section id to ONLY that domain's categories using dynamic imports, so
 * a page scoped to one section pulls just that section's data chunk (e.g.
 * data-phrases) instead of the whole ~677kB content graph that statically
 * importing `./sections` would drag in.
 */
async function loadCategories(id: string): Promise<Category[]> {
  switch (id) {
    case "phrases":
      return (await import("./phrases")).phraseCategories;
    case "vocabulary":
      return (await import("./vocabulary")).vocabularyCategories;
    case "idioms":
      return (await import("./idioms")).idiomCategories;
    case "grammar":
      return (await import("./grammar")).grammarCategories;
    case "toeic":
      return (await import("./toeic")).toeicCategories;
    default:
      return [];
  }
}

/**
 * Resolve a single section by id: its lightweight display metadata plus its
 * dynamically-loaded categories. Returns null for an unknown id.
 */
export async function loadSection(id: string): Promise<Section | null> {
  const meta = sectionsMeta.find((m) => m.id === id);
  if (!meta) return null;
  const categories = await loadCategories(meta.id);
  return {
    id: meta.id,
    title: meta.title,
    titleJa: meta.titleJa,
    description: meta.description,
    icon: meta.icon,
    color: meta.color,
    categories,
  };
}

/**
 * Load every section (each domain chunk loaded in parallel), preserving
 * sectionsMeta order. Use only on pages that genuinely need all sections.
 */
export async function loadAllSections(): Promise<Section[]> {
  const sections = await Promise.all(
    sectionsMeta.map((meta) => loadSection(meta.id)),
  );
  return sections.filter((s): s is Section => s !== null);
}
