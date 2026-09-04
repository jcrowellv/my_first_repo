import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { canonical } from "../lib/data";
import { PageIntro } from "../components/Editorial";
export function GlossaryView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const terms = canonical.glossary
    .filter(
      (g) =>
        (category === "all" || g.category === category) &&
        `${g.term} ${g.definition}`.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="page container">
      <PageIntro
        number="FIELD GLOSSARY"
        title={
          <>
            A few <em>useful words.</em>
          </>
        }
      >
        The ideas are easier to follow when the language gets out of the way.
      </PageIntro>
      <label className="search-field glossary-search">
        <Search size={20} />
        <input
          aria-label="Search glossary"
          placeholder="Find a term…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="topic-filters">
        {[
          "all",
          "milestones",
          "distributions",
          "evidence",
          "tests",
          "method",
        ].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c === "all" ? "All terms" : c[0].toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <p className="result-count" aria-live="polite">
        {terms.length} terms
      </p>
      <div className="glossary-list">
        {terms.map((g) => (
          <article id={g.id} key={g.id}>
            <div>
              <span className="eyebrow">{g.category}</span>
              <h2>{g.term}</h2>
            </div>
            <div>
              <p>{g.definition}</p>
              {(g.related || []).length > 0 && (
                <div className="related-terms">
                  {(g.related || []).map((id) => {
                    const term = canonical.glossary.find((t) => t.id === id);
                    return term ? (
                      <Link
                        to={`/glossary#${id}`}
                        onClick={() => {
                          setQuery("");
                          setCategory("all");
                        }}
                        key={id}
                      >
                        {term.term}
                        <ArrowUpRight size={12} />
                      </Link>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      {!terms.length && (
        <p className="empty-state">
          No matching terms. Try another word or choose all terms.
        </p>
      )}
    </div>
  );
}
