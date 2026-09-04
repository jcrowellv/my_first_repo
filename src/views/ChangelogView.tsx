import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { PageIntro, Sources, Disclosure } from "../components/Editorial";
export function ChangelogView() {
  return (
    <div className="page container">
      <PageIntro
        number="THE RECORD"
        title={
          <>
            A forecast should
            <br />
            <em>leave a trail.</em>
          </>
        }
      >
        New evidence arrives. Interpretations change. Previous judgments stay in
        the record so the movement can be examined.
      </PageIntro>
      <div className="changelog">
        {[...canonical.changelog]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((c, i) => (
            <article id={c.id} key={c.id}>
              <div>
                <span className="eyebrow">{formatIsoDate(c.date)}</span>
                {i === 0 && <span className="latest-tag">LATEST</span>}
              </div>
              <div>
                <h2>{c.change_summary.split(/(?<=\.) /)[0]}</h2>
                {c.change_summary.split(/(?<=\.) /).length > 1 && (
                  <p className="revision-detail">
                    {c.change_summary
                      .split(/(?<=\.) /)
                      .slice(1)
                      .join(" ")}
                  </p>
                )}
                <Sources ids={c.evidence_refs} />
                <Disclosure title="Affected records">
                  <ul className="record-ids">
                    {c.affected_entities.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </Disclosure>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
