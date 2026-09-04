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

## Featured experiment charts

The overview’s original charts use these primary evaluation records, linked from each graphic:

- ARC Prize: https://arcprize.org/blog/astra — standard max 62.7, adapter max 98.6; standard high 54.8, adapter high 99.9. Action-efficiency scores, not percentage of games completed. The adapter preserves reasoning state.
- Epoch AI: https://epoch.ai/latest/announcing-frontiermath-erdos — two of 68 open problems solved under the fixed one-attempt, $300, 72-hour setup. Accepted solutions are formally checked.
- Anthropic: https://alignment.anthropic.com/2026/taste/ — Fable 5 agreement 60%, estimated human agreement 77%, on 92 proposal pairs. These are noisy agreement estimates, not scores of objective idea quality. Astra was not evaluated in this test.

The research-speed instrument is an illustrative fixed-work calculation, not a fitted estimate or forecast revision: `1 / ((1 - share) + share / speed)`. Its limitations are stated beside its controls.
