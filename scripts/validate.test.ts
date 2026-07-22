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
});
