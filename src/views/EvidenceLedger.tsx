import { useMemo, useState } from "react";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { canonical, milestonesById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { DataCard, PageHeader, SampleBadge, StatusBadge } from "../components/Primitives";
import { Markdown } from "../components/Markdown";

const diagnosticityOrder = { high: 3, medium: 2, low: 1 } as const;

export function EvidenceLedger() {
  const [milestone, setMilestone] = useState("all");
  const [favors, setFavors] = useState("all");
  const [diagnosticity, setDiagnosticity] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const evidence = useMemo(
    () =>
      [...canonical.evidence]
        .filter((item) => milestone === "all" || item.milestone_tags.includes(milestone))
        .filter((item) => favors === "all" || item.favors === favors)
        .filter((item) => diagnosticity === "all" || item.diagnosticity === diagnosticity)
        .filter((item) => !from || item.date >= from)
        .filter((item) => !to || item.date <= to)
        .sort(
          (a, b) =>
            diagnosticityOrder[b.diagnosticity] - diagnosticityOrder[a.diagnosticity] ||
            b.date.localeCompare(a.date),
        ),
    [diagnosticity, favors, from, milestone, to],
  );

  const selectClass = "w-full rounded-md border border-line bg-canvas px-3 py-2 text-xs text-ink outline-none focus:border-cyan/60";

  return (
    <div>
      <PageHeader viewId="evidence" />
      <DataCard className="mb-6 p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          <SlidersHorizontal size={14} /> Ledger filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="space-y-1.5 text-[10px] uppercase tracking-[0.12em] text-muted">
            Milestone
            <select className={selectClass} value={milestone} onChange={(event) => setMilestone(event.target.value)}>
              <option value="all">All milestones</option>
              {canonical.milestones.map((item) => <option key={item.id} value={item.id}>{item.code}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 text-[10px] uppercase tracking-[0.12em] text-muted">
            Favors
            <select className={selectClass} value={favors} onChange={(event) => setFavors(event.target.value)}>
              <option value="all">All directions</option>
              <option value="compression">Compression</option>
              <option value="widening">Widening</option>
              <option value="spine">Spine</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>
          <label className="space-y-1.5 text-[10px] uppercase tracking-[0.12em] text-muted">
            Diagnosticity
            <select className={selectClass} value={diagnosticity} onChange={(event) => setDiagnosticity(event.target.value)}>
              <option value="all">All levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="space-y-1.5 text-[10px] uppercase tracking-[0.12em] text-muted">
            From
            <input type="date" className={selectClass} value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="space-y-1.5 text-[10px] uppercase tracking-[0.12em] text-muted">
            To
            <input type="date" className={selectClass} value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
        </div>
      </DataCard>
      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="hidden grid-cols-[120px_150px_1fr_150px_120px] gap-4 border-b border-line px-5 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted lg:grid">
          <span>Date</span><span>Source</span><span>Authored summary</span><span>Milestones</span><span>Signal</span>
        </div>
        {evidence.length ? evidence.map((item) => (
          <article
            key={item.id}
            className={`relative grid gap-4 border-b border-line p-5 last:border-b-0 lg:grid-cols-[120px_150px_1fr_150px_120px] ${item.diagnosticity === "low" ? "opacity-55" : ""}`}
          >
            <div>
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted lg:hidden">Date</span>
              <time className="text-xs text-ink">{formatIsoDate(item.date)}</time>
            </div>
            <div>
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted lg:hidden">Source</span>
              <a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 text-xs leading-5 text-cyan hover:text-ink">
                {item.source_label} <ArrowUpRight size={12} className="mt-1 shrink-0" />
              </a>
            </div>
            <div className="text-sm leading-6 text-ink">
              {item.sample ? <div className="mb-2"><SampleBadge note={item.sample_note} /></div> : null}
              <Markdown>{item.summary}</Markdown>
            </div>
            <div className="flex flex-wrap content-start gap-1.5">
              {item.milestone_tags.map((tag) => (
                <span key={tag} className="rounded border border-line bg-canvas px-2 py-1 font-mono text-[9px] text-muted">
                  {milestonesById.get(tag)?.code}
                </span>
              ))}
            </div>
            <div className="flex flex-col items-start gap-2">
              <StatusBadge value={item.diagnosticity} />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{item.favors}</span>
            </div>
          </article>
        )) : (
          <p className="p-8 text-center text-sm text-muted">No evidence matches the selected filters.</p>
        )}
      </div>
    </div>
  );
}
