import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  Database,
  Eye,
  GitBranch,
  LineChart,
  ShieldCheck,
  Waves,
  X,
} from "lucide-react";
import { Link } from "react-router";
import type { CapabilityProgress, Forecast, QuantileDate } from "../schema";
import {
  canonical,
  evidenceById,
  getProgressRange,
  milestonesById,
  tracksById,
} from "../lib/data";
import { displayQuantileLabel, formatIsoDate } from "../lib/dates";
import { DataCard, StatusBadge } from "../components/Primitives";
import { ChartScroller } from "../components/NavigationPrimitives";

const todayDate = new Date();
const startOfYear = new Date(todayDate.getFullYear(), 0, 1);
const startOfNextYear = new Date(todayDate.getFullYear() + 1, 0, 1);
const TODAY =
  todayDate.getFullYear() +
  (todayDate.getTime() - startOfYear.getTime()) /
    (startOfNextYear.getTime() - startOfYear.getTime());

/* ---------- State of play ---------- */

const briefingIcon = {
  capability: Clock3,
  control: ShieldCheck,
  diffusion: Waves,
};

const paceStatusTone = {
  confirmed: "bg-emerald-400",
  ahead: "bg-cyan",
  "on-track": "bg-violet",
  behind: "bg-amber",
  emerging: "bg-rose",
  "not-testable": "bg-canvas/35",
};

