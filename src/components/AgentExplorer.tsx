import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import {
  canonical,
  getProgressHistory,
  getProgressRange,
  progressById,
} from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { Disclosure, Sources } from "./Editorial";

const statusLabels = {
  "assessed-met": "Assessed met",
  partial: "Taking shape",
  "early-evidence": "Pieces emerging",
  precursors: "Early precursors",
};

export function AgentExplorer() {
  const assessment = canonical.agent_assessment;
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const agent =
    assessment.agents.find((a) => a.id === params.get("agent")) ??
    assessment.agents[1];
  const progress = progressById.get(agent.progress_id)!;
  const previous = getProgressHistory(progress.id)[1];
  const range = getProgressRange(progress);
  function choose(id: string) {
    const next = new URLSearchParams(params);
    next.set("agent", id);
    navigate(
      { search: next.toString(), hash: location.hash },
      { preventScrollReset: true },
    );
  }
  return (
    <div className="agent-explorer">
      <div
        className="agent-cards"
        role="group"
        aria-label="Explore the five AI 2027 agents"
      >
        {assessment.agents.map((a, index) => {
          const p = progressById.get(a.progress_id)!;
          return (
            <button
              className="agent-card"
              key={a.id}
              onClick={() => choose(a.id)}
              aria-pressed={a.id === agent.id}
              aria-controls="agent-detail"
            >
              <span className="agent-card-top">
                <span className="agent-number">0{index + 1}</span>
                {a.status === "assessed-met" ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  <ArrowUpRight size={15} aria-hidden="true" />
                )}
              </span>
              <span className="agent-card-name">{a.label}</span>
              <span className="agent-card-role">{a.role}</span>
              <span className="agent-card-score">
                {p.score}
                <small>%</small>
              </span>
              <span className="agent-meter" aria-hidden="true">
                <i style={{ width: `${p.score}%` }} />
              </span>
              <span className="agent-card-status">
                {statusLabels[a.status]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="agent-score-caption">
        Weighted profile completion · select an agent to inspect the judgment.
        These are not arrival probabilities.
      </p>
      <section
        className="agent-detail"
        id="agent-detail"
        aria-label={`${agent.label} assessment`}
      >
        <div className="agent-detail-lead">
          <div className="eyebrow">
            {agent.label} / {formatIsoDate(progress.as_of)}
          </div>
          <h3>{agent.role}</h3>
          <p className="agent-story-summary">{agent.story_summary}</p>
          <div className="agent-score-line">
            <strong>
              {progress.score}
              <small>%</small>
            </strong>
            <div>
              <span>
                {range.low}–{range.high}% judgment range
              </span>
              <small>
                {previous
                  ? `${progress.score === previous.score ? "Unchanged" : `+${progress.score - previous.score} points`} since ${formatIsoDate(previous.as_of)}`
                  : "New rubric · no earlier score"}
              </small>
            </div>
          </div>
          <p>{agent.changed}</p>
          <div className="agent-gap">
            <span className="eyebrow">
              {agent.status === "assessed-met"
                ? "WHAT THIS DOES NOT IMPLY"
                : "WHAT IS STILL MISSING"}
            </span>
            <p>{agent.missing}</p>
          </div>
          <Link
            className="text-link"
            to={
              agent.forecast_id
                ? `/forecasts?milestone=${agent.milestone_id}`
                : "/#story-timeline"
            }
          >
            {agent.forecast_id
              ? "Explore the arrival forecast"
              : "Place it on the story timeline"}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="agent-criteria">
          <div className="agent-criteria-heading">
            <h4>What makes up the score</h4>
            <span>Click for evidence</span>
          </div>
          {progress.criteria.map((c) => (
            <details className="agent-criterion" key={`${progress.id}-${c.id}`}>
              <summary>
                <span className="agent-criterion-name">
                  {c.label}
                  <small>{Math.round(c.weight * 100)}% of the rubric</small>
                </span>
                <span className="agent-criterion-score">
                  {Math.round(c.completion * 100)}%
                </span>
                <ChevronDown size={15} aria-hidden="true" />
                <span className="agent-criterion-meter" aria-hidden="true">
                  <i style={{ width: `${c.completion * 100}%` }} />
                </span>
              </summary>
              <div className="agent-criterion-body">
                <p>{c.rationale}</p>
                <p className="fine-print">
                  Judgment range: {Math.round(c.completion_range.low * 100)}–
                  {Math.round(c.completion_range.high * 100)}%. Rating:{" "}
                  {c.rating.replaceAll("-", " ")}.
                </p>
                <Sources ids={c.evidence_refs} />
                {c.counterevidence_refs.length > 0 && (
                  <>
                    <h5>Limits and counterevidence</h5>
                    <Sources ids={c.counterevidence_refs} />
                  </>
                )}
              </div>
            </details>
          ))}
          <div className="agent-next-test">
            <span className="eyebrow">THE NEXT DECISIVE TEST</span>
            <p>{agent.next_test}</p>
          </div>
        </div>
      </section>
      <div className="agent-detail-footnotes" key={agent.id}>
        <Disclosure title="Definition, confidence and scoring method">
          <p>
            <strong>In the story:</strong> {agent.story_date.label}.{" "}
            {agent.mapping_note}
          </p>
          <p>
            <strong>
              {progress.confidence === "high"
                ? "High"
                : progress.confidence === "medium"
                  ? "Medium"
                  : "Low"}{" "}
              confidence.
            </strong>{" "}
            {progress.confidence_note}
          </p>
          <p>
            {assessment.score_note} The displayed score is the rounded sum of
            each criterion’s completion × weight; the range uses the same
            weights on the low and high judgments. It is not a statistical
            confidence interval.
          </p>
          <Sources ids={[agent.story_date.source_ref]} />
          <Link className="text-link" to="/methodology#criteria">
            Full rubric and revision history <ArrowUpRight size={14} />
          </Link>
        </Disclosure>
        {previous && (
          <Disclosure
            title={`Previous assessment · ${previous.score}% on ${formatIsoDate(previous.as_of)}`}
          >
            <p>{previous.summary}</p>
            <p className="fine-print">
              The July weights are unchanged. Current evidence was rescored
              criterion by criterion; historical records remain intact.
            </p>
            <Link className="text-link" to={`/methodology#${previous.id}`}>
              Inspect the original criteria <ArrowUpRight size={14} />
            </Link>
          </Disclosure>
        )}
      </div>
    </div>
  );
}
