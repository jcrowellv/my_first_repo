import { useMemo } from "react";
import { ChevronDown, Clock3, FileLock2 } from "lucide-react";
import { canonical, tracksById } from "../lib/data";
import { formatCountdown, formatIsoDate } from "../lib/dates";
import { DataCard, PageHeader, SampleBadge, StatusBadge } from "../components/Primitives";

const statusOrder = { open: 0, pushed: 1, fired: 2, passed: 3 } as const;

export function FalsifierBoard() {
  const falsifiers = useMemo(
    () =>
      [...canonical.falsifiers].sort((a, b) => {
        const statusDelta = statusOrder[a.status] - statusOrder[b.status];
        return statusDelta || a.deadline.localeCompare(b.deadline);
      }),
    [],
  );

  return (
    <div>
      <PageHeader viewId="falsifiers" />
      <div className="mb-6 flex flex-wrap gap-3">
        {(["open", "pushed", "fired", "passed"] as const).map((status) => (
          <div key={status} className="rounded-lg border border-line bg-panel px-4 py-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{status}</span>
            <strong className="ml-3 text-lg text-ink">
              {canonical.falsifiers.filter((item) => item.status === status).length}
            </strong>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {falsifiers.map((falsifier) => {
          const track = tracksById.get(falsifier.track);
          return (
            <DataCard key={falsifier.id} sample={falsifier.sample} className="flex flex-col">
              <div className="border-b border-line p-5 md:p-6">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <StatusBadge value={falsifier.status} />
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-muted">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: track?.color }} />
                    {track?.short_name}
                  </span>
                  {falsifier.sample ? <SampleBadge note={falsifier.sample_note} /> : null}
                </div>
                <h2 className="text-xl font-semibold tracking-[-0.025em] text-ink">{falsifier.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{falsifier.statement}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-line">
                <div className="border-r border-line p-4 md:p-5">
                  <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Deadline</span>
                  <strong className="text-sm text-ink">{formatIsoDate(falsifier.deadline)}</strong>
                </div>
                <div className="p-4 md:p-5">
                  <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Countdown</span>
                  <strong className="inline-flex items-center gap-2 text-sm text-amber">
                    <Clock3 size={14} /> {formatCountdown(falsifier.deadline)}
                  </strong>
                </div>
              </div>
              <div className="flex-1 p-5 md:p-6">
                <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Pre-committed consequence</span>
                <p className="text-sm leading-6 text-ink">{falsifier.consequence}</p>
              </div>
              <details className="group border-t border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-ink md:px-6">
                  <span className="inline-flex items-center gap-2"><FileLock2 size={15} className="text-cyan" /> Resolution protocol</span>
                  <ChevronDown size={16} className="text-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-line bg-canvas/40 p-5 md:p-6">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-muted">{falsifier.resolution_protocol}</p>
                  {falsifier.amendment_history.length ? (
                    <div className="mt-6 border-l-2 border-amber/50 pl-4">
                      <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.16em] text-amber">Amendment history</p>
                      {falsifier.amendment_history.map((amendment) => (
                        <div key={`${falsifier.id}-${amendment.lock_date}`} className="space-y-3 text-xs leading-5 text-muted">
                          <p><strong className="text-ink">Original:</strong> {amendment.original_statement}</p>
                          <p><strong className="text-ink">Amendment:</strong> {amendment.amendment}</p>
                          <p><strong className="text-ink">Rationale:</strong> {amendment.rationale}</p>
                          <p className="font-mono text-[10px] text-amber">Locked {formatIsoDate(amendment.lock_date)}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {falsifier.resolution_record ? (
                    <div className="mt-6 rounded-lg border border-green/30 bg-green/5 p-4 text-sm text-ink">
                      {falsifier.resolution_record.outcome}
                    </div>
                  ) : null}
                </div>
              </details>
            </DataCard>
          );
        })}
      </div>
    </div>
  );
}
