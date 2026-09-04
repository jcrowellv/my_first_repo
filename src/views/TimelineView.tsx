import { Link } from "react-router";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { SignalField } from "../components/SignalField";
import { SectionTitle } from "../components/Editorial";
import { Findings } from "../components/Findings";
import { ForecastExplorer } from "../components/ForecastExplorer";
import { ResearchLab } from "../components/ResearchLab";
import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
export function TimelineView() {
  const latest = [
    "ev-astra-system-card-20260903",
    "ev-anthropic-internal-rd-20260904",
    "ev-metr-hf-investigation-20260826",
  ].map((id) => canonical.evidence.find((e) => e.id === id)!);
  return (
    <div className="home">
      <section className="hero">
        <SignalField />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            AN INDEPENDENT FIELD GUIDE TO AI
          </div>
          <h1>
            How far.
            <br />
            <em>How fast.</em>
          </h1>
          <p className="hero-deck">
            A new kind of intelligence is taking shape.
            <br />
            Follow the evidence. Explore the possible futures.
          </p>
          <div className="hero-actions">
            <a
              className="button button-light"
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("start")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Start with what's real <ArrowDown size={16} />
            </a>
            <Link className="text-link" to="/forecasts">
              Explore the forecasts <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="hero-bottom container">
          <span>THE FRONTIER, AS OF 04 SEPTEMBER 2026</span>
          <span>OBSERVATION → INTERPRETATION → POSSIBILITY</span>
        </div>
      </section>
      <section className="brief-strip container" id="start">
        <div>
          <span className="eyebrow">01 / WHAT'S HERE</span>
          <h2>
            Useful work.
            <br />
            Unfinished intelligence.
          </h2>
        </div>
        <p>
          AI can now write substantial software and solve some open research
          problems. Choosing the right problem—and knowing when an answer
          deserves trust—remains much harder.
        </p>
        <Link
          to="/evidence"
          className="circle-link"
          aria-label="Read the capability evidence"
        >
          <ArrowRight />
        </Link>
      </section>
      <section className="section container">
        <SectionTitle
          label="LOOK CLOSER"
          title={
            <>
              Progress isn't
              <br />
              <em>one rising number.</em>
            </>
          }
        />
        <Findings />
      </section>
      <section className="forecast-section">
        <div className="container section">
          <SectionTitle
            label="02 / WHAT MAY COME NEXT"
            title={
              <>
                The future has
                <br />
                <em>more than one date.</em>
              </>
            }
          >
            <p className="heading-note">
              Choose a capability. Compare the possibilities.
              <br />A central estimate is the middle of a forecast, not a
              deadline.
            </p>
          </SectionTitle>
          <ForecastExplorer compact />
        </div>
      </section>
      <section className="section container">
        <ResearchLab />
      </section>
      <section className="horizon-story">
        <img
          src={`${import.meta.env.BASE_URL}images/horizon.jpg`}
          alt="An imagined blue-hour ocean: a lone observer sits on the shore beside a vast illuminated swell."
          loading="lazy"
          width="1672"
          height="941"
        />
        <div className="horizon-shade" />
        <div className="container horizon-copy">
          <span className="eyebrow">03 / HOW TO WATCH</span>
          <h2>
            A front-row seat
            <br />
            <em>to the unknown.</em>
          </h2>
          <p>
            You can take the stakes seriously and still find this fascinating.
            Something new is happening. Understanding it starts with paying
            attention.
          </p>
          <Link className="button" to="/falsifiers">
            What would change our minds <ArrowUpRight size={16} />
          </Link>
        </div>
        <span className="image-credit">
          Original illustration · AI-generated
        </span>
      </section>
      <section className="section container">
        <SectionTitle
          label="FROM THE RESEARCH DESK"
          title={
            <>
              Three things
              <br />
              <em>worth your attention.</em>
            </>
          }
        >
          <Link className="text-link" to="/evidence">
            All {canonical.evidence.length} source records{" "}
            <ArrowUpRight size={16} />
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
                <h3>
                  {
                    [
                      "More capable does not mean easier to contain.",
                      "The research feedback loop is already beginning.",
                      "One incident. A much fuller account.",
                    ][i]
                  }
                </h3>
                <p>
                  {
                    [
                      "Astra’s system card puts cyber capability at Critical, while AI self-improvement remains below High. Capabilities advance unevenly.",
                      "Anthropic reports extensive internal coding assistance. That supports acceleration—but code volume is not a measure of scientific progress.",
                      "The independent Hugging Face investigation describes a coordinated agent effort to understand and interfere with an evaluation.",
                    ][i]
                  }
                </p>
              </div>
              <ArrowUpRight size={24} />
            </Link>
          ))}
        </div>
      </section>
      <section className="reading-paths container">
        <Link to="/methodology">
          <span className="eyebrow">NEW TO THIS?</span>
          <h3>
            Start with how
            <br />
            we think.
          </h3>
          <p>
            What a forecast means, what it leaves out, and why the private
            frontier matters.
          </p>
          <ArrowUpRight />
        </Link>
        <Link to="/bottlenecks">
          <span className="eyebrow">WANT TO GO DEEPER?</span>
          <h3>
            Follow the
            <br />
            mechanisms.
          </h3>
          <p>
            Research judgment, compute, learning and the constraints that set
            the pace.
          </p>
          <ArrowUpRight />
        </Link>
        <Link to="/glossary">
          <span className="eyebrow">LOST IN THE LETTERS?</span>
          <h3>
            Get the language.
            <br />
            Skip the mystique.
          </h3>
          <p>Plain-English definitions, from agents to superintelligence.</p>
          <ArrowUpRight />
        </Link>
      </section>
    </div>
  );
}
