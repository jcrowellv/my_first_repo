# The Capability Ledger

An independent assessment of where current AI capabilities fit in the **AI 2027** story. Start with the five agent profiles, compare the story's dates with our forecast, then inspect the evidence behind each judgment.

**Published site:** https://jcrowellv.github.io/my_first_repo/

The October 18, 2026 assessment places the frontier **between Agent-1 and Agent-2**. Bounded experiment selection, technical execution and some coordination abilities resemble pieces of later chapters already. Public evidence does not yet establish the complete Agent-2 combination of research engineering, continual learning and roughly 3× lab-wide algorithmic progress. We do not infer a single number of months ahead.

| Profile | Current rubric score | July score |
| --- | ---: | ---: |
| Agent-1: managed assistant | 100% | 100% |
| Agent-2: research engineer | 65% | 53% |
| Agent-3: superhuman coder | 33% | 21% |
| Agent-4: superhuman researcher | 25% | 8% |
| Agent-5: AI-designed successor | 4% | New rubric |

These are **weighted judgments of evidence for each capability profile**, not benchmark results, arrival probabilities or percentages of time remaining. Each score has a judgment range and criterion-level sources. A high average cannot compensate for a missing defining capability. Agent-5 is a low-confidence baseline for the race ending, not a relabeling of SIAR or ASI.

## Reading paths

- **AI 2027:** five selectable agents; current scores, remaining gaps and next tests; component-by-component comparison with the story; an interactive timeline with optional long tails. Evidence and previous scores open on demand. Agent selections have shareable URLs.
- **Timeline:** arrival ranges or probability curves; milestone, forecaster and horizon controls; exact quantiles and historical forecasts. Narrative dates and forecast distributions remain distinct.
- **Evidence:** full-text search, topic and source filters, related-source grouping, stable links, and expandable methods, interpretations and limitations.
- **Research:** the RSI dossier covers all 26 supplied packet pages and the separate quantum-circuit screenshot, with sources, qualification notes and a downloadable audit. The five-stage research-loop explorer remains available here.
- **Method, glossary and what to watch:** dated criteria, scoring rules, definitions, complete data download and observations that would change the assessment.

The interface puts the story first, with detailed evidence available through disclosures and dedicated routes. Research and development are transparently AI-assisted; the assessment is not an official AI Futures Project rating.

## Run and validate

Use Node.js 22.22+ and the pinned pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
```

`build` validates data and typechecks before compiling. Tests cover source integrity, append-only assessment history, current references, criterion arithmetic, completion gates, forecast supersession, percentile ordering, source curves, censored tails, date precision, packet coverage and routes.

For GitHub Pages:

```sh
GITHUB_PAGES=true VITE_BASE_PATH=/my_first_repo/ pnpm build
```

Pull requests run the tests and production build in CI. Changes to `main` deploy `dist/`. Hash-based routes work without server rewrites. The non-Pages build preserves the Sites-compatible `dist/client` and `dist/server` structure.

## Data and source conventions

`data/canonical.json` is authoritative: 105 evidence records, 50 forecasts, nine dated capability assessments and seven falsifiers. `agent_assessment` connects the current five profiles, story dates and forecast comparison; `research_review` preserves the October 17 packet audit. Supplemental probability series are documented in [`data/README.md`](data/README.md).

The [October 18 decision record](docs/research/2026-10-18-agent-assessment.md) explains the rescoring and seven appended house forecasts. The [October 17 research record](docs/research/2026-10-17-rsi-review.md) remains a historical account of the initial qualitative overhaul. The later assessment explicitly revises numerical judgments without overwriting the July scores or earlier forecast quantiles.

Current comparisons include the Ledger's October outlook, Daniel Kokotajlo's August all-things-considered forecasts, Claude's July registered alternative, and the fixed original AI 2027 story. Definitions travel with each forecast: Agent-4's September narrative chapter differs from the supplement's August SAR marker, and Agent-5 has no separately asserted arrival distribution.

**Append revisions.** Forecasts link forward with `superseded_by` and name moving evidence through `moved_by`; capability assessments link backward with `supersedes`. Keep original dates, criteria and quantiles. Multiple accounts of one incident are not independent events.

**Do not invent precision.** Missing quartiles stay missing. Bare-year labels remain years. October dates target useful internal capability, including interruptions, and do not subtract a private lead again. The numerical outlook is an elicited judgment, not an extrapolation of two progress-bar snapshots.

**Keep probability series versioned.** Daniel's supported milestones use published sampled CDFs. The September house ASI CDF belongs only to its historical forecast. October curves interpolate the new uncensored quantiles; readouts show bounds beyond available endpoints. A censored p90 is not an exact date.

## Implementation

React, TypeScript, Vite, React Router and Zod. No backend, authentication, database or runtime external data fetches.

- `src/components/AgentExplorer.tsx`: selectable profiles, criteria, evidence and assessment history.
- `src/components/StoryTimeline.tsx`: original scenario versus current outlook, with optional later milestones and long tails.
- `src/components/ForecastExplorer.tsx` and `ProbabilityChart.tsx`: full source-aware forecast comparison.
- `src/lib/data.ts`: validated canonical data and assessment history.
- `src/lib/forecast-series.ts` and `forecast-math.ts`: source-specific curves and bounded interpolation.
- `src/views/RSIView.tsx` and `src/lib/evidence.ts`: complete packet audit, related-source grouping and filters.
- `src/agents.css` and `src/index.css`: responsive story-first and shared editorial layouts.
- `src/schema.ts` and `scripts/validate.ts`: schema and cross-reference validation.

Fonts are self-hosted. Original illustration and social assets from earlier versions are retained. The separate interactive forecast artifact requested outside this repository is not bundled into the site.
