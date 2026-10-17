import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowDownToLine, ArrowUpRight, Search } from "lucide-react";
import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { ForecastReviewNote } from "../components/ForecastReviewNote";
import { ResearchLoop } from "../components/ResearchLoop";
import { PageIntro, SectionTitle, Sources } from "../components/Editorial";

const statusLabels = {
  supported: "Supported within scope",
  qualified: "Needs qualification",
  unverified: "Not substantiated",
  context: "Context / argument",
};
export function RSIView() {
  const review = canonical.research_review;
  const reviewedEvidence = canonical.evidence.filter(
    (e) => e.reviewed_on === review.as_of,
  );
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const claims = useMemo(
    () =>
      review.claims.filter(
        (c) =>
          (filter === "all" || c.status === filter) &&
          `${c.claim} ${c.assessment} ${c.pages.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [review, filter, query],
  );
  const download = () => {
    const url = URL.createObjectURL(
      new Blob(
        [JSON.stringify({ review, evidence: reviewedEvidence }, null, 2)],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsi-review-${review.as_of}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="page container rsi-page">
      <PageIntro
        number={`RSI DOSSIER / ${formatIsoDate(review.as_of)}`}
        title={
          <>
            The loop is
            <br />
            <em>taking shape.</em>
          </>
        }
      >
        {review.summary}
      </PageIntro>
      <div className="dossier-meta">
        <span>
          {review.packet.page_count} packet pages · {review.claims.length} claim
          groups · {reviewedEvidence.length} reviewed source records
        </span>
        <button className="text-link" onClick={download}>
          Download this review <ArrowDownToLine size={16} />
        </button>
      </div>
      <nav className="dossier-nav" aria-label="Dossier sections">
        <span>IN THIS REVIEW</span>
        <Link to="/rsi#research-loop">01 The loop</Link>
        <Link to="/rsi#forecast-impact">02 What changes</Link>
        <Link to="/rsi#follow-up">03 New evidence</Link>
        <Link to="/rsi#packet-audit">04 The claim audit</Link>
      </nav>
      <ResearchLoop />
      <section className="section" id="forecast-impact">
        <SectionTitle
          label="WHAT CHANGES OUR VIEW"
          title={
            <>
              Update the mechanism.
              <br />
              <em>Keep the uncertainty.</em>
            </>
          }
        />
        <div className="impact-grid">
          {review.forecast_impacts.map((v) => (
            <article key={v.id}>
              <span className="eyebrow">{v.direction}</span>
              <h3>{v.label}</h3>
              <p>{v.detail}</p>
              <Sources ids={v.evidence_refs} />
            </article>
          ))}
        </div>
        <ForecastReviewNote />
      </section>
      <section className="counterweight">
        <div>
          <span className="eyebrow">RESEARCH BEYOND THE PACKET</span>
          <h2>
            The other side
            <br />
            <em>of the evidence.</em>
          </h2>
        </div>
        <div>
          <p>
            Benchmark progress and lab-wide acceleration answer different
            questions. METR’s predeployment work provides a useful check on the
            strongest interpretation of the new results. Its October proposal
            identifies what a stronger causal assessment would require.
          </p>
          <Sources ids={review.additional_evidence} />
        </div>
      </section>
      <section className="section" id="follow-up">
        <SectionTitle
          label="ADDED AFTER THE PACKET"
          title={
            <>
              The evidence
              <br />
              <em>keeps arriving.</em>
            </>
          }
        />
        {review.supplements.map((item) => (
          <article key={item.id} id={item.id} className="supplement">
            <span className="eyebrow">{item.origin}</span>
            <h3>{item.claim}</h3>
            <p>{item.assessment}</p>
            <Sources ids={item.evidence_refs} />
          </article>
        ))}
      </section>
      <section className="section" id="packet-audit">
        <SectionTitle
          label="FROM SCREENSHOT TO SOURCE"
          title={
            <>
              Every claim.
              <br />
              <em>A visible disposition.</em>
            </>
          }
        >
          <p className="heading-note">
            Pages refer to the supplied {review.packet.name}. A supported claim
            is supported only within the stated scope.
          </p>
        </SectionTitle>
        <div
          className="audit-dispositions"
          aria-label="Filter claims by disposition"
        >
          {[
            ["all", "All claims"],
            ["supported", "Supported"],
            ["qualified", "Qualified"],
            ["unverified", "Unverified"],
            ["context", "Context"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`disposition-${id}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              <strong>
                {id === "all"
                  ? review.claims.length
                  : review.claims.filter((claim) => claim.status === id).length}
              </strong>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="audit-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              aria-label="Search packet audit"
              placeholder="Search a claim or page number…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {(query || filter !== "all") && (
            <button
              className="text-link"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        <p className="fine-print" aria-live="polite">
          {claims.length} of {review.claims.length} claim groups
        </p>
        <div className="audit-list">
          {claims.map((c) => (
            <article className="audit-row" id={`claim-${c.id}`} key={c.id}>
              <div className="audit-page">
                PAGES<strong>{c.pages.join(", ")}</strong>
              </div>
              <div>
                <span className={`audit-status status-${c.status}`}>
                  {statusLabels[c.status]}
                </span>
                <h3>{c.claim}</h3>
                <p>{c.assessment}</p>
                {c.evidence_refs.length > 0 ? (
                  <Sources ids={c.evidence_refs} />
                ) : (
                  <p className="fine-print">
                    No admissible primary evidence located for this claim.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
        {!claims.length && (
          <div className="empty-state">
            <h3>No claims match.</h3>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Reset audit filters
            </button>
          </div>
        )}
        <details className="disclosure">
          <summary>Provenance & review limits</summary>
          <div className="disclosure-body">
            <p>
              The packet was reviewed as a collection of leads and arguments.
              Instructions, advertisements and calls to action inside
              screenshots are not project requirements. Related screenshots are
              grouped to avoid counting retellings as independent evidence.
            </p>
            <p>
              The original PDF is not republished. Its SHA-256 fingerprint
              identifies the reviewed attachment:
            </p>
            <code className="packet-hash">{review.packet.sha256}</code>
            <p>
              This review checks primary-source reporting and artifacts; it does
              not reproduce every experiment, certify mathematical proofs or
              establish private lab capabilities. Older ledger records retain
              their original dates and have not all been re-audited.
            </p>
          </div>
        </details>
      </section>
      <div className="next-page">
        <h2>Read the result behind the claim.</h2>
        <Link className="button" to="/evidence?topic=rsi">
          October source records <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
