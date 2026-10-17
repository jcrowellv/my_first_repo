import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { canonical, evidenceById } from "../lib/data";
import { Sources } from "./Editorial";

export function Findings() {
  const [active, setActive] = useState(0);
  const measurements = canonical.research_review.measurements;
  const m = measurements[active];
  const source = evidenceById.get(m.source_ref)!;
  return (
    <div className="findings">
      <div
        className="finding-tabs"
        aria-label="Explore October research findings"
      >
        {measurements.map((v, i) => (
          <button
            key={v.id}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            {v.label}
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <div className="finding-body">
        <div className="finding-visual october-visual">
          <div className="visual-heading">
            <span>{m.label}</span>
            <span>{source.date}</span>
          </div>
          <div className="measurement-value">
            {m.id === "training"
              ? m.value.toFixed(4)
              : m.value.toFixed(m.id === "taste" ? 2 : 0)}
            <span>{m.unit}</span>
          </div>
          <p className="measurement-label">{m.detail}</p>
          {m.low !== undefined && m.high !== undefined ? (
            <div
              className="interval-chart"
              role="img"
              aria-label={`95% confidence interval ${m.low} to ${m.high} times the expert baseline of ${m.reference}`}
            >
              <div className="interval-axis">
                <i
                  className="reference-tick"
                  style={{ left: `${(m.reference / 5) * 100}%` }}
                />
                <i
                  className="interval-line"
                  style={{
                    left: `${(m.low / 5) * 100}%`,
                    width: `${((m.high - m.low) / 5) * 100}%`,
                  }}
                />
                <i
                  className="interval-point"
                  style={{ left: `${(m.value / 5) * 100}%` }}
                />
              </div>
              <div className="interval-labels">
                <span>0×</span>
                <span>1× expert</span>
                <span>5×</span>
              </div>
              <p>
                {m.low}–{m.high}× · uncertainty remains substantial
              </p>
            </div>
          ) : m.id === "physics" ? (
            <div
              className="problem-grid"
              role="img"
              aria-label={`${m.value} of ${m.reference} final answers correct`}
            >
              {Array.from({ length: m.reference }, (_, i) => (
                <i key={i} className={i < m.value ? "solved" : ""} />
              ))}
            </div>
          ) : (
            <div className="training-reference">
              <span>{m.reference_label}</span>
              <strong>{m.reference.toFixed(4)} BPB</strong>
              <p>Same metric; different research conditions.</p>
            </div>
          )}
          <p className="visual-caption">
            Metrics describe different tasks. They are not a shared scale of
            intelligence.
          </p>
        </div>
        <div className="finding-story" aria-live="polite">
          <h3>{m.title}</h3>
          <p>{source.summary}</p>
          <p className="finding-caveat">{source.limitation}</p>
          <Sources ids={[m.source_ref]} />
        </div>
      </div>
      <Link to="/rsi" className="finding-more">
        Follow the claim all the way back.
        <span>
          Read the October dossier <ArrowUpRight size={16} />
        </span>
      </Link>
    </div>
  );
}
