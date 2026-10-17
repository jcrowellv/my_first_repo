# The Capability Ledger

An independent field guide to AI progress. Start with observed results, explore competing forecasts, and inspect the assumptions and sources behind them.

**Published site:** https://jcrowellv.github.io/my_first_repo/

The October 17, 2026 overhaul centers the site on the evidence for recursive self-improvement: a clickable research-loop diagram, a five-stage explorer, three carefully scoped measurements, and a searchable audit of all 26 pages in the supplied evidence packet. The ledger now contains 101 evidence records, including 19 additions checked against primary sources. The visual direction is a quiet ocean observatory: dark reading surfaces, restrained cyan, expressive serif type, an original ocean illustration, and a pointer-responsive field of signals. Research and development are transparently AI-assisted.

## Run and validate

Use Node.js 22.22+ and the pinned pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
```

`build` validates data and typechecks before compiling. The test suite covers source integrity, supersession references, criterion arithmetic, percentile ordering, censored probability tails, source-curve ordering, date precision, the research-speed illustration, complete packet coverage, review provenance, evidence grouping, and route/navigation rendering.

For the production GitHub Pages build:

```sh
GITHUB_PAGES=true VITE_BASE_PATH=/my_first_repo/ pnpm build
```

Pull requests run the tests and production build in CI. The deployment workflow publishes `dist/` when `main` changes. Hash-based routes work without server rewrites. The non-Pages build preserves the existing Sites-compatible `dist/client` and `dist/server` structure.

## Reading paths

- **Overview:** October measurements, the five links in the research loop, current sources, dated forecasts and a research-speed thought experiment.
- **The RSI dossier:** 19 claim groups covering all 26 packet pages; sticky section navigation and count-based disposition filters; source links; a review download; and explicit observations that would change the assessment.
- **The futures:** arrival ranges or cumulative probability curves; milestone, forecaster and horizon controls; exact quantiles, source conditions and historical records; definition-separated outside forecasts.
- **The evidence:** full-text search, topic and source filters, archive inclusion, source-family grouping, publication/update/access dates, stable links, and expandable interpretation, limitations and experimental context.
- **What to watch:** dated tests with preserved amendment histories, followed by ongoing observations without invented deadlines.
- **Mechanisms, methodology, glossary and revision history:** the underlying arguments, dated capability criteria, definitions, complete data download and audit trail.

## Data and source conventions

`data/canonical.json` remains the authoritative record of evidence, forecast quantiles, milestone definitions, capability criteria, tests and revisions. Editorial framing and presentation live in the views and components. Supplemental probability series are versioned under `data/`, with their source documentation in [`data/README.md`](data/README.md).

The October review strengthens the case for bounded experiment selection while leaving repeated autonomous successor gains unestablished. It updates the mechanism assessment, bottlenecks and monitors. It does **not** manufacture new numerical forecast distributions or rescore the July capability rubric. See the [research decision record](docs/research/2026-10-17-rsi-review.md).

Current comparisons include:

- The Ledger’s September 4 Astra assessment, targeting useful internal capability and including interruptions.
- Daniel Kokotajlo’s August 16 all-things-considered forecasts for AC, SAR experiment-selection, TED-AI and ASI. April SC/SIAR records remain visibly dated because the August all-things-considered source does not provide those milestones.
- Claude’s July registered alternative, retained as a dated forecast rather than an official Anthropic position.
- The original AI 2027 story, held fixed. Narrative diamonds are separate from the research supplement’s distributions, including its conditional later-milestone estimates.

**Forecast revisions append records.** Add a new record, link the previous record through `superseded_by`, name the moving evidence with `moved_by`, and append a changelog entry. Do not overwrite historical quantiles. Corrections to evidence are explained; multiple accounts of one incident are not treated as independent events.

**Do not invent precision.** Missing quartiles remain missing. Bare-year labels stay as years. The September WSI estimate is only a rough 2034 center; the UI labels July’s complete distributions as historical instead of fabricating new tails.

**Probability curves distinguish sources.** Daniel’s updated milestones use his published sampled CDF. The Ledger’s ASI view includes its explicitly stated cumulative judgments. Other curves interpolate uncensored quantiles. Lines stop at the available endpoints; readouts show bounds beyond them. A lower-bound p90 is never treated as an exact percentile date.

**Capability scores are dated judgments.** The retained July criteria are weighted assessments of public evidence, not probabilities or September ratings. The schema recomputes weighted scores and validates each criterion’s supporting and contrary evidence.

## Implementation

React, TypeScript, Vite, React Router and Zod. No backend, authentication, database or runtime external data fetches.

- `src/components/SignalField.tsx`: original ambient canvas animation. Pauses offscreen, in background tabs, on user command, and for reduced-motion preferences.
- `src/components/ForecastExplorer.tsx`: source-aware comparison instrument.
- `src/components/ProbabilityChart.tsx`: responsive original probability chart.
- `src/lib/forecast-series.ts`: chooses the appropriate published curve or recorded quantiles.
- `src/lib/forecast-math.ts`: bounded interpolation and the fixed-work research illustration.
- `src/components/ResearchLoop.tsx`: source-linked research stages and open tests.
- `src/views/RSIView.tsx`: complete packet audit and downloadable review.
- `src/lib/evidence.ts`: review filtering and related-source grouping.
- `src/views/`: nine routes with progressive disclosure.
- `src/index.css`: shared editorial design and responsive layouts.
- `scripts/validate.ts` and `src/schema.ts`: schema and cross-reference validation.

The original horizon illustration and social preview were AI-generated for this project. Earlier social assets are retained. Fonts are self-hosted; the wave uses no third-party animation service.
