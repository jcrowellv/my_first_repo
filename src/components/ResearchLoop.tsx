import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Check, CircleDashed } from "lucide-react";
import { canonical } from "../lib/data";
import { Sources } from "./Editorial";

const labels = {
  demonstrated: "Demonstrated in bounded settings",
  partial: "Partial evidence",
  unestablished: "Not established by this review",
};
export function ResearchLoop({ compact = false }: { compact?: boolean }) {
  const { stages } = canonical.research_review;
  const [active, setActive] = useState(
    Math.max(
      0,
      stages.findIndex((stage) => stage.id === "experiment"),
    ),
  );
  const stage = stages[active];
  return (
    <section
      className={`loop-explorer ${compact ? "loop-compact" : ""}`}
      aria-label="Evidence across the research loop"
    >
      <div className="loop-heading">
        <div>
          <span className="eyebrow">THE RESEARCH LOOP</span>
          <h2>
            Five links.
            <br />
            <em>One consequential question.</em>
          </h2>
        </div>
        <p>
          Can better AI make the next AI better?
          <br />
          Select a link to see the evidence and the gap.
        </p>
      </div>
      <div className="loop-steps" aria-label="Research loop stages">
        {stages.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={active === i}
            aria-controls="loop-detail"
            onClick={() => setActive(i)}
          >
            <span className="loop-step-number">
              0{i + 1}{" "}
              {s.status === "demonstrated" ? (
                <Check size={16} />
              ) : (
                <CircleDashed size={16} />
              )}
            </span>
            <strong>{s.label}</strong>
            <span>{labels[s.status]}</span>
            {i < stages.length - 1 && (
              <ArrowRight className="loop-arrow" size={16} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
      <div className="loop-detail" id="loop-detail" aria-live="polite">
        <div>
          <span className="eyebrow">WHAT THE EVIDENCE SUPPORTS</span>
          <h3>{stage.signal}</h3>
          <Sources ids={stage.evidence_refs} />
        </div>
        <div>
          <span className="eyebrow">THE OPEN TEST</span>
          <p>{stage.missing}</p>
          <Link className="text-link" to="/falsifiers#f-successor-gains">
            What would close the loop <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <p className="fine-print">
        Stages are an editorial map, not a capability score. Success on one link
        does not establish the next, and all links must work together.
      </p>
    </section>
  );
}
