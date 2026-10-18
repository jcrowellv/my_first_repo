# Source data

## canonical.json

The validated record of forecasts, evidence, capability criteria and revisions. Forecast history is append-only. The September review adds eleven external evidence records, refreshes the existing May METR account with its original date preserved, adds a house-forecast explanation record, and corrects the status of the now-published incident investigation.

## daniel-20260816-cdf.json

All-things-considered cumulative distribution samples from Daniel Kokotajlo’s August 16, 2026 AI Futures Model forecast, retrieved September 4, 2026.

Source: https://www.aifuturesmodel.com/forecast/daniel-08-16-26?timeline=AC,SAR,TED-AI,ASI&ctype=atc

Keys retain the publisher’s names. `SAR-level-experiment-selection-skill` is mapped to SAR in the UI with the definitional caveat visible. The forecasts condition on development proceeding as fast as technically feasible. Samples are used directly, with linear interpolation between adjacent samples; do not substitute the separate pure-model-output CDF.

## ledger-20260904-asi-cdf.json

Explicit cumulative judgments from the September 4 Astra assessment with JJ Crowell, plus the registered ASI quantiles. These are subjective forecasts, not independent measurements. End-of-year judgments are placed at the start of the next year. A bare-year quantile has illustrative numerical placement and does not claim month precision.

The underlying discussion gave 4% by end-2027, 25% by end-2029, 35% by end-2030, 55% by end-2032, 70% by end-2035, and 80% by end-2040. The registered ASI quantiles are early-2029 / 2032 / 2050 for 10% / 50% / 90%.

## Historical September experiment charts

The September overview used these primary evaluation records, linked from each graphic:

- ARC Prize: https://arcprize.org/blog/astra — standard max 62.7, adapter max 98.6; standard high 54.8, adapter high 99.9. Action-efficiency scores, not percentage of games completed. The adapter preserves reasoning state.
- Epoch AI: https://epoch.ai/latest/announcing-frontiermath-erdos — two of 68 open problems solved under the fixed one-attempt, $300, 72-hour setup. Accepted solutions are formally checked.
- Anthropic: https://alignment.anthropic.com/2026/taste/ — Fable 5 agreement 60%, estimated human agreement 77%, on 92 proposal pairs. These are noisy agreement estimates, not scores of objective idea quality. Astra was not evaluated in this test.

The research-speed instrument is an illustrative fixed-work calculation, not a fitted estimate or forecast revision: `1 / ((1 - share) + share / speed)`. Its limitations are stated beside its controls.

## October 17 RSI review

`research_review` is the current review record. It contains the packet filename, page count and SHA-256 fingerprint; five qualitative research stages; 19 claim groups; three measurements; forecast implications; and links to additional research beyond the packet. A separate `supplements` array records the later quantum-circuit screenshot without assigning it a PDF page. Its report and preprint share one source family. The source PDF and OCR are not redistributed.

Every packet page has exactly one audit disposition. Multiple pages can belong to one claim group. Supported or qualified claims require evidence references. Validation rejects missing, duplicate or out-of-range pages, dangling references, and incomplete or reversed measurement intervals.

The three current measurements come from:

- [TasteVal](https://pzeroresearch.com/work/tasteval/): 2.30× experimental-compute multiplier, 95% interval 1.15–4.37×, within supplied research tasks. This is not a whole-lab acceleration factor.
- [Vals RSI Index](https://www.vals.ai/benchmarks/rsi_index): 0.8308 validation bits per byte versus a 0.8500 published reference. Task budgets, harnesses and reference conditions matter; the index is not a probability of RSI.
- [TheoPhysEval](https://arxiv.org/html/2610.16733v1): 49/50 final answers on its realistic track. These are known-method calculations, not 49 new discoveries.

New evidence includes `date_kind` (published, updated, accessed), `reviewed_on`, and `event_id`. An access date must not be presented as a publication date. Shared `event_id` values identify related coverage; a source-family count is not a count of independent experiments. Untagged legacy records default to their own family and are not thereby certified independent.

Falsifiers may carry a `latest_review` without overwriting locked statements, deadlines, amendment history or prior resolution records. The new successor-gains monitor has no invented deadline. Forecast distributions and July capability criteria remain unchanged. A later review must append numerical forecast revisions through the existing supersession protocol.

## October 18 AI 2027 assessment

`agent_assessment` is the current story-facing assessment. It points to five new `capability_progress` records and seven appended house forecasts. The four July progress records remain byte-for-byte equivalent as JSON records; each October replacement links backward through `supersedes`. Agent-5 starts a separate low-confidence rubric for the race ending and has no invented arrival distribution.

Current scores are Agent-1 **100%**, Agent-2 **65%**, Agent-3 **33%**, Agent-4 **25%**, Agent-5 **4%**. They are weighted evidence judgments, not probabilities. Each criterion retains its supporting evidence, counterevidence and judgment range. Every defining criterion must be complete before a profile can be labeled met. The schema checks current pointers, dates, history, sources, forecast associations and this completion rule.

The October forecasts use IDs ending in `20261018`; September predecessors point forward through `superseded_by`. Six forecasts reaffirm the separately prepared October outlook and Agent-2 adds an explicitly elicited estimate. These are subjective distributions with long late tails, not a fitted law or a conversion from rubric scores. The September ASI CDF above is not reused for the October record.

The October 17 packet review and its numerical non-revision decision remain frozen as history. See [the October 18 decision record](../docs/research/2026-10-18-agent-assessment.md) for the subsequent rescoring, definitions and forecasts.
