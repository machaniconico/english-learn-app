import { useEffect, useState } from "react";
import type { Section } from "../data/types";
import { loadSection, loadAllSections } from "../data/sectionContent";

interface SectionState {
  id: string | undefined;
  section: Section | null;
}

/**
 * Load a single section's full data lazily.
 *
 * undefined = still loading, null = not found (no id or unknown id),
 * Section = loaded.
 *
 * The loaded value is stored alongside the id it belongs to. While the stored
 * id does not match the requested id (the initial mount, or right after `id`
 * changes), we return undefined to signal loading — without a synchronous
 * setState inside the effect, so react-hooks/set-state-in-effect stays happy.
 */
export function useSection(id: string | undefined): Section | null | undefined {
  const [state, setState] = useState<SectionState | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadSection(id ?? "").then((section) => {
      if (!cancelled) setState({ id, section });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!state || state.id !== id) return undefined;
  return state.section;
}

/**
 * Load every section lazily. undefined = still loading.
 */
export function useAllSections(): Section[] | undefined {
  const [sections, setSections] = useState<Section[] | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadAllSections().then((result) => {
      if (!cancelled) setSections(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return sections;
}
