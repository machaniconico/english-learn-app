import { describe, it, expect } from "vitest";
import { loadSection, loadAllSections } from "./sectionContent";
import { sectionsMeta } from "./sectionsMeta";

describe("loadSection", () => {
  it("resolves a known section with its categories", async () => {
    const section = await loadSection("phrases");
    expect(section).not.toBeNull();
    expect(section?.id).toBe("phrases");
    expect(section?.categories.length).toBeGreaterThan(0);
  });

  it("resolves to null for an unknown id", async () => {
    const section = await loadSection("nope");
    expect(section).toBeNull();
  });
});

describe("loadAllSections", () => {
  it("returns all sections in sectionsMeta order", async () => {
    const sections = await loadAllSections();
    expect(sections).toHaveLength(5);
    expect(sections.map((s) => s.id)).toEqual(sectionsMeta.map((m) => m.id));
    for (const section of sections) {
      expect(section.categories.length).toBeGreaterThan(0);
    }
  });
});
