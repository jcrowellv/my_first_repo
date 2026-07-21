import { useMemo, useRef, useState } from "react";
import { scaleLinear } from "d3-scale";
import { ArrowUpRight, History } from "lucide-react";
import type { Forecast, Milestone, QuantileDate } from "../schema";
import {
  canonical,
  evidenceById,
  falsifiersById,
  forecastsById,
  getForecastChain,
  milestonesById,
  tracksById,
} from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { DataCard, PageHeader, SampleBadge } from "../components/Primitives";

type RangeMode = "focus" | "full";

const SURFACE = "#080c12";
const GRID_MINOR = "#131b26";
const GRID_MAJOR = "#243040";
const TEXT_PRIMARY = "#e8edf4";
const TEXT_MUTED = "#8997aa";
const TODAY = 2026 + 202 / 365; // July 21, 2026

const chartWidth = 1180;
const plotStart = 268;
const plotEnd = 1148;
const laneGap = 21;
const groupPadTop = 13;
const groupPadBottom = 13;
const axisBandTop = 34;

const trackOrder = canonical.meta.tracks.map((track) => track.id);
const currentForecasts = canonical.forecasts.filter((forecast) => forecast.superseded_by === null);
const timelineStart = Math.floor(
  Math.min(...currentForecasts.map((forecast) => forecast.distribution.p10.value)),
);
const focusEnd = Math.ceil(
  Math.max(
    ...currentForecasts
      .filter((forecast) => !forecast.distribution.p90.lower_bound)
      .map((forecast) => forecast.distribution.p90.value),
  ) / 5,
) * 5;
const fullEnd = Math.ceil(
  Math.max(...canonical.forecasts.map((forecast) => forecast.distribution.p90.value)) / 5,
) * 5;
const defaultForecastId =
  currentForecasts.find(
    (forecast) => forecast.track === "claude" && forecast.milestone_id === "sar",
  )?.id ?? currentForecasts[0]?.id ?? canonical.forecasts[0].id;

interface Lane {
  forecast: Forecast;
  centerY: number;
}

interface LaneGroup {
  milestone: Milestone;
  index: number;
  top: number;
  height: number;
  lanes: Lane[];
}

function buildGroups(): { groups: LaneGroup[]; chartHeight: number } {
  let cursor = axisBandTop + 14;
  const groups = canonical.milestones.map((milestone, index) => {
    const records = canonical.forecasts
      .filter((forecast) => forecast.milestone_id === milestone.id)
      .sort((a, b) => {
        const trackDelta = trackOrder.indexOf(a.track) - trackOrder.indexOf(b.track);
        if (trackDelta !== 0) return trackDelta;
        return a.committed_on.localeCompare(b.committed_on);
      });
    const height = Math.max(groupPadTop + records.length * laneGap + groupPadBottom, 58);
    const lanes = records.map((forecast, laneIndex) => ({
      forecast,
      centerY: cursor + groupPadTop + laneIndex * laneGap + laneGap / 2,
    }));
    const group = { milestone, index, top: cursor, height, lanes };
    cursor += height;
    return group;
  });
  return { groups, chartHeight: cursor + 30 };
}

const { groups: laneGroups, chartHeight } = buildGroups();

const provenanceLetter: Record<string, string> = {
  registered: "R",
  derived: "D",
  published: "P",
  "model-output": "M",
  sample: "S",
};

function wrapName(name: string): string[] {
  if (name.length <= 18) return [name];
  const words = name.split(" ");
  const first: string[] = [];
  while (words.length && (first.join(" ") + " " + words[0]).trim().length <= 18) {
    first.push(words.shift() as string);
  }
  if (!first.length) first.push(words.shift() as string);
  return [first.join(" "), words.join(" ")].filter(Boolean);
}

function quantileText(quantile: QuantileDate) {
  if (quantile.lower_bound && !quantile.label.endsWith("+")) return `${quantile.label}+`;
  return quantile.label;
}

interface TooltipState {
  x: number;
  y: number;
  forecast: Forecast;
}