function BriefingHero() {
  const briefing = canonical.meta.briefing;
  const agentTwo =
    canonical.capability_progress.find((item) => item.label === "Agent-2") ??
    canonical.capability_progress[1];
  const agentTwoRange = getProgressRange(agentTwo);
  const nextTest = canonical.falsifiers.find(
    (item) => item.kind === "dated-tripwire" && item.status === "watching",
  );
  const statusTotal = briefing.pace_statuses.reduce((sum, item) => sum + item.value, 0);

  return (
    <section
      id="state"
      className="scroll-mt-28 overflow-hidden rounded-[28px] border border-line bg-panel shadow-instrument"
    >
      <div className="grid lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative p-6 md:p-9 lg:p-11">
          <div
            className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-cyan via-violet to-rose"
            aria-hidden="true"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            {briefing.eyebrow} {formatIsoDate(briefing.as_of)}
          </p>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-[42px] font-semibold leading-[1.02] tracking-[-0.025em] text-ink md:text-[60px]">
            {briefing.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            {briefing.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/#paths"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-panel transition-colors hover:bg-cyan"
            >
              Take the 2-minute tour <ArrowRight size={15} />
            </Link>
            <Link
              to="/forecasts"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-cyan/40"
            >
              Compare forecasts
            </Link>
          </div>
        </div>
        <aside className="border-t border-line bg-ink p-6 text-panel md:p-8 lg:border-l lg:border-t-0 lg:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-canvas/60">
              The plain-English read
            </p>
            <span className="rounded-full border border-canvas/15 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.13em] text-canvas/55">
              public record
            </span>
          </div>
          <div className="mt-5 divide-y divide-canvas/15">
            <div className="pb-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cyan">
                What can systems do now?
              </p>
              <p className="mt-2 font-serif text-2xl font-semibold">
                Agent-1 is public. Agent-2 is partial.
              </p>
              <p className="mt-2 text-[13px] leading-5 text-canvas/65">
                The Agent-2 central rubric estimate is {agentTwo.score}%, with a{" "}
                {agentTwoRange.low}–{agentTwoRange.high}% judgment range. That is
                completion, not probability.
              </p>
            </div>
            <div className="py-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-violet">
                What do the forecasts disagree about?
              </p>
              <p className="mt-2 font-serif text-2xl font-semibold">
                Mostly the speed of takeoff.
              </p>
              <p className="mt-2 hidden text-[13px] leading-5 text-canvas/65 sm:block">
                The lanes share a capability sequence, then diverge on how long research
                taste, verification, and coordination continue to bind.
              </p>
            </div>
            <div className="pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-rose">
                What should change the view next?
              </p>
              <p className="mt-2 font-serif text-2xl font-semibold">
                {nextTest?.title ?? "The next locked test"}
              </p>
              <Link
                to="/falsifiers"
                className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-cyan hover:text-panel"
              >
                {nextTest?.deadline
                  ? formatIsoDate(nextTest.deadline)
                  : nextTest?.review_label}{" "}
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <details className="group mt-6 rounded-2xl border border-canvas/15 bg-canvas/[0.04]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-xs font-medium text-canvas/70">
              How is the frozen scenario tracking?
              <ChevronDown
                size={14}
                className="transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="space-y-4 border-t border-canvas/15 px-4 py-4">
              <div>
                <p className="text-sm font-semibold">
                  {briefing.pace_value} · {briefing.pace_label}
                </p>
                <p className="mt-1 text-xs leading-5 text-canvas/60">
                  {briefing.pace_detail}
                </p>
                <a
                  href={briefing.pace_source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-cyan"
                >
                  Source <ArrowUpRight size={11} />
                </a>
              </div>
              <div className="border-t border-canvas/15 pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-canvas/55">
                    {statusTotal} tracked claims
                  </p>
                  <p className="text-[10px] text-canvas/45">status, not speed</p>
                </div>
                <div
                  className="mt-3 flex h-2 overflow-hidden rounded-full bg-canvas/10"
                  aria-hidden="true"
                >
                  {briefing.pace_statuses.map((status) => (
                    <span
                      key={status.id}
                      className={paceStatusTone[status.id]}
                      style={{ width: `${(status.value / statusTotal) * 100}%` }}
                    />
                  ))}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  {briefing.pace_statuses.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-center justify-between gap-3 text-[10px]"
                    >
                      <dt className="flex min-w-0 items-center gap-2 text-canvas/55">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${paceStatusTone[status.id]}`}
                        />
                        <span className="truncate">{status.label}</span>
                      </dt>
                      <dd className="font-mono text-canvas/80">{status.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[10px] leading-5 text-canvas/50">
                  {briefing.pace_note}
                </p>
              </div>
            </div>
          </details>
        </aside>
      </div>
      <div className="grid border-t border-line md:grid-cols-3">
        {briefing.lenses.map((lens, index) => {
          const Icon = briefingIcon[lens.id];
          return (
            <Link
              key={lens.id}
              to={lens.path}
              className={`group p-5 transition-colors hover:bg-raised/45 md:p-6 ${
                index > 0 ? "border-t border-line md:border-l md:border-t-0" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan/10 text-cyan">
                  <Icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                    {lens.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">{lens.value}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="ml-auto shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-cyan"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const reasoningStepIcon = {
  observation: Eye,
  inference: GitBranch,
  "forecast-impact": LineChart,
};

function EvidenceLinks({ refs, dark = false }: { refs: string[]; dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {refs.map((ref) => {
        const item = evidenceById.get(ref);
        if (!item) return null;
        return (
          <a
            key={ref}
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
              dark
                ? "border-canvas/15 text-canvas/65 hover:border-cyan/50 hover:text-panel"
                : "border-line bg-canvas text-muted hover:border-cyan/40 hover:text-ink"
            }`}
            aria-label={`Open source: ${item.publisher}, ${item.source_label}`}
          >
            {item.publisher}
            <ArrowUpRight size={9} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}

function ReasoningSection() {
  const reasoning = canonical.meta.briefing.reasoning;

  return (
    <section id="reasoning" className="mt-20 scroll-mt-28" aria-labelledby="reasoning-title">
      <details className="group">
        <summary className="grid cursor-pointer list-none items-center gap-5 rounded-[24px] border border-line bg-panel p-5 shadow-instrument sm:grid-cols-[1fr_auto] md:p-7">
          <span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              Evidence-linked conclusion
            </span>
            <span
              id="reasoning-title"
              className="mt-2 block text-balance font-serif text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl"
            >
              Show the reasoning, not just the verdict.
            </span>
            <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted">
              Open the observation → inference → forecast-impact chain, the strongest
              disagreement, and three two-sided cruxes.
            </span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden max-w-[220px] text-right font-mono text-[8px] uppercase leading-4 tracking-[0.12em] text-muted sm:block">
              {reasoning.epistemic_status}
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

        <div className="mt-7 overflow-hidden rounded-[24px] border border-line bg-panel shadow-instrument">
        <div className="grid lg:grid-cols-[1.2fr_.8fr]">
          <div className="p-5 md:p-7 lg:p-8">
            <h3 className="max-w-2xl font-serif text-2xl font-semibold tracking-[-0.02em] text-ink">
              {reasoning.title}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{reasoning.summary}</p>
            <ol className="mt-7">
              {reasoning.steps.map((step, index) => {
                const Icon = reasoningStepIcon[step.id];
                return (
                  <li
                    key={step.id}
                    className={`grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[44px_1fr] ${
                      index > 0 ? "border-t border-line" : ""
                    }`}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan/10 text-cyan">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-cyan">
                        {String(index + 1).padStart(2, "0")} · {step.label}
                      </p>
                      <h4 className="mt-1.5 text-base font-semibold tracking-[-0.01em] text-ink">{step.title}</h4>
                      <p className="mt-2 text-[13px] leading-6 text-muted">{step.detail}</p>
                      <div className="mt-3">
                        <EvidenceLinks refs={step.evidence_refs} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <aside className="border-t border-line bg-ink p-5 text-panel md:p-7 lg:border-l lg:border-t-0 lg:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">{reasoning.disagreement_label}</p>
            <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight tracking-[-0.02em]">
              {reasoning.disagreement_title}
            </h3>
            <p className="mt-4 text-[13px] leading-6 text-canvas/70">{reasoning.disagreement_detail}</p>
            <div className="mt-5 border-t border-canvas/15 pt-5">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-canvas/45">Audit the disagreement</p>
              <EvidenceLinks refs={reasoning.disagreement_evidence_refs} dark />
            </div>
            <Link
              to="/methodology"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-canvas/15 px-4 py-2.5 text-xs font-medium text-panel transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              Read the synthesis rules <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>

      <div className="mt-10 flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Live cruxes</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-ink">What would change this read?</h3>
        </div>
        <Link to="/bottlenecks" className="hidden items-center gap-1 text-sm text-cyan hover:text-ink sm:inline-flex">
          Full driver map <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {reasoning.cruxes.map((crux, index) => (
          <article key={crux.id} className="flex flex-col rounded-2xl border border-line bg-panel p-5 shadow-instrument md:p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Crux {String(index + 1).padStart(2, "0")}</p>
            <h4 className="mt-3 text-base font-semibold leading-6 text-ink">{crux.question}</h4>
            <p className="mt-3 text-[13px] leading-6 text-muted">{crux.current_read}</p>
            <div className="mt-5 space-y-3 border-t border-line pt-4">
              <div className="grid grid-cols-[24px_1fr] gap-2.5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-cyan/10 text-cyan">
                  <ArrowUp size={12} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-cyan">Faster if</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{crux.faster_if}</p>
                </div>
              </div>
              <div className="grid grid-cols-[24px_1fr] gap-2.5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-rose/10 text-rose">
                  <ArrowDown size={12} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-rose">Slower if</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{crux.slower_if}</p>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <EvidenceLinks refs={crux.evidence_refs} />
            </div>
          </article>
        ))}
      </div>
      </details>
    </section>
  );
}

function ReadingPaths() {
  const paths = canonical.meta.reading_paths;
  if (!paths?.length) return null;
  const [activeId, setActiveId] = useState(paths[0].id);
  const active = paths.find((path) => path.id === activeId) ?? paths[0];
  const pathIcons = [Compass, BookOpen, Database];
  const ActiveIcon = pathIcons[paths.findIndex((path) => path.id === active.id)] ?? Compass;

  return (
    <section id="paths" aria-labelledby="paths-title" className="scroll-mt-28">
      <div className="overflow-hidden rounded-[28px] border border-line bg-panel shadow-instrument">
        <div className="grid lg:grid-cols-[.72fr_1.28fr]">
          <div className="border-b border-line bg-raised/55 p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              Three depths · one record
            </p>
            <h2
              id="paths-title"
              className="mt-3 font-serif text-3xl font-semibold tracking-[-0.015em] text-ink"
            >
              Choose how far in you want to go
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Start with the shape of the argument. The data, sources, and technical rules
              stay available when you decide they matter.
            </p>
            <div className="mt-6 space-y-2" role="tablist" aria-label="Reading depth">
              {paths.map((path, index) => {
                const Icon = pathIcons[index];
                const selected = active.id === path.id;
                return (
                  <button
                    key={path.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="reading-path-panel"
                    onClick={() => setActiveId(path.id)}
                    className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors ${
                      selected ? "bg-ink text-panel" : "text-ink hover:bg-panel"
                    }`}
                  >
                    <Icon
                      size={17}
                      className={selected ? "text-cyan" : "text-muted"}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-sm font-semibold">{path.label}</span>
                      <span
                        className={`mt-0.5 block font-mono text-[8px] uppercase tracking-[0.13em] ${
                          selected ? "text-canvas/50" : "text-muted"
                        }`}
                      >
                        {path.duration}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className={`ml-auto ${selected ? "text-cyan" : "text-muted"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div
            id="reading-path-panel"
            role="tabpanel"
            className="flex min-h-[320px] flex-col justify-between p-6 md:min-h-[360px] md:p-8 lg:p-10"
          >
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan/10 text-cyan">
                <ActiveIcon size={19} aria-hidden="true" />
              </span>
              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                {active.duration}
              </p>
              <h3 className="mt-2 font-serif text-3xl font-semibold text-ink">
                {active.label}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                {active.description}
              </p>
              <ol className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                {active.steps.slice(0, 3).map((step, index) => (
                  <li key={step.path}>
                    <Link
                      to={step.path}
                      className="group flex h-full flex-col items-start gap-2 rounded-xl border border-line p-3 hover:border-cyan/40 hover:bg-raised/35 sm:flex-row sm:gap-3 sm:p-3.5"
                    >
                      <span className="font-mono text-[9px] text-cyan">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-medium leading-5 text-ink">
                        {step.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
              {active.steps.length > 3 ? (
                <p className="mt-3 text-xs text-muted">
                  + {active.steps.length - 3} more stops after you begin
                </p>
              ) : null}
            </div>
            <Link
              to={active.steps[0].path}
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-panel hover:bg-cyan"
            >
              Begin with {active.steps[0].label} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Capability progress ---------- */

function CapabilityDetail({ item }: { item: CapabilityProgress }) {
  const milestone = milestonesById.get(item.milestone_id);
  const range = getProgressRange(item);

  return (
    <div
      id="capability-detail"
      role="region"
      aria-labelledby={`capability-tab-${item.id}`}
    >
      <DataCard className="mt-4">
        <div className="grid lg:grid-cols-[.4fr_.6fr]">
          <div className="bg-ink p-6 text-panel md:p-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/55">
              {item.label} · central estimate
            </span>
            <StatusBadge value={item.confidence} />
          </div>
          <div className="mt-6 flex items-end gap-4">
            <span className="font-serif text-7xl font-semibold leading-none tracking-[-0.06em]">
              {item.score}
            </span>
            <span className="mb-2 text-sm text-canvas/55">of 100 rubric points</span>
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
                style={{ left: `calc(${item.score}% - 2px)` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-canvas/45">
              <span>{range.low}% low</span>
              <span>{range.high}% high</span>
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-canvas/55">
            Range = plausible scoring judgment under the same public record, not a
            confidence interval.
          </p>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cyan">
              {milestone?.code} · {formatIsoDate(item.as_of)}
            </span>
            <StatusBadge value={milestone?.status ?? "not-arrived"} />
          </div>
          <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
            {milestone?.name}
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            {milestone?.operational_definition}
          </p>
          <p className="mt-5 rounded-xl bg-raised/65 p-4 text-sm leading-6 text-ink">
            {item.summary}
          </p>
          <p className="mt-4 text-xs leading-5 text-muted">{item.confidence_note}</p>
          <details className="group mt-5 rounded-xl border border-line">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-ink">
              See criteria, weights, and sources
              <ChevronDown
                size={15}
                className="text-muted transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid gap-px border-t border-line bg-line md:grid-cols-2">
              {item.criteria.map((criterion) => {
                const band = canonical.methodology.score_bands.find(
                  (entry) => entry.id === criterion.rating,
                );
                return (
                  <div key={criterion.id} className="bg-panel p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-xs font-semibold text-ink">
                        {criterion.label}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-cyan">
                        {band?.label} · {Math.round(criterion.weight * 100)}% weight
                      </span>
                    </div>
                    <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-raised">
                      <div
                        className="absolute inset-y-0 rounded-full bg-cyan/20"
                        style={{
                          left: `${criterion.completion_range.low * 100}%`,
                          width: `${
                            (criterion.completion_range.high -
                              criterion.completion_range.low) *
                            100
                          }%`,
                        }}
                      />
                      <span
                        className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-cyan"
                        style={{ left: `${criterion.completion * 100}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted">
                      {criterion.rationale}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {criterion.evidence_refs.map((ref) => {
                        const evidence = evidenceById.get(ref);
                        return evidence ? (
                          <a
                            key={ref}
                            href={evidence.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-line px-2 py-1 text-[9px] text-muted hover:border-cyan/40 hover:text-cyan"
                          >
                            {evidence.publisher}
                          </a>
                        ) : null;
                      })}
                    </div>
                    {criterion.counterevidence_refs.length ? (
                      <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.11em] text-rose">
                        {criterion.counterevidence_refs.length} explicit counter
                        {criterion.counterevidence_refs.length === 1 ? "" : "s"} retained
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </details>
        </div>
        </div>
      </DataCard>
    </div>
  );
}

function CapabilitySection() {
  const defaultItem =
    canonical.capability_progress.find((item) => item.label === "Agent-2") ??
    canonical.capability_progress[0];
  const [selectedId, setSelectedId] = useState(defaultItem.id);
  const selected =
    canonical.capability_progress.find((item) => item.id === selectedId) ??
    defaultItem;

  return (
    <section id="capability" aria-labelledby="progress-title" className="scroll-mt-28">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="progress-title" className="font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
            The capability ladder, in one glance
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            These are cumulative job descriptions, not model versions. Pick a level to see
            what is public, what is missing, and how uncertain the scoring judgment is.
          </p>
        </div>
        <Link
          to="/methodology"
          className="inline-flex items-center gap-2 rounded-full bg-raised px-3.5 py-2 text-xs text-muted transition-colors hover:text-ink"
        >
          <CircleHelp size={14} /> {canonical.meta.progress_label}
        </Link>
      </div>
      <div
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line xl:grid-cols-4"
        role="group"
        aria-label="Capability levels"
      >
        {canonical.capability_progress.map((item) => {
          const milestone = milestonesById.get(item.milestone_id);
          const isSelected = selectedId === item.id;
          const range = getProgressRange(item);
          return (
            <button
              key={item.id}
              id={`capability-tab-${item.id}`}
              type="button"
              aria-pressed={isSelected}
              aria-controls="capability-detail"
              onClick={() => setSelectedId(item.id)}
              className={`min-h-[132px] p-5 text-left transition-colors ${
                isSelected ? "bg-ink text-panel" : "bg-panel text-ink hover:bg-raised/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.14em] ${
                    isSelected ? "text-canvas/50" : "text-muted"
                  }`}
                >
                  {item.label}
                </span>
                <span className="font-serif text-3xl font-semibold leading-none">
                  {item.score}
                </span>
              </div>
              <h3 className="mt-5 text-sm font-semibold">{milestone?.name}</h3>
              <div className="mt-3 flex items-center gap-2">
                <div
                  className={`h-1.5 flex-1 overflow-hidden rounded-full ${
                    isSelected ? "bg-canvas/15" : "bg-raised"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-cyan"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span
                  className={`font-mono text-[8px] ${
                    isSelected ? "text-canvas/45" : "text-muted"
                  }`}
                >
                  {range.low}–{range.high}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <CapabilityDetail item={selected} />
    </section>
  );
}

/* ---------- Forecast explorer ---------- */

const chartWidth = 1080;
const plotStart = 196;
const plotEnd = 986;
const rowHeight = 58;
const axisBand = 34;

interface ChartRow {
  forecast: Forecast;
  retired: boolean;
}

function quantileCell(label: string, quantile: QuantileDate | undefined) {
  if (!quantile) return null;
  const provenance: Record<string, string> = {
    registered: "R",
    derived: "D",
    published: "P",
    "model-output": "M",
    sample: "S",
  };
  return (
    <div key={label} className="text-center">
      <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
        {label}
        <sup className="ml-0.5 opacity-70">{provenance[quantile.provenance]}</sup>
      </span>
      <span className="mt-1 block text-sm font-semibold text-ink">{displayQuantileLabel(quantile)}</span>
    </div>
  );
}

function ForecastDetail({ forecast, onClose }: { forecast: Forecast; onClose: () => void }) {
  const track = tracksById.get(forecast.track);
  const retired = canonical.forecasts
    .filter(
      (item) =>
        item.track === forecast.track &&
        item.milestone_id === forecast.milestone_id &&
        item.superseded_by !== null,
    )
    .sort((a, b) => b.committed_on.localeCompare(a.committed_on));
  const q = forecast.distribution;
  return (
    <div className="border-t border-line bg-raised/35 px-5 py-5 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: track?.color }} />
          <span className="text-sm font-semibold text-ink">{track?.name}</span>
          <span className="text-xs text-muted">committed {formatIsoDate(forecast.committed_on)}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close forecast detail"
          className="rounded-full border border-line bg-panel p-1.5 text-muted hover:text-ink"
        >
          <X size={13} />
        </button>
      </div>
      <div className="mt-4 grid max-w-md grid-cols-5 gap-2">
        {quantileCell("p10", q.p10)}
        {quantileCell("p25", q.p25)}
        {quantileCell("p50", q.p50)}
        {quantileCell("p75", q.p75)}
        {quantileCell("p90", q.p90)}
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-5 text-muted">{forecast.source_note}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        {forecast.source_url ? (
          <a
            className="inline-flex items-center gap-1 font-medium text-cyan hover:text-ink"
            href={forecast.source_url}
            target="_blank"
            rel="noreferrer"
          >
            {forecast.source_label}
            <ArrowUpRight size={12} />
          </a>
        ) : (
          <span className="text-muted">{forecast.source_label}</span>
        )}
        {retired.map((item) => (
          <span key={item.id} className="text-muted">
            Superseded {formatIsoDate(item.committed_on)}: p50 {displayQuantileLabel(item.distribution.p50)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ForecastChart({
  rows,
  selectedId,
  onSelect,
}: {
  rows: ChartRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const values = rows.flatMap(({ forecast }) => {
    const q = forecast.distribution;
    return [q.p10.value, q.p90.lower_bound ? q.p50.value + 2 : q.p90.value];
  });
  const min = Math.floor(Math.min(...values, TODAY));
  const max = Math.max(min + 2, Math.ceil(Math.max(...values)));
  const x = (value: number) =>
    plotStart + ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * (plotEnd - plotStart);
  const span = max - min;
  const step = span > 14 ? 4 : span > 8 ? 2 : 1;
  const years: number[] = [];
  for (let year = min; year <= max; year += 1) if ((year - min) % step === 0) years.push(year);
  const height = axisBand + rows.length * rowHeight + 14;

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${height}`}
      className="w-full"
      role="group"
      aria-label="Forecast distributions for the selected capability threshold"
    >
      {years.map((year) => (
        <g key={year}>
          <line
            x1={x(year)}
            x2={x(year)}
            y1={axisBand - 8}
            y2={height - 10}
            stroke="#e3ddd0"
            strokeWidth={1}
          />
          <text
            x={x(year)}
            y={axisBand - 16}
            textAnchor="middle"
            fontSize={11}
            fill="#66717d"
            fontFamily="JetBrains Mono Variable"
          >
            {year}
          </text>
        </g>
      ))}
      {TODAY >= min && TODAY <= max ? (
        <g>
          <line
            x1={x(TODAY)}
            x2={x(TODAY)}
            y1={axisBand - 8}
            y2={height - 10}
            stroke="#132336"
            strokeWidth={1}
            opacity={0.4}
          />
          <text
            x={x(TODAY) + 5}
            y={axisBand + 4}
            fontSize={9}
            fill="#132336"
            opacity={0.55}
            fontFamily="JetBrains Mono Variable"
          >
            TODAY
          </text>
        </g>
      ) : null}
      {rows.map(({ forecast, retired }, index) => {
        const track = tracksById.get(forecast.track);
        if (!track) return null;
        const centerY = axisBand + index * rowHeight + rowHeight / 2;
        const q = forecast.distribution;
        const p10 = x(q.p10.value);
        const p90 = x(q.p90.lower_bound ? max : q.p90.value);
        const p50 = x(q.p50.value);
        const spine = track.kind === "frozen-spine";
        const selected = selectedId === forecast.id;
        const opacity = retired ? 0.45 : 1;
        return (
          <g
            key={forecast.id}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${track.name}${retired ? " (superseded)" : ""}: median ${displayQuantileLabel(q.p50)}, range ${displayQuantileLabel(q.p10)} to ${displayQuantileLabel(q.p90)}`}
            onClick={() => onSelect(forecast.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(forecast.id);
              }
            }}
            className="forecast-row cursor-pointer outline-none"
          >
            {index > 0 ? (
              <line x1={16} x2={chartWidth - 16} y1={centerY - rowHeight / 2} y2={centerY - rowHeight / 2} stroke="#ece7db" strokeWidth={1} />
            ) : null}
            <rect
              x={4}
              y={centerY - rowHeight / 2 + 2}
              width={chartWidth - 8}
              height={rowHeight - 4}
              rx={10}
              fill={selected ? "#0e8ea8" : "#132336"}
              opacity={selected ? 0.06 : 0}
            />
            <circle cx={20} cy={centerY} r={4} fill={track.color} opacity={opacity} />
            <text x={32} y={centerY - 1} fontSize={13} fontWeight={600} fill="#132336" opacity={opacity}>
              {track.short_name}
            </text>
            <text x={32} y={centerY + 14} fontSize={10} fill="#66717d" opacity={opacity}>
              {retired ? `superseded ${forecast.committed_on.slice(0, 7)}` : spine ? "frozen scenario" : "p10–p90"}
            </text>
            <g opacity={opacity}>
              <line
                x1={p10}
                x2={p90}
                y1={centerY}
                y2={centerY}
                stroke={track.color}
                strokeWidth={retired ? 2 : 2.5}
                strokeLinecap="round"
                opacity={0.35}
                strokeDasharray={retired || spine ? "1 6" : undefined}
              />
              {q.p25 && q.p75 ? (
                <line
                  x1={x(q.p25.value)}
                  x2={x(q.p75.value)}
                  y1={centerY}
                  y2={centerY}
                  stroke={track.color}
                  strokeWidth={retired ? 5 : 8}
                  strokeLinecap="round"
                />
              ) : null}
              {q.p90.lower_bound ? (
                <path d={`M ${plotEnd + 6} ${centerY - 4} L ${plotEnd + 14} ${centerY} L ${plotEnd + 6} ${centerY + 4} Z`} fill={track.color} opacity={0.6} />
              ) : null}
              {spine && forecast.scenario_marker ? (
                <rect
                  x={x(forecast.scenario_marker.value) - 5}
                  y={centerY - 5}
                  width={10}
                  height={10}
                  fill="#fffdf8"
                  stroke={track.color}
                  strokeWidth={2}
                  transform={`rotate(45 ${x(forecast.scenario_marker.value)} ${centerY})`}
                />
              ) : null}
              <circle
                cx={p50}
                cy={centerY}
                r={retired ? 3.5 : 5}
                fill={track.color}
                stroke="#fffdf8"
                strokeWidth={2.5}
              />
              {selected ? (
                <circle cx={p50} cy={centerY} r={9} fill="none" stroke="#132336" strokeWidth={1.25} />
              ) : null}
            </g>
            <text
              x={chartWidth - 16}
              y={centerY + 4}
              textAnchor="end"
              fontSize={13}
              fontWeight={600}
              fill="#132336"
              fontFamily="JetBrains Mono Variable"
              opacity={opacity}
            >
              {displayQuantileLabel(q.p50)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ForecastExplorer() {
  const current = canonical.forecasts.filter((forecast) => forecast.superseded_by === null);
  const milestoneIds = canonical.milestones
    .filter((milestone) => current.some((forecast) => forecast.milestone_id === milestone.id))
    .map((milestone) => milestone.id);
  const [selected, setSelected] = useState(milestoneIds.includes("ac") ? "ac" : milestoneIds[0]);
  const [showRetired, setShowRetired] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const milestone = milestonesById.get(selected);

  const rows = useMemo(() => {
    const trackOrder = canonical.meta.tracks.map((track) => track.id);
    const list: ChartRow[] = [];
    trackOrder.forEach((trackId) => {
      const records = canonical.forecasts
        .filter((forecast) => forecast.track === trackId && forecast.milestone_id === selected)
        .sort((a, b) => a.committed_on.localeCompare(b.committed_on));
      records.forEach((forecast) => {
        const retired = forecast.superseded_by !== null;
        if (!retired || showRetired) list.push({ forecast, retired });
      });
    });
    return list;
  }, [selected, showRetired]);

  const detail = detailId ? rows.find(({ forecast }) => forecast.id === detailId)?.forecast ?? null : null;
  const hasRetired = canonical.forecasts.some(
    (forecast) => forecast.milestone_id === selected && forecast.superseded_by !== null,
  );

  return (
    <section id="explorer" aria-labelledby="forecast-lens-title" className="scroll-mt-36">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Four forecasts</p>
          <h2 id="forecast-lens-title" className="mt-2 font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
            When does each threshold arrive?
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted">
          The soft line spans p10–p90, the solid center is p25–p75 where the source supplies it, and the dot is the
          median. Select a row for quantiles and provenance.
        </p>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Capability thresholds">
        {milestoneIds.map((id) => {
          const item = milestonesById.get(id);
          return (
            <button
              key={id}
              id={`forecast-tab-${id}`}
              type="button"
              aria-pressed={selected === id}
              aria-label={`${item?.code}: ${item?.name}`}
              onClick={() => {
                setSelected(id);
                setDetailId(null);
              }}
              className={`min-h-11 shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                selected === id
                  ? "border-ink bg-ink text-panel"
                  : "border-line bg-panel text-muted hover:text-ink"
              }`}
            >
              {item?.code}
            </button>
          );
        })}
        {hasRetired ? (
          <label className="ml-auto inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-xs text-muted transition-colors hover:bg-raised">
            <input
              type="checkbox"
              checked={showRetired}
              onChange={(event) => {
                setShowRetired(event.target.checked);
                setDetailId(null);
              }}
              className="h-4 w-4 accent-[#167f92]"
            />
            Show superseded records
          </label>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
        <div className="border-b border-line px-5 py-5 md:px-6">
          <h3 className="font-serif text-xl font-semibold text-ink">{milestone?.name}</h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{milestone?.operational_definition}</p>
        </div>
        <ChartScroller label={`${milestone?.name ?? "selected threshold"} forecast chart`} className="px-2 pt-2">
          <div className="min-w-[760px]">
            <ForecastChart
              rows={rows}
              selectedId={detailId}
              onSelect={(id) => setDetailId((prior) => (prior === id ? null : id))}
            />
          </div>
        </ChartScroller>
        {detail ? <ForecastDetail forecast={detail} onClose={() => setDetailId(null)} /> : null}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{canonical.meta.distribution_warning}</p>
    </section>
  );
}

/* ---------- Signals ---------- */

function SignalsSection() {
  const latestEvidence = useMemo(
    () =>
      [...canonical.evidence]
        .filter((item) => !item.archived)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 2),
    [],
  );
  const datedTest = canonical.falsifiers.find(
    (item) => item.kind === "dated-tripwire" && item.status === "watching",
  );
  const bindingDrivers = canonical.bottlenecks.filter((item) => item.status === "binding").slice(0, 2);
  return (
    <section id="signals" className="scroll-mt-28 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
      <div className="rounded-2xl border border-line bg-panel p-6 shadow-instrument md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Latest evidence</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-ink">
              New signals worth opening
            </h2>
          </div>
          <Link to="/evidence" className="inline-flex shrink-0 items-center gap-1 text-sm text-cyan">
            All evidence <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-line">
          {latestEvidence.map((item) => (
            <article key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <time>{formatIsoDate(item.date)}</time>
                <span>·</span>
                <span>{item.publisher}</span>
                <StatusBadge value={item.diagnosticity} />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-ink">{item.source_label}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.implication}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        {datedTest ? (
          <Link to="/falsifiers" className="block rounded-2xl bg-ink p-6 text-panel shadow-instrument">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-canvas/60">Next dated test</p>
            <h2 className="mt-3 font-serif text-xl font-semibold">{datedTest.title}</h2>
            <p className="mt-2 text-sm leading-6 text-canvas/70">{datedTest.summary}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm">
              {datedTest.deadline ? formatIsoDate(datedTest.deadline) : datedTest.review_label}
              <ArrowRight size={14} />
            </span>
          </Link>
        ) : null}
        <Link to="/bottlenecks" className="block rounded-2xl border border-line bg-panel p-6 shadow-instrument">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose">Binding drivers</p>
          <div className="mt-4 space-y-3">
            {bindingDrivers.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink">{item.name}</span>
                <StatusBadge value={item.status} />
              </div>
            ))}
          </div>
          <span className="mt-5 inline-flex items-center gap-1 text-sm text-cyan">
            Open driver map <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}

export function TimelineView() {
  return (
    <div>
      <BriefingHero />
      <div className="mt-8 md:mt-10">
        <ReadingPaths />
      </div>
      <div className="mt-20">
        <CapabilitySection />
      </div>
      <ReasoningSection />
      <section className="my-20 overflow-hidden rounded-2xl border border-line bg-ink text-panel shadow-instrument">
        <div className="grid items-center lg:grid-cols-[1fr_auto]">
          <div className="p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Forecast workbench</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-[-0.02em]">
              Ready for dates? Compare the whole ladder first.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-canvas/65">
              Four source-faithful distributions show where the timelines agree, where they
              diverge, and which assumptions pull each threshold earlier or later.
            </p>
          </div>
          <Link to="/forecasts" className="m-6 inline-flex items-center justify-center gap-2 rounded-full bg-panel px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cyan hover:text-panel md:m-8">
            Open forecasts <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <SignalsSection />
      <section className="mt-20 overflow-hidden rounded-[28px] border border-line bg-panel shadow-instrument">
        <div className="grid lg:grid-cols-[.72fr_1.28fr]">
          <div className="bg-raised/55 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan/10 text-cyan">
                <CircleHelp size={18} aria-hidden="true" />
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan">
                Method {canonical.methodology.version}
              </p>
            </div>
            <h2 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.015em] text-ink">
              How does a signal earn a place here?
            </h2>
          </div>
          <div className="p-6 md:p-8">
            <p className="max-w-2xl text-sm leading-6 text-muted">
              Follow one public observation through the five-step pipeline: define the
              threshold, admit the source, classify the evidence, score the rubric, and
              update the record visibly. The full method also exposes counterevidence,
              uncertainty ranges, and known failure modes.
            </p>
            <Link
              to="/methodology"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-panel hover:bg-cyan"
            >
              Read the 60-second method <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
