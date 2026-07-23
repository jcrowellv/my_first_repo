import { useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { canonical, evidenceById, milestonesById, tracksById } from "../lib/data";
import { displayQuantileLabel, formatDecimalYear, formatIsoDate } from "../lib/dates";
import { PageHeader, StatusBadge } from "../components/Primitives";
import { ForecastExplorer } from "./TimelineView";

const ladderForecasts = canonical.forecasts.filter((forecast) => forecast.superseded_by === null);
const MIN_YEAR = Math.floor(
  Math.min(...ladderForecasts.map((forecast) => forecast.distribution.p10.value)),
);
const MAX_YEAR = Math.ceil(
  Math.max(
    ...ladderForecasts
      .filter((forecast) => !forecast.distribution.p90.lower_bound)
      .map((forecast) => forecast.distribution.p90.value),
  ),
);
const LABEL_WIDTH = 150;
const PLOT_START = 170;
const PLOT_END = 1100;
const ROW_HEIGHT = 112;
const AXIS_HEIGHT = 46;

const ladderToday = (() => {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 1);
  const end = Date.UTC(now.getUTCFullYear() + 1, 0, 1);
  return now.getUTCFullYear() + (now.getTime() - start) / (end - start);
})();

function ForecastLadder() {
  const current = ladderForecasts;
  const milestones = canonical.milestones.filter((milestone) =>
    current.some((forecast) => forecast.milestone_id === milestone.id),
  );
  const x = (year: number) =>
    PLOT_START +
    ((Math.max(MIN_YEAR, Math.min(MAX_YEAR, year)) - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) *
      (PLOT_END - PLOT_START);
  const years = Array.from(
    new Set([
      MIN_YEAR,
      ...Array.from(
        { length: Math.max(0, Math.floor(MAX_YEAR / 5) - Math.ceil(MIN_YEAR / 5) + 1) },
        (_, index) => (Math.ceil(MIN_YEAR / 5) + index) * 5,
      ),
      MAX_YEAR,
    ]),
  ).sort((a, b) => a - b);
  const height = AXIS_HEIGHT + milestones.length * ROW_HEIGHT + 12;

  return (
    <section id="ladder" className="scroll-mt-28">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">All current records</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
            The capability ladder
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted">
          Each lane is a p10–p90 distribution; the thick center is p25–p75 and the dot is p50. Open-ended tails continue beyond the frame.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line px-5 py-4 md:px-6">
          {canonical.meta.tracks.map((track) => (
            <span key={track.id} className="inline-flex items-center gap-2 text-xs text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track.color }} />
              {track.short_name}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto p-2 md:p-4">
          <svg
            viewBox={`0 0 1130 ${height}`}
            className="min-w-[850px] w-full"
            role="img"
            aria-label="Current forecast distributions across all capability milestones"
          >
            {years.map((year) => (
              <g key={year}>
                <line x1={x(year)} x2={x(year)} y1={31} y2={height - 8} stroke="#e3ddd0" />
                <text
                  x={x(year)}
                  y={20}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono Variable"
                  fontSize={11}
                  fill="#66717d"
                >
                  {year}
                </text>
              </g>
            ))}
            {ladderToday >= MIN_YEAR && ladderToday <= MAX_YEAR ? (
              <g>
                <line x1={x(ladderToday)} x2={x(ladderToday)} y1={31} y2={height - 8} stroke="#132336" strokeWidth={1} opacity={0.4} />
                <text x={x(ladderToday) + 5} y={40} fontSize={9} fill="#132336" opacity={0.55} fontFamily="JetBrains Mono Variable">
                  TODAY
                </text>
              </g>
            ) : null}
            {milestones.map((milestone, milestoneIndex) => {
              const forecasts = canonical.meta.tracks
                .map((track) =>
                  current.find(
                    (forecast) =>
                      forecast.track === track.id && forecast.milestone_id === milestone.id,
                  ),
                )
                .filter((forecast): forecast is NonNullable<typeof forecast> => Boolean(forecast));
              const top = AXIS_HEIGHT + milestoneIndex * ROW_HEIGHT;
              return (
                <g key={milestone.id}>
                  <rect
                    x={0}
                    y={top}
                    width={1128}
                    height={ROW_HEIGHT - 4}
                    rx={12}
                    fill={milestoneIndex % 2 ? "#f7f4ed" : "#fffdf8"}
                  />
                  <text x={16} y={top + 31} fontSize={14} fontWeight={650} fill="#132336">
                    {milestone.code}
                  </text>
                  <text x={16} y={top + 49} fontSize={11} fill="#66717d">
                    {milestone.name}
                  </text>
                  {forecasts.map((forecast, forecastIndex) => {
                    const track = tracksById.get(forecast.track);
                    if (!track) return null;
                    const trackIndex = canonical.meta.tracks.findIndex((item) => item.id === forecast.track);
                    const y = top + 24 + (trackIndex >= 0 ? trackIndex : forecastIndex) * 19;
                    const q = forecast.distribution;
                    const clippedTail = q.p90.lower_bound || q.p90.value > MAX_YEAR;
                    return (
                      <g key={forecast.id}>
                        <title>
                          {`${track.name}: ${displayQuantileLabel(q.p10)}–${displayQuantileLabel(q.p90)}, median ${displayQuantileLabel(q.p50)}`}
                        </title>
                        <text
                          x={LABEL_WIDTH}
                          y={y + 3}
                          textAnchor="end"
                          fontFamily="JetBrains Mono Variable"
                          fontSize={8.5}
                          fill={track.color}
                        >
                          {track.short_name}
                        </text>
                        <line
                          x1={x(q.p10.value)}
                          x2={x(q.p90.value)}
                          y1={y}
                          y2={y}
                          stroke={track.color}
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          opacity={0.38}
                          strokeDasharray={track.kind === "frozen-spine" ? "2 5" : undefined}
                        />
                        {q.p25 && q.p75 ? (
                          <line
                            x1={x(q.p25.value)}
                            x2={x(q.p75.value)}
                            y1={y}
                            y2={y}
                            stroke={track.color}
                            strokeWidth={6}
                            strokeLinecap="round"
                          />
                        ) : null}
                        <circle cx={x(q.p50.value)} cy={y} r={4} fill={track.color} stroke="#fffdf8" strokeWidth={2} />
                        {clippedTail ? (
                          <path
                            d={`M ${PLOT_END - 1} ${y - 4} L ${PLOT_END + 7} ${y} L ${PLOT_END - 1} ${y + 4} Z`}
                            fill={track.color}
                          />
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{canonical.meta.distribution_warning}</p>
    </section>
  );
}

const gapAnchors = [
  { id: "ac", label: "AC → ASI", detail: "From coding automation to superintelligence" },
  { id: "sc", label: "SC → ASI", detail: "From superhuman coding to superintelligence" },
] as const;

function TakeoffGapSection() {
  const [anchor, setAnchor] = useState<"ac" | "sc">("ac");
  const current = canonical.forecasts.filter((forecast) => forecast.superseded_by === null);
  const findMedian = (trackId: string, milestoneId: string) =>
    current.find((forecast) => forecast.track === trackId && forecast.milestone_id === milestoneId)
      ?.distribution.p50;

  const rows = canonical.meta.tracks
    .map((track) => {
      const from = findMedian(track.id, anchor);
      const to = findMedian(track.id, "asi");
      return from && to ? { track, from, to, gap: to.value - from.value } : null;
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (!rows.length) return null;

  const min = Math.floor(Math.min(...rows.map((row) => row.from.value)));
  const max = Math.ceil(Math.max(...rows.map((row) => row.to.value)));
  const width = 1080;
  const plotStart = 168;
  const plotEnd = width - 76;
  const rowHeight = 64;
  const axis = 36;
  const height = axis + rows.length * rowHeight + 8;
  const x = (value: number) => plotStart + ((value - min) / (max - min)) * (plotEnd - plotStart);
  const years: number[] = [];
  for (let year = min; year <= max; year += 1) years.push(year);
  const fromMilestone = milestonesById.get(anchor);

  return (
    <section id="takeoff" className="scroll-mt-28">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Takeoff speed</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
            The live disagreement is the gap, not the start
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            The tracks nearly agree on when {fromMilestone?.name} arrives. They disagree by years on how long
            the run from there to superintelligence takes — which is where most of the decision-relevant
            uncertainty lives.
          </p>
        </div>
        <div className="flex gap-2">
          {gapAnchors.map((option) => (
            <button
              key={option.id}
              type="button"
              title={option.detail}
              onClick={() => setAnchor(option.id)}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                anchor === option.id
                  ? "border-ink bg-ink text-panel"
                  : "border-line bg-panel text-muted hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
        <div className="overflow-x-auto p-2 md:p-4">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="min-w-[760px] w-full"
            role="img"
            aria-label={`Median gap from ${fromMilestone?.name} to Artificial Superintelligence for each track`}
          >
            {years.map((year) => (
              <g key={year}>
                <line x1={x(year)} x2={x(year)} y1={axis - 10} y2={height - 8} stroke="#e3ddd0" />
                <text x={x(year)} y={axis - 18} textAnchor="middle" fontFamily="JetBrains Mono Variable" fontSize={11} fill="#66717d">
                  {year}
                </text>
              </g>
            ))}
            {rows.map((row, index) => {
              const centerY = axis + index * rowHeight + rowHeight / 2;
              const startX = x(row.from.value);
              const endX = x(row.to.value);
              const spine = row.track.kind === "frozen-spine";
              return (
                <g key={row.track.id}>
                  <title>
                    {`${row.track.name}: ${displayQuantileLabel(row.from)} → ${displayQuantileLabel(row.to)} (${row.gap.toFixed(1)} years)`}
                  </title>
                  {index > 0 ? (
                    <line x1={16} x2={width - 16} y1={centerY - rowHeight / 2} y2={centerY - rowHeight / 2} stroke="#ece7db" />
                  ) : null}
                  <text x={16} y={centerY - 2} fontSize={13} fontWeight={600} fill="#132336">
                    {row.track.short_name}
                  </text>
                  <text x={16} y={centerY + 14} fontSize={10} fill="#66717d">
                    {spine ? "frozen scenario medians" : "current medians"}
                  </text>
                  <line
                    x1={startX}
                    x2={endX}
                    y1={centerY}
                    y2={centerY}
                    stroke={row.track.color}
                    strokeWidth={7}
                    strokeLinecap="round"
                    opacity={spine ? 0.55 : 0.85}
                    strokeDasharray={spine ? "2 7" : undefined}
                  />
                  <circle cx={startX} cy={centerY} r={5} fill="#fffdf8" stroke={row.track.color} strokeWidth={2.5} />
                  <circle cx={endX} cy={centerY} r={5} fill={row.track.color} stroke="#fffdf8" strokeWidth={2.5} />
                  <text x={startX} y={centerY + 24} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono Variable" fill="#66717d">
                    {formatDecimalYear(row.from.value)}
                  </text>
                  <text x={endX} y={centerY + 24} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono Variable" fill="#66717d">
                    {formatDecimalYear(row.to.value)}
                  </text>
                  <text
                    x={width - 16}
                    y={centerY + 4}
                    textAnchor="end"
                    fontSize={14}
                    fontWeight={650}
                    fontFamily="JetBrains Mono Variable"
                    fill="#132336"
                  >
                    {row.gap.toFixed(1)} y
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="border-t border-line px-5 py-4 text-xs leading-5 text-muted md:px-6">
          Each bar connects two medians from the same track's marginal forecasts; it is not a sampled scenario
          path. Open circles mark {fromMilestone?.code} medians, filled circles mark ASI medians.{" "}
          <Link to="/glossary#g-takeoff-gap" className="text-cyan hover:text-ink">
            Takeoff gap, defined
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

const directionStyles: Record<string, string> = {
  shortens: "border-green/25 bg-green/10 text-green",
  lengthens: "border-rose/25 bg-rose/10 text-rose",
  mixed: "border-amber/25 bg-amber/10 text-amber",
  reference: "border-line bg-raised text-muted",
};

function DriverMatrix() {
  return (
    <section id="drivers" className="scroll-mt-28">
      <div className="mb-6 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Assumption map</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
          What pulls each timeline earlier or later
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Dates disagree because mechanisms disagree. Open a driver to inspect the evidence and each track's stated position.
        </p>
      </div>
      <div className="space-y-3">
        {canonical.forecast_drivers.map((driver) => (
          <details key={driver.id} className="group overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
            <summary className="cursor-pointer list-none p-5 md:p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge value={driver.importance} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{driver.phase.replaceAll("-", " ")}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-ink">{driver.name}</h3>
                </div>
                <p className="text-sm leading-6 text-muted">{driver.question}</p>
                <ChevronDown size={18} className="text-muted transition-transform group-open:rotate-180" />
              </div>
            </summary>
            <div className="border-t border-line bg-raised/30 p-5 md:p-6">
              <p className="max-w-4xl text-sm leading-7 text-ink">{driver.assessment}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {driver.track_positions.map((position) => {
                  const track = tracksById.get(position.track_id);
                  return (
                    <div key={position.track_id} className="rounded-xl border border-line bg-panel p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: track?.color }} />
                          {track?.short_name}
                        </span>
                        <span className={`rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${directionStyles[position.direction]}`}>
                          {position.direction}
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-ink">{position.label}</p>
                      <p className="mt-2 text-xs leading-5 text-muted">{position.note}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {driver.evidence_refs.map((ref) => {
                  const evidence = evidenceById.get(ref);
                  return evidence ? (
                    <a
                      key={ref}
                      href={evidence.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-cyan hover:text-ink"
                    >
                      {evidence.publisher} · {evidence.source_label}<ArrowUpRight size={11} />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function OutsideViews() {
  return (
    <section id="outside" className="scroll-mt-28">
      <div className="mb-6 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Definition-separated context</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">Outside views</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          These forecasts answer broader questions than the house tracks. They are shown as context, never converted into a fifth lane or silently mapped onto Automated Coder.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {canonical.outside_views.map((view) => (
          <article key={view.id} className="flex flex-col rounded-2xl border border-line bg-panel p-5 shadow-instrument md:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{view.population}</span>
              <span className="font-mono text-[9px] text-muted">{formatIsoDate(view.as_of)}</span>
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-ink">{view.short_name}</h3>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-cyan">{view.headline}</p>
            <p className="mt-5 text-xs leading-5 text-muted">{view.definition}</p>
            <details className="group mt-5 border-t border-line pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-ink">
                Why it is not directly comparable
                <ChevronDown size={14} className="text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-5 text-muted">{view.comparison_note}</p>
            </details>
            <a href={view.source_url} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-1 pt-5 text-xs font-medium text-cyan hover:text-ink">
              {view.source_label}<ArrowUpRight size={11} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrackTheses() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {canonical.meta.tracks.map((track) => (
        <article key={track.id} className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track.color }} />
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{track.thesis}</span>
          </div>
          <h2 className="mt-4 text-base font-semibold text-ink">{track.name}</h2>
          <p className="mt-2 text-xs leading-5 text-muted">{track.description}</p>
        </article>
      ))}
    </section>
  );
}

export function ForecastsView() {
  const firstMilestone = milestonesById.get("ac");

  return (
    <div>
      <PageHeader viewId="forecasts" />
      <TrackTheses />
      <div className="mt-16">
        <ForecastLadder />
      </div>
      <div className="mt-16">
        <TakeoffGapSection />
      </div>
      <div className="my-20 border-y border-line py-16">
        <ForecastExplorer />
      </div>
      <DriverMatrix />
      <div className="my-20">
        <OutsideViews />
      </div>
      <aside className="rounded-2xl bg-ink p-6 text-panel md:flex md:items-center md:justify-between md:gap-8 md:p-8">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">Audit boundary</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold">Definitions travel with dates.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-canvas/65">
            {firstMilestone?.operational_definition} Outside views remain separate when their resolution criteria differ.
          </p>
        </div>
        <Link to="/methodology" className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-panel px-5 py-3 text-sm font-semibold text-ink md:mt-0">
          Read methodology <ArrowRight size={14} />
        </Link>
      </aside>
    </div>
  );
}
