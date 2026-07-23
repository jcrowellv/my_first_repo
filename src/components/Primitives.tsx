import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { canonical } from "../lib/data";

const statusStyles: Record<string, string> = {
  watching: "border-cyan/25 bg-cyan/10 text-cyan",
  met: "border-green/25 bg-green/10 text-green",
  "not-met": "border-rose/25 bg-rose/10 text-rose",
  inconclusive: "border-amber/25 bg-amber/10 text-amber",
  "not-arrived": "border-line bg-raised text-muted",
  arrived: "border-green/35 bg-green/10 text-green",
  contested: "border-amber/35 bg-amber/10 text-amber",
  easing: "border-green/25 bg-green/10 text-green",
  mixed: "border-amber/25 bg-amber/10 text-amber",
  binding: "border-rose/25 bg-rose/10 text-rose",
  unresolved: "border-line bg-raised text-muted",
  high: "border-cyan/35 bg-cyan/10 text-cyan",
  medium: "border-amber/35 bg-amber/10 text-amber",
  low: "border-line bg-raised text-muted",
  documented: "border-green/25 bg-green/10 text-green",
  developing: "border-cyan/25 bg-cyan/10 text-cyan",
  strained: "border-rose/25 bg-rose/10 text-rose",
  unknown: "border-line bg-raised text-muted",
  narrowing: "border-green/25 bg-green/10 text-green",
  partial: "border-amber/25 bg-amber/10 text-amber",
  strong: "border-green/25 bg-green/10 text-green",
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
    <header className="mb-10 max-w-4xl">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">
        {view.eyebrow}
      </p>
      <h1 className="text-balance font-serif text-4xl font-semibold tracking-[-0.015em] text-ink md:text-[54px] md:leading-[1.08]">
        {view.title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
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
      className={`relative overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument ${className}`}
    >
      {sample ? <SampleWatermark>SAMPLE</SampleWatermark> : null}
      {children}
    </article>
  );
}
