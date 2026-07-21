import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { canonical } from "../lib/data";

const statusStyles: Record<string, string> = {
  open: "border-cyan/35 bg-cyan/10 text-cyan",
  passed: "border-green/35 bg-green/10 text-green",
  pushed: "border-amber/35 bg-amber/10 text-amber",
  fired: "border-rose/35 bg-rose/10 text-rose",
  "not-arrived": "border-line bg-raised text-muted",
  arrived: "border-green/35 bg-green/10 text-green",
  contested: "border-amber/35 bg-amber/10 text-amber",
  "not-yet-testable": "border-line bg-raised text-muted",
  holding: "border-green/35 bg-green/10 text-green",
  strained: "border-amber/35 bg-amber/10 text-amber",
  broken: "border-rose/35 bg-rose/10 text-rose",
  high: "border-rose/35 bg-rose/10 text-rose",
  medium: "border-amber/35 bg-amber/10 text-amber",
  low: "border-line bg-raised text-muted",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${
        statusStyles[value] ?? statusStyles["not-arrived"]
      }`}
    >
      {value.replaceAll("-", " ")}
    </span>
  );
}

export function SampleBadge({ note }: { note?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border border-amber/50 bg-amber/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber"
      title={note ?? canonical.meta.sample_warning}
    >
      <AlertTriangle size={11} aria-hidden="true" />
      Sample
    </span>
  );
}

export function SampleWatermark({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span className="absolute -right-10 top-8 rotate-45 border-y border-amber/15 px-14 py-1 font-mono text-[10px] font-bold tracking-[0.34em] text-amber/20">
        {children}
      </span>
    </div>
  );
}

export function PageHeader({ viewId }: { viewId: string }) {
  const view = canonical.meta.views.find((item) => item.id === viewId);
  if (!view) return null;
  return (
    <header className="mb-8 border-b border-line pb-7">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">
        {view.eyebrow}
      </p>
      <h1 className="max-w-4xl text-balance text-3xl font-semibold tracking-[-0.035em] text-ink md:text-5xl">
        {view.title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-muted md:text-base">
        {view.description}
      </p>
    </header>
  );
}

export function DataCard({
  children,
  className = "",
  sample = false,
}: {
  children: ReactNode;
  className?: string;
  sample?: boolean;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border border-line bg-panel shadow-instrument ${className}`}
    >
      {sample ? <SampleWatermark>SAMPLE</SampleWatermark> : null}
      {children}
    </article>
  );
}
