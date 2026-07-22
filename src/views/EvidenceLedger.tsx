import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Evidence } from "../schema";
import { canonical, milestonesById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { PageHeader, StatusBadge } from "../components/Primitives";

const favorsLabel: Record<Evidence["favors"], string> = {
  compression: "Favors faster timelines",
  widening: "Favors slower timelines",
  spine: "Matches the frozen scenario",
  neutral: "Framework or neutral",
};

function quarterOf(date: string) {
  const [year, month] = date.split("-").map(Number);
  return `Q${Math.ceil(month / 3)} ${year}`;
}

function EvidenceRow({ item }: { item: Evidence }) {
  return (
    <details className="group border-b border-line last:border-b-0">
      <summary className="cursor-pointer list-none px-5 py-4 transition-colors hover:bg-raised/40 md:px-6">
        <div className="grid items-baseline gap-x-5 gap-y-1.5 md:grid-cols-[96px_1fr_auto]">
          <time className="font-mono text-xs text-muted">{formatIsoDate(item.date)}</time>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-ink">
              {item.publisher}
              <span className="font-normal text-muted"> · {item.source_label}</span>
            </span>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.implication}</p>
          </div>
          <div className="flex items-center gap-2.5 md:justify-end">
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.13em] text-muted lg:inline">
              {item.source_type.replaceAll("-", " ")}
            </span>
            <StatusBadge value={item.diagnosticity} />
            <ChevronDown size={15} className="text-muted transition-transform group-open:rotate-180" />
          </div>
        </div>
      </summary>
      <div className="grid gap-6 border-t border-line bg-raised/35 px-5 py-5 md:grid-cols-[1.4fr_.6fr] md:px-6">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Observed</p>
            <p className="mt-2 text-sm leading-7 text-ink">{item.summary}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">Limit</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.limitation}</p>
          </div>
        </div>
        <div className="space-y-4 text-xs">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Reading</p>
            <p className="mt-1.5 text-ink">{favorsLabel[item.favors]}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Bears on</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.milestone_tags.map((tag) => (
                <span key={tag} className="rounded-full bg-panel px-2.5 py-1 font-mono text-[9px] text-muted ring-1 ring-line">
                  {milestonesById.get(tag)?.code}
                </span>
              ))}
            </div>
          </div>
          <a
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-cyan hover:text-ink"
          >
            Open source <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </details>
  );
}

export function EvidenceLedger() {
  const [milestone, setMilestone] = useState("all");
  const [diagnosticity, setDiagnosticity] = useState("all");
  const [sourceType, setSourceType] = useState("all");

  const evidence = useMemo(
    () =>
      [...canonical.evidence]
        .filter((item) => milestone === "all" || item.milestone_tags.includes(milestone))
        .filter((item) => diagnosticity === "all" || item.diagnosticity === diagnosticity)
        .filter((item) => sourceType === "all" || item.source_type === sourceType)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [milestone, diagnosticity, sourceType],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Evidence[]>();
    evidence.forEach((item) => {
      const key = quarterOf(item.date);
      map.set(key, [...(map.get(key) ?? []), item]);
    });
    return [...map.entries()];
  }, [evidence]);

  const selectClass = "rounded-full border border-line bg-panel px-4 py-2.5 text-xs text-ink";

  return (
    <div>
      <PageHeader viewId="evidence" />
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs text-muted">
          <SlidersHorizontal size={14} /> {evidence.length} of {canonical.evidence.length} records
        </span>
        <select aria-label="Filter by capability level" className={selectClass} value={milestone} onChange={(event) => setMilestone(event.target.value)}>
          <option value="all">All capability levels</option>
          {canonical.milestones.map((item) => (
            <option key={item.id} value={item.id}>{item.code} · {item.name}</option>
          ))}
        </select>
        <select aria-label="Filter by source type" className={selectClass} value={sourceType} onChange={(event) => setSourceType(event.target.value)}>
          <option value="all">All source types</option>
          {[...new Set(canonical.evidence.map((item) => item.source_type))].map((type) => (
            <option key={type} value={type}>{type.replaceAll("-", " ")}</option>
          ))}
        </select>
        <select aria-label="Filter by signal strength" className={selectClass} value={diagnosticity} onChange={(event) => setDiagnosticity(event.target.value)}>
          <option value="all">All signal strengths</option>
          <option value="high">High diagnosticity</option>
          <option value="medium">Medium diagnosticity</option>
          <option value="low">Low diagnosticity</option>
        </select>
      </div>
      {groups.length ? (
        <div className="space-y-8">
          {groups.map(([quarter, items]) => (
            <section key={quarter} aria-label={quarter}>
              <div className="mb-3 flex items-baseline gap-3">
                <h2 className="font-serif text-xl font-semibold text-ink">{quarter}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {items.length} {items.length === 1 ? "record" : "records"}
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
                {items.map((item) => <EvidenceRow key={item.id} item={item} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-line bg-panel p-10 text-center text-sm text-muted">
          No evidence matches these filters.
        </p>
      )}
    </div>
  );
}
