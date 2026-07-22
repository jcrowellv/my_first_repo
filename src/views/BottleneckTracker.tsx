import { ChevronDown } from "lucide-react";
import { canonical, evidenceById } from "../lib/data";
import { PageHeader, StatusBadge } from "../components/Primitives";

const statusNote: Record<string, string> = {
  easing: "Evidence says this constraint is loosening.",
  mixed: "The evidence pulls in both directions.",
  binding: "This remains a live constraint on faster takeoff.",
  unresolved: "Public evidence cannot yet settle this mechanism.",
};

export function BottleneckTracker() {
  return (
    <div>
      <PageHeader viewId="bottlenecks" />
      <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(["easing", "mixed", "binding", "unresolved"] as const).map((status) => <div key={status} className="rounded-2xl border border-line bg-panel p-4"><StatusBadge value={status} /><p className="mt-3 text-xs leading-5 text-muted">{statusNote[status]}</p></div>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {canonical.bottlenecks.map((driver) => (
          <details key={driver.id} className="group rounded-2xl border border-line bg-panel shadow-instrument">
            <summary className="cursor-pointer list-none p-5 md:p-6">
              <div className="flex items-start justify-between gap-5">
                <div><div className="mb-3 flex flex-wrap items-center gap-2"><StatusBadge value={driver.status} /><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{driver.confidence} confidence</span></div><h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">{driver.name}</h2><p className="mt-2 text-sm leading-6 text-muted">{driver.assessment}</p></div>
                <ChevronDown size={18} className="mt-1 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </div>
            </summary>
            <div className="space-y-6 border-t border-line bg-raised/30 p-5 md:p-6">
              <div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Mechanism</p><p className="mt-2 text-sm leading-7 text-ink">{driver.mechanism}</p></div>
              <div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Next signal</p><p className="mt-2 text-sm leading-7 text-ink">{driver.next_signal}</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-green">Supporting evidence</p><div className="space-y-2">{driver.evidence_for.map((ref) => { const item = evidenceById.get(ref); return item ? <a key={ref} href={item.source_url} target="_blank" rel="noreferrer" className="block text-xs leading-5 text-cyan hover:text-ink">{item.publisher} · {item.source_label}</a> : null; })}</div></div>
                <div><p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-rose">Counterevidence</p><div className="space-y-2">{driver.evidence_against.map((ref) => { const item = evidenceById.get(ref); return item ? <a key={ref} href={item.source_url} target="_blank" rel="noreferrer" className="block text-xs leading-5 text-cyan hover:text-ink">{item.publisher} · {item.source_label}</a> : null; })}</div></div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
