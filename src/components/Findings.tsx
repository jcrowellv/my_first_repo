import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { Sources } from "./Editorial";
const findings = [
  {
    label: "Learning the rules",
    title: "A different setup. A different frontier.",
    body: "On unfamiliar interactive puzzles, Astra scores substantially higher when its interface preserves reasoning state between actions. The surrounding software changes what the same model can do.",
    caveat:
      "ARC-AGI-3 measures action efficiency on its Semi-Private evaluation set. This is not the percentage of games completed, and it is not a test of learning that persists across a working life.",
    source: "ev-astra-arc3",
  },
  {
    label: "Doing new mathematics",
    title: "Two solutions where none were known.",
    body: "Under a fixed budget, Astra solved two of 68 selected open Erdős problems. Each solution was checked in a formal proof system. A small number, and a consequential kind of success.",
    caveat:
      "One attempt per problem, with a $300 and 72-hour cap. Four other tested models scored zero in this setup. This says more about a new research foothold than about autonomous science in general.",
    source: "ev-frontiermath-erdos-20260901",
  },
  {
    label: "Choosing the next idea",
    title: "Good answers need good questions.",
    body: "Research taste means knowing which idea is worth pursuing. In TASTE, Fable 5’s predictions of experts’ preferences agreed with them less often than other experts did.",
    caveat:
      "92 pairs of ideas; 60% model agreement versus 77% human agreement. The estimates are noisy, expert preference is an imperfect target, and Astra was not tested here.",
    source: "ev-taste-20260828",
  },
];
export function Findings() {
  const [active, setActive] = useState(0);
  const [effort, setEffort] = useState("max");
  const f = findings[active];
  return (
    <div className="findings">
      <div
        className="finding-tabs"
        aria-label="Explore three research findings"
      >
        {findings.map((x, i) => (
          <button
            key={x.label}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            {x.label}
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <div className="finding-body">
        <div className="finding-visual">
          {active === 0 ? (
            <>
              <div className="visual-heading">
                <span>ARC-AGI-3 / ASTRA</span>
                <label>
                  Effort
                  <select
                    aria-label="ARC reasoning effort"
                    value={effort}
                    onChange={(e) => setEffort(e.target.value)}
                  >
                    <option value="max">Max</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
              <div className="bar-comparison">
                {[
                  ["Standard interface", effort === "max" ? 62.7 : 54.8],
                  ["State-preserving adapter", effort === "max" ? 98.6 : 99.9],
                ].map(([l, v], i) => (
                  <div key={l}>
                    <span>{l}</span>
                    <div>
                      <i
                        style={{
                          width: `${v}%`,
                          background: i ? "var(--accent)" : "#49646f",
                        }}
                      />
                      <b>
                        {v}
                        <small>%</small>
                      </b>
                    </div>
                  </div>
                ))}
              </div>
              <p className="visual-caption">
                Same model. Matching reasoning effort.
                <br />
                Score: higher is better.
              </p>
            </>
          ) : active === 1 ? (
            <>
              <div className="visual-heading">
                <span>FRONTIERMATH / ERDŐS</span>
                <span>FIXED-BUDGET RUN</span>
              </div>
              <div
                className="problem-grid"
                role="img"
                aria-label="2 of 68 problems solved"
              >
                {Array.from({ length: 68 }, (_, i) => (
                  <i className={i < 2 ? "solved" : ""} key={i} />
                ))}
              </div>
              <div className="problem-score">
                <strong>
                  2 <span>/ 68</span>
                </strong>
                <span>
                  new solutions,
                  <br />
                  formally verified
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="visual-heading">
                <span>TASTE / RESEARCH JUDGMENT</span>
                <span>92 IDEA PAIRS</span>
              </div>
              <div className="bar-comparison">
                {[
                  ["Fable 5", 60],
                  ["Human experts", 77],
                ].map(([l, v], i) => (
                  <div key={l}>
                    <span>{l}</span>
                    <div>
                      <i
                        style={{
                          width: `${v}%`,
                          background: i ? "var(--amber)" : "#49646f",
                        }}
                      />
                      <b>
                        {v}
                        <small>%</small>
                      </b>
                    </div>
                  </div>
                ))}
              </div>
              <p className="visual-caption">
                Agreement with expert preferences.
                <br />
                Different test, different model.
              </p>
            </>
          )}
        </div>
        <div className="finding-story" aria-live="polite">
          <h3>{f.title}</h3>
          <p>{f.body}</p>
          <p className="finding-caveat">{f.caveat}</p>
          <Sources ids={[f.source]} />
        </div>
      </div>
      <Link to="/evidence" className="finding-more">
        Every result has a setup. Every claim has a source.
        <span>
          Read the ledger <ArrowUpRight size={16} />
        </span>
      </Link>
    </div>
  );
}
