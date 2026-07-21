import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { canonical, evidenceById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { DataCard, PageHeader, SampleBadge } from "../components/Primitives";

export function ChangelogView() {
  const entries = [...canonical.changelog].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <PageHeader viewId="changelog" />
      <div className="relative ml-3 border-l border-line pl-7 md:ml-5 md:pl-10">
        {entries.map((entry, index) => (
          <div key={entry.id} className="relative mb-6 last:mb-0">
            <span className={`absolute -left-[34px] top-6 grid h-3 w-3 place-items-center rounded-full border md:-left-[47px] ${index === 0 ? "border-cyan bg-cyan shadow-[0_0_18px_rgba(95,213,232,.6)]" : "border-line bg-panel"}`} />
            <DataCard sample={entry.sample}>
              <div className="flex flex-col gap-5 p-5 md:flex-row md:p-6">
                <div className="shrink-0 md:w-36">
                  <time className="font-mono text-xs text-cyan">{formatIsoDate(entry.date)}</time>
                  {index === 0 ? <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Current head</span> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <GitCommitHorizontal size={16} className="text-muted" />
                    <h2 className="text-base font-semibold leading-6 text-ink">{entry.change_summary}</h2>
                    {entry.sample ? <SampleBadge note={entry.sample_note} /> : null}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.affected_entities.map((entity) => (
                      <span key={entity} className="rounded border border-line bg-canvas px-2 py-1 font-mono text-[9px] text-muted">{entity}</span>
                    ))}
                  </div>
                  {entry.evidence_refs.length ? (
                    <div className="mt-4 border-t border-line pt-4">
                      {entry.evidence_refs.map((ref) => {
                        const evidence = evidenceById.get(ref);
                        return evidence ? (
                          <a key={ref} href={evidence.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan hover:text-ink">
                            {evidence.source_label} <ArrowUpRight size={12} />
                          </a>
                        ) : null;
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </DataCard>
          </div>
        ))}
      </div>
    </div>
  );
}
