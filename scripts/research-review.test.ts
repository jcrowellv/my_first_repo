import { describe, expect, it } from "vitest";
import source from "../data/canonical.json";
import { CanonicalSchema } from "../src/schema";

function rejects(edit: (data: typeof source) => void, path: string) {
  const data = structuredClone(source);
  edit(data);
  const result = CanonicalSchema.safeParse(data);
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(
      result.error.issues.some((issue) =>
        issue.path.join(".").startsWith(path),
      ),
    ).toBe(true);
  }
}

describe("research review provenance", () => {
  it("rejects an omitted packet page", () => {
    rejects((d) => {
      d.research_review.claims[0].pages.pop();
    }, "research_review.claims");
  });
  it("rejects duplicate and out-of-range page coverage", () => {
    rejects((d) => {
      d.research_review.claims[1].pages.push(1);
    }, "research_review.claims.1.pages");
    rejects((d) => {
      d.research_review.claims[0].pages.push(27);
    }, "research_review.claims.0.pages");
  });
  it("requires evidence for an admitted claim", () => {
    rejects((d) => {
      d.research_review.claims[1].evidence_refs = [];
    }, "research_review.claims.1.evidence_refs");
  });
  it("rejects dangling claims, measurements and monitor reviews", () => {
    rejects((d) => {
      d.research_review.claims[1].evidence_refs = ["missing"];
    }, "research_review.claims.1.evidence_refs");
    rejects((d) => {
      d.research_review.measurements[0].source_ref = "missing";
    }, "research_review.measurements.0.source_ref");
    const index = source.falsifiers.findIndex((f) => f.latest_review);
    rejects((d) => {
      d.falsifiers[index].latest_review!.evidence_refs = ["missing"];
    }, `falsifiers.${index}.latest_review.evidence_refs`);
  });
  it("rejects intervals that omit or exclude the estimate", () => {
    rejects((d) => {
      d.research_review.measurements[0].low = 3;
    }, "research_review.measurements.0");
    rejects((d) => {
      d.research_review.measurements[0].high = undefined;
    }, "research_review.measurements.0");
  });
  it("rejects review dates before the source and after the cutoff", () => {
    const index = source.evidence.findIndex((e) => e.reviewed_on);
    rejects((d) => {
      d.evidence[index].reviewed_on = "2020-01-01";
    }, `evidence.${index}.reviewed_on`);
    rejects((d) => {
      d.evidence[index].reviewed_on = "2099-01-01";
    }, `evidence.${index}.reviewed_on`);
  });
});
