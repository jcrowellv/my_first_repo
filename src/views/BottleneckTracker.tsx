import { canonical, evidenceById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { DataCard, PageHeader, SampleBadge, StatusBadge } from "../components/Primitives";
import { Markdown } from "../components/Markdown";

const steps = ["not-yet-testable", "holding", "strained", "broken"] as const;

const stepFill: Record<(typeof steps)[number], string> = {
  "not-yet-testable": "bg-muted",
  holding: "bg-green",
  strained: "bg-amber",
  broken: "bg-rose",
};

const stepText: Record<(typeof steps)[number], string> = {
  "not-yet-testable": "text-muted",
  holding: "text-green",
  strained: "text-amber",
  broken: "text-rose",
};

export function BottleneckTracker() {
  return (
    <div>
      <PageHeader viewId="bottlenecks" />
      <div className="grid gap-5 xl:grid-cols-2">
        {canonical.bottlenecks.map((bottleneck) => {
          const currentIndex = steps.indexOf(bottleneck.status);
          return (
            <DataCard key={bottleneck.id} sample={bottleneck.sample}>
              <div className="border-b border-line p-5 md:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <StatusBadge value={bottleneck.status} />
                  {bottleneck.sample ? <SampleBadge note={bottleneck.sample_note} /> : null}
                </div>
                <h2 className="text-xl font-semibold tracking-[-0.025em] text-ink">{bottleneck.name}</h2>
                <div className="mt-3 text-sm leading-6 text-muted"><Markdown>{bottleneck.mechanism}</Markdown></div>
              </div>
              <div className="border-b border-line p-5 md:p-6">
                <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Status ladder</p>
                <div className="grid grid-cols-4 gap-1">
                  {steps.map((step, index) => (
                    <div key={step} className="text-center">
                      <div
                        className={`mb-2 h-1.5 rounded-full ${index <= currentIndex ? stepFill[bottleneck.status] : "bg-line"} ${index < currentIndex ? "opacity-40" : ""}`}
                      />
                      <span className={`font-mono text-[8px] uppercase tracking-[0.08em] ${index === currentIndex ? stepText[bottleneck.status] : "text-muted"}`}>
                        {step.replaceAll("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-b border-line p-5 md:p-6">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Next status-change criterion</p>
                <p className="text-sm leading-6 text-ink">{bottleneck.status_change_criteria}</p>
              </div>
              <div className="p-5 md:p-6">
                <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">History</p>
                <div className="relative space-y-4 border-l border-line pl-5">
                  {bottleneck.history.map((entry) => (
                    <div key={`${bottleneck.id}-${entry.date}`} className="relative">
                      <span className="absolute -left-[23px] top-1 h-1.5 w-1.5 rounded-full bg-cyan" />
                      <div className="flex flex-wrap items-center gap-2"><time className="text-xs text-ink">{formatIsoDate(entry.date)}</time><StatusBadge value={entry.status} /></div>
                      <p className="mt-2 text-xs leading-5 text-muted">{entry.note}</p>
                      {entry.evidence_refs.map((ref) => <span key={ref} className="mt-2 block font-mono text-[9px] text-cyan">{evidenceById.get(ref)?.source_label}</span>)}
                    </div>
                  ))}
                </div>
              </div>
            </DataCard>
          );
        })}
      </div>
    </div>
  );
}
