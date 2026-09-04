import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { Search, ArrowUpRight, ChevronDown, X } from "lucide-react";
import { canonical, milestonesById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { PageIntro, Disclosure, Sources } from "../components/Editorial";
const topics = [
  ["all", "Everything"],
  ["research", "Research & agents"],
  ["evaluation", "Evaluations"],
  ["forecast", "Forecasts"],
  ["safety", "Safety & control"],
  ["diffusion", "Open models & deployment"],
];
export function EvidenceLedger() {
  const { hash } = useLocation();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const topic = params.get("topic") || "all";
  const [independence, setIndependence] = useState("all");
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState("date");
  const [limit, setLimit] = useState(16);
  const target = decodeURIComponent(hash.slice(1));
  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    setParams(p, { preventScrollReset: true });
  };
  const results = useMemo(
    () =>
      canonical.evidence
        .filter((e) => {
          if (
            e.id === target &&
            !query &&
            topic === "all" &&
            independence === "all"
          )
            return true;
          if (e.archived && !archived) return false;
          if (independence !== "all" && e.independence !== independence)
            return false;
          const text = [
            e.source_label,
            e.publisher,
            e.summary,
            e.implication,
            e.limitation,
            ...(e.themes || []),
          ]
            .join(" ")
            .toLowerCase();
          if (query && !text.includes(query.toLowerCase())) return false;
          if (
            topic === "research" &&
            !e.milestone_tags.some((x) =>
              ["agent-2", "sar", "siar", "sc"].includes(x),
            )
          )
            return false;
          if (
            topic === "evaluation" &&
            !["evaluation", "system-card"].includes(e.source_type)
          )
            return false;
          if (
            topic === "forecast" &&
            !["forecast", "scenario", "survey"].includes(e.source_type)
          )
            return false;
          if (
            topic === "safety" &&
            !e.themes?.some((x) =>
              ["cybersecurity", "alignment-control", "governance"].includes(x),
            ) &&
            e.source_type !== "incident"
          )
            return false;
          if (
            topic === "diffusion" &&
            !e.themes?.some((x) =>
              ["open-weights", "deployment", "diffusion"].includes(x),
            ) &&
            e.source_type !== "deployment"
          )
            return false;
          return true;
        })
        .sort((a, b) =>
          sort === "relevance"
            ? { high: 0, medium: 1, low: 2 }[a.diagnosticity] -
                { high: 0, medium: 1, low: 2 }[b.diagnosticity] ||
              b.date.localeCompare(a.date)
            : b.date.localeCompare(a.date),
        ),
    [query, topic, independence, archived, sort, target],
  );
  useEffect(() => setLimit(16), [query, topic, independence, archived, sort]);
  const visible = results.slice(
    0,
    Math.max(limit, results.findIndex((e) => e.id === target) + 1),
  );
  return (
    <div className="page container">
      <PageIntro
        number="THE EVIDENCE"
        title={
          <>
            Show <em>the work.</em>
          </>
        }
      >
        An experiment is more useful than a headline. Here is what was observed,
        what it might mean, and where the inference stops.
      </PageIntro>
      <div className="evidence-toolbar">
        <label className="search-field">
          <Search size={20} />
          <input
            aria-label="Search evidence"
            placeholder="Search a model, question or source…"
            value={query}
            onChange={(e) => setParam("q", e.target.value)}
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setParam("q", "")}>
              <X size={18} />
            </button>
          )}
        </label>
        <div className="topic-filters">
          {topics.map(([id, label]) => (
            <button
              key={id}
              aria-pressed={topic === id}
              onClick={() => setParam("topic", id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filter-bottom">
          <p aria-live="polite">
            {results.length} source record{results.length === 1 ? "" : "s"}
          </p>
          <div>
            <label>
              Source{" "}
              <select
                aria-label="Filter source independence"
                value={independence}
                onChange={(e) => setIndependence(e.target.value)}
              >
                <option value="all">All sources</option>
                <option value="independent">Independent</option>
                <option value="first-party">First-party</option>
                <option value="mixed">Mixed</option>
              </select>
            </label>
            <label>
              Order{" "}
              <select
                aria-label="Sort evidence"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="date">Newest first</option>
                <option value="relevance">Most relevant</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={archived}
                onChange={(e) => setArchived(e.target.checked)}
              />{" "}
              Include archive
            </label>
          </div>
        </div>
      </div>
      <div className="evidence-list">
        {visible.map((e) => (
          <article
            id={e.id}
            className={`evidence-entry ${target === e.id ? "target-entry" : ""}`}
            key={e.id}
          >
            <div className="evidence-date">
              <time dateTime={e.date}>{formatIsoDate(e.date)}</time>
              <span>
                {e.id === "ev-anthropic-internal-rd-20260904"
                  ? "Verified on this date"
                  : e.source_type.replace("-", " ")}
              </span>
              {e.archived && <b>Historical account</b>}
            </div>
            <div className="evidence-main">
              <div className="evidence-meta">
                <span>{e.publisher}</span>
                <span>
                  {e.independence.replace("-", " ")} ·{" "}
                  {e.verification.replaceAll("-", " ")}
                </span>
              </div>
              <h2>
                <a href={e.source_url} target="_blank" rel="noreferrer">
                  {e.source_label}
                  <ArrowUpRight size={19} />
                </a>
              </h2>
              <p>{e.summary}</p>
              <details
                className="evidence-detail"
                open={target === e.id || undefined}
              >
                <summary>
                  Interpretation, limits & setup <ChevronDown size={17} />
                </summary>
                <div>
                  <div className="evidence-analysis">
                    <div>
                      <span className="eyebrow">WHAT IT MAY CHANGE</span>
                      <p>{e.implication}</p>
                    </div>
                    <div>
                      <span className="eyebrow">WHERE THE CLAIM STOPS</span>
                      <p>{e.limitation}</p>
                    </div>
                  </div>
                  <div className="experiment-context">
                    <span className="eyebrow">THE SETUP</span>
                    <p>
                      {e.evaluation_context ||
                        "See the original source for the full evaluation context."}
                    </p>
                  </div>
                  {e.archived && (
                    <p className="archive-note">Archived: {e.archive_reason}</p>
                  )}
                  <div className="evidence-tags">
                    {e.milestone_tags.map((id) => (
                      <Link
                        key={id}
                        to={
                          ["agent-1", "agent-3", "agent-4"].includes(id)
                            ? `/methodology#progress-${id}-20260721`
                            : `/forecasts?milestone=${id}`
                        }
                      >
                        {milestonesById.get(id)?.code || id}
                      </Link>
                    ))}
                    <span>Relevance: {e.diagnosticity}</span>
                  </div>
                  <div className="entry-actions">
                    <a
                      className="source-link"
                      href={e.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read the original <ArrowUpRight size={14} />
                    </a>
                    <Link className="text-link" to={`/evidence#${e.id}`}>
                      Link to this record
                    </Link>
                  </div>
                </div>
              </details>
            </div>
          </article>
        ))}
      </div>
      {!results.length && (
        <div className="empty-state">
          <h2>No records match.</h2>
          <p>Try a shorter phrase, another topic, or include the archive.</p>
          <button
            className="button"
            onClick={() => {
              setParams({});
              setIndependence("all");
              setArchived(false);
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      {visible.length < results.length && (
        <div className="load-more">
          <button className="button" onClick={() => setLimit(limit + 16)}>
            Read more records{" "}
            <span>{results.length - visible.length} remaining</span>
          </button>
        </div>
      )}
      <div className="archive-sections">
        <Disclosure
          id="safety-readiness"
          title="Safety & control: the maintained watchlist"
        >
          <p className="muted">
            A separate question from capability: can these systems be evaluated
            and deployed under dependable control? These notes retain their
            underlying source dates.
          </p>
          {canonical.safety_readiness.map((s) => (
            <div className="source-record" key={s.id}>
              <h3>{s.name}</h3>
              <p>{s.summary}</p>
              <p className="muted">Next evidence: {s.next_signal}</p>
              <Sources ids={s.evidence_refs} />
            </div>
          ))}
        </Disclosure>
        <Disclosure
          id="open-weights"
          title="Open models & deployment: dated snapshots"
        >
          <p className="muted">
            These indicators describe their stated observation dates; they are
            not live market statistics.
          </p>
          {canonical.open_weight_indicators.map((s) => (
            <div className="source-record" key={s.id}>
              <span className="eyebrow">{formatIsoDate(s.as_of)}</span>
              <h3>
                {s.label}: {s.value}
              </h3>
              <p>{s.detail}</p>
              <Sources ids={s.evidence_refs} />
            </div>
          ))}
        </Disclosure>
      </div>
      <p className="archive-footer">
        The count is a reading index, not a vote. Several records can describe
        the same experiment or incident.{" "}
        <Link to="/methodology">
          How evidence is weighed <ArrowUpRight size={14} />
        </Link>
      </p>
    </div>
  );
}
