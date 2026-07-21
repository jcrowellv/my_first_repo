# AI Timeline Forecasts

A static forecasting instrument comparing four AI capability timelines against pre-committed falsifiers and an append-only evidence record:

- the frozen AI 2027 racing-ending spine;
- Codex's July 2026 distribution, with a 2032 WSI median;
- Claude's widening-thesis distribution, with a 2035 WSI median; and
- Daniel Kokotajlo's pinned April 2, 2026 AI Futures Model update.

The site is built with Vite, React, TypeScript, Zod, D3, and Tailwind. It has no backend, database, authentication, CMS, or runtime data fetches.

## Canonical-data rule

[`data/canonical.json`](data/canonical.json) is the only content source. Components contain display, filtering, routing, date-math, and chart logic; forecast dates, definitions, descriptions, statuses, evidence summaries, protocols, track copy, and changelog text live in the canonical file.

Content updates therefore follow one workflow:

```bash
edit data/canonical.json
npm run validate
git add data/canonical.json
git commit -m "Update forecast record"
```

Forecasts are append-only. Never replace a forecast record to revise a distribution. Add a new record, point the old record's `superseded_by` field at the new record, set the new record's `moved_by` field to the evidence or falsifier that caused the revision, and append a changelog entry.

## Repository structure

```text
data/canonical.json          All authored and sample-marked content
scripts/validate.ts          Schema and cross-reference validator
scripts/validate.test.ts     Positive and deliberately broken-data tests
src/schema.ts                Zod schemas and inferred TypeScript types
src/lib/                     Parsed data and date helpers
src/components/              Content-agnostic layout primitives
src/views/                   Six routed views
MISSING_CONTENT.md           Exact inventory of sample-filled content
vercel.json                  Vercel build configuration
.github/workflows/deploy.yml GitHub Pages fallback deployment
```

## Local development

Prerequisite: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run validate
npm run typecheck
npm run test
npm run build
npm run preview
```

`npm run build` runs canonical-data validation and TypeScript compilation before producing the static `dist/` directory.

## Validation behavior

The validator checks both schema shape and data integrity, including:

- unique IDs in every entity collection;
- valid track, milestone, evidence, falsifier, and changelog references;
- p10 <= p25 <= p50 <= p75 <= p90;
- valid supersession and `moved_by` references;
- valid evidence links in bottleneck histories and resolution records; and
- valid affected-entity links in the changelog.

Validation errors include the exact JSON path. To demonstrate failure safely, copy the file outside the repo, change one forecast's p10 so it falls after p50, then validate that copy:

```bash
npm run validate -- /tmp/broken-canonical.json
```

The automated test suite includes this broken-percentile check.

## Worked content-only update

Suppose falsifier `f-hard-verify-direction` fires and moves Claude's SAR distribution.

1. Change that falsifier's `status` to `fired` and add its `resolution_record` with an existing evidence ID.
2. Append a new Claude SAR forecast record. Give it a new ID and the revised quantiles.
3. Set `claude-sar-20260721.superseded_by` to the new forecast ID.
4. Set the new forecast's `moved_by` to `f-hard-verify-direction` or to the resolving evidence ID.
5. Append a changelog entry referencing the old forecast, new forecast, falsifier, and evidence.
6. Run `npm run validate` and commit the data-file change.

No component change is required. The timeline shows the new band and the superseded band, the inspector exposes the chain, the falsifier board shows the resolution, and the changelog displays the audit entry.

## Distribution and provenance conventions

- Timeline bands always show p10-p90 and a p50 marker. p25-p75 is emphasized when supplied.
- AI 2027 scenario dates are separate hatched diamond markers. They are not presented as distributions.
- The AI 2027 SC band comes from the original time-horizon-extension forecast. Later bands come from the original takeoff forecast conditional on SC in March 2027.
- Open right bounds such as `>2100` remain explicitly marked as lower bounds.
- Claude quantiles retain per-cell `registered` or `derived` provenance and effective dates.
- Daniel's January records remain in the data as superseded history; the April records link to the evidence that moved them.
- `SAMPLE` records are structurally valid but are never presented as real evidence. Their gaps are catalogued in [`MISSING_CONTENT.md`](MISSING_CONTENT.md).

## Deployment

### Vercel

Import the repository into Vercel. The checked-in configuration uses:

```text
Build command: npm run build
Output directory: dist
Framework: Vite
```

No environment variables are required.

### GitHub Pages

1. Push the repository to GitHub.
2. In **Settings -> Pages**, choose **GitHub Actions** as the source.
3. The checked-in workflow validates, builds with the repository-specific base path, and deploys `dist/`.

Routing uses URL hashes, so every view works on static hosts without rewrite rules.

## Architectural decisions

- Four track IDs are defined in data instead of a hardcoded three-value track enum.
- Forecast quantiles store source-faithful decimal-year values and display labels together. Chart math uses the numeric value; tooltips use the authored label.
- The focused timeline derives its endpoint from current closed p90 bounds and renders overflow arrows for open or extreme tails. “Full tails” exposes the complete range without altering data.
- AI Futures Model SAR/SIAR experiment-selection-skill outputs are mapped to the corresponding site milestones and disclose the mapping in `source_note`.
- Missing content is represented visibly, never filled with plausible-looking claims.
