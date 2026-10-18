import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { canonical, forecastsById } from "../lib/data";
import { displayQuantileLabel } from "../lib/dates";

export function StoryTimeline() {
  const [extended, setExtended] = useState(false);
  const [later, setLater] = useState(false);
  const start = 2026,
    end = extended ? 2050 : 2032;
  const ticks = extended ? [2026, 2030, 2040, 2050] : [2026, 2028, 2030, 2032];
  const position = (value: number) =>
    Math.max(0, Math.min(100, (100 * (value - start)) / (end - start)));
  const rows = canonical.agent_assessment.outlook.filter(
    (row) => later || !row.later_milestone,
  );
  return (
    <div className="story-timeline">
      <div className="story-timeline-toolbar">
        <div className="story-legend">
          <span>
            <i className="story-diamond" />
            Original story
          </span>
          <span>
            <i className="story-forecast-dot" />
            Our median
          </span>
          <span>
            <i className="story-forecast-line" />
            Central 80%
          </span>
        </div>
        <button
          className="timeline-toggle"
          aria-pressed={extended}
          onClick={() => setExtended(!extended)}
        >
          {extended ? "Zoom to 2032" : "Show the long tails"}
        </button>
      </div>
      <div className="story-axis" aria-hidden="true">
        <div />
        <div className="story-axis-track">
          {ticks.map((t) => (
            <span key={t} style={{ left: `${position(t)}%` }}>
              {t}
            </span>
          ))}
        </div>
        <div />
      </div>
      {rows.map((row) => {
        const f = forecastsById.get(row.forecast_id)!;
        const { p10, p50, p90 } = f.distribution;
        const clipped = p90.value > end;
        return (
          <div className="story-timeline-row" key={row.milestone_id}>
            <div className="story-row-label">
              <Link to={`/forecasts?milestone=${row.milestone_id}`}>
                {row.label}
                <ArrowUpRight size={12} />
              </Link>
              <small>Story: {row.scenario.label}</small>
            </div>
            <div
              className="story-track"
              role="img"
              aria-label={`${row.label}: story ${row.scenario.label}; October median ${displayQuantileLabel(p50)}, central 80 percent ${displayQuantileLabel(p10)} to ${displayQuantileLabel(p90)}${clipped ? "; late tail extends beyond this view" : ""}.`}
            >
              {ticks.map((t) => (
                <i
                  className="story-gridline"
                  key={t}
                  style={{ left: `${position(t)}%` }}
                />
              ))}
              <span
                className="story-range"
                style={{
                  left: `${position(p10.value)}%`,
                  width: `${position(p90.value) - position(p10.value)}%`,
                }}
              />
              <span
                className="story-median"
                style={{ left: `${position(p50.value)}%` }}
              />
              <span
                className="story-marker"
                style={{ left: `${position(row.scenario.value)}%` }}
              />
              {clipped && (
                <span className="story-tail" aria-hidden="true">
                  ›
                </span>
              )}
            </div>
            <div className="story-row-value">
              <strong>{displayQuantileLabel(p50)}</strong>
              <small>
                {displayQuantileLabel(p10)}–{displayQuantileLabel(p90)}
              </small>
            </div>
          </div>
        );
      })}
      <div className="story-timeline-bottom">
        <button
          className="text-link"
          aria-expanded={later}
          onClick={() => setLater(!later)}
        >
          {later ? "Hide later milestones" : "Show SIAR and ASI"}
          <span aria-hidden="true">{later ? "−" : "+"}</span>
        </button>
        <span>Arrow = range continues beyond this view</span>
      </div>
      {later && (
        <p className="story-context">
          SIAR and ASI extend the research ladder. Neither is an exact
          substitute for Agent-5, which has no separate house arrival
          distribution. The original SIAR definition is stronger than the
          Ledger’s retained shorthand.
        </p>
      )}
      <details className="story-date-notes">
        <summary>
          Dates, definitions and how this outlook was extrapolated
        </summary>
        <p>{canonical.agent_assessment.forecast_note}</p>
        <p>
          Better experiment selection and technical execution increase the
          weight on faster research progress. Training cycles, compute, reliable
          autonomy and uncertain lab-level gains preserve long late tails. No
          trend is fitted to the two rubric snapshots.
        </p>
        <p>
          Ranges target useful internal capability and include interruptions.
          Bare years are approximate anchors; story diamonds are narrative
          dates, not probability estimates. These are marginal forecasts, not a
          joint path or a prediction of takeoff duration.
        </p>
        {rows.map((row) => (
          <p key={row.milestone_id}>
            <strong>{row.label}:</strong> {row.context}
          </p>
        ))}
        <Link className="text-link" to="/forecasts">
          Compare all forecasts and historical records{" "}
          <ArrowUpRight size={14} />
        </Link>
      </details>
    </div>
  );
}
