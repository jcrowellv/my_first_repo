import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { canonical } from "../lib/data";

const shortLabels: Record<string, string> = {
  build: "Build & execute",
  experiment: "Choose experiments",
  verify: "Verify results",
  direct: "Set the agenda",
  successor: "Improve the researcher",
};
const statusLabels = {
  demonstrated: "Bounded result",
  partial: "Partial evidence",
  unestablished: "Open test",
};

export function ResearchOrbit() {
  const stages = canonical.research_review.stages;
  const positions = stages.map((_, i) => {
    const angle = (i * 2 * Math.PI) / stages.length;
    return [
      Math.round(280 + 180 * Math.sin(angle)),
      Math.round(255 - 180 * Math.cos(angle)),
    ];
  });
  return (
    <figure className="research-orbit">
      <div className="orbit-caption">
        <span>RESEARCH SYSTEM / 01</span>
        <span>
          EXPLORE THE LOOP <ArrowUpRight size={12} />
        </span>
      </div>
      <svg
        viewBox="0 0 560 500"
        role="group"
        aria-label="Five research stages. Select a stage to inspect its evidence."
      >
        <circle className="orbit-guide" cx="280" cy="255" r="120" />
        <path
          className="orbit-crosshair"
          d="M280 115v22m0 236v22M140 255h22m236 0h22"
        />
        {stages.map((stage, i) => {
          const [x, y] = positions[i];
          const [nextX, nextY] = positions[(i + 1) % positions.length];
          return (
            <path
              key={stage.id}
              className={`orbit-track orbit-${stages[(i + 1) % stages.length].status}`}
              d={`M${x} ${y} A180 180 0 0 1 ${nextX} ${nextY}`}
            />
          );
        })}
        <text
          className="orbit-center-label"
          x="280"
          y="234"
          textAnchor="middle"
        >
          CAN THE GAINS
        </text>
        <text
          className="orbit-center-question"
          x="280"
          y="274"
          textAnchor="middle"
        >
          compound?
        </text>
        <text className="orbit-center-note" x="280" y="302" textAnchor="middle">
          THE QUESTION STILL OPEN
        </text>
        {stages.map((stage, i) => {
          const [x, y] = positions[i];
          return (
            <Link
              key={stage.id}
              className={`orbit-node orbit-${stage.status}`}
              to={`/rsi?stage=${stage.id}#research-loop`}
              aria-label={`${stage.label}: ${statusLabels[stage.status]}. Inspect evidence.`}
            >
              <rect
                className="orbit-hit"
                x={x - 103}
                y={y - 23}
                width="206"
                height="87"
                rx="12"
              />
              <circle className="orbit-node-ring" cx={x} cy={y} r="15" />
              <text
                className="orbit-number"
                x={x}
                y={y + 4}
                textAnchor="middle"
              >
                0{i + 1}
              </text>
              <text
                className="orbit-node-title"
                x={x}
                y={y + 35}
                textAnchor="middle"
              >
                {shortLabels[stage.id] || stage.label}
              </text>
              <text
                className="orbit-node-status"
                x={x}
                y={y + 53}
                textAnchor="middle"
              >
                {statusLabels[stage.status]}
              </text>
            </Link>
          );
        })}
      </svg>
      <div className="orbit-mobile">
        <h2>
          Can the gains <em>compound?</em>
        </h2>
        {stages.map((stage, i) => (
          <Link
            className={`orbit-mobile-stage orbit-${stage.status}`}
            key={stage.id}
            to={`/rsi?stage=${stage.id}#research-loop`}
          >
            <span className="orbit-mobile-number">0{i + 1}</span>
            <div>
              <strong>{shortLabels[stage.id] || stage.label}</strong>
              <span>{statusLabels[stage.status]}</span>
            </div>
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </div>
      <figcaption>
        <span>
          <i /> Evidence at each link
        </span>
        <span>Components ≠ a closed loop</span>
      </figcaption>
    </figure>
  );
}
