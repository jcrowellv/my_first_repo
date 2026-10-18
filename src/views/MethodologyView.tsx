import { Link } from "react-router";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { canonical, currentAgentProgress, getProgressRange } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { PageIntro, Disclosure, Sources } from "../components/Editorial";
function download() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(canonical, null, 2)], {
      type: "application/json",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `capability-ledger-${canonical.agent_assessment.as_of}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function MethodologyView() {
  return (
    <div className="page container">
      <PageIntro
        number="HOW WE THINK"
        title={
          <>
            How the forecast
            <br />
            <em>is made.</em>
          </>
        }
      >
        The aim is to understand what is happening well enough to change our
        minds when the facts change.
      </PageIntro>
      <div className="article-layout">
        <aside className="article-nav" aria-label="On this page">
          <a href="#/methodology#purpose">Why this exists</a>
          <a href="#/methodology#source-audit">How claims enter</a>
          <a href="#/methodology#private-frontier">The private frontier</a>
          <a href="#/methodology#reading-ranges">Reading the ranges</a>
          <a href="#/methodology#agent-update">The October update</a>
          <a href="#/methodology#criteria">The capability audit</a>
          <a href="#/methodology#record">The open record</a>
        </aside>
        <article className="editorial-article">
          <section id="purpose">
            <span className="eyebrow">01 / THE PURPOSE</span>
            <h2>
              No one can see
              <br />
              <em>the whole frontier.</em>
            </h2>
            <p>
              There are model releases, benchmark scores, extraordinary
              demonstrations and people confidently predicting opposite futures.
              Keeping up is easy to confuse with understanding.
            </p>
            <p>
              This site slows the conversation down. It connects a claim to its
              source, asks what the result actually demonstrates, and then
              considers what it should change about the future we expect.
            </p>
            <p>
              The Ledger is curated by JJ Crowell, with AI assistance in
              research, analysis and development. The October house forecast is
              a Codex assessment; the earlier Astra judgments remain in the
              record. These are independent judgments, not OpenAI or AI Futures
              Project forecasts. The site has no privileged access to frontier
              labs.
            </p>
            <div className="three-steps">
              <div>
                <span>01</span>
                <h3>Observation</h3>
                <p>What happened, under which conditions?</p>
              </div>
              <div>
                <span>02</span>
                <h3>Interpretation</h3>
                <p>
                  Which ability does it support—and which does it leave
                  untested?
                </p>
              </div>
              <div>
                <span>03</span>
                <h3>Forecast</h3>
                <p>How does that change what we expect, and why?</p>
              </div>
            </div>
          </section>
          <section id="source-audit">
            <span className="eyebrow">THE OCTOBER SOURCE STANDARD</span>
            <h2>
              Separate the claim
              <br />
              <em>from its retelling.</em>
            </h2>
            <p>
              The October review starts with a 26-page screenshot packet, treats
              it as research leads, and traces claims to original papers,
              artifacts and evaluation reports. Every page has a disposition,
              including claims that remain unsubstantiated.
            </p>
            <p>
              Source records distinguish publication, update and access dates. A
              review date means the source was checked, not that its experiment
              was independently reproduced. Multiple reports about one
              underlying event share a source family.
            </p>
            <p>
              The research loop separates execution, experiment selection,
              verification, agenda selection and repeated successor gains. These
              are qualitative judgments, not percentages of intelligence
              achieved. Evidence can revise a mechanism without supplying a
              calibrated new probability distribution.
            </p>
            <Link className="source-link" to="/rsi#packet-audit">
              Inspect the complete audit <ArrowUpRight size={15} />
            </Link>
          </section>
          <section id="private-frontier">
            <span className="eyebrow">02 / WHAT WE CANNOT DIRECTLY SEE</span>
            <h2>
              The release is
              <br />
              <em>not the frontier.</em>
            </h2>
            <p>
              The most capable system inside a lab may be a research prototype,
              an expensive configuration, or an agent with tools that are not
              available publicly. A product release is a selected view of that
              work.
            </p>
            <p>
              That matters for timelines. Human researchers can direct
              increasingly capable assistants toward useful experiments before
              an AI can independently run an entire research agenda. Better
              tools can help build better tools.
            </p>
            <p>
              The retained September forecast assumed a typical private lead of
              roughly three to six months in useful research capability, with a
              meaningful chance of a year or more in some systems or domains.
              That is an assumption, not a measurement of today’s hidden models.
            </p>
            <p>
              The October dates also target practically useful{" "}
              <strong>internal capability</strong>. Subtracting a private lead
              again would count it twice. Nor does a stronger private prototype
              establish reliable autonomy, continual learning or
              superintelligence by itself.
            </p>
            <Sources
              ids={[
                "ev-anthropic-internal-rd-20260904",
                "ev-metr-risk-report",
                "ev-openai-pacing-20260818",
              ]}
            />
          </section>
          <section id="reading-ranges">
            <span className="eyebrow">03 / LIVING WITH UNCERTAINTY</span>
            <h2>
              How to read
              <br />
              <em>a forecast range.</em>
            </h2>
            <p>
              “50% by 2030” means the forecaster gives roughly equal weight to
              arrival before and after that point. It does not mean the
              capability is half built, or that the date has a 50% chance of
              being exactly right.
            </p>
            <div
              className="range-explainer"
              role="img"
              aria-label="10 percent of forecast probability falls before the range, 80 percent within it, and 10 percent after"
            >
              <span>
                10%<small>earlier</small>
              </span>
              <div>
                <i />
                <strong>80% of possibilities</strong>
                <b>
                  50%<small>central estimate</small>
                </b>
              </div>
              <span>
                10%<small>later</small>
              </span>
            </div>
            <p>
              Our ranges connect the 10th and 90th percentiles. Outcomes outside
              the range remain possible. Daniel’s August probability readout
              uses his published curve. Other readouts use interpolation between
              recorded percentiles, with unknown tails shown as bounds. These
              calculations do not constitute a separately calibrated model.
            </p>
            <p>
              Each milestone has its own distribution. Lining up the middle
              dates does not produce a simulated future, and subtracting two
              middle dates does not give the middle duration between them.
            </p>
            <p>
              Definitions also differ. Daniel’s August forecast assumes the
              fastest technically feasible development path. The Ledger includes
              interruptions. The original AI 2027 story is held fixed as a
              scenario, with its probability estimates kept separately.
            </p>
            <Link className="source-link" to="/forecasts">
              Explore the forecasts <ArrowUpRight size={15} />
            </Link>
          </section>
          <section id="agent-update">
            <span className="eyebrow">OCTOBER 18 / THE NEW ASSESSMENT</span>
            <h2>
              Early components.
              <br />
              <em>An unfinished bundle.</em>
            </h2>
            <p>
              {canonical.agent_assessment.summary} The strongest upward update
              is to experimental research taste; it does not by itself establish
              agenda selection, durable learning or a tripling of lab progress.
            </p>
            <p>
              Agent-1 through Agent-4 now score 100%, 65%, 33% and 25% on the
              retained July rubric. Their weights are unchanged. Agent-5 adds a
              separate, very low-confidence 4% precursor baseline tied to the
              race-branch narrative, not to an assumed equivalence with SIAR or
              ASI.
            </p>
            <p>
              {canonical.agent_assessment.forecast_note} The six core forecast
              ranges from the October 17 independent outlook are reaffirmed
              here. Agent-2 adds a new judgmental range of 2027–2032, centered
              on mid-2027, for the full learning-and-uplift bundle.
            </p>
            <p>
              We did not fit a trend to the two percentage snapshots. Better
              experimental judgment and technical execution support earlier
              arrival; uncertain generalization, frontier training cycles and
              physical compute preserve broad late tails. Rubric ranges are
              interpretive bounds, while forecast ranges are elicited p10–p90
              probability intervals.
            </p>
            <Sources
              ids={[
                "ev-tasteval-20261006",
                "ev-vals-rsi-20261015",
                "ev-metr-hf-investigation-20260826",
                "ev-metr-opus55-20260922",
                "ev-epoch-power-20260904",
              ]}
            />
            <Link className="source-link" to="/#story-timeline">
              View the story and forecast together <ArrowUpRight size={15} />
            </Link>
          </section>
          <section id="criteria">
            <span className="eyebrow">04 / A CLOSER CAPABILITY AUDIT</span>
            <h2>
              Which parts
              <br />
              <em>have we seen?</em>
            </h2>
            <p>
              The Agent-1 through Agent-5 sequence comes from AI 2027. Each
              level combines several abilities. A coding result cannot establish
              research judgment, just as an impressive single run cannot
              establish reliability.
            </p>
            <p>
              Current October assessments appear first, followed by the
              preserved July snapshots. The percentages summarize weighted
              judgments about publicly documented criteria. They are{" "}
              <strong>
                not probabilities, benchmark scores, or a percentage of time
                remaining
              </strong>
              . Every defining ability must be established before the bundle is
              assessed as met; a strong average cannot hide a missing
              requirement.
            </p>
            <p>
              Calculation: round(100 × sum of criterion weight × completion).
              The low and high judgment ranges use the same weights. These
              ranges are not statistical confidence intervals. New entries point
              back to their predecessors; earlier scores and rationales are
              preserved.
            </p>
            {[
              ...currentAgentProgress,
              ...canonical.capability_progress.filter(
                (p) =>
                  !currentAgentProgress.some((current) => current.id === p.id),
              ),
            ].map((p) => {
              const range = getProgressRange(p);
              return (
                <Disclosure
                  key={p.id}
                  id={p.id}
                  title={
                    <span>
                      {p.label}
                      <small className="disclosure-subtitle">
                        {p.as_of === canonical.agent_assessment.as_of
                          ? "Current"
                          : "Historical"}{" "}
                        · {p.score}% rubric completion · {range.low}–
                        {range.high}% judgment range · {formatIsoDate(p.as_of)}
                      </small>
                    </span>
                  }
                >
                  <p>{p.summary}</p>
                  {p.criteria.map((c) => (
                    <div className="criterion" key={c.id}>
                      <div>
                        <h4>{c.label}</h4>
                        <span>
                          {c.rating.replace("-", " ")} ·{" "}
                          {Math.round(c.weight * 100)}% weight
                        </span>
                      </div>
                      <div className="criterion-bar">
                        <i style={{ width: `${c.completion * 100}%` }} />
                      </div>
                      <p>{c.rationale}</p>
                      <p className="fine-print">
                        Completion estimate: {Math.round(c.completion * 100)}%;
                        judgment range{" "}
                        {Math.round(c.completion_range.low * 100)}–
                        {Math.round(c.completion_range.high * 100)}%.
                      </p>
                      <Sources ids={c.evidence_refs} />
                      {c.counterevidence_refs.length > 0 && (
                        <>
                          <h5>Counterevidence</h5>
                          <Sources ids={c.counterevidence_refs} />
                        </>
                      )}
                    </div>
                  ))}
                </Disclosure>
              );
            })}
          </section>
          <section id="record">
            <span className="eyebrow">05 / AN OPEN RECORD</span>
            <h2>
              Keep the history.
              <br />
              <em>Make the next judgment better.</em>
            </h2>
            <p>
              A changed forecast gets a new entry. The earlier estimate remains
              visible, linked to the one that replaced it. Corrections to
              evidence are labeled; one event described by several publishers
              does not become several independent events.
            </p>
            <p>
              Source quality is not collapsed into a single number. We track who
              produced the result, how it was checked, and how directly it bears
              on the question. All three matter.
            </p>
            <p>
              The illustrations and charts are original to this site. The ocean
              image was generated with AI; the interactive charts use the linked
              source data and explicitly labeled calculations.
            </p>
            <div className="article-actions">
              <button className="button button-accent" onClick={download}>
                Download the full ledger <ArrowDownToLine size={17} />
              </button>
              <a
                className="text-link"
                href="https://github.com/jcrowellv/my_first_repo"
                target="_blank"
                rel="noreferrer"
              >
                Inspect the source <ArrowUpRight size={16} />
              </a>
            </div>
            <Disclosure title="Known limitations of the method">
              {canonical.methodology.limitations.map((l) => (
                <div className="source-record" key={l.title}>
                  <h3>{l.title}</h3>
                  <p>{l.risk}</p>
                  <p className="muted">{l.mitigation}</p>
                </div>
              ))}
            </Disclosure>
            <Link className="source-link" to="/changelog">
              Read the revision history <ArrowUpRight size={15} />
            </Link>
          </section>
        </article>
      </div>
    </div>
  );
}
