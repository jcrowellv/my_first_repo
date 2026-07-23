import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Database, ShieldCheck, SlidersHorizontal, Waves } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { Evidence } from "../schema";
import { canonical, evidenceById, milestonesById } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { PageHeader, StatusBadge } from "../components/Primitives";

const favorsLabel: Record<Evidence["favors"], string> = {
  compression: "Favors faster timelines",
  widening: "Favors slower timelines",
  spine: "Matches the frozen scenario",
  neutral: "Framework or neutral",
};

const diagnosticityRank: Record<Evidence["diagnosticity"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

type Lens = "capability" | "safety" | "open-weight";

function SourceLinks({ refs }: { refs: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {refs.map((ref) => {
        const item = evidenceById.get(ref);
        return item ? (
          <a
            key={ref}
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-line bg-panel px-3 py-1.5 text-[11px] text-cyan hover:text-ink"
          >
            {item.publisher} · {item.source_label}<ArrowUpRight size={10} />
          </a>
        ) : null;
      })}
    </div>
  );
}

function SafetyReadinessPanel() {
  return (
    <section id="safety" className="scroll-mt-28">
      <div className="mb-6 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Separate control lens</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">Safety readiness</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          A capability score does not imply a control score. These states track the public evidence for evaluation, monitoring, safeguards, and independent access.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {canonical.safety_readiness.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-panel p-5 shadow-instrument md:p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-ink">{item.name}</h3>
              <StatusBadge value={item.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{item.summary}</p>
            <details className="group mt-5 border-t border-line pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-ink">
                Evidence and next signal
                <ChevronDown size={14} className="text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-5 text-muted"><strong className="text-ink">Next:</strong> {item.next_signal}</p>
              <div className="mt-3"><SourceLinks refs={item.evidence_refs} /></div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

function OpenWeightPanel() {
  return (
    <section id="open-weight" className="scroll-mt-28">
      <div className="mb-6 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">Capability, access, transparency</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">Open-weight diffusion</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Weight access changes who can deploy a capability. Full openness additionally requires legible data, code, training, and evaluation provenance.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {canonical.open_weight_indicators.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-panel p-5 shadow-instrument md:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{item.label}</span>
              <StatusBadge value={item.status} />
            </div>
            <p className="mt-5 font-serif text-3xl font-semibold tracking-[-0.03em] text-ink">{item.value}</p>
            <p className="mt-3 text-xs leading-5 text-muted">{item.detail}</p>
            <a href={item.source_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-cyan hover:text-ink">
              {item.source_label}<ArrowUpRight size={11} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidenceRow({ item }: { item: Evidence }) {
  return (
    <details className="group border-b border-line last:border-b-0">
      <summary className="cursor-pointer list-none px-5 py-4 transition-colors hover:bg-raised/40 md:px-6">
        <div className="grid items-baseline gap-x-5 gap-y-1.5 md:grid-cols-[96px_1fr_auto]">
          <time className="font-mono text-xs text-muted">{formatIsoDate(item.date)}</time>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-ink">
              {item.publisher}
              <span className="font-normal text-muted"> · {item.source_label}</span>
            </span>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.implication}</p>
          </div>
          <div className="flex items-center gap-2.5 md:justify-end">
            {item.independence ? (
              <span className="hidden font-mono text-[8px] uppercase tracking-[0.12em] text-muted xl:inline">
                {item.independence.replaceAll("-", " ")}
              </span>
            ) : null}
            <StatusBadge value={item.diagnosticity} />
            <ChevronDown size={15} className="text-muted transition-transform group-open:rotate-180" />
          </div>
        </div>
      </summary>
      <div className="grid gap-6 border-t border-line bg-raised/35 px-5 py-5 md:grid-cols-[1.4fr_.6fr] md:px-6">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">Observed</p>
            <p className="mt-2 text-sm leading-7 text-ink">{item.summary}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">Limit</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.limitation}</p>
          </div>
          {item.evaluation_context ? (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Evaluation context</p>
              <p className="mt-2 text-xs leading-5 text-muted">{item.evaluation_context}</p>
            </div>
          ) : null}
        </div>
        <div className="space-y-4 text-xs">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Reading</p>
            <p className="mt-1.5 text-ink">{favorsLabel[item.favors]}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Source</p>
              <p className="mt-1.5 text-ink">{item.source_type.replaceAll("-", " ")}</p>
            </div>
            {item.verification ? (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Verification</p>
                <p className="mt-1.5 text-ink">{item.verification.replaceAll("-", " ")}</p>
              </div>
            ) : null}
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Bears on</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.milestone_tags.map((tag) => (
                <span key={tag} className="rounded-full bg-panel px-2.5 py-1 font-mono text-[9px] text-muted ring-1 ring-line">
                  {milestonesById.get(tag)?.code}
                </span>
              ))}
            </div>
          </div>
          {item.themes?.length ? (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Themes</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.themes.map((tag) => (
                  <span key={tag} className="rounded-full bg-panel px-2.5 py-1 font-mono text-[9px] text-muted ring-1 ring-line">
                    {tag.replaceAll("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-cyan hover:text-ink">
            Open primary source <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </details>
  );
}

export function EvidenceLedger() {
  const { hash } = useLocation();
  const lens: Lens = hash === "#safety" ? "safety" : hash === "#open-weight" ? "open-weight" : "capability";
  const [milestone, setMilestone] = useState("all");
  const [diagnosticity, setDiagnosticity] = useState("all");
  const [sourceType, setSourceType] = useState("all");
  const [favors, setFavors] = useState("all");
  const [theme, setTheme] = useState("all");
  const [sort, setSort] = useState<"diagnosticity" | "date">("diagnosticity");

  const evidence = useMemo(() => {
    const lensFilter = (item: Evidence) => {
      if (lens === "safety") {
        return item.themes?.some((theme) =>
          ["alignment-control", "cybersecurity", "evaluation-methods"].includes(theme),
        );
      }
      if (lens === "open-weight") {
        return item.themes?.some((theme) =>
          ["open-weight", "open-science", "transparency"].includes(theme),
        );
      }
      return true;
    };

    return [...canonical.evidence]
      .filter(lensFilter)
      .filter((item) => milestone === "all" || item.milestone_tags.includes(milestone))
      .filter((item) => diagnosticity === "all" || item.diagnosticity === diagnosticity)
      .filter((item) => sourceType === "all" || item.source_type === sourceType)
      .filter((item) => favors === "all" || item.favors === favors)
      .filter((item) => theme === "all" || item.themes?.includes(theme as NonNullable<Evidence["themes"]>[number]))
      .sort((a, b) => {
        if (sort === "diagnosticity") {
          const rank = diagnosticityRank[b.diagnosticity] - diagnosticityRank[a.diagnosticity];
          if (rank !== 0) return rank;
        }
        return b.date.localeCompare(a.date);
      });
  }, [diagnosticity, favors, lens, milestone, sort, sourceType, theme]);

  const themeOptions = useMemo(
    () => [...new Set(canonical.evidence.flatMap((item) => item.themes ?? []))].sort(),
    [],
  );

  const selectClass = "rounded-full border border-line bg-panel px-4 py-2.5 text-xs text-ink";
  const lensItems = [
    { id: "capability", label: "Capability evidence", detail: "All milestone-moving records", path: "/evidence", icon: Database },
    { id: "safety", label: "Safety & control", detail: "Containment, monitors, safeguards", path: "/evidence#safety", icon: ShieldCheck },
    { id: "open-weight", label: "Open-weight", detail: "Diffusion, openness, transparency", path: "/evidence#open-weight", icon: Waves },
  ] as const;

  return (
    <div>
      <PageHeader viewId="evidence" />
      <div className="mb-14 grid gap-3 md:grid-cols-3">
        {lensItems.map((item) => {
          const Icon = item.icon;
          const active = lens === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`rounded-2xl border p-5 transition-colors ${
                active ? "border-cyan/45 bg-panel shadow-instrument ring-1 ring-cyan/20" : "border-line bg-panel hover:border-cyan/30"
              }`}
            >
              <Icon size={18} className={active ? "text-cyan" : "text-muted"} />
              <span className="mt-4 block text-sm font-semibold text-ink">{item.label}</span>
              <span className="mt-1 block text-xs text-muted">{item.detail}</span>
            </Link>
          );
        })}
      </div>

      {lens === "safety" ? <SafetyReadinessPanel /> : null}
      {lens === "open-weight" ? <OpenWeightPanel /> : null}

      <section className={lens === "capability" ? "" : "mt-16"} aria-labelledby="ledger-title">
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
            {lens === "capability" ? "Source ledger" : `${lens.replaceAll("-", " ")} sources`}
          </p>
          <h2 id="ledger-title" className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
            Inspect the record
          </h2>
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs text-muted">
            <SlidersHorizontal size={14} /> {evidence.length} of {canonical.evidence.length} records
          </span>
          <select aria-label="Filter by capability level" className={selectClass} value={milestone} onChange={(event) => setMilestone(event.target.value)}>
            <option value="all">All capability levels</option>
            {canonical.milestones.map((item) => (
              <option key={item.id} value={item.id}>{item.code} · {item.name}</option>
            ))}
          </select>
          <select aria-label="Filter by source type" className={selectClass} value={sourceType} onChange={(event) => setSourceType(event.target.value)}>
            <option value="all">All source types</option>
            {[...new Set(canonical.evidence.map((item) => item.source_type))].sort().map((type) => (
              <option key={type} value={type}>{type.replaceAll("-", " ")}</option>
            ))}
          </select>
          <select aria-label="Filter by signal strength" className={selectClass} value={diagnosticity} onChange={(event) => setDiagnosticity(event.target.value)}>
            <option value="all">All signal strengths</option>
            <option value="high">High diagnosticity</option>
            <option value="medium">Medium diagnosticity</option>
            <option value="low">Low diagnosticity</option>
          </select>
          <select aria-label="Filter by forecast direction" className={selectClass} value={favors} onChange={(event) => setFavors(event.target.value)}>
            <option value="all">All directions</option>
            <option value="compression">Favors faster timelines</option>
            <option value="widening">Favors slower timelines</option>
            <option value="spine">Matches the frozen scenario</option>
            <option value="neutral">Framework or neutral</option>
          </select>
          <select aria-label="Filter by theme" className={selectClass} value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="all">All themes</option>
            {themeOptions.map((item) => (
              <option key={item} value={item}>{item.replaceAll("-", " ")}</option>
            ))}
          </select>
          <select aria-label="Sort evidence" className={selectClass} value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
            <option value="diagnosticity">Strongest signal first</option>
            <option value="date">Newest first</option>
          </select>
        </div>
        {evidence.length ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-instrument">
            {evidence.map((item) => <EvidenceRow key={item.id} item={item} />)}
          </div>
        ) : (
          <p className="rounded-2xl border border-line bg-panel p-10 text-center text-sm text-muted">
            No evidence matches these filters.
          </p>
        )}
      </section>
    </div>
  );
}
