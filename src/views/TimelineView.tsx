import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, CircleHelp, Clock3, ShieldCheck, Waves, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { CapabilityProgress, Forecast, QuantileDate } from "../schema";
import { canonical, evidenceById, milestonesById, tracksById } from "../lib/data";
import { displayQuantileLabel, formatIsoDate } from "../lib/dates";
import { StatusBadge } from "../components/Primitives";

const ACCENT = "#167f92";
const todayDate = new Date();
const startOfYear = new Date(todayDate.getFullYear(), 0, 1);
const startOfNextYear = new Date(todayDate.getFullYear() + 1, 0, 1);
const TODAY =
  todayDate.getFullYear() +
  (todayDate.getTime() - startOfYear.getTime()) /
    (startOfNextYear.getTime() - startOfYear.getTime());

/* ---------- State of play ---------- */

const briefingIcon = {
  capability: Clock3,
  control: ShieldCheck,
  diffusion: Waves,
};

function BriefingHero() {
  const briefing = canonical.meta.briefing;

  return (
    <section id="state" className="scroll-mt-28 overflow-hidden rounded-[28px] border border-line bg-panel shadow-instrument">
      <div className="grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="relative overflow-hidden p-6 md:p-9 lg:p-11">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[46px] border-cyan/[0.06]" aria-hidden="true" />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            {briefing.eyebrow} · {formatIsoDate(briefing.as_of)}
          </p>
          <h1 className="relative mt-5 max-w-3xl text-balance font-serif text-[42px] font-semibold leading-[1.02] tracking-[-0.025em] text-ink md:text-[60px]">
            {briefing.title}
          </h1>
          <p className="relative mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            {briefing.description}
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link to="/forecasts" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-panel transition-colors hover:bg-cyan">
              Explore four forecasts <ArrowRight size={15} />
            </Link>
            <Link to="/evidence" className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-cyan/40">
              Audit the evidence
            </Link>
          </div>
        </div>
        <aside className="border-t border-line bg-ink p-6 text-panel md:p-8 lg:border-l lg:border-t-0 lg:p-9">
          <p className="font-mono text-[9px] uppercase tracking-[0.19em] text-canvas/50">
            Frozen-scenario pace · two gradings
          </p>
          <div className="mt-4">
            <div className="flex items-end justify-between gap-4">
              <span className="font-serif text-5xl font-semibold tracking-[-0.05em] text-panel">{briefing.pace_value}</span>
              <span className="mb-1.5 rounded-full border border-canvas/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-canvas/55">
                preliminary
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-canvas/15" aria-hidden="true">
              <div
                className="h-full rounded-full bg-cyan"
                style={{ width: `${(briefing.pace_fraction ?? 0) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-canvas/65">
              <span className="font-semibold text-canvas/90">{briefing.pace_label}.</span> {briefing.pace_detail}
            </p>
            <a href={briefing.pace_source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-cyan hover:text-panel">
              {briefing.pace_source_label} <ArrowUpRight size={12} />
            </a>
          </div>
          {briefing.pace_secondary ? (
            <div className="mt-6 border-t border-canvas/15 pt-5">
              <span className="font-serif text-3xl font-semibold tracking-[-0.04em] text-panel">
                {briefing.pace_secondary.value}
              </span>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-canvas/15" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-violet"
                  style={{ width: `${briefing.pace_secondary.fraction * 100}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-canvas/65">
                <span className="font-semibold text-canvas/90">{briefing.pace_secondary.label}.</span>{" "}
                {briefing.pace_secondary.detail}
              </p>
              <a
                href={briefing.pace_secondary.source_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-cyan hover:text-panel"
              >
                {briefing.pace_secondary.source_label} <ArrowUpRight size={12} />
              </a>
            </div>
          ) : null}
        </aside>
      </div>
      <div className="grid border-t border-line md:grid-cols-3">
        {briefing.lenses.map((lens, index) => {
          const Icon = briefingIcon[lens.id];
          return (
            <Link
              key={lens.id}
              to={lens.path}
              className={`group p-5 transition-colors hover:bg-raised/45 md:p-6 ${
                index > 0 ? "border-t border-line md:border-l md:border-t-0" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan/10 text-cyan">
                  <Icon size={17} />
                </span>
                <ArrowRight size={15} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-cyan" />
              </div>
              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.17em] text-muted">{lens.label}</p>
              <p className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-ink">{lens.value}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{lens.detail}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HeadlineStats() {
  const stats = canonical.meta.headline_stats;
  if (!stats?.length) return null;
  return (
    <section aria-label="Headline statistics" className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-panel p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-muted">{stat.label}</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-ink">{stat.value}</p>
          {stat.detail ? <p className="mt-2 text-xs leading-5 text-muted">{stat.detail}</p> : null}
        </div>
      ))}
    </section>
  );
}

function ReadingPaths() {
  const paths = canonical.meta.reading_paths;
  if (!paths?.length) return null;
  return (
    <section id="paths" aria-labelledby="paths-title" className="scroll-mt-28">
      <div className="mb-6 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Three depths, one record</p>
        <h2 id="paths-title" className="mt-2 font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
          Choose how far in you want to go
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {paths.map((path, index) => (
          <article key={path.id} className="flex flex-col rounded-2xl border border-line bg-panel p-5 shadow-instrument md:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[10px] text-cyan">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{path.duration}</span>
            </div>
            <h3 className="mt-3 font-serif text-xl font-semibold text-ink">{path.label}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{path.description}</p>
            <ol className="mt-5 space-y-1 border-t border-line pt-4">
              {path.steps.map((step, stepIndex) => (
                <li key={step.path}>
                  <Link
                    to={step.path}
                    className="group flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-ink transition-colors hover:bg-raised"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-muted">{stepIndex + 1}</span>
                      {step.label}
                    </span>
                    <ArrowRight size={13} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-cyan" />
                  </Link>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- Capability progress ---------- */

function ProgressRing({ value }: { value: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-[104px] w-[104px] shrink-0">
      <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="52" cy="52" r={radius} fill="none" stroke="#e7e2d6" strokeWidth="7" />
        <circle
          cx="52"
          cy="52"
          r={radius}
          fill="none"
          stroke={ACCENT}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[23px] font-semibold tracking-[-0.05em] text-ink">
        {value}%
      </span>
    </div>
  );
}

function CapabilityDetail({ item, onClose }: { item: CapabilityProgress; onClose: () => void }) {
  const milestone = milestonesById.get(item.milestone_id);
  return (
    <div className="mt-4 rounded-2xl border border-line bg-panel shadow-instrument">
      <div className="flex items-start justify-between gap-6 border-b border-line p-5 md:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{item.label}</span>
            <StatusBadge value={item.confidence} />
            <span className="text-[11px] text-muted">as of {formatIsoDate(item.as_of)}</span>
          </div>
          <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-ink">{milestone?.name}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{milestone?.operational_definition}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close capability detail"
          className="rounded-full border border-line bg-canvas p-2 text-muted hover:text-ink"
        >
          <X size={15} />
        </button>
      </div>
      <div className="grid gap-x-10 gap-y-6 p-5 md:grid-cols-2 md:p-6">
        {item.criteria.map((criterion) => (
          <div key={criterion.id}>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-ink">{criterion.label}</span>
              <span className="shrink-0 font-mono text-xs text-muted">
                {Math.round(criterion.completion * 100)}% · w {Math.round(criterion.weight * 100)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-raised">
              <div
                className="h-full rounded-full"
                style={{ width: `${criterion.completion * 100}%`, backgroundColor: ACCENT }}
              />
            </div>
            <p className="mt-2.5 text-xs leading-5 text-muted">{criterion.rationale}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {criterion.evidence_refs.map((ref) => {
                const evidence = evidenceById.get(ref);
                return evidence ? (
                  <a
                    key={ref}
                    href={evidence.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[10px] text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
                  >
                    {evidence.publisher} · {evidence.source_label}
                  </a>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="border-t border-line px-5 py-4 text-xs leading-5 text-muted md:px-6">{item.summary}</p>
    </div>
  );
}

function CapabilitySection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = canonical.capability_progress.find((item) => item.id === selectedId) ?? null;
  return (
    <section id="capability" aria-labelledby="progress-title" className="scroll-mt-28">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="progress-title" className="font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
            Capability progress
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Weighted completion of public-evidence criteria. Select a level to see every component and source.
          </p>
        </div>
        <Link
          to="/methodology"
          className="inline-flex items-center gap-2 rounded-full bg-raised px-3.5 py-2 text-xs text-muted transition-colors hover:text-ink"
        >
          <CircleHelp size={14} /> {canonical.meta.progress_label}
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Capability levels">
        {canonical.capability_progress.map((item) => {
          const milestone = milestonesById.get(item.milestone_id);
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-expanded={isSelected}
              onClick={() => setSelectedId(isSelected ? null : item.id)}
              className={`rounded-2xl border p-5 text-left shadow-instrument transition-colors ${
                isSelected ? "border-cyan/60 bg-panel ring-1 ring-cyan/30" : "border-line bg-panel hover:border-cyan/35"
              }`}
            >
              <div className="flex items-center gap-4 xl:flex-col xl:items-start">
                <ProgressRing value={item.score} />
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{item.label}</span>
                  <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-ink">{milestone?.name}</h3>
                  <span className={`mt-2 inline-block text-xs ${isSelected ? "text-cyan" : "text-muted"}`}>
                    {isSelected ? "Hide detail" : "View criteria & sources"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {selected ? <CapabilityDetail item={selected} onClose={() => setSelectedId(null)} /> : null}
    </section>
  );
}

/* ---------- Forecast explorer ---------- */

const chartWidth = 1080;
const plotStart = 196;
const plotEnd = 986;
const rowHeight = 58;
const axisBand = 34;

interface ChartRow {
  forecast: Forecast;
  retired: boolean;
}

function quantileCell(label: string, quantile: QuantileDate | undefined) {
  if (!quantile) return null;
  const provenance: Record<string, string> = {
    registered: "R",
    derived: "D",
    published: "P",
    "model-output": "M",
    sample: "S",
  };
  return (
    <div key={label} className="text-center">
      <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
        {label}
        <sup className="ml-0.5 opacity-70">{provenance[quantile.provenance]}</sup>
      </span>
      <span className="mt-1 block text-sm font-semibold text-ink">{displayQuantileLabel(quantile)}</span>
    </div>
  );
}

function ForecastDetail({ forecast, onClose }: { forecast: Forecast; onClose: () => void }) {
  const track = tracksById.get(forecast.track);
  const retired = canonical.forecasts
    .filter(
      (item) =>
        item.track === forecast.track &&
        item.milestone_id === forecast.milestone_id &&
        item.superseded_by !== null,
    )
    .sort((a, b) => b.committed_on.localeCompare(a.committed_on));
  const q = forecast.distribution;
  return (
    <div className="border-t border-line bg-raised/35 px-5 py-5 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track?.color }} />
          <span className="text-sm font-semibold text-ink">{track?.name}</span>
          <span className="text-xs text-muted">committed {formatIsoDate(forecast.committed_on)}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close forecast detail"
          className="rounded-full border border-line bg-panel p-1.5 text-muted hover:text-ink"
        >
          <X size={13} />
        </button>
      </div>
      <div className="mt-4 grid max-w-md grid-cols-5 gap-2">
        {quantileCell("p10", q.p10)}
        {quantileCell("p25", q.p25)}
        {quantileCell("p50", q.p50)}
        {quantileCell("p75", q.p75)}
        {quantileCell("p90", q.p90)}
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-5 text-muted">{forecast.source_note}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        {forecast.source_url ? (
          <a
            className="inline-flex items-center gap-1 font-medium text-cyan hover:text-ink"
            href={forecast.source_url}
            target="_blank"
            rel="noreferrer"
          >
            {forecast.source_label}
            <ArrowUpRight size={12} />
          </a>
        ) : (
          <span className="text-muted">{forecast.source_label}</span>
        )}
        {retired.map((item) => (
          <span key={item.id} className="text-muted">
            Superseded {formatIsoDate(item.committed_on)}: p50 {displayQuantileLabel(item.distribution.p50)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ForecastChart({
  rows,
  selectedId,
  onSelect,
}: {
  rows: ChartRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const values = rows.flatMap(({ forecast }) => {
    const q = forecast.distribution;
    return [q.p10.value, q.p90.lower_bound ? q.p50.value + 2 : q.p90.value];
  });
  const min = Math.floor(Math.min(...values, TODAY));
  const max = Math.max(min + 2, Math.ceil(Math.max(...values)));
  const x = (value: number) =>
    plotStart + ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * (plotEnd - plotStart);
  const span = max - min;
  const step = span > 14 ? 4 : span > 8 ? 2 : 1;
  const years: number[] = [];
  for (let year = min; year <= max; year += 1) if ((year - min) % step === 0) years.push(year);
  const height = axisBand + rows.length * rowHeight + 14;

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${height}`}
      className="w-full"
      role="img"
      aria-label="Forecast distributions for the selected capability threshold"
    >
      {years.map((year) => (
        <g key={year}>
          <line
            x1={x(year)}
            x2={x(year)}
            y1={axisBand - 8}
            y2={height - 10}
            stroke="#e3ddd0"
            strokeWidth={1}
          />
          <text
            x={x(year)}
            y={axisBand - 16}
            textAnchor="middle"
            fontSize={11}
            fill="#66717d"
            fontFamily="JetBrains Mono Variable"
          >
            {year}
          </text>
        </g>
      ))}
      {TODAY >= min && TODAY <= max ? (
        <g>
          <line
            x1={x(TODAY)}
            x2={x(TODAY)}
            y1={axisBand - 8}
            y2={height - 10}
            stroke="#132336"
            strokeWidth={1}
            opacity={0.4}
          />
          <text
            x={x(TODAY) + 5}
            y={axisBand + 4}
            fontSize={9}
            fill="#132336"
            opacity={0.55}
            fontFamily="JetBrains Mono Variable"
          >
            TODAY
          </text>
        </g>
      ) : null}
      {rows.map(({ forecast, retired }, index) => {
        const track = tracksById.get(forecast.track);
        if (!track) return null;
        const centerY = axisBand + index * rowHeight + rowHeight / 2;
        const q = forecast.distribution;
        const p10 = x(q.p10.value);
        const p90 = x(q.p90.lower_bound ? max : q.p90.value);
        const p50 = x(q.p50.value);
        const spine = track.kind === "frozen-spine";
        const selected = selectedId === forecast.id;
        const opacity = retired ? 0.45 : 1;
        return (
          <g
            key={forecast.id}
            role="button"
            tabIndex={0}
            aria-label={`${track.name}${retired ? " (superseded)" : ""}: median ${displayQuantileLabel(q.p50)}, range ${displayQuantileLabel(q.p10)} to ${displayQuantileLabel(q.p90)}`}
            onClick={() => onSelect(forecast.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(forecast.id);
              }
            }}
            className="cursor-pointer outline-none"
          >
            {index > 0 ? (
              <line x1={16} x2={chartWidth - 16} y1={centerY - rowHeight / 2} y2={centerY - rowHeight / 2} stroke="#ece7db" strokeWidth={1} />
            ) : null}
            <rect
              x={4}
              y={centerY - rowHeight / 2 + 2}
              width={chartWidth - 8}
              height={rowHeight - 4}
              rx={10}
              fill={selected ? "#0e8ea8" : "#132336"}
              opacity={selected ? 0.06 : 0}
            />
            <circle cx={20} cy={centerY} r={4} fill={track.color} opacity={opacity} />
            <text x={32} y={centerY - 1} fontSize={13} fontWeight={600} fill="#132336" opacity={opacity}>
              {track.short_name}
            </text>
            <text x={32} y={centerY + 14} fontSize={10} fill="#66717d" opacity={opacity}>
              {retired ? `superseded ${forecast.committed_on.slice(0, 7)}` : spine ? "frozen scenario" : "p10–p90"}
            </text>
            <g opacity={opacity}>
              <line
                x1={p10}
                x2={p90}
                y1={centerY}
                y2={centerY}
                stroke={track.color}
                strokeWidth={retired ? 2 : 2.5}
                strokeLinecap="round"
                opacity={0.35}
                strokeDasharray={retired || spine ? "1 6" : undefined}
              />
              {q.p25 && q.p75 ? (
                <line
                  x1={x(q.p25.value)}
                  x2={x(q.p75.value)}
                  y1={centerY}
                  y2={centerY}
                  stroke={track.color}
                  strokeWidth={retired ? 5 : 8}
                  strokeLinecap="round"
                />
              ) : null}
              {q.p90.lower_bound ? (
                <path d={`M ${plotEnd + 6} ${centerY - 4} L ${plotEnd + 14} ${centerY} L ${plotEnd + 6} ${centerY + 4} Z`} fill={track.color} opacity={0.6} />
              ) : null}
              {spine && forecast.scenario_marker ? (
                <rect
                  x={x(forecast.scenario_marker.value) - 5}
                  y={centerY - 5}
                  width={10}
                  height={10}
                  fill="#fffdf8"
                  stroke={track.color}
                  strokeWidth={2}
                  transform={`rotate(45 ${x(forecast.scenario_marker.value)} ${centerY})`}
                />
              ) : null}
              <circle
                cx={p50}
                cy={centerY}
                r={retired ? 3.5 : 5}
                fill={track.color}
                stroke="#fffdf8"
                strokeWidth={2.5}
              />
              {selected ? (
                <circle cx={p50} cy={centerY} r={9} fill="none" stroke="#132336" strokeWidth={1.25} />
              ) : null}
            </g>
            <text
              x={chartWidth - 16}
              y={centerY + 4}
              textAnchor="end"
              fontSize={13}
              fontWeight={600}
              fill="#132336"
              fontFamily="JetBrains Mono Variable"
              opacity={opacity}
            >
              {displayQuantileLabel(q.p50)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ForecastExplorer() {
  const current = canonical.forecasts.filter((forecast) => forecast.superseded_by === null);
  const milestoneIds = canonical.milestones
    .filter((milestone) => current.some((forecast) => forecast.milestone_id === milestone.id))
    .map((milestone) => milestone.id);
  const [selected, setSelected] = useState(milestoneIds.includes("ac") ? "ac" : milestoneIds[0]);
  const [showRetired, setShowRetired] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const milestone = milestonesById.get(selected);

  const rows = useMemo(() => {
    const trackOrder = canonical.meta.tracks.map((track) => track.id);
    const list: ChartRow[] = [];
    trackOrder.forEach((trackId) => {
      const records = canonical.forecasts
        .filter((forecast) => forecast.track === trackId && forecast.milestone_id === selected)
        .sort((a, b) => a.committed_on.localeCompare(b.committed_on));
      records.forEach((forecast) => {
        const retired = forecast.superseded_by !== null;
        if (!retired || showRetired) list.push({ forecast, retired });
      });
    });
    return list;
  }, [selected, showRetired]);

  const detail = detailId ? rows.find(({ forecast }) => forecast.id === detailId)?.forecast ?? null : null;
  const hasRetired = canonical.forecasts.some(
    (forecast) => forecast.milestone_id === selected && forecast.superseded_by !== null,
  );

  return (
    <section id="explorer" aria-labelledby="forecast-lens-title" className="scroll-mt-28">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Four forecasts</p>
          <h2 id="forecast-lens-title" className="mt-2 font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
            When does each threshold arrive?
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted">
          The soft line spans p10–p90, the solid center is p25–p75 where the source supplies it, and the dot is the
          median. Select a row for quantiles and provenance.
        </p>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {milestoneIds.map((id) => {
          const item = milestonesById.get(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSelected(id);
                setDetailId(null);
              }}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                selected === id
                  ? "border-ink bg-ink text-panel"
                  : "border-line bg-panel text-muted hover:text-ink"
              }`}
            >
              {item?.code}
            </button>
          );
        })}
        {hasRetired ? (
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={showRetired}
              onChange={(event) => {
                setShowRetired(event.target.checked);
                setDetailId(null);
              }}
              className="h-3.5 w-3.5 accent-[#167f92]"
            />
            Show superseded records
          </label>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
        <div className="border-b border-line px-5 py-5 md:px-6">
          <h3 className="font-serif text-xl font-semibold text-ink">{milestone?.name}</h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{milestone?.operational_definition}</p>
        </div>
        <div className="overflow-x-auto px-2 pt-2">
          <div className="min-w-[760px]">
            <ForecastChart
              rows={rows}
              selectedId={detailId}
              onSelect={(id) => setDetailId((prior) => (prior === id ? null : id))}
            />
          </div>
        </div>
        {detail ? <ForecastDetail forecast={detail} onClose={() => setDetailId(null)} /> : null}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{canonical.meta.distribution_warning}</p>
    </section>
  );
}

/* ---------- Signals ---------- */

function SignalsSection() {
  const latestEvidence = useMemo(
    () => [...canonical.evidence].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [],
  );
  const datedTest = canonical.falsifiers.find(
    (item) => item.kind === "dated-tripwire" && item.status === "watching",
  );
  const bindingDrivers = canonical.bottlenecks.filter((item) => item.status === "binding").slice(0, 2);
  return (
    <section id="signals" className="scroll-mt-28 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
      <div className="rounded-2xl border border-line bg-panel p-6 shadow-instrument md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Latest evidence</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-ink">
              New signals in the ledger
            </h2>
          </div>
          <Link to="/evidence" className="inline-flex shrink-0 items-center gap-1 text-sm text-cyan">
            All evidence <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-line">
          {latestEvidence.map((item) => (
            <article key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <time>{formatIsoDate(item.date)}</time>
                <span>·</span>
                <span>{item.publisher}</span>
                <StatusBadge value={item.diagnosticity} />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-ink">{item.source_label}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.implication}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        {datedTest ? (
          <Link to="/falsifiers" className="block rounded-2xl bg-ink p-6 text-panel shadow-instrument">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-canvas/60">Next dated test</p>
            <h2 className="mt-3 font-serif text-xl font-semibold">{datedTest.title}</h2>
            <p className="mt-2 text-sm leading-6 text-canvas/70">{datedTest.summary}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm">
              {datedTest.deadline ? formatIsoDate(datedTest.deadline) : datedTest.review_label}
              <ArrowRight size={14} />
            </span>
          </Link>
        ) : null}
        <Link to="/bottlenecks" className="block rounded-2xl border border-line bg-panel p-6 shadow-instrument">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose">Binding drivers</p>
          <div className="mt-4 space-y-3">
            {bindingDrivers.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink">{item.name}</span>
                <StatusBadge value={item.status} />
              </div>
            ))}
          </div>
          <span className="mt-5 inline-flex items-center gap-1 text-sm text-cyan">
            Open driver map <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}

export function TimelineView() {
  return (
    <div>
      <BriefingHero />
      <HeadlineStats />
      <div className="mt-20">
        <CapabilitySection />
      </div>
      <section className="my-20 overflow-hidden rounded-2xl border border-line bg-ink text-panel shadow-instrument">
        <div className="grid items-center lg:grid-cols-[1fr_auto]">
          <div className="p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Forecast workbench</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-[-0.02em]">
              Compare the whole ladder before debating one date.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-canvas/65">
              Four committed distributions, every available quantile, explicit supersession history, and the assumptions that pull each timeline earlier or later.
            </p>
          </div>
          <Link to="/forecasts" className="m-6 inline-flex items-center justify-center gap-2 rounded-full bg-panel px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cyan hover:text-panel md:m-8">
            Open forecasts <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <SignalsSection />
      <div className="mt-20">
        <ReadingPaths />
      </div>
    </div>
  );
}
