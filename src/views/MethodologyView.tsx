import { ArrowUpRight, Database, FileCheck2, Gauge, History, Scale } from "lucide-react";
import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { DataCard, PageHeader } from "../components/Primitives";

const iconByIndex = [FileCheck2, Gauge, Scale, History, Database];

export function MethodologyView() {
  const principles = [
    { title: "Public scoring", text: canonical.meta.scoring_convention },
    { title: "Capability rubric", text: canonical.meta.progress_methodology },
    { title: `${canonical.meta.internal_lag_months}-month internal lag`, text: canonical.meta.internal_lag_explanation },
    { title: "Append-only revisions", text: canonical.meta.update_protocol },
    { title: "Distribution discipline", text: canonical.meta.distribution_warning },
  ];
  return (
    <div>
      <PageHeader viewId="methodology" />
      <div className="mb-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-6">
        {principles.map((principle, index) => {
          const Icon = iconByIndex[index];
          return (
            <div
              key={principle.title}
              className={`bg-panel p-5 md:p-6 ${index < 2 ? "lg:col-span-3" : "lg:col-span-2"} ${index === 4 ? "md:col-span-2 lg:col-span-2" : ""}`}
            >
              <Icon size={18} className="mb-5 text-cyan" />
              <h2 className="text-sm font-semibold text-ink">{principle.title}</h2>
              <p className="mt-3 text-xs leading-5 text-muted">{principle.text}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <DataCard>
          <div className="border-b border-line p-5 md:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan">Track provenance</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">What each lane represents</h2>
          </div>
          <div className="divide-y divide-line">
            {canonical.meta.tracks.map((track) => (
              <div key={track.id} className="p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track.color }} />
                  <h3 className="text-sm font-semibold text-ink">{track.name}</h3>
                  <span className="rounded border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">{track.thesis}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{track.description}</p>
                <div className="mt-3">
                  {track.source_url ? (
                    <a href={track.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan hover:text-ink">{track.source_label} <ArrowUpRight size={12} /></a>
                  ) : <span className="text-xs text-muted">{track.source_label}</span>}
                </div>
              </div>
            ))}
          </div>
        </DataCard>
        <div className="space-y-6">
          <DataCard className="p-5 md:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan">Milestone ladder</p>
            <div className="mt-5 space-y-5">
              {canonical.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative border-l border-line pl-5">
                  <span className="absolute -left-1 top-1 h-2 w-2 rounded-full bg-cyan" />
                  <span className="font-mono text-[9px] text-muted">{String(index + 1).padStart(2, "0")} · {milestone.code}</span>
                  <h3 className="mt-1 text-sm font-semibold text-ink">{milestone.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{milestone.operational_definition}</p>
                </div>
              ))}
            </div>
          </DataCard>
          <DataCard className="p-5 md:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan">Review cadence</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-ink">{formatIsoDate(canonical.meta.next_review_date)}</p>
            <p className="mt-3 text-xs leading-5 text-muted">{canonical.meta.progress_disclaimer}</p>
          </DataCard>
        </div>
      </div>
    </div>
  );
}
