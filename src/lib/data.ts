import canonicalJson from "../../data/canonical.json";
import { CanonicalSchema } from "../schema";

export const canonical = CanonicalSchema.parse(canonicalJson);

export const tracksById = new Map(
  canonical.meta.tracks.map((track) => [track.id, track]),
);
export const milestonesById = new Map(
  canonical.milestones.map((milestone) => [milestone.id, milestone]),
);
export const forecastsById = new Map(
  canonical.forecasts.map((forecast) => [forecast.id, forecast]),
);
export const evidenceById = new Map(
  canonical.evidence.map((evidence) => [evidence.id, evidence]),
);
export const falsifiersById = new Map(
  canonical.falsifiers.map((falsifier) => [falsifier.id, falsifier]),
);

export const newestChangelogDate = [...canonical.changelog]
  .sort((a, b) => b.date.localeCompare(a.date))[0]
  .date;

export function getForecastChain(forecastId: string) {
  const chain = [];
  let current = forecastsById.get(forecastId);
  const visited = new Set<string>();
  while (current && !visited.has(current.id)) {
    chain.push(current);
    visited.add(current.id);
    current = current.superseded_by
      ? forecastsById.get(current.superseded_by)
      : undefined;
  }
  return chain;
}

export function getProgressRange(
  progress: (typeof canonical.capability_progress)[number],
) {
  const low = Math.round(
    progress.criteria.reduce(
      (sum, criterion) =>
        sum + criterion.weight * criterion.completion_range.low,
      0,
    ) * 100,
  );
  const high = Math.round(
    progress.criteria.reduce(
      (sum, criterion) =>
        sum + criterion.weight * criterion.completion_range.high,
      0,
    ) * 100,
  );
  return { low, high };
}
