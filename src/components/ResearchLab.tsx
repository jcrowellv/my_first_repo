import { useState } from "react";
import { researchSpeedup } from "../lib/forecast-math";
import { Sources } from "./Editorial";
export function ResearchLab() {
  const [share, setShare] = useState(60);
  const [speed, setSpeed] = useState(10);
  const uplift = researchSpeedup(share / 100, speed);
  return (
    <section className="research-lab" id="research-lab">
      <div className="lab-copy">
        <span className="eyebrow">A SMALL THOUGHT EXPERIMENT</span>
        <h2>
          Faster code.
          <br />
          <em>How much faster science?</em>
        </h2>
        <p>
          Research also takes ideas, experiments, compute and judgment. Speed up
          one part and the others take a larger share of the day.
        </p>
        <p>
          Try changing how much work AI accelerates. The fraction left to humans
          matters more than it first appears.
        </p>
        <Sources
          ids={[
            "ev-parallelization-20260729",
            "ev-anthropic-internal-rd-20260904",
          ]}
        />
      </div>
      <div className="lab-instrument">
        <div className="lab-output">
          <span>OVERALL RESEARCH SPEED</span>
          <strong aria-live="polite">
            {uplift.toFixed(1)}
            <em>×</em>
          </strong>
          <p>from a {speed}× faster AI-assisted portion</p>
        </div>
        <label htmlFor="research-share">
          Share of work AI accelerates <b>{share}%</b>
        </label>
        <input
          id="research-share"
          type="range"
          min="0"
          max="95"
          step="5"
          value={share}
          onChange={(e) => setShare(Number(e.target.value))}
        />
        <label htmlFor="research-speed">
          Speed of that work <b>{speed}×</b>
        </label>
        <input
          id="research-speed"
          type="range"
          min="1"
          max="30"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <div
          className="work-bar"
          role="img"
          aria-label={`Remaining work: ${100 - share}% unchanged, ${Math.round(share / speed)}% accelerated`}
        >
          <span style={{ flex: 100 - share }} />
          <span style={{ flex: share / speed }} />
        </div>
        <div className="work-legend">
          <span>● Unchanged work</span>
          <span>● Accelerated work</span>
        </div>
        <p className="fine-print">
          Illustrative, fixed-work model: 1 ÷ [(1 − share) + share ÷ speed]. It
          leaves out new ideas, changing workflows, parallel work and compute
          limits. It does not change the registered forecasts.
        </p>
      </div>
    </section>
  );
}
