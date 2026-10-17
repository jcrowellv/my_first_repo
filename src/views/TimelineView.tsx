import { Link } from "react-router";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { SignalField } from "../components/SignalField";
import { SectionTitle } from "../components/Editorial";
import { Findings } from "../components/Findings";
import { ForecastExplorer } from "../components/ForecastExplorer";
import { ResearchLab } from "../components/ResearchLab";
import { ResearchLoop } from "../components/ResearchLoop";
import { ForecastReviewNote } from "../components/ForecastReviewNote";
import { canonical, evidenceById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";

export function TimelineView() {
  const review = canonical.research_review;
  const latest = [
    "ev-quantum-circuits-report-20261016",
    "ev-scion-20261013",
    "ev-metr-acceleration-20261014",
  ].map((id) => evidenceById.get(id)!);
  return (
    <div className="home">
      <section className="hero rsi-hero">
        <SignalField />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            THE OCTOBER REVIEW / RECURSIVE SELF-IMPROVEMENT
          </div>
          <h1>
            When AI
            <br />
            <em>builds AI.</em>
          </h1>
          <p className="hero-deck">
            The research is accelerating.
            <br />
            How much of the loop is really closed?
          </p>
          <div className="hero-actions">
            <Link className="button button-light" to="/rsi">
              Open the research dossier <ArrowUpRight size={16} />
            </Link>
            <button
              className="text-link"
              onClick={() =>
                document.getElementById("start")?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              See what changed <ArrowDown size={17} />
            </button>
          </div>
        </div>
        <div className="hero-bottom container">
          <span>REVIEWED {formatIsoDate(review.as_of).toUpperCase()}</span>
          <span>OBSERVATION → INTERPRETATION → OPEN QUESTION</span>
        </div>
      </section>
      <section className="brief-strip container" id="start">
        <div>
          <span className="eyebrow">01 / THE CHANGE THAT MATTERS</span>
          <h2>
            Beyond writing code.
            <br />
            <em>Into choosing experiments.</em>
          </h2>
        </div>
        <p>{review.summary}</p>
        <Link
          to="/rsi#forecast-impact"
          className="circle-link"
          aria-label="Read what changes in the October assessment"
        >
          <ArrowRight />
        </Link>
      </section>
      <section className="section container">
        <SectionTitle
          label="THREE MEASUREMENTS / THREE DIFFERENT CLAIMS"
          title={
            <>
              Look past
              <br />
              <em>the headline.</em>
            </>
          }
        />
        <Findings />
      </section>
      <section className="loop-section">
        <div className="container section">
          <ResearchLoop compact />
        </div>
      </section>
      <section className="section container" id="signals">
        <SectionTitle
          label="02 / THE SOURCE TRAIL"
          title={
            <>
              A stronger claim
              <br />
              <em>needs a stronger record.</em>
            </>
          }
        >
          <Link className="text-link" to="/rsi#packet-audit">
            All 26 packet pages, audited <ArrowUpRight size={16} />
          </Link>
        </SectionTitle>
        <div className="dispatches">
          {latest.map((e, i) => (
            <Link className="dispatch" to={`/evidence#${e.id}`} key={e.id}>
              <span className="dispatch-number">0{i + 1}</span>
              <div>
                <div className="eyebrow">
                  {e.publisher} / {formatIsoDate(e.date)}
                </div>
                <h3>{e.source_label}</h3>
                <p>{e.implication}</p>
              </div>
              <ArrowUpRight size={24} />
            </Link>
          ))}
        </div>
      </section>
      <section className="forecast-section">
        <div className="container section">
          <SectionTitle
            label="03 / THE POSSIBLE FUTURES"
            title={
              <>
                Evidence moves.
                <br />
                <em>History stays visible.</em>
              </>
            }
          >
            <p className="heading-note">
              Compare dated forecasts. Inspect their assumptions.
              <br />A benchmark result is not an arrival probability.
            </p>
          </SectionTitle>
          <ForecastReviewNote />
          <ForecastExplorer compact />
        </div>
      </section>
      <section className="section container">
        <ResearchLab />
      </section>
      <section className="reading-paths container">
        <Link to="/falsifiers">
          <span className="eyebrow">THE NEXT DECISIVE OBSERVATION</span>
          <h3>
            Show the
            <br />
            successor gains.
          </h3>
          <p>
            Repeated cycles, held-out results and an account of the human work.
          </p>
          <ArrowUpRight />
        </Link>
        <Link to="/bottlenecks">
          <span className="eyebrow">FOLLOW THE CONSTRAINTS</span>
          <h3>
            The bottleneck
            <br />
            can move.
          </h3>
          <p>
            Compute, judgment, validation and infrastructure set the pace
            together.
          </p>
          <ArrowUpRight />
        </Link>
        <Link to="/methodology">
          <span className="eyebrow">MAKE THE REASONING AUDITABLE</span>
          <h3>
            How this ledger
            <br />
            changes its mind.
          </h3>
          <p>
            Definitions, dated judgments, source limitations and preserved
            history.
          </p>
          <ArrowUpRight />
        </Link>
      </section>
    </div>
  );
}
