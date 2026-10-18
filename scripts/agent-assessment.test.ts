import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import source from "../data/canonical.json";
import { CanonicalSchema } from "../src/schema";
import {
  canonical,
  currentAgentProgress,
  getProgressHistory,
  getProgressRange,
} from "../src/lib/data";
import { forecastSeries } from "../src/lib/forecast-series";

function rejects(edit: (data: typeof source) => void, path: string) {
  const data = structuredClone(source);
  edit(data);
  const parsed = CanonicalSchema.safeParse(data);
  expect(parsed.success).toBe(false);
  if (!parsed.success)
    expect(
      parsed.error.issues.some((i) => i.path.join(".").startsWith(path)),
    ).toBe(true);
}

describe("dated agent assessment", () => {
  it("preserves the four original July records exactly", () => {
    const july = source.capability_progress.filter((p) =>
      p.as_of.startsWith("2026-07"),
    );
    expect(
      createHash("sha256").update(JSON.stringify(july)).digest("hex"),
    ).toBe("88b7828b6472e7aef83400ea105bbb6c862f27b8725756729400ca25676e2c91");
  });
  it("selects one current assessment per agent and preserves history in date order", () => {
    expect(currentAgentProgress).toHaveLength(5);
    expect(new Set(currentAgentProgress.map((p) => p.milestone_id)).size).toBe(
      5,
    );
    for (const progress of currentAgentProgress) {
      const range = getProgressRange(progress);
      expect(range.low).toBeLessThanOrEqual(progress.score);
      expect(range.high).toBeGreaterThanOrEqual(progress.score);
      const history = getProgressHistory(progress.id);
      expect(history[0].as_of).toBe(canonical.agent_assessment.as_of);
      if (history[1]) {
        expect(history[0].as_of > history[1].as_of).toBe(true);
        expect(history[0].criteria.map((c) => [c.id, c.weight])).toEqual(
          history[1].criteria.map((c) => [c.id, c.weight]),
        );
      }
    }
  });
  it("rounds half-point bounds consistently despite binary floating-point error", () => {
    expect(getProgressRange(currentAgentProgress[3]).high).toBe(40);
  });
  it("rejects stale or mismatched progress pointers", () => {
    rejects((d) => {
      d.agent_assessment.agents[1].progress_id = d.capability_progress[1].id;
    }, "agent_assessment.agents.1.progress_id");
    rejects((d) => {
      d.agent_assessment.agents[1].progress_id =
        d.agent_assessment.agents[0].progress_id;
    }, "agent_assessment.agents.1.progress_id");
  });
  it("rejects a future predecessor, cycle or cross-agent history", () => {
    rejects((d) => {
      d.capability_progress[4].supersedes = d.capability_progress[4].id;
    }, "capability_progress.4.supersedes");
    rejects((d) => {
      d.capability_progress[4].supersedes = d.capability_progress[1].id;
    }, "capability_progress.4.supersedes");
  });
  it("cannot declare a bundle met while a defining criterion is incomplete", () => {
    rejects((d) => {
      d.agent_assessment.agents[1].status = "assessed-met";
    }, "agent_assessment.agents.1.status");
  });
  it("rejects missing sources and an unrelated forecast", () => {
    rejects((d) => {
      d.agent_assessment.agents[2].evidence_refs = ["missing"];
    }, "agent_assessment.agents.2.evidence_refs");
    rejects((d) => {
      d.agent_assessment.outlook[0].scenario.source_ref = "missing";
    }, "agent_assessment.outlook.0.scenario.source_ref");
    rejects((d) => {
      d.agent_assessment.outlook[0].forecast_id = "codex-asi-20261018";
    }, "agent_assessment.outlook.0.forecast_id");
  });
  it("does not substitute a later milestone for the Agent-5 narrative profile", () => {
    const a5 = canonical.agent_assessment.agents[4];
    expect(a5.milestone_id).toBe("agent-5");
    expect(a5.forecast_id).toBeNull();
    expect(a5.story_date.label).toContain("race");
  });
  it("uses the new October ASI quantiles without inheriting September's probability curve", () => {
    const october = canonical.forecasts.find(
      (f) => f.id === "codex-asi-20261018",
    )!;
    expect(forecastSeries(october).points).toEqual([
      { year: 2028.5, p: 0.1 },
      { year: 2031, p: 0.5 },
      { year: 2047, p: 0.9 },
    ]);
    expect(
      canonical.forecasts.find((f) => f.id === "codex-asi-20260904")!
        .superseded_by,
    ).toBe(october.id);
  });
});
