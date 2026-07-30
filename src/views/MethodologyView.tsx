import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  ChevronDown,
  Database,
  Download,
  FileCheck2,
  GitBranch,
  History,
  Layers3,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { canonical, getProgressRange } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { DataCard, PageHeader, StatusBadge } from "../components/Primitives";
import { SectionNav } from "../components/NavigationPrimitives";

const stepIcons = [Braces, FileCheck2, Layers3, Scale, History];

const sectionItems = [
  { id: "method-quick", label: "60-second method" },
  { id: "method-score", label: "Scoring" },
  { id: "method-evidence", label: "Evidence" },
  { id: "method-forecasts", label: "Forecast rules" },
  { id: "method-audit", label: "Audit & limits" },
];

function MethodAtAGlance() {
  return (
    <section id="method-quick" aria-labelledby="method-quick-title" className="scroll-mt-36">
      <div className="overflow-hidden rounded-[28px] border border-line bg-panel shadow-instrument">
        <div className="grid gap-px bg-line lg:grid-cols-[.9fr_1.1fr]">
          <div className="bg-ink p-6 text-panel md:p-8 lg:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-cyan">
              The 60-second method
            </p>
            <h2
              id="method-quick-title"
              className="mt-4 max-w-lg font-serif text-3xl font-semibold tracking-[-0.02em] md:text-4xl"
            >
              {canonical.methodology.headline}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-canvas/70">
              {canonical.methodology.summary}
            </p>
            <div className="mt-7 rounded-2xl border border-canvas/15 bg-canvas/[0.05] p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-canvas/50">
                The question underneath every update
              </p>
              <p className="mt-2 text-sm leading-6 text-panel/90">
                {canonical.methodology.core_question}
              </p>
            </div>
          </div>
          <ol className="grid gap-px bg-line sm:grid-cols-2">
            {canonical.methodology.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <li
                  key={step.id}
                  className={`bg-panel p-5 md:p-6 ${
                    index === canonical.methodology.steps.length - 1
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan/10 text-cyan">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[9px] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-ink">{step.label}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-muted">{step.summary}</p>
                  <details className="group mt-4 border-t border-line pt-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-cyan">
                      Why this step matters
                      <ChevronDown
                        size={14}
                        className="transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="mt-3 text-xs leading-5 text-muted">{step.detail}</p>
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink">
                      Output · {step.output}
                    </p>
                  </details>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ScoreSection() {
  const example =
    canonical.capability_progress.find((item) => item.label === "Agent-2") ??
    canonical.capability_progress[0];
  const range = getProgressRange(example);

  return (
    <section id="method-score" aria-labelledby="method-score-title" className="scroll-mt-36">
      <details className="group">
        <summary className="grid cursor-pointer list-none items-center gap-5 rounded-[24px] border border-line bg-panel p-5 shadow-instrument sm:grid-cols-[1fr_auto] md:p-6">
          <span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              Read the number correctly
            </span>
            <span
              id="method-score-title"
              className="mt-2 block font-serif text-2xl font-semibold tracking-[-0.015em] text-ink md:text-3xl"
            >
              A rubric estimate, with the judgment left visible
            </span>
            <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted">
              Weighted criteria produce a central estimate; explicit low-high bounds expose
              judgment uncertainty.
            </span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block font-serif text-3xl font-semibold text-ink">
                {example.score}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                {range.low}–{range.high} range
              </span>
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-raised text-muted">
              <ChevronDown
                size={17}
                className="transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
          </span>
        </summary>
        <div className="mt-6">
          <p className="mb-5 max-w-3xl text-sm leading-6 text-muted">
            {canonical.methodology.score_rule}
          </p>
          <div className="grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
        <DataCard className="bg-ink text-panel">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-canvas/55">
                Worked example · {example.label}
              </p>
              <StatusBadge value={example.confidence} />
            </div>
            <div className="mt-7 flex items-end gap-4">
              <span className="font-serif text-7xl font-semibold leading-none tracking-[-0.06em]">
                {example.score}
              </span>
              <span className="mb-2 text-sm text-canvas/60">central estimate</span>
            </div>
            <div className="mt-6">
              <div className="relative h-3 overflow-hidden rounded-full bg-canvas/15">
                <div
                  className="absolute inset-y-0 rounded-full bg-cyan/45"
                  style={{ left: `${range.low}%`, width: `${range.high - range.low}%` }}
                  aria-hidden="true"
                />
                <span
                  className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-panel"
                  style={{ left: `calc(${example.score}% - 2px)` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.13em] text-canvas/50">
                <span>{range.low}% low</span>
                <span>{range.high}% high</span>
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-canvas/75">{example.summary}</p>
            <p className="mt-4 border-t border-canvas/15 pt-4 text-xs leading-5 text-canvas/55">
              {example.confidence_note}
            </p>
          </div>
        </DataCard>

        <DataCard>
          <div className="border-b border-line p-5 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan">
                  What makes up {example.score}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">
                  Four criteria, weighted—not averaged
                </h3>
              </div>
              <span className="rounded-full bg-raised px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                Σ weight × completion
              </span>
            </div>
          </div>
          <div className="divide-y divide-line">
            {example.criteria.map((criterion) => {
              const band = canonical.methodology.score_bands.find(
                (item) => item.id === criterion.rating,
              );
              return (
                <div key={criterion.id} className="p-5 md:px-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <span className="text-sm font-semibold text-ink">{criterion.label}</span>
                      <span className="ml-2 text-xs text-muted">
                        weight {Math.round(criterion.weight * 100)}%
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan">
                      {band?.label} · {Math.round(criterion.completion * 100)}%
                    </span>
                  </div>
                  <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-raised">
                    <div
                      className="absolute inset-y-0 rounded-full bg-cyan/25"
                      style={{
                        left: `${criterion.completion_range.low * 100}%`,
                        width: `${
                          (criterion.completion_range.high -
                            criterion.completion_range.low) *
                          100
                        }%`,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-cyan"
                      style={{ left: `${criterion.completion * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted">{criterion.rationale}</p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                    {criterion.evidence_refs.length} records considered
                    {criterion.counterevidence_refs.length
                      ? ` · ${criterion.counterevidence_refs.length} explicit counter${
                          criterion.counterevidence_refs.length === 1 ? "" : "s"
                        }`
                      : " · no separate counterevidence tagged"}
                  </p>
                </div>
              );
            })}
          </div>
        </DataCard>
          </div>

          <details className="group/bands mt-5 rounded-2xl border border-line bg-panel shadow-instrument">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink md:px-6">
              See the five rating bands
              <ChevronDown
                size={16}
                className="text-muted transition-transform group-open/bands:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid gap-px border-t border-line bg-line sm:grid-cols-5">
              {canonical.methodology.score_bands.map((band) => (
                <div key={band.id} className="bg-panel p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-cyan">
                    {Math.round(band.min * 100)}
                    {band.max !== band.min ? `–${Math.round(band.max * 100)}` : ""}%
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">{band.label}</p>
                  <p className="mt-2 text-xs leading-5 text-muted">{band.plain_language}</p>
                </div>
              ))}
            </div>
            <p className="border-t border-line px-5 py-4 text-xs leading-5 text-muted md:px-6">
              {canonical.methodology.uncertainty_rule}
            </p>
          </details>
        </div>
      </details>
    </section>
  );
}

