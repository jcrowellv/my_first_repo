import { describe, expect, it } from "vitest";
import { canonical } from "./data";
import { matchesTopic, sourceFamilyCount } from "./evidence";

describe("evidence discovery", () => {
  it("keeps every record from the current review discoverable", () => {
    const current = canonical.evidence.filter((e) =>
      matchesTopic(e, "rsi", canonical.research_review.as_of),
    );
    expect(current.length).toBeGreaterThan(0);
    const ids = new Set(current.map((e) => e.id));
    const review = canonical.research_review;
    for (const id of [
      ...review.featured_evidence,
      ...review.additional_evidence,
    ]) {
      expect(ids.has(id), id).toBe(true);
    }
    expect(matchesTopic(current[0], "rsi", "2020-01-01")).toBe(false);
  });

  it("groups repeated coverage without treating it as independent events", () => {
    const incident = canonical.evidence.filter(
      (e) => e.event_id === "hugging-face-incident-202607",
    );
    expect(incident.length).toBeGreaterThan(1);
    expect(sourceFamilyCount(incident)).toBe(1);
  });

  it("includes open-weight evidence under open models and deployment", () => {
    const open = canonical.evidence.filter((e) =>
      e.themes?.includes("open-weight"),
    );
    expect(open.length).toBeGreaterThan(0);
    expect(open.every((e) => matchesTopic(e, "diffusion"))).toBe(true);
  });
});
