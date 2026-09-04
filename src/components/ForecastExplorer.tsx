import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { canonical, tracksById, milestonesById } from "../lib/data";
import { displayQuantileLabel, formatIsoDate } from "../lib/dates";
import { probabilityFromPoints } from "../lib/forecast-math";
import { forecastSeries } from "../lib/forecast-series";
import { ProbabilityChart } from "./ProbabilityChart";
import { Disclosure, External } from "./Editorial";

const labels: Record<string, string> = {
  ac: "Automated coding",
  sar: "Superhuman AI research",
  "ted-ai": "Expert-level work, broadly",
  asi: "Superintelligence",
  "agent-2": "A capable research colleague",
  sc: "Superhuman coding",
  siar: "AI research far beyond humans",
  wsi: "Far beyond superintelligence",
};
const explanations: Record<string, string> = {
  ac: "A leading AI lab would rather remove its human software engineers than stop using its AI coding labor.",
  sar: "AI research ability exceeds the best humans. This is about choosing and carrying out research, not just writing code.",
  "ted-ai":
    "AI is at least as good as top human experts at virtually all cognitive tasks. This is a capability threshold, not a forecast of job replacement.",
  asi: "AI is far beyond the best human individuals across essentially all cognitive tasks. A much stronger claim than being useful at many jobs.",
  "agent-2":
    "Near-top-human research engineering, some research judgment, durable learning and roughly threefold lab research uplift.",
  sc: "AI performs the coding work of the best research engineers, much faster and at a scale humans cannot match.",
  siar: "AI research is as far beyond a superhuman researcher as that researcher is beyond a typical human researcher. This is a demanding and less sharply testable threshold.",
  wsi: "A loosely defined house term for intelligence far past ASI; it is not a deployment milestone. September’s rough center is 2034; no new uncertainty range was specified.",
};
export { labels as milestoneLabels };
export function ForecastExplorer({ compact = false }: { compact?: boolean }) {
  const [params, setParams] = useSearchParams();
  const initial = params.get("milestone");
  const milestone = initial && labels[initial] ? initial : "ac";
  const [selected, setSelected] = useState(["codex", "daniel", "claude"]);
  const [year, setYear] = useState(2030);
  const [end, setEnd] = useState(2040);
  const [scenario, setScenario] = useState(true);
  const [mode, setMode] = useState<"ranges" | "curves">("ranges");
  const records = canonical.forecasts
    .filter(
      (f) =>
        f.milestone_id === milestone &&
        !f.superseded_by &&
        f.track !== "ai-2027",
    )
    .sort(
      (a, b) =>
        ["codex", "daniel", "claude"].indexOf(a.track) -
        ["codex", "daniel", "claude"].indexOf(b.track),
    );
  const marker = canonical.forecasts.find(
    (f) => f.track === "ai-2027" && f.milestone_id === milestone,
  )?.scenario_marker;
  const left = 2026;
  const ticks = [
    2026,
    ...(end <= 2040
      ? [2030, 2035, 2040]
      : end === 2050
        ? [2030, 2040, 2050]
        : [2050, 2075, 2100]),
  ].filter((y) => y <= end);
  const position = (value: number) =>
    Math.min(100, Math.max(0, ((value - left) / (end - left)) * 100));
  const choose = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("milestone", id);
    setParams(next, { preventScrollReset: true });
  };
  return (
    <div className="forecast-explorer" id="explorer">
      <div className="segmented" aria-label="Choose a capability">
        {["ac", "sar", "ted-ai", "asi"].map((id) => (
          <button
            key={id}
            aria-pressed={milestone === id}
            onClick={() => choose(id)}
          >
            {labels[id]}
          </button>
        ))}
      </div>
      {!compact && (
        <label className="advanced-select">
          More milestones
          <select
            aria-label="All capability milestones"
            value={milestone}
            onChange={(e) => choose(e.target.value)}
          >
            {Object.entries(labels).map(([id, name]) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      )}
      {milestone === "wsi" && (
        <div className="comparison-note">
          <strong>
            Historical distributions below. September rough center: 2034.
          </strong>
          <p>
            No September 10–90% range was specified for WSI. The July curves
            remain available for reference and should not be read as the new
            forecast.
          </p>
        </div>
      )}
      <div className="chart-intro">
        <div>
          <span className="eyebrow">
            {milestone.toUpperCase()} / THE CAPABILITY
          </span>
          <h3>{labels[milestone]}</h3>
          <p>{explanations[milestone]}</p>
        </div>
        <div className="chart-key">
          <span>
            <i className="key-range" />
            {mode === "ranges"
              ? "10–90% range; arrows mark open ends"
              : "Chance of arrival by a given year"}
          </span>
          <span>
            <i className="key-median" />
            {mode === "ranges"
              ? "Central estimate (50%)"
              : "Dotted line: the selected year"}
          </span>
        </div>
      </div>
      <div className="forecast-controls">
        <div className="track-toggles">
          {["codex", "daniel", "claude"].map((id) => (
            <label
              key={id}
              style={
                { "--track": tracksById.get(id)!.color } as React.CSSProperties
              }
            >
              <input
                type="checkbox"
                checked={selected.includes(id)}
                onChange={() =>
                  setSelected(
                    selected.includes(id)
                      ? selected.filter((x) => x !== id)
                      : [...selected, id],
                  )
                }
              />
              <span className="track-dot" />
              {tracksById.get(id)!.short_name}
            </label>
          ))}
        </div>
        <label className="scale-control">
          View to{" "}
          <select
            aria-label="Chart end year"
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
          >
            {[2035, 2040, 2050, 2100].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="chart-view-switch" aria-label="Chart format">
        <button
          onClick={() => setMode("ranges")}
          aria-pressed={mode === "ranges"}
        >
          Arrival ranges
        </button>
        <button
          onClick={() => setMode("curves")}
          aria-pressed={mode === "curves"}
        >
          Probability curves
        </button>
      </div>
      {mode === "curves" && (
        <ProbabilityChart
          records={records.filter((f) => selected.includes(f.track))}
          year={Math.min(year, end)}
          end={end}
          ticks={ticks}
        />
      )}
      <div
        hidden={mode !== "ranges"}
        className="range-chart"
        aria-label={`Forecast uncertainty ranges for ${labels[milestone]}`}
      >
        <div className="chart-axis">
          <span />
          <div>
            {ticks.map((y) => (
              <span key={y} style={{ left: `${position(y)}%` }}>
                {y}
              </span>
            ))}
          </div>
        </div>
        {["codex", "daniel", "claude"]
          .filter((id) => selected.includes(id))
          .map((id) => {
            const f = records.find((x) => x.track === id),
              track = tracksById.get(id)!;
            return (
              <div
                className="range-row"
                key={id}
                style={{ "--track": track.color } as React.CSSProperties}
              >
                <div className="range-label">
                  <strong>{track.short_name}</strong>
                  <span>
                    {f ? formatIsoDate(f.committed_on) : "No estimate"}
                    {milestone === "wsi" ? " · historical" : ""}
                  </span>
                </div>
                {f ? (
                  <div className="range-plot">
                    {ticks.map((y) => (
                      <i
                        key={y}
                        className="plot-grid"
                        style={{ left: `${position(y)}%` }}
                      />
                    ))}
                    <div
                      className="range-fill"
                      style={{
                        left: `${position(f.distribution.p10.value)}%`,
                        width: `${position(f.distribution.p90.value) - position(f.distribution.p10.value)}%`,
                      }}
                    />
                    <span
                      className="range-cap"
                      style={{ left: `${position(f.distribution.p10.value)}%` }}
                    />
                    <span
                      className="range-cap"
                      style={{ left: `${position(f.distribution.p90.value)}%` }}
                    >
                      {f.distribution.p90.value > end ||
                      f.distribution.p90.lower_bound
                        ? "→"
                        : ""}
                    </span>
                    <span
                      className="range-median"
                      style={{ left: `${position(f.distribution.p50.value)}%` }}
                    >
                      <b>{displayQuantileLabel(f.distribution.p50)}</b>
                    </span>
                    {!compact && (
                      <span
                        className="year-cursor"
                        style={{ left: `${position(year)}%` }}
                      />
                    )}
                  </div>
                ) : (
                  <p className="no-estimate">
                    This forecaster has not specified this milestone.
                  </p>
                )}
              </div>
            );
          })}
        {!selected.length && (
          <p className="empty-state">Select a forecaster to show a range.</p>
        )}
        {scenario && marker && (
          <div className="range-row scenario-row">
            <div className="range-label">
              <strong>AI 2027 story</strong>
              <span>Frozen April 2025</span>
            </div>
            <div className="range-plot">
              <span
                className="scenario-marker"
                style={{ left: `${position(marker.value)}%` }}
              >
                ◇<b>{displayQuantileLabel(marker)}</b>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="chart-footnote">
        <span>
          Arrows continue beyond the chart. Dates are estimates of internal
          capability, not public release dates.
        </span>
        {marker && mode === "ranges" && (
          <label>
            <input
              type="checkbox"
              checked={scenario}
              onChange={(e) => setScenario(e.target.checked)}
            />{" "}
            Show original story
          </label>
        )}
      </div>
      {(!compact || mode === "curves") && (
        <div className="probability-tool">
          <div className="year-slider">
            <label htmlFor="forecast-year">
              Move through time.<strong>By the start of {year}</strong>
            </label>
            <input
              id="forecast-year"
              type="range"
              min="2026"
              max={end}
              step="1"
              value={Math.min(year, end)}
              onChange={(e) => setYear(Number(e.target.value))}
            />
            <div>
              <span>2026</span>
              <span>{end}</span>
            </div>
          </div>
          <div className="probability-readouts" aria-live="polite">
            {records
              .filter((f) => selected.includes(f.track))
              .map((f) => {
                const series = forecastSeries(f),
                  p = probabilityFromPoints(series.points, Math.min(year, end));
                return (
                  <div
                    key={f.id}
                    style={{ color: tracksById.get(f.track)!.color }}
                  >
                    <span>{tracksById.get(f.track)!.short_name}</span>
                    <strong>
                      {p.bound === "below"
                        ? "<"
                        : p.bound === "above"
                          ? ">"
                          : p.bound === "interpolated"
                            ? "≈"
                            : ""}
                      {Math.round(p.value * 100)}
                      <small>%</small>
                    </strong>
                    <small className="probability-source">
                      {series.source}
                    </small>
                  </div>
                );
              })}
          </div>
          <p className="fine-print">
            Daniel’s updated milestones use his published August probability
            curve, interpolated between samples. The Ledger’s ASI curve also
            includes the September cumulative judgments. Other readings
            interpolate recorded quantiles. Open-ended percentiles are not
            treated as exact dates; beyond the last known point, we show a
            bound. Bare-year estimates have approximate placement; use the
            source labels below for precision.
          </p>
        </div>
      )}
      {compact ? (
        <div className="chart-bottom">
          <p>
            Three dated forecasts. Different assumptions. The original story
            appears where it names this milestone.
          </p>
          <Link className="text-link" to={`/forecasts?milestone=${milestone}`}>
            Open the full explorer <ArrowUpRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="comparison-note">
            <strong>Read the differences before comparing the dates.</strong>
            <p>
              The Ledger includes interruptions and assumes useful private
              systems often precede public releases. Daniel’s forecast assumes
              development proceeds as fast as technically feasible; his SAR
              threshold emphasizes experiment selection. Claude is a July 2026
              alternative. These are related targets, not a controlled
              comparison.
            </p>
          </div>
          <Disclosure title="Exact dates, definitions & source records">
            <p className="muted">
              {milestonesById.get(milestone)?.operational_definition}
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Forecast</th>
                    <th>10% by</th>
                    <th>25% by</th>
                    <th>50% by</th>
                    <th>75% by</th>
                    <th>90% by</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((f) => (
                    <tr key={f.id}>
                      <th>
                        {tracksById.get(f.track)!.short_name}
                        <small>{formatIsoDate(f.committed_on)}</small>
                      </th>
                      {(["p10", "p25", "p50", "p75", "p90"] as const).map(
                        (p) => (
                          <td key={p}>
                            {f.distribution[p]
                              ? displayQuantileLabel(f.distribution[p]!)
                              : "—"}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {records.map((f) => (
              <div className="source-record" key={f.id}>
                <h4>{tracksById.get(f.track)!.name}</h4>
                <p>{f.source_note}</p>
                {f.source_url ? (
                  <External href={f.source_url}>{f.source_label}</External>
                ) : (
                  <Link className="source-link" to="/changelog">
                    {f.source_label} · revision record{" "}
                    <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </Disclosure>
          <Disclosure title="Earlier forecasts & the original AI 2027 distribution">
            <p className="muted">
              Previous estimates are retained. The original AI 2027 SAR, SIAR
              and ASI supplement distributions are conditional on Superhuman
              Coder arriving in March 2027; they are not unconditional arrival
              forecasts. Narrative plot points are separate again. Missing
              quartiles remain blank.
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Record</th>
                    <th>10%</th>
                    <th>25%</th>
                    <th>50%</th>
                    <th>75%</th>
                    <th>90%</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {canonical.forecasts
                    .filter((f) => f.milestone_id === milestone)
                    .sort((a, b) =>
                      b.committed_on.localeCompare(a.committed_on),
                    )
                    .map((f) => (
                      <tr key={f.id}>
                        <th>
                          {tracksById.get(f.track)!.short_name}
                          <small>{formatIsoDate(f.committed_on)}</small>
                        </th>
                        {(["p10", "p25", "p50", "p75", "p90"] as const).map(
                          (p) => (
                            <td key={p}>
                              {f.distribution[p]
                                ? displayQuantileLabel(f.distribution[p]!)
                                : "—"}
                            </td>
                          ),
                        )}
                        <td>
                          {f.superseded_by
                            ? "Superseded"
                            : f.track === "ai-2027"
                              ? "Original supplement"
                              : "Latest record"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {canonical.forecasts
              .filter(
                (f) =>
                  f.milestone_id === milestone &&
                  (f.superseded_by || f.track === "ai-2027"),
              )
              .map((f) => (
                <Disclosure
                  key={f.id}
                  title={`${tracksById.get(f.track)!.short_name} · ${formatIsoDate(f.committed_on)} · source conditions`}
                >
                  <p>{f.source_note}</p>
                  {f.source_url && (
                    <External href={f.source_url}>{f.source_label}</External>
                  )}
                  <p className="fine-print">
                    {Object.entries(f.distribution)
                      .filter(([, q]) => q)
                      .map(
                        ([key, q]) =>
                          `${key}: ${q!.provenance} (${q!.effective_on})`,
                      )
                      .join(" · ")}
                  </p>
                </Disclosure>
              ))}
          </Disclosure>
        </>
      )}
    </div>
  );
}
