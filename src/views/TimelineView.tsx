import { Link } from "react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  Microscope,
} from "lucide-react";
import { SectionTitle, Sources } from "../components/Editorial";
import { AgentExplorer } from "../components/AgentExplorer";
import { StoryTimeline } from "../components/StoryTimeline";
import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import "../agents.css";

export function TimelineView() {
  const assessment = canonical.agent_assessment;
  return (
    <div className="agent-home">
      <section className="agent-hero">
        <div className="container">
          <div className="agent-hero-meta">
            <span className="eyebrow">
              <span className="live-dot" />
              AI 2027 / A LIVING ASSESSMENT
            </span>
            <span>{formatIsoDate(assessment.as_of)}</span>
          </div>
          <div className="agent-hero-grid">
            <div>
              <h1>
                Tracking the
                <br />
                <em>AI 2027 story.</em>
              </h1>
              <p className="agent-hero-deck">
                Capable assistants are here.
                <br />
                The next jump is a complete research engineer.
              </p>
              <Link className="button button-accent" to="/#agents">
                Explore the agents <ArrowDown size={16} />
              </Link>
            </div>
            <aside className="story-position">
              <span className="eyebrow">WHERE THE EVIDENCE PLACES US</span>
              <div className="story-position-path" aria-hidden="true">
                <span>A1</span>
                <i />
                <span>A2</span>
              </div>
              <h2>{assessment.position}</h2>
              <p>{assessment.summary}</p>
              <Link className="text-link" to="/#pace">
                Are we ahead of the story? <ArrowRight size={15} />
              </Link>
            </aside>
          </div>
          <div className="agent-hero-bottom">
            <p>
              An independent reading of the scenario, not an AI Futures Project
              rating.
            </p>
            <a
              className="text-link"
              href="https://ai-2027.com/"
              target="_blank"
              rel="noreferrer"
            >
              Read the original story <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>
      <div className="container">
        <section className="agent-section" id="agents">
          <span id="start" className="anchor-alias" />
          <SectionTitle
            label="01 / THE AGENT LADDER"
            title={
              <>
                Five profiles.
                <br />
                <em>Different distances to go.</em>
              </>
            }
          >
            <p>
              Start with the current assessment. Open any agent for the
              abilities, evidence and remaining gaps behind its score.
            </p>
          </SectionTitle>
          <AgentExplorer />
        </section>
        <section className="agent-section pace-section" id="pace">
          <span id="signals" className="anchor-alias" />
          <SectionTitle
            label="02 / STORY VERSUS EVIDENCE"
            title={
              <>
                Some pieces are early.
                <br />
                <em>The whole jump is unfinished.</em>
              </>
            }
          >
            <p>
              Ahead in one capability does not put every chapter ahead of
              schedule. Here is where that distinction matters most.
            </p>
          </SectionTitle>
          <div className="pace-cards">
            {assessment.pace.map((p) => (
              <article className="pace-card" key={p.id}>
                <span className={`pace-verdict ${p.verdict}`}>{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <details>
                  <summary>
                    Compare with the story <ArrowDown size={14} />
                  </summary>
                  <div>
                    <p>{p.story_comparison}</p>
                    <p className="muted">{p.limitation}</p>
                    <Sources ids={p.evidence_refs} />
                  </div>
                </details>
              </article>
            ))}
          </div>
          <p className="pace-bottom-note">
            Our reading: parts of Agent-2 are arriving before its January 2027
            chapter. Public evidence does not yet establish that the complete
            agent sequence is ahead, or by how many months.
          </p>
        </section>
        <section className="agent-section" id="story-timeline">
          <SectionTitle
            label="03 / THE TIMELINE"
            title={
              <>
                The story’s dates.
                <br />
                <em>Our updated outlook.</em>
              </>
            }
          >
            <p>
              The October forecast moves earlier than September. Its central
              dates still leave more time than the original 2027 narrative.
            </p>
          </SectionTitle>
          <StoryTimeline />
        </section>
        <section className="agent-section deeper-section" id="go-deeper">
          <SectionTitle
            label="04 / FOLLOW YOUR CURIOSITY"
            title={
              <>
                Go deeper.
                <br />
                <em>One question at a time.</em>
              </>
            }
          />
          <div className="deeper-links">
            <Link to="/evidence">
              <BookOpen size={22} />
              <span>
                <h3>What actually happened?</h3>
                <p>
                  Search the source ledger and inspect the limits of each
                  finding.
                </p>
              </span>
              <ArrowUpRight size={18} />
            </Link>
            <Link to="/rsi">
              <Microscope size={22} />
              <span>
                <h3>Can AI improve AI?</h3>
                <p>
                  Follow the research loop and the full October evidence
                  dossier.
                </p>
              </span>
              <ArrowUpRight size={18} />
            </Link>
            <Link to="/forecasts">
              <ChartNoAxesCombined size={22} />
              <span>
                <h3>How do forecasts differ?</h3>
                <p>Compare dates, assumptions and the full revision history.</p>
              </span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="agent-next-links">
            <Link className="text-link" to="/falsifiers">
              What would change this assessment? <ArrowRight size={15} />
            </Link>
            <Link className="text-link" to="/methodology#criteria">
              How the percentages are calculated <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
