export type Quantile = { value: number; label: string; lower_bound?: boolean };
export type Distribution = {
  p10: Quantile;
  p25?: Quantile;
  p50: Quantile;
  p75?: Quantile;
  p90: Quantile;
};
export type ProbabilityReading = {
  value: number;
  bound: "below" | "above" | "exact" | "interpolated";
};
/** Interpolate known points only. Censored quantiles and tails cannot supply an exact endpoint. */
export function probabilityFromPoints(
  points: { year: number; p: number }[],
  year: number,
): ProbabilityReading {
  if (year < points[0].year) return { value: points[0].p, bound: "below" };
  const last = points[points.length - 1];
  if (year > last.year) return { value: last.p, bound: "above" };
  for (let i = 0; i < points.length; i++) {
    if (year === points[i].year) return { value: points[i].p, bound: "exact" };
    if (year < points[i].year) {
      const a = points[i - 1],
        b = points[i];
      return {
        value: a.p + ((b.p - a.p) * (year - a.year)) / (b.year - a.year),
        bound: "interpolated",
      };
    }
  }
  return { value: last.p, bound: "exact" };
}
/** A display interpolation, not a fitted probability model. Never extrapolate tails. */
export function probabilityAt(
  distribution: Distribution,
  year: number,
): ProbabilityReading {
  const points = (
    [
      ["p10", 0.1],
      ["p25", 0.25],
      ["p50", 0.5],
      ["p75", 0.75],
      ["p90", 0.9],
    ] as const
  ).flatMap(([key, p]) =>
    distribution[key] && !distribution[key]!.lower_bound
      ? [{ year: distribution[key]!.value, p }]
      : [],
  );
  return probabilityFromPoints(points, year);
}
export function researchSpeedup(automatedShare: number, taskSpeed: number) {
  return 1 / (1 - automatedShare + automatedShare / taskSpeed);
}
