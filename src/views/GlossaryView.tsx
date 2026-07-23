import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText } from "lucide-react";
import type { GlossaryEntry } from "../schema";
import { canonical } from "../lib/data";
import { PageHeader } from "../components/Primitives";

const categoryOrder: Array<{ id: GlossaryEntry["category"]; label: string; detail: string }> = [
  {
    id: "milestones",
    label: "Milestones",
    detail: "The capability thresholds every date on this site refers to.",
  },
  {
    id: "distributions",
    label: "Reading the charts",
    detail: "How ranges, medians, provenance tags, and the frozen spine should be read.",
  },
  {
    id: "evidence",
    label: "Weighing evidence",
    detail: "The fields that decide how much a source is allowed to move the record.",
  },
  {
    id: "tests",
    label: "Tests",
    detail: "The difference between a locked tripwire and an honest monitor.",
  },
  {
    id: "method",
    label: "Method",
    detail: "The conventions that keep the record auditable.",
  },
];

const entriesById = new Map(canonical.glossary.map((entry) => [entry.id, entry]));

function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  const related = (entry.related ?? [])
    .map((id) => entriesById.get(id))
    .filter((item): item is GlossaryEntry => Boolean(item));
  return (
    <article id={entry.id} className="scroll-mt-28 rounded-2xl border border-line bg-panel p-5 shadow-instrument md:p-6">
      <h3 className="font-serif text-xl font-semibold tracking-[-0.01em] text-ink">{entry.term}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{entry.definition}</p>
      {related.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-4">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">See also</span>
          {related.map((item) => (
            <Link
              key={item.id}
              to={`/glossary#${item.id}`}
              className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11px] text-cyan transition-colors hover:border-cyan/40 hover:text-ink"
            >
              {item.term.split("(")[0].trim()}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function GlossaryView() {
  const grouped = useMemo(
    () =>
      categoryOrder
        .map((category) => ({
          ...category,
          entries: canonical.glossary.filter((entry) => entry.category === category.id),
        }))
        .filter((category) => category.entries.length > 0),
    [],
  );

  return (
    <div>
      <PageHeader viewId="glossary" />
      <nav aria-label="Glossary sections" className="mb-12 flex flex-wrap gap-2">
        {grouped.map((category) => (
          <Link
            key={category.id}
            to={`/glossary#section-${category.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-cyan/40 hover:text-ink"
          >
            <BookOpenText size={13} className="text-cyan" />
            {category.label}
            <span className="font-mono text-[10px] text-muted">{category.entries.length}</span>
          </Link>
        ))}
      </nav>
      <div className="space-y-14">
        {grouped.map((category) => (
          <section key={category.id} id={`section-${category.id}`} className="scroll-mt-28">
            <div className="mb-5 max-w-3xl">
              <h2 className="font-serif text-2xl font-semibold tracking-[-0.015em] text-ink">{category.label}</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted">{category.detail}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {category.entries.map((entry) => (
                <GlossaryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <aside className="mt-16 rounded-2xl bg-ink p-6 text-panel md:flex md:items-center md:justify-between md:gap-8 md:p-8">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">Definitions travel with dates</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold">Now read the forecasts the same way they were written.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-canvas/65">
            Every range, tag, and status across the site uses exactly these definitions, and the methodology page shows how they are scored.
          </p>
        </div>
        <div className="mt-6 flex shrink-0 flex-wrap gap-3 md:mt-0">
          <Link to="/forecasts" className="inline-flex items-center gap-2 rounded-full bg-panel px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cyan hover:text-panel">
            Open forecasts <ArrowRight size={14} />
          </Link>
          <Link to="/methodology" className="inline-flex items-center gap-2 rounded-full border border-canvas/25 px-5 py-3 text-sm font-medium text-panel transition-colors hover:border-cyan">
            Methodology
          </Link>
        </div>
      </aside>
    </div>
  );
}