function ForecastDetail({ forecast }: { forecast: Forecast }) {
  const milestone = milestonesById.get(forecast.milestone_id);
  const track = tracksById.get(forecast.track);
  const movedBy = forecast.moved_by
    ? evidenceById.get(forecast.moved_by) ?? falsifiersById.get(forecast.moved_by)
    : undefined;
  const chain = getForecastChain(forecast.id);
  const entries = [
    ["p10", forecast.distribution.p10],
    ...(forecast.distribution.p25 ? [["p25", forecast.distribution.p25] as const] : []),
    ["p50", forecast.distribution.p50],
    ...(forecast.distribution.p75 ? [["p75", forecast.distribution.p75] as const] : []),
    ["p90", forecast.distribution.p90],
  ] as Array<[string, QuantileDate]>;

  return (
    <DataCard className="xl:sticky xl:top-24">
      <div className="border-b border-line p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track?.color }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            {track?.name}
          </span>
          {forecast.superseded_by ? (
            <span className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
              Superseded
            </span>
          ) : null}
          {forecast.sample ? <SampleBadge note={forecast.sample_note} /> : null}
        </div>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
          {milestone?.code} · {milestone?.name}
        </h2>
        <p className="mt-2 text-[13px] leading-6 text-muted">{milestone?.operational_definition}</p>
      </div>
      <div className={`grid border-b border-line ${entries.length === 5 ? "grid-cols-5" : "grid-cols-3"}`}>
        {entries.map(([label, quantile]) => (
          <div key={label} className="border-r border-line px-1 py-3.5 text-center last:border-r-0">
            <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
              {label}
              <sup className="ml-0.5 normal-case opacity-70">{provenanceLetter[quantile.provenance]}</sup>
            </span>
            <span className="mt-1 block text-xs font-semibold text-ink">{quantileText(quantile)}</span>
          </div>
        ))}
      </div>
      <dl className="space-y-3.5 p-5 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted">Committed</dt>
          <dd className="text-right text-ink">{formatIsoDate(forecast.committed_on)}</dd>
        </div>
        {forecast.scenario_marker ? (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted">Frozen scenario date</dt>
            <dd className="text-right text-amber">{forecast.scenario_marker.label}</dd>
          </div>
        ) : null}
        {movedBy ? (
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-muted">Moved by</dt>
            <dd className="text-right text-ink">
              {"title" in movedBy ? movedBy.title : movedBy.source_label}
            </dd>
          </div>
        ) : null}
        <div className="border-t border-line pt-3.5">
          <p className="text-xs leading-5 text-muted">{forecast.source_note}</p>
        </div>
      </dl>
      {chain.length > 1 ? (
        <div className="border-t border-line p-5">
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <History size={13} /> Revision history
          </p>
          <ol className="space-y-2">
            {chain.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-ink">{formatIsoDate(item.committed_on)}</span>
                <span className="font-mono text-muted">p50 {item.distribution.p50.label}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <div className="border-t border-line p-5">
        {forecast.source_url ? (
          <a
            href={forecast.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan hover:text-ink"
          >
            {forecast.source_label} <ArrowUpRight size={13} />
          </a>
        ) : (
          <span className="text-xs text-muted">{forecast.source_label}</span>
        )}
      </div>
    </DataCard>
  );
}

function SpineMark({
  forecast,
  y,
  x,
  selected,
  rangeMax,
  color,
}: {
  forecast: Forecast;
  y: number;
  x: (value: number) => number;
  selected: boolean;
  rangeMax: number;
  color: string;
}) {
  const q = forecast.distribution;
  const clamp = (v: number) => Math.min(v, rangeMax);
  const p10 = x(clamp(q.p10.value));
  const p90 = x(clamp(q.p90.value));
  const p50 = x(clamp(q.p50.value));
  const marker = forecast.scenario_marker;
  return (
    <>
      <line x1={p10} x2={p90} y1={y} y2={y} stroke={color} strokeWidth={1.5} opacity={0.75} />
      <line x1={p50} x2={p50} y1={y - 5} y2={y + 5} stroke={color} strokeWidth={2} />
      {q.p90.value > rangeMax || q.p90.lower_bound ? (
        <path d={`M ${p90} ${y - 3.5} L ${p90 + 7} ${y} L ${p90} ${y + 3.5} Z`} fill={color} />
      ) : null}
      {marker ? (
        <rect
          x={x(clamp(marker.value)) - 4.5}
          y={y - 4.5}
          width={9}
          height={9}
          fill={SURFACE}
          stroke={color}
          strokeWidth={2}
          transform={`rotate(45 ${x(clamp(marker.value))} ${y})`}
        />
      ) : null}
      {selected ? (
        <circle cx={p50} cy={y} r={8.5} fill="none" stroke={TEXT_PRIMARY} strokeWidth={1.25} />
      ) : null}
    </>
  );
}

function BandMark({
  forecast,
  y,
  x,
  selected,
  rangeMax,
  color,
}: {
  forecast: Forecast;
  y: number;
  x: (value: number) => number;
  selected: boolean;
  rangeMax: number;
  color: string;
}) {
  const q = forecast.distribution;
  const superseded = Boolean(forecast.superseded_by);
  const clamp = (v: number) => Math.min(v, rangeMax);
  const p10 = x(clamp(q.p10.value));
  const p90 = x(clamp(q.p90.value));
  const p50 = x(clamp(q.p50.value));
  const iqrStart = q.p25 ? x(clamp(q.p25.value)) : null;
  const iqrEnd = q.p75 ? x(clamp(q.p75.value)) : null;
  return (
    <g opacity={superseded ? 0.4 : 1}>
      <line
        x1={p10}
        x2={p90}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={superseded ? 1.5 : 2}
        strokeLinecap="round"
        strokeDasharray={superseded ? "2 5" : undefined}
      />
      {iqrStart !== null && iqrEnd !== null ? (
        <line
          x1={iqrStart}
          x2={iqrEnd}
          y1={y}
          y2={y}
          stroke={color}
          strokeWidth={superseded ? 4 : 7}
          strokeLinecap="round"
        />
      ) : null}
      {q.p90.value > rangeMax || q.p90.lower_bound ? (
        <path d={`M ${p90} ${y - 3.5} L ${p90 + 7} ${y} L ${p90} ${y + 3.5} Z`} fill={color} />
      ) : null}
      <circle
        cx={p50}
        cy={y}
        r={superseded ? 3 : 4.5}
        fill={color}
        stroke={SURFACE}
        strokeWidth={2}
      />
      {selected ? (
        <circle cx={p50} cy={y} r={8.5} fill="none" stroke={TEXT_PRIMARY} strokeWidth={1.25} />
      ) : null}
    </g>
  );
}

function DesktopTimeline({
  rangeMode,
  selectedId,
  setSelectedId,
}: {
  rangeMode: RangeMode;
  selectedId: string;
  setSelectedId: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const rangeMax = rangeMode === "focus" ? focusEnd : fullEnd;
  const xScale = useMemo(
    () => scaleLinear().domain([timelineStart, rangeMax]).range([plotStart, plotEnd]),
    [rangeMax],
  );

  const years = useMemo(() => {
    if (rangeMode === "focus") {
      const list = [];
      for (let year = timelineStart; year <= rangeMax; year += 1) list.push(year);
      return list;
    }
    return xScale.ticks(8);
  }, [rangeMode, rangeMax, xScale]);
  const isMajor = (year: number) => (rangeMode === "focus" ? year % 5 === 0 : true);

  const showTooltip = (event: React.MouseEvent, forecast: Forecast) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top, forecast });
  };

  const tooltipTrack = tooltip ? tracksById.get(tooltip.forecast.track) : null;
  const tooltipMilestone = tooltip ? milestonesById.get(tooltip.forecast.milestone_id) : null;
  const tooltipEntries = tooltip
    ? ([
        ["p10", tooltip.forecast.distribution.p10],
        ["p25", tooltip.forecast.distribution.p25],
        ["p50", tooltip.forecast.distribution.p50],
        ["p75", tooltip.forecast.distribution.p75],
        ["p90", tooltip.forecast.distribution.p90],
      ].filter(([, q]) => q !== undefined) as Array<[string, QuantileDate]>)
    : [];

  return (
    <div ref={containerRef} className="relative hidden overflow-x-auto rounded-xl border border-line bg-panel lg:block">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="min-w-[980px]"
        role="img"
        aria-label="Distribution timeline comparing four AI capability forecasts across eight milestones"
      >
        {laneGroups.map((group) =>
          group.index % 2 === 1 ? (
            <rect
              key={`band-${group.milestone.id}`}
              x={0}
              y={group.top}
              width={chartWidth}
              height={group.height}
              fill="#0b1119"
            />
          ) : null,
        )}
        {years.map((year) => (
          <g key={year}>
            <line
              x1={xScale(year)}
              x2={xScale(year)}
              y1={axisBandTop}
              y2={chartHeight - 22}
              stroke={isMajor(year) ? GRID_MAJOR : GRID_MINOR}
              strokeWidth={1}
            />
            {isMajor(year) ? (
              <>
                <text
                  x={xScale(year)}
                  y={axisBandTop - 10}
                  textAnchor="middle"
                  fill={TEXT_MUTED}
                  fontSize={11}
                  fontFamily="JetBrains Mono Variable"
                >
                  {year}
                </text>
                <text
                  x={xScale(year)}
                  y={chartHeight - 7}
                  textAnchor="middle"
                  fill={TEXT_MUTED}
                  fontSize={11}
                  fontFamily="JetBrains Mono Variable"
                >
                  {year}
                </text>
              </>
            ) : null}
          </g>
        ))}
        {TODAY <= rangeMax ? (
          <g>
            <line
              x1={xScale(TODAY)}
              x2={xScale(TODAY)}
              y1={axisBandTop}
              y2={chartHeight - 22}
              stroke={TEXT_PRIMARY}
              strokeWidth={1}
              opacity={0.35}
            />
            <text
              x={xScale(TODAY) + 5}
              y={axisBandTop + 11}
              fill={TEXT_PRIMARY}
              fontSize={9}
              fontFamily="JetBrains Mono Variable"
              opacity={0.6}
            >
              TODAY
            </text>
          </g>
        ) : null}
        {laneGroups.map((group) => {
          const groupCenter = group.top + group.height / 2;
          return (
            <g key={group.milestone.id}>
              <line
                x1={0}
                x2={chartWidth}
                y1={group.top}
                y2={group.top}
                stroke={GRID_MINOR}
                strokeWidth={1}
              />
              <text x={20} y={groupCenter - 3} fill={TEXT_PRIMARY} fontSize={13} fontWeight={650}>
                {group.milestone.code}
              </text>
              {wrapName(group.milestone.name).map((line, lineIndex) => (
                <text
                  key={line}
                  x={20}
                  y={groupCenter + 13 + lineIndex * 12}
                  fill={TEXT_MUTED}
                  fontSize={10.5}
                >
                  {line}
                </text>
              ))}
              {group.lanes.map(({ forecast, centerY }) => {
                const track = tracksById.get(forecast.track);
                if (!track) return null;
                const superseded = Boolean(forecast.superseded_by);
                const selected = selectedId === forecast.id;
                const label = superseded
                  ? `${track.short_name} ’${forecast.committed_on.slice(2, 4)}`
                  : track.short_name;
                return (
                  <g
                    key={forecast.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${track.name}, ${group.milestone.name}: median ${forecast.distribution.p50.label}, range ${forecast.distribution.p10.label} to ${forecast.distribution.p90.label}${superseded ? ", superseded" : ""}`}
                    onClick={() => setSelectedId(forecast.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setSelectedId(forecast.id);
                    }}
                    onMouseMove={(event) => showTooltip(event, forecast)}
                    onMouseLeave={() => setTooltip(null)}
                    className="cursor-pointer outline-none"
                  >
                    <rect
                      x={150}
                      y={centerY - laneGap / 2}
                      width={chartWidth - 170}
                      height={laneGap}
                      fill="transparent"
                    />
                    <circle
                      cx={plotStart - 106}
                      cy={centerY}
                      r={3}
                      fill={track.color}
                      opacity={superseded ? 0.45 : 1}
                    />
                    <text
                      x={plotStart - 96}
                      y={centerY + 3.5}
                      fill={selected ? TEXT_PRIMARY : TEXT_MUTED}
                      fontSize={10.5}
                      opacity={superseded ? 0.6 : 1}
                    >
                      {label}
                    </text>
                    {track.kind === "frozen-spine" ? (
                      <SpineMark
                        forecast={forecast}
                        y={centerY}
                        x={xScale}
                        selected={selected}
                        rangeMax={rangeMax}
                        color={track.color}
                      />
                    ) : (
                      <BandMark
                        forecast={forecast}
                        y={centerY}
                        x={xScale}
                        selected={selected}
                        rangeMax={rangeMax}
                        color={track.color}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      {tooltip && tooltipTrack && tooltipMilestone ? (
        <div
          className="pointer-events-none absolute z-10 w-56 rounded-lg border border-line bg-raised p-3 shadow-instrument"
          style={{
            left: Math.min(tooltip.x + 14, (containerRef.current?.clientWidth ?? 800) - 240),
            top: tooltip.y + 16,
          }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tooltipTrack.color }} />
            <span className="text-xs font-semibold text-ink">
              {tooltipTrack.short_name} · {tooltipMilestone.code}
            </span>
            {tooltip.forecast.superseded_by ? (
              <span className="font-mono text-[9px] uppercase text-muted">superseded</span>
            ) : null}
          </div>
          <div className="flex justify-between font-mono text-[10px] text-muted">
            {tooltipEntries.map(([label]) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="flex justify-between font-mono text-[10px] text-ink">
            {tooltipEntries.map(([label, quantile]) => (
              <span key={label}>{quantileText(quantile)}</span>
            ))}
          </div>
          <p className="mt-1.5 text-[10px] text-muted">
            Committed {formatIsoDate(tooltip.forecast.committed_on)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function MobileTimeline({
  selectedId,
  setSelectedId,
}: {
  selectedId: string;
  setSelectedId: (id: string) => void;
}) {
  const min = timelineStart;
  const max = focusEnd;
  const pct = (value: number) => Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const axisYears = [];
  for (let year = min; year <= max; year += 5) axisYears.push(year);
  return (
    <div className="space-y-4 lg:hidden">
      <div className="rounded-lg border border-line bg-panel px-[29px] py-2.5">
        <div className="relative h-4">
          {axisYears.map((year) => (
            <span
              key={year}
              className="absolute -translate-x-1/2 font-mono text-[9px] text-muted"
              style={{ left: `${pct(year)}%` }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
      {canonical.milestones.map((milestone) => (
        <DataCard key={milestone.id} className="p-4">
          <div className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {milestone.code}
            </span>
            <h2 className="mt-0.5 font-semibold text-ink">{milestone.name}</h2>
          </div>
          <div className="space-y-3.5">
            {canonical.meta.tracks.map((track) => {
              const current = canonical.forecasts.find(
                (forecast) =>
                  forecast.milestone_id === milestone.id &&
                  forecast.track === track.id &&
                  forecast.superseded_by === null,
              );
              if (!current) return null;
              const q = current.distribution;
              const selected = selectedId === current.id;
              return (
                <button
                  type="button"
                  key={track.id}
                  onClick={() => setSelectedId(current.id)}
                  className={`block w-full rounded-lg border p-3 text-left ${selected ? "border-cyan/60 bg-cyan/5" : "border-line bg-canvas/50"}`}
                >
                  <span className="mb-2.5 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-ink">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: track.color }} />
                      {track.short_name}
                    </span>
                    <span className="font-mono text-[10px] text-muted">p50 {q.p50.label}</span>
                  </span>
                  <span className="relative block h-4">
                    <span className="absolute top-[7px] h-px w-full bg-line" />
                    <span
                      className="absolute top-[7px] h-0.5 -translate-y-px opacity-40"
                      style={{
                        left: `${pct(TODAY)}%`,
                        width: 1,
                        height: 14,
                        top: 1,
                        backgroundColor: "#e8edf4",
                      }}
                    />
                    <span
                      className="absolute top-[6.5px] h-[3px] rounded-full"
                      style={{
                        left: `${pct(q.p10.value)}%`,
                        width: `${pct(Math.min(q.p90.value, max)) - pct(q.p10.value)}%`,
                        backgroundColor: track.color,
                        opacity: 0.55,
                      }}
                    />
                    {q.p25 && q.p75 ? (
                      <span
                        className="absolute top-[4.5px] h-[7px] rounded-full"
                        style={{
                          left: `${pct(q.p25.value)}%`,
                          width: `${pct(q.p75.value) - pct(q.p25.value)}%`,
                          backgroundColor: track.color,
                        }}
                      />
                    ) : null}
                    <span
                      className="absolute top-[2px] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-canvas"
                      style={{ left: `${pct(q.p50.value)}%`, backgroundColor: track.color }}
                    />
                  </span>
                  <span className="mt-2 flex justify-between font-mono text-[9px] text-muted">
                    <span>{q.p10.label}</span>
                    <span>{quantileText(q.p90)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </DataCard>
      ))}
    </div>
  );
}

function EncodingKey() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
      {canonical.meta.tracks.map((track) => (
        <span key={track.id} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track.color }} />
          {track.short_name}
        </span>
      ))}
      <span className="hidden h-4 w-px bg-line md:block" />
      <span className="inline-flex items-center gap-1.5">
        <svg width="34" height="10" aria-hidden="true">
          <line x1="1" x2="33" y1="5" y2="5" stroke={TEXT_MUTED} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" x2="24" y1="5" y2="5" stroke={TEXT_MUTED} strokeWidth="5" strokeLinecap="round" />
          <circle cx="17" cy="5" r="3" fill={TEXT_MUTED} stroke={SURFACE} strokeWidth="1.5" />
        </svg>
        p10 · p25–p75 · median
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="12" height="12" aria-hidden="true">
          <rect x="3" y="3" width="6" height="6" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5" transform="rotate(45 6 6)" />
        </svg>
        frozen scenario date
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="26" height="10" aria-hidden="true">
          <line x1="1" x2="25" y1="5" y2="5" stroke={TEXT_MUTED} strokeWidth="1.5" strokeDasharray="2 4" strokeLinecap="round" />
        </svg>
        superseded
      </span>
    </div>
  );
}

export function TimelineView() {
  const [rangeMode, setRangeMode] = useState<RangeMode>("focus");
  const [selectedId, setSelectedId] = useState(defaultForecastId);
  const selected = forecastsById.get(selectedId) ?? canonical.forecasts[0];
  const stats = canonical.meta.headline_stats ?? [];

  return (
    <div>
      <PageHeader viewId="timeline" />
      {stats.length ? (
        <section className="mb-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-panel p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {stat.label}
              </span>
              <strong className="mt-1.5 block text-2xl font-semibold tracking-[-0.02em] text-ink">
                {stat.value}
              </strong>
              {stat.detail ? (
                <p className="mt-2 text-xs leading-5 text-muted">{stat.detail}</p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}
      <div className="mb-5 flex flex-col gap-4 rounded-xl border border-line bg-panel px-4 py-3.5 md:flex-row md:items-center md:justify-between">
        <EncodingKey />
        <div className="flex shrink-0 items-center gap-2">
          {(["focus", "full"] as RangeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setRangeMode(mode)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ${rangeMode === mode ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-line text-muted hover:text-ink"}`}
            >
              {mode === "focus" ? `${timelineStart}–${focusEnd}` : "Full tails"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <DesktopTimeline rangeMode={rangeMode} selectedId={selectedId} setSelectedId={setSelectedId} />
          <MobileTimeline selectedId={selectedId} setSelectedId={setSelectedId} />
          <p className="mt-4 max-w-4xl text-xs leading-5 text-muted">
            {canonical.meta.distribution_warning}
          </p>
        </div>
        <div>
          <ForecastDetail forecast={selected} />
        </div>
      </div>
    </div>
  );
}
