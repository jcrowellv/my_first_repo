import { useMemo, useState } from "react";
import { scaleLinear } from "d3-scale";
import { ArrowUpRight, History, RotateCcw } from "lucide-react";
import type { Forecast, QuantileDate } from "../schema";
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
import { DataCard, PageHeader, SampleBadge, StatusBadge } from "../components/Primitives";

type RangeMode = "focus" | "full";

const chartWidth = 1180;
const labelWidth = 190;
const plotEnd = 1144;
const laneGap = 22;
const milestoneGap = 128;
const chartTop = 48;
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
    (forecast) => forecast.track === "codex" && forecast.milestone_id === "wsi",
  )?.id ?? currentForecasts[0]?.id ?? canonical.forecasts[0].id;

function quantileText(quantile: QuantileDate) {
  return `${quantile.label}${quantile.lower_bound ? "+" : ""}`;
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
    <DataCard className="sticky top-24">
      <div className="border-b border-line p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: track?.color }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-muted">
            {track?.name}
          </span>
          {forecast.sample ? <SampleBadge note={forecast.sample_note} /> : null}
        </div>
        <h2 className="text-xl font-semibold tracking-[-0.025em] text-ink">
          {milestone?.code} · {milestone?.name}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{forecast.source_note}</p>
      </div>
      <div className="grid grid-cols-5 border-b border-line">
        {entries.map(([label, quantile]) => (
          <div key={label} className="border-r border-line px-2 py-4 text-center last:border-r-0">
            <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              {label}
            </span>
            <span className="mt-1 block text-xs font-semibold text-ink">
              {quantileText(quantile)}
            </span>
          </div>
        ))}
      </div>
      <dl className="space-y-4 p-5 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted">Committed</dt>
          <dd className="text-right text-ink">{formatIsoDate(forecast.committed_on)}</dd>
        </div>
        {forecast.scenario_marker ? (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted">Frozen marker</dt>
            <dd className="text-right text-amber">{forecast.scenario_marker.label}</dd>
          </div>
        ) : null}
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted">History</dt>
          <dd className="text-right text-ink">
            {forecast.superseded_by ? "Superseded" : "Current"}
          </dd>
        </div>
        {movedBy ? (
          <div className="border-t border-line pt-4">
            <dt className="mb-2 text-muted">Moved by</dt>
            <dd className="text-ink">{"title" in movedBy ? movedBy.title : movedBy.source_label}</dd>
          </div>
        ) : null}
      </dl>
      {chain.length > 1 ? (
        <div className="border-t border-line p-5">
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <History size={13} /> Supersession chain
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan hover:text-ink"
          >
            {forecast.source_label} <ArrowUpRight size={14} />
          </a>
        ) : (
          <span className="text-xs text-muted">{forecast.source_label}</span>
        )}
      </div>
    </DataCard>
  );
}

