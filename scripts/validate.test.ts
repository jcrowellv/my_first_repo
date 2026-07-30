import { describe, expect, it } from "vitest";
import canonicalJson from "../data/canonical.json";
import { CanonicalSchema } from "../src/schema";

describe("canonical data", () => {
  it("accepts the shipped data", () => {
    expect(CanonicalSchema.safeParse(canonicalJson).success).toBe(true);
  });

  it("reports the precise path for a broken percentile", () => {
    const broken = structuredClone(canonicalJson);
    broken.forecasts[0].distribution.p10.value = 2100;
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "forecasts.0.distribution")).toBe(true);
    }
  });

  it("rejects a capability score that does not match its weighted criteria", () => {
    const broken = structuredClone(canonicalJson);
    broken.capability_progress[0].score = 99;
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "capability_progress.0.score")).toBe(true);
    }
  });

  it("rejects a criterion whose central estimate falls outside its uncertainty range", () => {
    const broken = structuredClone(canonicalJson);
    broken.capability_progress[1].criteria[0].completion_range.high = 0.7;
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path.join(".") ===
            "capability_progress.1.criteria.0.completion_range",
        ),
      ).toBe(true);
    }
  });

  it("requires complete provenance labels on every evidence record", () => {
    const broken = structuredClone(canonicalJson) as unknown as {
      evidence: Array<Record<string, unknown>>;
    };
    delete broken.evidence[0].verification;
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.path.join(".") === "evidence.0.verification",
        ),
      ).toBe(true);
    }
  });

  it("rejects overlapping evidence and counterevidence on one criterion", () => {
    const broken = structuredClone(canonicalJson);
    broken.capability_progress[1].criteria[0].counterevidence_refs = [
      broken.capability_progress[1].criteria[0].evidence_refs[0],
    ];
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path.join(".") ===
            "capability_progress.1.criteria.0.counterevidence_refs.0",
        ),
      ).toBe(true);
    }
  });

  it("rejects an outside view whose evidence record is missing", () => {
    const broken = structuredClone(canonicalJson);
    broken.outside_views[0].evidence_ref = "ev-does-not-exist";
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.path.join(".") === "outside_views.0.evidence_ref",
        ),
      ).toBe(true);
    }
  });

  it("requires one unique position per house track for every forecast driver", () => {
    const broken = structuredClone(canonicalJson);
    broken.forecast_drivers[0].track_positions[1].track_id =
      broken.forecast_drivers[0].track_positions[0].track_id;
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path.join(".") ===
            "forecast_drivers.0.track_positions.1.track_id",
        ),
      ).toBe(true);
    }
  });

  it("requires an archive reason when a source leaves the live ledger", () => {
    const broken = structuredClone(canonicalJson);
    const archivedIndex = broken.evidence.findIndex((item) => item.archived);
    broken.evidence[archivedIndex].archive_reason = undefined;
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path.join(".") ===
            `evidence.${archivedIndex}.archive_reason`,
        ),
      ).toBe(true);
    }
  });

  it("rejects a conclusion step whose evidence record is missing", () => {
    const broken = structuredClone(canonicalJson);
    broken.meta.briefing.reasoning.steps[0].evidence_refs[0] =
      "ev-does-not-exist";
    const result = CanonicalSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path.join(".") ===
            "meta.briefing.reasoning.steps.0.evidence_refs.0",
        ),
      ).toBe(true);
    }
  });
});
