import { canonical } from "../lib/data";
import { PageIntro, Disclosure, Sources } from "../components/Editorial";
import { ResearchLab } from "../components/ResearchLab";
const names: Record<string, string> = {
  "b-autonomy-horizon": "Staying useful without supervision",
  "b-research-engineering": "Building and running the experiment",
  "b-research-taste": "Experiment selection is not agenda selection",
  "b-continual-learning": "Keeping what experience teaches",
  "b-verification-asymmetry": "Knowing which answers to trust",
  "b-compute-economics": "Finding enough compute and time",
};
export function BottleneckTracker() {
  return (
    <div className="page container">
      <PageIntro
        number="THE MECHANISMS"
        title={
          <>
            What sets <em>the pace?</em>
          </>
        }
      >
        A faster model helps. So do better experiments, cheaper compute and
        tools that remember what worked. Progress depends on how these pieces
        fit together.
      </PageIntro>
      <div className="mechanism-index">
        {canonical.bottlenecks.map((b, i) => (
          <a href={`#/bottlenecks#${b.id}`} key={b.id}>
            <span>0{i + 1}</span>
            {b.name}
          </a>
        ))}
      </div>
      <div>
        {canonical.bottlenecks.map((b, i) => (
          <article className="mechanism" id={b.id} key={b.id}>
            <div className="mechanism-number">0{i + 1}</div>
            <div>
              <div className="eyebrow">
                {b.name} / {b.status}
                {b.reviewed_on && ` / Reviewed ${b.reviewed_on}`}
              </div>
              <h2>{names[b.id]}</h2>
              <p className="mechanism-deck">{b.mechanism}</p>
              <div className="mechanism-detail">
                <div>
                  <span className="eyebrow">THE ASSESSMENT</span>
                  <p>{b.assessment}</p>
                </div>
                <div>
                  <span className="eyebrow">THE NEXT USEFUL OBSERVATION</span>
                  <p>{b.next_signal}</p>
                </div>
              </div>
              <Disclosure title="Evidence for & against this assessment">
                <h4>Supporting evidence</h4>
                <Sources ids={b.evidence_for} />
                <h4>Limits and counterevidence</h4>
                <Sources ids={b.evidence_against} />
                <p className="fine-print">
                  Assessment confidence: {b.confidence}. This is a qualitative
                  judgment. Source dates determine the age of the supporting
                  record.
                </p>
              </Disclosure>
            </div>
          </article>
        ))}
      </div>
      <section className="section">
        <ResearchLab />
      </section>
    </div>
  );
}