function ForecastMark({
  forecast,
  y,
  x,
  selected,
  choose,
  rangeMax,
}: {
  forecast: Forecast;
  y: number;
  x: (value: number) => number;
  selected: boolean;
  choose: () => void;
  rangeMax: number;
}) {
  const track = tracksById.get(forecast.track);
  if (!track) return null;
  const q = forecast.distribution;
  const old = Boolean(forecast.superseded_by);
  const p10 = x(q.p10.value);
  const p90 = x(Math.min(q.p90.value, rangeMax));
  const p50 = x(Math.min(q.p50.value, rangeMax));
  const iqrStart = x(Math.min(q.p25?.value ?? q.p10.value, rangeMax));
  const iqrEnd = x(Math.min(q.p75?.value ?? q.p90.value, rangeMax));
  const tooltip = `${track.name} · ${milestonesById.get(forecast.milestone_id)?.name}\np10 ${q.p10.label} · p50 ${q.p50.label} · p90 ${q.p90.label}\nCommitted ${forecast.committed_on}${old ? " · superseded" : ""}`;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={tooltip.replaceAll("\n", ", ")}
      onClick={choose}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") choose();
      }}
      className="cursor-pointer outline-none"
      opacity={old ? 0.42 : 1}
    >
      <title>{tooltip}</title>
      <line
        x1={p10}
        x2={p90}
        y1={y}
        y2={y}
        stroke={track.color}
        strokeWidth={old ? 1.5 : 2}
        strokeDasharray={old ? "4 4" : undefined}
      />
      {track.kind === "frozen-spine" ? (
        <rect
          x={iqrStart}
          y={y - 4}
          width={Math.max(3, iqrEnd - iqrStart)}
          height={8}
          rx={2}
          fill="url(#spine-hatch)"
          stroke={track.color}
          strokeWidth={1}
        />
      ) : (
        <line
          x1={iqrStart}
          x2={iqrEnd}
          y1={y}
          y2={y}
          stroke={track.color}
          strokeWidth={old ? 3 : 8}
          strokeLinecap="round"
        />
      )}
      <circle
        cx={p50}
        cy={y}
        r={selected ? 6 : old ? 3 : 4.5}
        fill={track.color}
        stroke={selected ? "#ffffff" : "#080c12"}
        strokeWidth={selected ? 2 : 1.5}
      />
      {q.p90.value > rangeMax ? (
        <path
          d={`M ${p90 - 1} ${y - 4} L ${p90 + 6} ${y} L ${p90 - 1} ${y + 4} Z`}
          fill={track.color}
        />
      ) : null}
      {forecast.scenario_marker ? (
        <rect
          x={x(Math.min(forecast.scenario_marker.value, rangeMax)) - 4}
          y={y - 4}
          width={8}
          height={8}
          fill="#080c12"
          stroke={track.color}
          strokeWidth={2}
          transform={`rotate(45 ${x(Math.min(forecast.scenario_marker.value, rangeMax))} ${y})`}
        />
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
  const rangeMax = rangeMode === "focus" ? focusEnd : fullEnd;
  const xScale = useMemo(
    () => scaleLinear().domain([timelineStart, rangeMax]).range([labelWidth, plotEnd]),
    [rangeMax],
  );
  const ticks = xScale.ticks(rangeMode === "focus" ? 10 : 8);
  const chartHeight = chartTop + canonical.milestones.length * milestoneGap + 35;

  return (
    <div className="hidden overflow-x-auto rounded-xl border border-line bg-panel lg:block">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="min-w-[980px]"
        role="img"
        aria-label="Distribution timeline comparing four AI capability forecasts"
      >
        <defs>
          <pattern id="spine-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#17130d" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#f5ae54" strokeWidth="2" />
          </pattern>
        </defs>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={xScale(tick)} x2={xScale(tick)} y1={32} y2={chartHeight - 24} stroke="#253143" strokeWidth={1} />
            <text x={xScale(tick)} y={22} textAnchor="middle" fill="#8997aa" fontSize={10} fontFamily="JetBrains Mono Variable">
              {tick}
            </text>
          </g>
        ))}
        {canonical.milestones.map((milestone, milestoneIndex) => {
          const groupTop = chartTop + milestoneIndex * milestoneGap;
          return (
            <g key={milestone.id}>
              <line x1={16} x2={plotEnd} y1={groupTop - 13} y2={groupTop - 13} stroke="#1c2634" />
              <text x={18} y={groupTop + 4} fill="#e8edf4" fontSize={12} fontWeight={700}>
                {milestone.code}
              </text>
              <text x={18} y={groupTop + 20} fill="#8997aa" fontSize={10}>
                {milestone.name}
              </text>
              {canonical.meta.tracks.map((track, trackIndex) => {
                const y = groupTop + trackIndex * laneGap;
                const records = canonical.forecasts.filter(
                  (forecast) => forecast.milestone_id === milestone.id && forecast.track === track.id,
                );
                return (
                  <g key={track.id}>
                    <text x={120} y={y + 3.5} fill={track.color} fontSize={9} fontFamily="JetBrains Mono Variable">
                      {track.short_name}
                    </text>
                    {records.map((forecast) => (
                      <ForecastMark
                        key={forecast.id}
                        forecast={forecast}
                        y={y}
                        x={xScale}
                        selected={selectedId === forecast.id}
                        choose={() => setSelectedId(forecast.id)}
                        rangeMax={rangeMax}
                      />
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MobileTimeline({ selectedId, setSelectedId }: { selectedId: string; setSelectedId: (id: string) => void }) {
  const min = timelineStart;
  const max = focusEnd;
  const position = (value: number) => `${Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))}%`;
  return (
    <div className="space-y-4 lg:hidden">
      {canonical.milestones.map((milestone) => (
        <DataCard key={milestone.id} className="p-4">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">{milestone.code}</span>
              <h2 className="mt-1 font-semibold text-ink">{milestone.name}</h2>
            </div>
            <StatusBadge value={milestone.status} />
          </div>
          <div className="space-y-4">
            {canonical.meta.tracks.map((track) => {
              const current = canonical.forecasts.find(
                (forecast) =>
                  forecast.milestone_id === milestone.id &&
                  forecast.track === track.id &&
                  forecast.superseded_by === null,
              );
              if (!current) return null;
              const q = current.distribution;
              return (
                <button
                  type="button"
                  key={track.id}
                  onClick={() => setSelectedId(current.id)}
                  className={`block w-full rounded-lg border p-3 text-left ${selectedId === current.id ? "border-cyan/60 bg-cyan/5" : "border-line bg-canvas/50"}`}
                >
                  <span className="mb-3 flex items-center justify-between text-xs">
                    <span style={{ color: track.color }}>{track.short_name}</span>
                    <span className="font-mono text-[10px] text-muted">p50 {q.p50.label}</span>
                  </span>
                  <span className="relative block h-4">
                    <span className="absolute top-[7px] h-px bg-line" style={{ left: position(min), right: 0 }} />
                    <span className="absolute top-[6px] h-0.5" style={{ left: position(q.p10.value), right: `${100 - parseFloat(position(q.p90.value))}%`, backgroundColor: track.color }} />
                    <span className="absolute top-1 h-2 rounded-full opacity-60" style={{ left: position(q.p25?.value ?? q.p10.value), right: `${100 - parseFloat(position(q.p75?.value ?? q.p90.value))}%`, backgroundColor: track.color }} />
                    <span className="absolute top-0.5 h-3 w-1 -translate-x-1/2 rounded" style={{ left: position(q.p50.value), backgroundColor: track.color }} />
                  </span>
                  <span className="mt-2 flex justify-between font-mono text-[9px] text-muted"><span>{q.p10.label}</span><span>{q.p90.label}</span></span>
                </button>
              );
            })}
          </div>
        </DataCard>
      ))}
    </div>
  );
}

export function TimelineView() {
  const [rangeMode, setRangeMode] = useState<RangeMode>("focus");
  const [selectedId, setSelectedId] = useState(defaultForecastId);
  const selected = forecastsById.get(selectedId) ?? canonical.forecasts[0];
  const historicalCount = canonical.forecasts.filter((item) => item.superseded_by).length;

  return (
    <div>
      <PageHeader viewId="timeline" />
      <section className="mb-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        <div className="bg-panel p-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Forecast records</span>
          <strong className="mt-1 block text-2xl text-ink">{canonical.forecasts.length}</strong>
        </div>
        <div className="bg-panel p-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Visible history</span>
          <strong className="mt-1 block text-2xl text-ink">{historicalCount}</strong>
        </div>
        <div className="bg-panel p-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Internal lag</span>
          <strong className="mt-1 block text-2xl text-ink">{canonical.meta.internal_lag_months} months</strong>
        </div>
      </section>
      <div className="mb-5 flex flex-col gap-4 rounded-xl border border-line bg-panel p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {canonical.meta.tracks.map((track) => (
            <span key={track.id} className="inline-flex items-center gap-2 text-xs text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track.color }} />
              {track.short_name}
            </span>
          ))}
          <span className="inline-flex items-center gap-2 text-xs text-muted">
            <span className="h-2 w-2 rotate-45 border border-amber" /> Frozen scenario marker
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={13} className="text-muted" />
          {(["focus", "full"] as RangeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setRangeMode(mode)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] ${rangeMode === mode ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-line text-muted"}`}
            >
              {mode === "focus" ? `${timelineStart}-${focusEnd}` : "full tails"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <DesktopTimeline rangeMode={rangeMode} selectedId={selectedId} setSelectedId={setSelectedId} />
          <MobileTimeline selectedId={selectedId} setSelectedId={setSelectedId} />
          <p className="mt-4 max-w-4xl text-xs leading-5 text-muted">{canonical.meta.distribution_warning}</p>
        </div>
        <ForecastDetail forecast={selected} />
      </div>
    </div>
  );
}