function EvidenceSection() {
  return (
    <section id="method-evidence" aria-labelledby="method-evidence-title" className="scroll-mt-36">
      <details className="group">
        <summary className="grid cursor-pointer list-none items-center gap-5 rounded-[24px] border border-line bg-panel p-5 shadow-instrument sm:grid-cols-[1fr_auto] md:p-6">
          <span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              Evidence, without the magic grade
            </span>
            <span
              id="method-evidence-title"
              className="mt-2 block font-serif text-2xl font-semibold tracking-[-0.015em] text-ink md:text-3xl"
            >
              Three questions stay separate
            </span>
            <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted">
              Relevance, independence, and verification answer different questions; no
              composite score is allowed to blur them.
            </span>
          </span>
          <span className="flex items-center gap-3">
            <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
              {canonical.methodology.evidence_axes.map((axis) => (
                <span
                  key={axis.id}
                  className="rounded-full bg-raised px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted"
                >
                  {axis.label}
                </span>
              ))}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-raised text-muted">
              <ChevronDown
                size={17}
                className="transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
          </span>
        </summary>
        <div className="mt-6 grid gap-6 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
        <div className="lg:sticky lg:top-36">
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted">
            A result can be highly relevant and still preliminary. It can be independent and
            still poorly matched to the threshold. Keeping these axes separate makes that
            tension readable instead of burying it in a composite “quality” score.
          </p>
          <Link
            to="/evidence"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-panel hover:bg-cyan"
          >
            Browse the evidence labels <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-4">
          {canonical.methodology.evidence_axes.map((axis, index) => (
            <details
              key={axis.id}
              className="group/axis overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument"
            >
              <summary className="grid min-h-20 cursor-pointer list-none grid-cols-[38px_1fr_auto] items-center gap-4 p-5 md:p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan/10 font-mono text-[10px] text-cyan">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{axis.label}</span>
                  <span className="mt-1 block text-[13px] leading-5 text-muted">
                    {axis.question}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className="text-muted transition-transform group-open/axis:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="border-t border-line px-5 py-5 md:px-6">
                <p className="text-sm leading-6 text-muted">{axis.summary}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {axis.values.map((value) => (
                    <div key={value.value} className="rounded-xl bg-raised/65 p-4">
                      <p className="text-xs font-semibold text-ink">{value.label}</p>
                      <p className="mt-1.5 text-xs leading-5 text-muted">
                        {value.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
      </details>
    </section>
  );
}

function ForecastRulesSection() {
  const [selectedTrackId, setSelectedTrackId] = useState(
    canonical.meta.tracks[0].id,
  );
  const selectedTrack =
    canonical.meta.tracks.find((track) => track.id === selectedTrackId) ??
    canonical.meta.tracks[0];
  const lagScenarios = canonical.methodology.lag_scenarios_months;

  return (
    <section
      id="method-forecasts"
      aria-labelledby="method-forecasts-title"
      className="scroll-mt-36"
    >
      <details className="group">
        <summary className="grid cursor-pointer list-none items-center gap-5 rounded-[24px] border border-line bg-panel p-5 shadow-instrument sm:grid-cols-[1fr_auto] md:p-6">
          <span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              Forecast discipline
            </span>
            <span
              id="method-forecasts-title"
              className="mt-2 block font-serif text-2xl font-semibold tracking-[-0.015em] text-ink md:text-3xl"
            >
              Compare the lanes without blending them
            </span>
            <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted">
              Four source-faithful tracks remain separate; outside views keep their own
              definitions and the lag never rewrites stored dates.
            </span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden items-center gap-2 sm:flex" aria-hidden="true">
              {canonical.meta.tracks.map((track) => (
                <span
                  key={track.id}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: track.color }}
                />
              ))}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-raised text-muted">
              <ChevronDown
                size={17}
                className="transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
          </span>
        </summary>
        <div className="mt-6">
          <p className="mb-5 max-w-3xl text-sm leading-6 text-muted">
            {canonical.methodology.forecast_rule}
          </p>
          <div className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
        <DataCard>
          <div className="border-b border-line p-5 md:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan">
              Select a source lane
            </p>
            <div className="mt-4 flex flex-wrap gap-2" role="list">
              {canonical.meta.tracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  aria-pressed={selectedTrack.id === track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                    selectedTrack.id === track.id
                      ? "border-ink bg-ink text-panel"
                      : "border-line bg-panel text-muted hover:border-cyan/40 hover:text-ink"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: track.color }}
                    aria-hidden="true"
                  />
                  {track.short_name}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold text-ink">{selectedTrack.name}</h3>
              <span className="rounded border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                {selectedTrack.thesis}
              </span>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
              {selectedTrack.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              {selectedTrack.source_url ? (
                <a
                  href={selectedTrack.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-cyan hover:text-ink"
                >
                  {selectedTrack.source_label} <ArrowUpRight size={12} />
                </a>
              ) : (
                <span className="text-muted">{selectedTrack.source_label}</span>
              )}
              <Link to="/forecasts" className="inline-flex items-center gap-1.5 font-medium text-cyan">
                Open its distributions <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </DataCard>

        <DataCard className="p-5 md:p-6">
          <div className="flex items-start gap-3">
            <SlidersHorizontal size={18} className="mt-0.5 shrink-0 text-cyan" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan">
                Lag sensitivity · not a date adjustment
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink">
                How late might public evidence appear?
              </h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            {canonical.methodology.lag_rule}
          </p>
          <div className="relative mt-7">
            <div className="absolute left-4 right-4 top-3 h-px bg-line" aria-hidden="true" />
            <div className="relative grid grid-cols-3">
              {lagScenarios.map((months, index) => (
                <div key={months} className="text-center">
                  <span
                    className={`mx-auto grid h-7 w-7 place-items-center rounded-full border ${
                      index === 1
                        ? "border-cyan bg-cyan text-panel"
                        : "border-line bg-panel text-muted"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <p className="mt-2 text-sm font-semibold text-ink">{months} months</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                    {index === 0
                      ? "No lag"
                      : index === 1
                        ? "Central"
                        : "Long lag"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 rounded-xl bg-raised p-3 text-xs leading-5 text-muted">
            Stored forecast dates, rubric scores, and milestone statuses are identical in all
            three interpretations.
          </p>
        </DataCard>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {canonical.methodology.decision_rules.map((rule) => (
              <div key={rule.title} className="rounded-2xl border border-line bg-panel p-4">
                <ShieldCheck size={15} className="text-cyan" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold text-ink">{rule.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted">{rule.text}</p>
              </div>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}

function AuditSection() {
  const recordCounts = useMemo(
    () => [
      ["Sources", canonical.evidence.length],
      ["Forecast records", canonical.forecasts.length],
      ["Locked tests", canonical.falsifiers.length],
      ["Logged changes", canonical.changelog.length],
    ],
    [],
  );

  return (
    <section id="method-audit" aria-labelledby="method-audit-title" className="scroll-mt-36">
      <details className="group">
        <summary className="grid cursor-pointer list-none items-center gap-5 rounded-[24px] border border-line bg-panel p-5 shadow-instrument sm:grid-cols-[1fr_auto] md:p-6">
          <span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              Audit kit · known limits
            </span>
            <span
              id="method-audit-title"
              className="mt-2 block font-serif text-2xl font-semibold tracking-[-0.015em] text-ink md:text-3xl"
            >
              Inspect the record, not just the conclusion
            </span>
            <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted">
              Download the canonical data, inspect every revision, and open the failure
              modes the method cannot eliminate.
            </span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block font-serif text-3xl font-semibold text-ink">
                {canonical.evidence.length}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                source records
              </span>
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-raised text-muted">
              <ChevronDown
                size={17}
                className="transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
          </span>
        </summary>
        <div className="mt-6 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <DataCard className="bg-ink text-panel">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Database size={18} className="text-cyan" />
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-canvas/55">
                Audit kit
              </p>
            </div>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[-0.02em]">
              Inspect the record, not just the conclusion
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-canvas/15">
              {recordCounts.map(([label, value]) => (
                <div key={label} className="bg-ink p-4">
                  <span className="block font-serif text-3xl font-semibold">{value}</span>
                  <span className="mt-1 block text-xs text-canvas/55">{label}</span>
                </div>
              ))}
            </div>
            <dl className="mt-6 space-y-3 border-t border-canvas/15 pt-5 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-canvas/50">Method version</dt>
                <dd className="font-medium text-panel">{canonical.methodology.version}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-canvas/50">Reviewed</dt>
                <dd className="font-medium text-panel">
                  {formatIsoDate(canonical.methodology.reviewed_on)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-canvas/50">Next scheduled review</dt>
                <dd className="font-medium text-panel">
                  {formatIsoDate(canonical.meta.next_review_date)}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="data/canonical.json"
                download
                className="inline-flex items-center gap-1.5 rounded-full bg-panel px-4 py-2.5 text-xs font-semibold text-ink hover:bg-cyan hover:text-panel"
              >
                <Download size={13} /> Download data
              </a>
              <Link
                to="/changelog"
                className="inline-flex items-center gap-1.5 rounded-full border border-canvas/20 px-4 py-2.5 text-xs font-semibold text-panel hover:border-cyan"
              >
                <GitBranch size={13} /> Changelog
              </Link>
            </div>
          </div>
        </DataCard>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose">
            Known limits
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
            Where the method can still be wrong
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Limitations are part of the instrument. Open a concern to see both the failure
            mode and the current mitigation; none of these mitigations makes the problem
            disappear.
          </p>
          <div className="mt-5 space-y-3">
            {canonical.methodology.limitations.map((limitation) => (
              <details
                key={limitation.title}
                className="group/limit rounded-2xl border border-line bg-panel shadow-instrument"
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink">
                  {limitation.title}
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-muted transition-transform group-open/limit:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="grid gap-4 border-t border-line px-5 py-4 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-rose">
                      Risk
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted">{limitation.risk}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cyan">
                      Current mitigation
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      {limitation.mitigation}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/glossary"
              className="inline-flex items-center rounded-full border border-line bg-panel px-4 py-2.5 text-xs font-medium text-ink hover:border-cyan/40"
            >
              Definitions & milestone ladder
            </Link>
            <Link
              to="/falsifiers"
              className="inline-flex items-center rounded-full border border-line bg-panel px-4 py-2.5 text-xs font-medium text-ink hover:border-cyan/40"
            >
              Locked tests
            </Link>
          </div>
        </div>
        </div>
      </details>
    </section>
  );
}

export function MethodologyView() {
  return (
    <div>
      <PageHeader viewId="methodology" />
      <SectionNav items={sectionItems} />
      <div className="space-y-20 md:space-y-24">
        <MethodAtAGlance />
        <ScoreSection />
        <EvidenceSection />
        <ForecastRulesSection />
        <AuditSection />
      </div>
    </div>
  );
}
