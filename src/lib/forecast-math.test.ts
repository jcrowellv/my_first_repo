import { describe, it, expect } from "vitest";
import {
  probabilityAt,
  probabilityFromPoints,
  researchSpeedup,
} from "./forecast-math";
import { displayQuantileLabel } from "./dates";
import { canonical } from "./data";
import { forecastSeries } from "./forecast-series";
import publishedCdf from "../../data/daniel-20260816-cdf.json";
const d = {
  p10: { value: 2027, label: "2027" },
  p50: { value: 2030, label: "2030" },
  p90: { value: 2040, label: "2040" },
};
describe("honest forecast readouts", () => {
  it("preserves anchors and bounds both tails rather than claiming certainty", () => {
    expect(probabilityAt(d, 2030)).toEqual({ value: 0.5, bound: "exact" });
    expect(probabilityAt(d, 2026)).toEqual({ value: 0.1, bound: "below" });
    expect(probabilityAt(d, 2050)).toEqual({ value: 0.9, bound: "above" });
    expect(probabilityAt(d, 2035)).toEqual({
      value: 0.7,
      bound: "interpolated",
    });
  });
  it("does not interpolate toward a censored percentile", () => {
    const claude = canonical.forecasts.find(
      (f) => f.id === "claude-sar-20260721",
    )!;
    expect(claude.distribution.p90.lower_bound).toBe(true);
    expect(probabilityAt(claude.distribution, 2035)).toEqual({
      value: 0.75,
      bound: "above",
    });
    expect(probabilityAt(claude.distribution, 2040)).toEqual({
      value: 0.75,
      bound: "above",
    });
  });
  it("honors the September ASI cumulative judgments", () => {
    const f = canonical.forecasts.find((f) => f.id === "codex-asi-20260904")!;
    expect(probabilityFromPoints(forecastSeries(f).points, 2030)).toEqual({
      value: 0.25,
      bound: "exact",
    });
    expect(probabilityFromPoints(forecastSeries(f).points, 2036).value).toBe(
      0.7,
    );
  });
  it("retains year-only precision in September judgments", () => {
    expect(displayQuantileLabel({ value: 2030, label: "2030" })).toBe("2030");
  });
  it("keeps published probability curves ordered and within probability bounds", () => {
    for (const series of Object.values(publishedCdf))
      for (let i = 0; i < series.length; i++) {
        expect(series[i].cdf).toBeGreaterThanOrEqual(0);
        expect(series[i].cdf).toBeLessThanOrEqual(1);
        if (i) {
          expect(series[i].year).toBeGreaterThan(series[i - 1].year);
          expect(series[i].cdf).toBeGreaterThanOrEqual(series[i - 1].cdf);
        }
      }
    const ac = publishedCdf.AC.map((p) => ({ year: p.year, p: p.cdf }));
    expect(probabilityFromPoints(ac, 2028).value).toBeCloseTo(0.549, 2);
  });
});
describe("research work model", () => {
  it("leaves wholly unchanged work unchanged", () => {
    expect(researchSpeedup(0, 30)).toBe(1);
    expect(researchSpeedup(0.8, 1)).toBe(1);
  });
  it("retains the sequential bottleneck even with very fast assistance", () => {
    expect(researchSpeedup(0.8, 10)).toBeCloseTo(3.5714);
    expect(researchSpeedup(0.8, 100000)).toBeLessThan(5);
  });
});
