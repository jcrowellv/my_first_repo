# The Capability Ledger

A static forecasting instrument that combines a public-evidence capability rubric, four AI timelines, definition-separated outside views, source-backed tests, safety and open-weight lenses, an evidence ledger, and an append-only audit record:

- the frozen AI 2027 racing-ending spine;
- Codex's July 2026 distribution, with a 2032 WSI median;
- Claude's widening-thesis distribution, with a 2035 WSI median; and
- Daniel Kokotajlo's pinned April 2, 2026 AI Futures Model update.

The site is built with Vite, React, TypeScript, Zod, native SVG, and Tailwind. It has no backend, database, authentication, CMS, or runtime data fetches.

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
data/canonical.json          All authored content, evidence, scores, and forecasts
scripts/validate.ts          Schema and cross-reference validator
scripts/validate.test.ts     Positive and deliberately broken-data tests
src/schema.ts                Zod schemas and inferred TypeScript types
src/lib/                     Parsed data and date helpers
src/components/              Content-agnostic layout primitives
src/views/                   Eight routed views
public/og-v3.png             Current generated 1200x630 social preview
public/og-v2.png             Previous social preview retained for comparison
public/og.png                Original social preview retained for comparison
MISSING_CONTENT.md           Explicit inventory of unresolved source limitations
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
- valid evidence links in tests, drivers, progress criteria, and resolution records;
- valid evidence links in outside views, forecast drivers, safety-readiness states, and open-weight indicators;
- complete relevance, independence, verification, and evaluation-context metadata on every evidence record;
- capability-criterion weights that sum to 100% and scores that match their weighted arithmetic;
- criterion rating-band consistency, low <= central <= high uncertainty bounds, and non-overlapping evidence/counterevidence;
- alignment between the central lag-sensitivity case and the declared public-evidence lag;
- valid related-term references inside the glossary; and
- valid affected-entity links in the changelog.

Validation errors include the exact JSON path. To demonstrate failure safely, copy the file outside the repo, change one forecast's p10 so it falls after p50, then validate that copy:

```bash
npm run validate -- /tmp/broken-canonical.json
```

The automated test suite includes this broken-percentile check.

## Worked content-only update

Suppose dated tripwire `f-hard-verify-direction` is met and moves the widening-thesis SAR distribution.

1. Change that test's `status` to `met` and add its `resolution_record` with an existing evidence ID.
2. Append a new Claude SAR forecast record. Give it a new ID and the revised quantiles.
3. Set `claude-sar-20260721.superseded_by` to the new forecast ID.
4. Set the new forecast's `moved_by` to `f-hard-verify-direction` or to the resolving evidence ID.
5. Append a changelog entry referencing the old forecast, new forecast, falsifier, and evidence.
6. Run `npm run validate` and commit the data-file change.

No component change is required. The forecast lens exposes the current band and its earlier record, the test board shows the resolution, and the changelog displays the audit entry.

## Capability-progress rubric

The four capability estimates are not forecasts or probabilities. Each is the weighted completion of public-evidence criteria derived from an AI 2027 agent definition. Every criterion carries a named rating band, central completion value, low-high judgment range, rationale, evidence, and explicit counterevidence. `canonical.json` also stores a confidence rationale and as-of date for each aggregate.

Validation recomputes the central score, checks the uncertainty bounds, confirms that the central value fits its named band, and validates all evidence links. The low and high aggregates are interpretive sensitivity bounds, not calibrated confidence intervals.

To revise a score, update or append the evidence record, update the affected criterion's band, central value, range, and rationale, and append a changelog record. The UI recalculates the aggregate range directly from the criterion data.

Evidence quality is deliberately not collapsed into one grade. Every record must separately declare:

- **diagnosticity:** how directly it bears on the threshold;
- **independence:** who produced or evaluated the result; and
- **verification:** how far the public claim has been checked.

The four-month public-evidence lag is a narrative sensitivity assumption only. The methodology shows zero-, four-, and eight-month interpretations, and validation keeps the central scenario aligned with `meta.internal_lag_months`. No lag option changes a canonical forecast date, rubric score, or milestone status.

## Information architecture

The site exposes one canonical record at three reading depths, and renders the three depths as explicit reading paths on the overview:

- **Brief:** the overview begins with a plain-language product map and an interactive two-minute path. It gives the current capability, control-readiness, open-weight, and next-test read without requiring chart interpretation. The two scenario-pace gradings remain available in a collapsed source note.
- **Explore:** the forecast workbench compares the full ladder, the takeoff-gap disagreement between milestone medians, one threshold at a time, the mechanism assumptions behind each track, and outside views whose definitions differ.
- **Audit:** the evidence ledger, locked tests, methodology, glossary, driver map, and changelog retain source limitations, three-axis provenance, uncertainty ranges, counterevidence, superseded records, and resolution protocols.

A glossary view defines every recurring term (milestone codes, percentile bands, provenance letters, diagnosticity, tripwires versus monitors, rubric completion) with cross-references, so definitions stay attached to dates everywhere else on the site.

Outside views never become an extra house track. Their exact resolution definitions and conditioning remain attached to their dates. Capability progress, safety readiness, and open-weight diffusion are separate lenses and are never combined into a single score.

## Distribution and provenance conventions

- The forecast lens shows one milestone at a time: p10-p90 as the outer range, p25-p75 as the heavier center where supplied, and p50 as the marker.
- The AI 2027 spine renders as a thin range line with a median tick and a diamond scenario marker. It has no p25-p75 band and is never presented as a full distribution.
- Superseded records remain in the canonical data and are disclosed from the current range's expanded provenance panel.
- Landing-page headline statistics are hand-authored in `meta.headline_stats` and must be re-derived whenever a forecast record changes.
- The AI 2027 SC band comes from the original time-horizon-extension forecast. Later bands come from the original takeoff forecast conditional on SC in March 2027.
- Open right bounds such as `>2100` remain explicitly marked as lower bounds.
- Claude quantiles retain per-cell `registered` or `derived` provenance and effective dates.
- Daniel's January records remain in the data as superseded history; the April records link to the evidence that moved them.
- Dated tripwires and structural monitors are deliberately distinct. A monitor never receives an invented deadline merely to look like a falsifier.

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
- The forecast lens derives its scale from the selected milestone, avoiding the unreadable all-milestone matrix while preserving full p10-p90 ranges.
- AI Futures Model SAR/SIAR experiment-selection-skill outputs are mapped to the corresponding site milestones and disclose the mapping in `source_note`.
- Current driver assessments show supporting evidence, counterevidence, a confidence label, and the next observation that would move the assessment.
- Evaluation records may carry independence, verification, and evaluation-context fields so first-party results, independent tests, and preliminary incident evidence remain visibly distinct.
