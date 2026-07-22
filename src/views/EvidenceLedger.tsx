import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { canonical, milestonesById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { PageHeader, StatusBadge } from "../components/Primitives";

const diagnosticityOrder = { high: 3, medium: 2, low: 1 } as const;

export function EvidenceLedger() {
  const [milestone, setMilestone] = useState("all");
  const [diagnosticity, setDiagnosticity] = useState("all");
  const [sourceType, setSourceType] = useState("all");
  const [theme, setTheme] = useState("all");
  const evidence = useMemo(() => [...canonical.evidence]
    .filter((item) => milestone === "all" || item.milestone_tags.includes(milestone))
    .filter((item) => diagnosticity === "all" || item.diagnosticity === diagnosticity)
    .filter((item) => sourceType === "all" || item.source_type === sourceType)
    .filter((item) => theme === "all" || item.themes?.includes(theme as NonNullable<typeof item.themes>[number]))
    .sort((a, b) => diagnosticityOrder[b.diagnosticity] - diagnosticityOrder[a.diagnosticity] || b.date.localeCompare(a.date)), [milestone, diagnosticity, sourceType, theme]);
  const themes = [...new Set(canonical.evidence.flatMap((item) => item.themes ?? []))];
  const selectClass = "rounded-full border border-line bg-panel px-4 py-2.5 text-xs text-ink";
  return (
    <div>
      <PageHeader viewId="evidence" />
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs text-muted"><SlidersHorizontal size={14} /> {evidence.length} records</span>
        <select aria-label="Filter by milestone" className={selectClass} value={milestone} onChange={(event) => setMilestone(event.target.value)}><option value="all">All capability levels</option>{canonical.milestones.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.name}</option>)}</select>
        <select aria-label="Filter by diagnosticity" className={selectClass} value={diagnosticity} onChange={(event) => setDiagnosticity(event.target.value)}><option value="all">All signal strengths</option><option value="high">High diagnosticity</option><option value="medium">Medium diagnosticity</option><option value="low">Low diagnosticity</option></select>
        <select aria-label="Filter by source type" className={selectClass} value={sourceType} onChange={(event) => setSourceType(event.target.value)}><option value="all">All source types</option>{[...new Set(canonical.evidence.map((item) => item.source_type))].map((type) => <option key={type} value={type}>{type.replaceAll("-", " ")}</option>)}</select>
        <select aria-label="Filter by evidence theme" className={selectClass} value={theme} onChange={(event) => setTheme(event.target.value)}><option value="all">All evidence themes</option>{themes.map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}</select>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {evidence.map((item) => (
          <details key={item.id} className={`group rounded-2xl border border-line bg-panel shadow-instrument ${item.diagnosticity === "low" ? "opacity-80" : ""}`}>
            <summary className="cursor-pointer list-none p-5 md:p-6">
              <div className="flex items-start justify-between gap-5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-[11px] text-muted"><time>{formatIsoDate(item.date)}</time><span>·</span><span>{item.publisher}</span><StatusBadge value={item.diagnosticity} /></div><h2 className="mt-3 text-lg font-semibold tracking-[-0.025em] text-ink">{item.source_label}</h2><p className="mt-2 text-sm leading-6 text-muted">{item.implication}</p></div><ChevronDown size={17} className="mt-1 shrink-0 text-muted transition-transform group-open:rotate-180" /></div>
              <div className="mt-4 flex flex-wrap gap-1.5">{item.milestone_tags.map((tag) => <span key={tag} className="rounded-full bg-raised px-2.5 py-1 font-mono text-[9px] text-muted">{milestonesById.get(tag)?.code}</span>)}{item.themes?.map((themeName) => <span key={themeName} className="rounded-full border border-cyan/20 bg-cyan/5 px-2.5 py-1 font-mono text-[9px] text-cyan">{themeName.replaceAll("-", " ")}</span>)}</div>
            </summary>
            <div className="space-y-5 border-t border-line bg-raised/30 p-5 md:p-6">
              <div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Observed</p><p className="mt-2 text-sm leading-7 text-ink">{item.summary}</p></div>
              <div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">Limit</p><p className="mt-2 text-sm leading-7 text-muted">{item.limitation}</p></div>
              <div className="flex items-center justify-between gap-4"><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{item.source_type.replaceAll("-", " ")} · {item.favors}</span><a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-cyan hover:text-ink">Open source <ArrowUpRight size={12} /></a></div>
            </div>
          </details>
        ))}
      </div>
      {!evidence.length ? <p className="rounded-2xl border border-line bg-panel p-10 text-center text-sm text-muted">No evidence matches these filters.</p> : null}
    </div>
  );
}
