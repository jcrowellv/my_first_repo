import { CalendarClock, ChevronDown, FileLock2, Radar } from "lucide-react";
import type { Falsifier } from "../schema";
import { canonical, evidenceById, milestonesById } from "../lib/data";
import { formatCountdown, formatIsoDate } from "../lib/dates";
import { PageHeader, StatusBadge } from "../components/Primitives";

function TestCard({ test }: { test: Falsifier }) {
  return (
    <details className="group rounded-2xl border border-line bg-panel shadow-instrument">
      <summary className="cursor-pointer list-none p-5 md:p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge value={test.status} />
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{test.review_label}</span>
              {test.deadline ? (
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-amber">
                  {formatIsoDate(test.deadline)} · {formatCountdown(test.deadline)}
                </span>
              ) : null}
            </div>
            <h2 className="font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink">{test.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{test.summary}</p>
          </div>
          <ChevronDown size={18} className="mt-1 shrink-0 text-muted transition-transform group-open:rotate-180" />
        </div>
      </summary>
      <div className="grid gap-6 border-t border-line bg-raised/30 p-5 md:grid-cols-2 md:p-6">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Trigger</p>
          <p className="mt-2 text-sm leading-6 text-ink">{test.statement}</p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">If observed</p>
          <p className="mt-2 text-sm leading-6 text-ink">{test.consequence}</p>
        </div>
        <div className="md:col-span-2">
          <p className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            <FileLock2 size={13} /> Resolution protocol
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{test.resolution_protocol}</p>
        </div>
        <div className="md:col-span-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em]">Moves</span>
          {test.affected_milestones.map((id) => (
            <span key={id} className="rounded-full bg-panel px-2.5 py-1 font-mono text-[9px] text-muted ring-1 ring-line">
              {milestonesById.get(id)?.code}
            </span>
          ))}
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {test.evidence_refs.map((ref) => {
            const evidence = evidenceById.get(ref);
            return evidence ? (
              <a
                key={ref}
                href={evidence.source_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-cyan transition-colors hover:border-cyan/40 hover:text-ink"
              >
                {evidence.publisher} · {evidence.source_label}
              </a>
            ) : null;
          })}
        </div>
        {test.amendment_history.length ? (
          <div className="md:col-span-2 border-l-2 border-amber pl-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">Amendment history</p>
            {test.amendment_history.map((item) => (
              <div key={item.lock_date} className="mt-3 space-y-2 text-xs leading-5 text-muted">
                <p><strong className="text-ink">Original:</strong> {item.original_statement}</p>
                <p><strong className="text-ink">Amended:</strong> {item.amendment}</p>
                <p>{item.rationale}</p>
                <p className="font-mono">Locked {formatIsoDate(item.lock_date)}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function FalsifierBoard() {
  const dated = canonical.falsifiers
    .filter((item) => item.kind === "dated-tripwire")
    .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"));
  const monitors = canonical.falsifiers.filter((item) => item.kind === "structural-monitor");
  return (
    <div>
      <PageHeader viewId="falsifiers" />
      <section id="dated" className="scroll-mt-28">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan/10 text-cyan"><CalendarClock size={17} /></span>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink">Dated tripwires</h2>
            <p className="text-sm text-muted">Locked review dates and stated consequences.</p>
          </div>
        </div>
        <div className="space-y-4">
          {dated.map((item) => <TestCard key={item.id} test={item} />)}
        </div>
      </section>
      <section id="monitors" className="mt-14 scroll-mt-28">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-violet/10 text-violet"><Radar size={17} /></span>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink">Structural monitors</h2>
            <p className="text-sm text-muted">Important observations without invented quantitative deadlines.</p>
          </div>
        </div>
        <div className="space-y-4">
          {monitors.map((item) => <TestCard key={item.id} test={item} />)}
        </div>
      </section>
    </div>
  );
}
