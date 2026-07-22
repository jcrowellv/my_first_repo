import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, CircleHelp, History } from "lucide-react";
import { Link } from "react-router-dom";
import type { CapabilityProgress, Forecast } from "../schema";
import { canonical, evidenceById, milestonesById, tracksById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { PageHeader, StatusBadge } from "../components/Primitives";

function ProgressRing({ value, color }: { value: number; color: string }) {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-28 w-28 shrink-0" aria-label={`${value}% complete`}>
      <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="52" cy="52" r={radius} fill="none" stroke="#e4dfd4" strokeWidth="7" />
        <circle cx="52" cy="52" r={radius} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-2xl font-semibold tracking-[-0.05em] text-ink">{value}%</span>
    </div>
  );
}

function CapabilityCard({ item, index }: { item: CapabilityProgress; index: number }) {
  const colors = ["#2c875d", "#167f92", "#6758bd", "#bd4963"];
  const milestone = milestonesById.get(item.milestone_id);
  return (
    <details className="group rounded-2xl border border-line bg-panel shadow-instrument">
      <summary className="cursor-pointer list-none p-5">
        <div className="flex items-center gap-4 lg:flex-col lg:items-start">
          <ProgressRing value={item.score} color={colors[index % colors.length]} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{item.label}</span>
              <ChevronDown size={16} className="text-muted transition-transform group-open:rotate-180" />
            </div>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-ink">{milestone?.name}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{item.summary}</p>
          </div>
        </div>
      </summary>
      <div className="border-t border-line px-5 py-4">
        <p className="mb-4 text-xs leading-5 text-muted">{milestone?.operational_definition}</p>
        <div className="space-y-4">
          {item.criteria.map((criterion) => (
            <div key={criterion.id}>
              <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
                <span className="font-medium text-ink">{criterion.label}</span>
                <span className="font-mono text-muted">{Math.round(criterion.completion * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-raised"><div className="h-full rounded-full" style={{ width: `${criterion.completion * 100}%`, backgroundColor: colors[index % colors.length] }} /></div>
              <p className="mt-2 text-xs leading-5 text-muted">{criterion.rationale}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {criterion.evidence_refs.map((ref) => <span key={ref} className="rounded-full bg-raised px-2 py-1 text-[10px] text-muted">{evidenceById.get(ref)?.publisher}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

function yearLabel(value: number) {
  const year = Math.floor(value);
  const month = Math.max(1, Math.min(12, Math.round((value - year) * 12) + 1));
  return `${year}.${String(month).padStart(2, "0")}`;
}

function ForecastRow({ forecast, min, max }: { forecast: Forecast; min: number; max: number }) {
  const track = tracksById.get(forecast.track);
  const q = forecast.distribution;
  const position = (value: number) => ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  const outerLeft = position(q.p10.value);
  const outerWidth = Math.max(1, position(q.p90.value) - outerLeft);
  const innerLeft = q.p25 ? position(q.p25.value) : outerLeft;
  const innerWidth = q.p25 && q.p75 ? Math.max(1, position(q.p75.value) - innerLeft) : 0;
  const retired = canonical.forecasts.filter((item) => item.track === forecast.track && item.milestone_id === forecast.milestone_id && item.superseded_by !== null);
  return (
    <details className="group border-b border-line last:border-b-0">
      <summary className="cursor-pointer list-none px-5 py-5 md:px-6">
        <div className="grid items-center gap-4 md:grid-cols-[150px_1fr_72px]">
          <div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track?.color }} /><span className="text-sm font-medium text-ink">{track?.short_name}</span></div>
            <span className="mt-1 block text-[11px] text-muted">p10–p90</span>
          </div>
          <div className="relative h-10">
            <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
            <div className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full ${track?.kind === "frozen-spine" ? "opacity-70" : "opacity-25"}`} style={{ left: `${outerLeft}%`, width: `${outerWidth}%`, background: track?.kind === "frozen-spine" ? `repeating-linear-gradient(135deg, ${track.color}, ${track.color} 3px, transparent 3px, transparent 6px)` : track?.color }} />
            {innerWidth ? <div className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full" style={{ left: `${innerLeft}%`, width: `${innerWidth}%`, backgroundColor: track?.color }} /> : null}
            <span className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel ring-2 ring-current" style={{ left: `${position(q.p50.value)}%`, color: track?.color }} />
          </div>
          <div className="flex items-center justify-between gap-2 md:justify-end">
            <span className="font-mono text-sm font-semibold text-ink">{q.p50.label}</span>
            <ChevronDown size={15} className="text-muted transition-transform group-open:rotate-180" />
          </div>
        </div>
      </summary>
      <div className="grid gap-5 border-t border-line bg-raised/35 px-5 py-5 text-xs md:grid-cols-[1fr_auto] md:px-6">
        <div>
          <p className="leading-5 text-muted">{forecast.source_note}</p>
          <p className="mt-2 text-muted">{canonical.meta.distribution_warning}</p>
        </div>
        <dl className="grid grid-cols-3 gap-5 text-right">
          <div><dt className="text-muted">p10</dt><dd className="mt-1 font-mono text-ink">{q.p10.label}</dd></div>
          <div><dt className="text-muted">p50</dt><dd className="mt-1 font-mono text-ink">{q.p50.label}</dd></div>
          <div><dt className="text-muted">p90</dt><dd className="mt-1 font-mono text-ink">{q.p90.label}</dd></div>
        </dl>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted md:col-span-2">
          <span>{formatIsoDate(forecast.committed_on)}</span>
          {retired.length ? <span className="inline-flex items-center gap-1"><History size={12} /> {retired.length} earlier record</span> : null}
          {forecast.source_url ? <a className="inline-flex items-center gap-1 text-cyan" href={forecast.source_url} target="_blank" rel="noreferrer">{forecast.source_label}<ArrowUpRight size={12} /></a> : <span>{forecast.source_label}</span>}
        </div>
      </div>
    </details>
  );
}

function ForecastLens() {
  const current = canonical.forecasts.filter((forecast) => forecast.superseded_by === null);
  const milestoneIds = canonical.milestones.filter((milestone) => current.some((forecast) => forecast.milestone_id === milestone.id)).map((milestone) => milestone.id);
  const [selected, setSelected] = useState(milestoneIds.includes("ac") ? "ac" : milestoneIds[0]);
  const rows = current.filter((forecast) => forecast.milestone_id === selected);
  const min = Math.floor(Math.min(...rows.map((row) => row.distribution.p10.value)));
  const maxRaw = Math.max(...rows.map((row) => row.distribution.p90.value));
  const max = Math.max(min + 1, Math.ceil(maxRaw));
  const tickCount = Math.min(6, max - min + 1);
  const ticks = Array.from({ length: tickCount }, (_, index) => min + ((max - min) * index) / Math.max(1, tickCount - 1));
  return (
    <section aria-labelledby="forecast-lens-title" className="mt-20">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Four distributions</p><h2 id="forecast-lens-title" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">Compare one threshold at a time</h2></div>
        <p className="max-w-md text-sm leading-6 text-muted">The thin line is p10–p90, the heavier center is p25–p75 where available, and the marker is p50.</p>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {milestoneIds.map((id) => { const milestone = milestonesById.get(id); return <button key={id} type="button" onClick={() => setSelected(id)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${selected === id ? "border-ink bg-ink text-panel" : "border-line bg-panel text-muted hover:text-ink"}`}>{milestone?.code}</button>; })}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
        <div className="border-b border-line px-5 py-5 md:px-6">
          <h3 className="text-lg font-semibold text-ink">{milestonesById.get(selected)?.name}</h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{milestonesById.get(selected)?.operational_definition}</p>
          <div className="mt-5 hidden grid-cols-[150px_1fr_72px] items-center gap-4 md:grid">
            <span />
            <div className="flex justify-between font-mono text-[9px] text-muted">{ticks.map((tick) => <span key={tick}>{yearLabel(tick)}</span>)}</div>
            <span />
          </div>
        </div>
        {rows.map((forecast) => <ForecastRow key={forecast.id} forecast={forecast} min={min} max={max} />)}
      </div>
    </section>
  );
}

export function TimelineView() {
  const latestEvidence = useMemo(() => [...canonical.evidence].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3), []);
  const datedTest = canonical.falsifiers.find((item) => item.kind === "dated-tripwire" && item.status === "watching");
  const bindingDrivers = canonical.bottlenecks.filter((item) => item.status === "binding").slice(0, 2);
  return (
    <div>
      <PageHeader viewId="timeline" />
      <section aria-labelledby="progress-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><h2 id="progress-title" className="text-2xl font-semibold tracking-[-0.035em] text-ink">Capability progress</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Weighted completion of public-evidence criteria. Open a card to see every component and source.</p></div>
          <Link to="/methodology" className="inline-flex items-center gap-2 rounded-full bg-raised px-3 py-2 text-xs text-muted hover:text-ink"><CircleHelp size={14} /> {canonical.meta.progress_label}</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{canonical.capability_progress.map((item, index) => <CapabilityCard key={item.id} item={item} index={index} />)}</div>
      </section>
      <ForecastLens />
      <section className="mt-20 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-2xl border border-line bg-panel p-6 shadow-instrument md:p-7">
          <div className="mb-5 flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Latest evidence</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-ink">New signals in the ledger</h2></div><Link to="/evidence" className="inline-flex items-center gap-1 text-sm text-cyan">All evidence <ArrowRight size={14} /></Link></div>
          <div className="divide-y divide-line">{latestEvidence.map((item) => <article key={item.id} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-center gap-2 text-[11px] text-muted"><time>{formatIsoDate(item.date)}</time><span>·</span><span>{item.publisher}</span><StatusBadge value={item.diagnosticity} /></div><h3 className="mt-2 text-sm font-semibold text-ink">{item.source_label}</h3><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.implication}</p></article>)}</div>
        </div>
        <div className="space-y-5">
          {datedTest ? <Link to="/falsifiers" className="block rounded-2xl bg-ink p-6 text-panel shadow-instrument"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-canvas/60">Next dated test</p><h2 className="mt-3 text-xl font-semibold">{datedTest.title}</h2><p className="mt-2 text-sm leading-6 text-canvas/70">{datedTest.summary}</p><span className="mt-5 inline-flex items-center gap-1 text-sm">{datedTest.deadline ? formatIsoDate(datedTest.deadline) : datedTest.review_label}<ArrowRight size={14} /></span></Link> : null}
          <Link to="/bottlenecks" className="block rounded-2xl border border-line bg-panel p-6 shadow-instrument"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose">Binding drivers</p><div className="mt-4 space-y-3">{bindingDrivers.map((item) => <div key={item.id} className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-ink">{item.name}</span><StatusBadge value={item.status} /></div>)}</div><span className="mt-5 inline-flex items-center gap-1 text-sm text-cyan">Open driver map <ArrowRight size={14} /></span></Link>
        </div>
      </section>
    </div>
  );
}
