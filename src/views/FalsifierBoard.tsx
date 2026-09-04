import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { canonical } from "../lib/data";
import { formatIsoDate, formatCountdown } from "../lib/dates";
import {
  PageIntro,
  Disclosure,
  Sources,
  SectionTitle,
} from "../components/Editorial";
export function FalsifierBoard() {
  return (
    <div className="page container">
      <PageIntro
        number="WHAT TO WATCH"
        title={
          <>
            The next <em>telling result.</em>
          </>
        }
      >
        A useful forecast says what would change it. Some tests have deadlines.
        Others require watching a mechanism until the evidence becomes clear.
      </PageIntro>
      <section className="watch-feature">
        <div>
          <span className="eyebrow">THE NEAREST LOCKED TEST / 31 JAN 2027</span>
          <h2>
            How long can AI work
            <br />
            <em>dependably?</em>
          </h2>
          <p>
            METR’s time horizon measures task difficulty in the time a human
            expert would need. The 80% horizon asks where an AI succeeds eight
            times out of ten—not how long its session stays open.
          </p>
        </div>
        <div className="thresholds">
          <div>
            <strong>
              &lt; 5 <small>hours</small>
            </strong>
            <span>Slower than required</span>
            <p>Move Agent-2 and coding automation 6–9 months later.</p>
          </div>
          <div>
            <strong>
              5–10 <small>hours</small>
            </strong>
            <span>Still inconclusive</span>
            <p>Push adjudication; do not count this as a pass.</p>
          </div>
          <div>
            <strong>
              ≥ 10 <small>hours</small>
            </strong>
            <span>Supports faster progress</span>
            <p>Move superhuman coding and research 3–6 months earlier.</p>
          </div>
        </div>
        <p className="fine-print">
          Precommitted review consequences, not automatic edits. Record the task
          suite, evaluation date and any methodology break before a revision.
        </p>
      </section>
      <section className="section compact-section">
        <SectionTitle
          label="01 / TESTS WITH A DATE"
          title={
            <>
              Put a date
              <br />
              <em>on being wrong.</em>
            </>
          }
        />
        {canonical.falsifiers
          .filter((f) => f.kind === "dated-tripwire")
          .map((f) => (
            <article className="watch-row" id={f.id} key={f.id}>
              <div className="watch-date">
                <span className="eyebrow">
                  {f.deadline && formatIsoDate(f.deadline)}
                </span>
                <strong>{f.deadline && formatCountdown(f.deadline)}</strong>
                <span>{f.status}</span>
              </div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.statement}</p>
                <Disclosure title="Resolution rules & amendment history">
                  <p>{f.resolution_protocol}</p>
                  <p>
                    <strong>Forecast consequence:</strong> {f.consequence}
                  </p>
                  {f.amendment_history.map((a, i) => (
                    <div className="amendment" key={i}>
                      <span className="eyebrow">
                        AMENDED {formatIsoDate(a.amended_on)}
                      </span>
                      <p>
                        <strong>Original:</strong> {a.original_statement}
                      </p>
                      <p>
                        <strong>Replacement:</strong> {a.amendment}
                      </p>
                      <p>{a.rationale}</p>
                    </div>
                  ))}
                  {f.resolution_record && (
                    <pre>{JSON.stringify(f.resolution_record, null, 2)}</pre>
                  )}
                  <Sources ids={f.evidence_refs} />
                </Disclosure>
              </div>
            </article>
          ))}
      </section>
      <section>
        <SectionTitle
          label="02 / MECHANISMS TO FOLLOW"
          title={
            <>
              Changes you can't
              <br />
              <em>schedule.</em>
            </>
          }
        />
        <div className="monitor-grid">
          {canonical.falsifiers
            .filter((f) => f.kind === "structural-monitor")
            .map((f, i) => (
              <article className="monitor" id={f.id} key={f.id}>
                <span className="eyebrow">
                  0{i + 1} / {f.status}
                </span>
                <h3>{f.title}</h3>
                <p>{f.summary}</p>
                <Disclosure title="What would count">
                  <p>{f.statement}</p>
                  <p>{f.resolution_protocol}</p>
                  <p>
                    <strong>Consequence:</strong> {f.consequence}
                  </p>
                  <Sources ids={f.evidence_refs} />
                </Disclosure>
              </article>
            ))}
        </div>
      </section>
      <div className="next-page">
        <div>
          <span className="eyebrow">BEHIND THE TESTS</span>
          <h2>What actually sets the pace?</h2>
        </div>
        <Link className="button" to="/bottlenecks">
          Explore the constraints <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
