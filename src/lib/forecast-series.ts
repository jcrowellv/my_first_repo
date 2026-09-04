import daniel from "../../data/daniel-20260816-cdf.json";
import ledgerAsi from "../../data/ledger-20260904-asi-cdf.json";
import type { canonical } from "./data";
export type ForecastRecord = (typeof canonical.forecasts)[number];
export function forecastSeries(f: ForecastRecord) {
  const key = (
    {
      ac: "AC",
      sar: "SAR-level-experiment-selection-skill",
      "ted-ai": "TED-AI",
      asi: "ASI",
    } as const
  )[f.milestone_id as "ac" | "sar" | "ted-ai" | "asi"];
  if (f.track === "daniel" && f.committed_on === "2026-08-16" && key)
    return {
      source: "Published curve",
      points: daniel[key].map((x) => ({ year: x.year, p: x.cdf })),
    };
  if (
    f.track === "codex" &&
    f.milestone_id === "asi" &&
    f.committed_on === "2026-09-04"
  )
    return { source: "Stated probability anchors", points: ledgerAsi.points };
  return {
    source: "Recorded quantiles",
    points: (
      [
        ["p10", 0.1],
        ["p25", 0.25],
        ["p50", 0.5],
        ["p75", 0.75],
        ["p90", 0.9],
      ] as const
    ).flatMap(([key, p]) =>
      f.distribution[key] && !f.distribution[key]!.lower_bound
        ? [{ year: f.distribution[key]!.value, p }]
        : [],
    ),
  };
}
