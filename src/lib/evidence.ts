import type { Evidence } from "../schema";

export const evidenceTopics = [
  ["all", "Everything"],
  ["rsi", "October RSI review"],
  ["research", "Research & agents"],
  ["evaluation", "Evaluations"],
  ["forecast", "Forecasts"],
  ["safety", "Safety & control"],
  ["diffusion", "Open models & deployment"],
] as const;

export function matchesTopic(e: Evidence, topic: string, reviewDate?: string) {
  switch (topic) {
    case "rsi":
      return reviewDate !== undefined && e.reviewed_on === reviewDate;
    case "research":
      return e.milestone_tags.some((id) =>
        ["agent-2", "sar", "siar", "sc"].includes(id),
      );
    case "evaluation":
      return ["evaluation", "system-card"].includes(e.source_type);
    case "forecast":
      return ["forecast", "scenario", "survey"].includes(e.source_type);
    case "safety":
      return (
        e.source_type === "incident" ||
        !!e.themes?.some((theme) =>
          ["cybersecurity", "alignment-control"].includes(theme),
        )
      );
    case "diffusion":
      return (
        e.source_type === "deployment" || !!e.themes?.includes("open-weight")
      );
    default:
      return true;
  }
}

export function sourceFamily(e: Evidence) {
  return e.event_id || e.id;
}

export function sourceFamilyCount(records: Evidence[]) {
  return new Set(records.map(sourceFamily)).size;
}
