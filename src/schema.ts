import { z } from "zod";

const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO date in YYYY-MM-DD format");

const SampleFieldsSchema = z.object({
  sample: z.boolean(),
  sample_note: z.string().min(1).optional(),
});

export const TrackIdSchema = z.string().min(1);

export const TrackSchema = SampleFieldsSchema.extend({
  id: TrackIdSchema,
  name: z.string().min(1),
  short_name: z.string().min(1),
  description: z.string().min(1),
  thesis: z.enum(["spine", "compression", "widening"]),
  kind: z.enum(["frozen-spine", "forecast"]),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  source_label: z.string().min(1),
  source_url: z.string().url().nullable(),
});

export const ViewMetaSchema = z.object({
  id: z.enum([
    "timeline",
    "forecasts",
    "falsifiers",
    "evidence",
    "bottlenecks",
    "changelog",
    "methodology",
    "glossary",
    "rsi",
  ]),
  label: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const NavigationChildSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  path: z.string().min(1),
});

export const NavigationItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  path: z.string().min(1),
  children: z.array(NavigationChildSchema).min(1),
});

export const HeadlineStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  detail: z.string().min(1).optional(),
});

export const ActionLinkSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
});

export const ActionGroupSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  items: z.array(ActionLinkSchema).min(1),
});

export const ActionCenterSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  groups: z.array(ActionGroupSchema).min(1),
});

export const BriefingLensSchema = z.object({
  id: z.enum(["capability", "control", "diffusion"]),
  label: z.string().min(1),
  value: z.string().min(1),
  status: z.enum(["met", "watching", "strained", "mixed"]),
  detail: z.string().min(1),
  path: z.string().min(1),
});

export const PaceSourceSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  fraction: z.number().min(0).max(1),
  detail: z.string().min(1),
  source_label: z.string().min(1),
  source_url: z.string().url(),
});

export const PaceStatusSchema = z.object({
  id: z.enum([
    "confirmed",
    "ahead",
    "on-track",
    "behind",
    "emerging",
    "not-testable",
  ]),
  label: z.string().min(1),
  value: z.number().int().nonnegative(),
});

export const ReasoningStepSchema = z.object({
  id: z.enum(["observation", "inference", "forecast-impact"]),
  label: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).min(1),
});

export const CruxSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  current_read: z.string().min(1),
  faster_if: z.string().min(1),
  slower_if: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).min(1),
});

export const BriefingReasoningSchema = z.object({
  epistemic_status: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  steps: z.array(ReasoningStepSchema).length(3),
  disagreement_label: z.string().min(1),
  disagreement_title: z.string().min(1),
  disagreement_detail: z.string().min(1),
  disagreement_evidence_refs: z.array(z.string().min(1)).min(1),
  cruxes: z.array(CruxSchema).min(1).max(4),
});

export const BriefingSchema = z.object({
  as_of: IsoDateSchema,
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  pace_label: z.string().min(1),
  pace_value: z.string().min(1),
  pace_fraction: z.number().min(0).max(1).optional(),
  pace_detail: z.string().min(1),
  pace_source_label: z.string().min(1),
  pace_source_url: z.string().url(),
  pace_note: z.string().min(1),
  pace_statuses: z.array(PaceStatusSchema).length(6),
  pace_secondary: PaceSourceSchema.optional(),
  reasoning: BriefingReasoningSchema,
  lenses: z.array(BriefingLensSchema).length(3),
});

export const ReadingPathStepSchema = z.object({
  label: z.string().min(1),
  path: z.string().min(1),
});

export const ReadingPathSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(ReadingPathStepSchema).min(1),
});

export const MethodStepSchema = z.object({
  id: z.enum(["define", "admit", "classify", "score", "update"]),
  label: z.string().min(1),
  summary: z.string().min(1),
  detail: z.string().min(1),
  output: z.string().min(1),
});

export const EvidenceAxisValueSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  definition: z.string().min(1),
});

export const EvidenceAxisSchema = z.object({
  id: z.enum(["diagnosticity", "independence", "verification"]),
  label: z.string().min(1),
  question: z.string().min(1),
  summary: z.string().min(1),
  values: z.array(EvidenceAxisValueSchema).min(2),
});

export const ScoreBandIdSchema = z.enum([
  "not-observed",
  "trace",
  "partial",
  "substantial",
  "met",
]);

export const ScoreBandSchema = z.object({
  id: ScoreBandIdSchema,
  label: z.string().min(1),
  min: z.number().min(0).max(1),
  max: z.number().min(0).max(1),
  plain_language: z.string().min(1),
});

export const MethodDecisionRuleSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

export const MethodLimitationSchema = z.object({
  title: z.string().min(1),
  risk: z.string().min(1),
  mitigation: z.string().min(1),
});

export const MethodologySchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  reviewed_on: IsoDateSchema,
  headline: z.string().min(1),
  summary: z.string().min(1),
  core_question: z.string().min(1),
  steps: z.array(MethodStepSchema).length(5),
  evidence_axes: z.array(EvidenceAxisSchema).length(3),
  score_bands: z.array(ScoreBandSchema).length(5),
  score_rule: z.string().min(1),
  uncertainty_rule: z.string().min(1),
  forecast_rule: z.string().min(1),
  lag_rule: z.string().min(1),
  lag_scenarios_months: z.tuple([
    z.number().int().nonnegative(),
    z.number().int().nonnegative(),
    z.number().int().nonnegative(),
  ]),
  decision_rules: z.array(MethodDecisionRuleSchema).min(3),
  limitations: z.array(MethodLimitationSchema).min(3),
});

export const MetaSchema = z.object({
  site_title: z.string().min(1),
  site_subtitle: z.string().min(1),
  site_description: z.string().min(1),
  site_url: z.string().url(),
  internal_lag_months: z.number().int().nonnegative(),
  next_review_date: IsoDateSchema,
  scoring_convention: z.string().min(1),
  internal_lag_explanation: z.string().min(1),
  update_protocol: z.string().min(1),
  progress_methodology: z.string().min(1),
  synthesis_methodology: z.string().min(1),
  progress_label: z.string().min(1),
  progress_disclaimer: z.string().min(1),
  distribution_warning: z.string().min(1),
  sample_warning: z.string().min(1),
  last_updated_label: z.string().min(1),
  next_review_label: z.string().min(1),
  headline_stats: z.array(HeadlineStatSchema).max(4).optional(),
  briefing: BriefingSchema,
  action_center: ActionCenterSchema,
  reading_paths: z.array(ReadingPathSchema).min(1).optional(),
  tracks: z.array(TrackSchema).min(1),
  views: z.array(ViewMetaSchema).length(9),
  navigation: z.array(NavigationItemSchema).length(5),
});

export const MilestoneStatusSchema = z.enum([
  "not-arrived",
  "arrived",
  "contested",
]);

export const MilestoneSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  code: z.string().min(1),
  name: z.string().min(1),
  operational_definition: z.string().min(1),
  spine_description: z.string().min(1),
  spine_mapping: z.string().min(1),
  status: MilestoneStatusSchema,
  source_refs: z.array(z.string().min(1)).min(1),
});

export const QuantileProvenanceSchema = z.enum([
  "registered",
  "derived",
  "published",
  "model-output",
  "sample",
]);

export const QuantileDateSchema = z.object({
  value: z.number().finite().min(2020).max(2300),
  label: z.string().min(1),
  provenance: QuantileProvenanceSchema,
  effective_on: IsoDateSchema,
  lower_bound: z.boolean().optional(),
});

export const DistributionSchema = z.object({
  p10: QuantileDateSchema,
  p25: QuantileDateSchema.optional(),
  p50: QuantileDateSchema,
  p75: QuantileDateSchema.optional(),
  p90: QuantileDateSchema,
});

export const ForecastSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  track: TrackIdSchema,
  milestone_id: z.string().min(1),
  committed_on: IsoDateSchema,
  superseded_by: z.string().min(1).nullable(),
  distribution: DistributionSchema,
  scenario_marker: QuantileDateSchema.nullable(),
  moved_by: z.string().min(1).nullable(),
  source_label: z.string().min(1),
  source_url: z.string().url().nullable(),
  source_note: z.string().min(1),
});

export const FalsifierStatusSchema = z.enum([
  "watching",
  "met",
  "not-met",
  "inconclusive",
]);

export const FalsifierAmendmentSchema = z.object({
  original_statement: z.string().min(1),
  amendment: z.string().min(1),
  rationale: z.string().min(1),
  amended_on: IsoDateSchema,
  lock_date: IsoDateSchema,
});

export const ResolutionRecordSchema = z.object({
  resolved_on: IsoDateSchema,
  outcome: z.string().min(1),
  evidence_ref: z.string().min(1),
});

export const FalsifierSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  kind: z.enum(["dated-tripwire", "structural-monitor"]),
  title: z.string().min(1),
  summary: z.string().min(1),
  statement: z.string().min(1),
  deadline: IsoDateSchema.nullable(),
  review_label: z.string().min(1),
  consequence: z.string().min(1),
  status: FalsifierStatusSchema,
  resolution_protocol: z.string().min(1),
  resolution_record: ResolutionRecordSchema.nullable(),
  amendment_history: z.array(FalsifierAmendmentSchema),
  affected_milestones: z.array(z.string().min(1)).min(1),
  evidence_refs: z.array(z.string().min(1)).min(1),
  latest_review: z
    .object({
      date: IsoDateSchema,
      note: z.string().min(1),
      evidence_refs: z.array(z.string().min(1)).min(1),
    })
    .optional(),
});

export const EvidenceSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  date: IsoDateSchema,
  date_kind: z.enum(["published", "updated", "accessed"]).optional(),
  reviewed_on: IsoDateSchema.optional(),
  event_id: z.string().min(1).optional(),
  source_url: z.string().url(),
  source_label: z.string().min(1),
  publisher: z.string().min(1),
  source_type: z.enum([
    "scenario",
    "forecast",
    "evaluation",
    "system-card",
    "deployment",
    "research",
    "framework",
    "survey",
    "incident",
  ]),
  summary: z.string().min(1),
  implication: z.string().min(1),
  limitation: z.string().min(1),
  milestone_tags: z.array(z.string().min(1)).min(1),
  favors: z.enum(["compression", "widening", "spine", "neutral"]),
  diagnosticity: z.enum(["high", "medium", "low"]),
  themes: z
    .array(
      z.enum([
        "open-weight",
        "frontier-lab",
        "independent-evaluation",
        "research-autonomy",
        "evaluation-methods",
        "cybersecurity",
        "alignment-control",
        "scientific-discovery",
        "forecasting",
        "transparency",
        "open-science",
        "scaling",
      ]),
    )
    .optional(),
  independence: z.enum(["first-party", "independent", "mixed"]),
  verification: z.enum([
    "documented",
    "reported",
    "independently-evaluated",
    "reproduced",
    "preliminary",
  ]),
  evaluation_context: z.string().min(1),
  archived: z.boolean().optional(),
  archive_reason: z.string().min(1).optional(),
});

export const BottleneckStatusSchema = z.enum([
  "easing",
  "mixed",
  "binding",
  "unresolved",
]);

export const BottleneckSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  reviewed_on: IsoDateSchema.optional(),
  name: z.string().min(1),
  mechanism: z.string().min(1),
  status: BottleneckStatusSchema,
  confidence: z.enum(["high", "medium", "low"]),
  assessment: z.string().min(1),
  next_signal: z.string().min(1),
  evidence_for: z.array(z.string().min(1)).min(1),
  evidence_against: z.array(z.string().min(1)),
});

export const ProgressCriterionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  weight: z.number().positive().max(1),
  completion: z.number().min(0).max(1),
  rating: ScoreBandIdSchema,
  completion_range: z.object({
    low: z.number().min(0).max(1),
    high: z.number().min(0).max(1),
  }),
  rationale: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).min(1),
  counterevidence_refs: z.array(z.string().min(1)),
});

export const CapabilityProgressSchema = z.object({
  id: z.string().min(1),
  milestone_id: z.string().min(1),
  label: z.string().min(1),
  score: z.number().int().min(0).max(100),
  confidence: z.enum(["high", "medium", "low"]),
  confidence_note: z.string().min(1),
  as_of: IsoDateSchema,
  supersedes: z.string().min(1).nullable().optional(),
  summary: z.string().min(1),
  criteria: z.array(ProgressCriterionSchema).min(1),
});

export const AgentAssessmentSchema = z.object({
  id: z.string().min(1),
  as_of: IsoDateSchema,
  position: z.string().min(1),
  summary: z.string().min(1),
  score_note: z.string().min(1),
  forecast_note: z.string().min(1),
  agents: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        role: z.string().min(1),
        milestone_id: z.string().min(1),
        progress_id: z.string().min(1),
        status: z.enum([
          "assessed-met",
          "partial",
          "early-evidence",
          "precursors",
        ]),
        story_date: z.object({
          value: z.number().finite(),
          label: z.string().min(1),
          source_ref: z.string().min(1),
        }),
        story_summary: z.string().min(1),
        mapping_note: z.string().min(1),
        changed: z.string().min(1),
        missing: z.string().min(1),
        next_test: z.string().min(1),
        forecast_id: z.string().min(1).nullable(),
        evidence_refs: z.array(z.string().min(1)).min(1),
        counterevidence_refs: z.array(z.string().min(1)),
      }),
    )
    .length(5),
  pace: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        verdict: z.enum(["early-signal", "mixed", "not-established"]),
        label: z.string().min(1),
        summary: z.string().min(1),
        story_comparison: z.string().min(1),
        limitation: z.string().min(1),
        evidence_refs: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  outlook: z
    .array(
      z.object({
        milestone_id: z.string().min(1),
        label: z.string().min(1),
        forecast_id: z.string().min(1),
        scenario: z.object({
          value: z.number().finite(),
          label: z.string().min(1),
          source_ref: z.string().min(1),
        }),
        context: z.string().min(1),
        later_milestone: z.boolean(),
      }),
    )
    .min(1),
});

export const OutsideViewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  short_name: z.string().min(1),
  as_of: IsoDateSchema,
  population: z.string().min(1),
  definition: z.string().min(1),
  conditional: z.boolean(),
  probability_before_2100: z.number().min(0).max(1).optional(),
  p25_year: z.number().int().min(2020).max(2300).optional(),
  p50_year: z.number().int().min(2020).max(2300),
  p75_year: z.number().int().min(2020).max(2300).optional(),
  headline: z.string().min(1),
  comparison_note: z.string().min(1),
  source_label: z.string().min(1),
  source_url: z.string().url(),
  evidence_ref: z.string().min(1),
});

export const DriverTrackPositionSchema = z.object({
  track_id: TrackIdSchema,
  direction: z.enum(["shortens", "mixed", "lengthens", "reference"]),
  label: z.string().min(1),
  note: z.string().min(1),
});

export const ForecastDriverSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  question: z.string().min(1),
  phase: z.enum(["pre-ac", "takeoff", "both"]),
  importance: z.enum(["high", "medium", "low"]),
  assessment: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).min(1),
  track_positions: z.array(DriverTrackPositionSchema).length(4),
});

export const SafetyReadinessSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["documented", "developing", "strained", "unknown"]),
  summary: z.string().min(1),
  next_signal: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).min(1),
});

export const OpenWeightIndicatorSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  status: z.enum(["narrowing", "partial", "strong", "unknown"]),
  as_of: IsoDateSchema,
  detail: z.string().min(1),
  source_label: z.string().min(1),
  source_url: z.string().url(),
  evidence_refs: z.array(z.string().min(1)).min(1),
});

export const GlossaryEntrySchema = z.object({
  id: z.string().min(1),
  term: z.string().min(1),
  category: z.enum([
    "milestones",
    "distributions",
    "evidence",
    "tests",
    "method",
  ]),
  definition: z.string().min(1),
  related: z.array(z.string().min(1)).optional(),
});

export const ChangelogSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  date: IsoDateSchema,
  change_summary: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)),
  affected_entities: z.array(z.string().min(1)).min(1),
});

export const ResearchReviewSchema = z.object({
  id: z.string().min(1),
  as_of: IsoDateSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  forecast_note: z.string().min(1),
  packet: z.object({
    name: z.string().min(1),
    page_count: z.number().int().positive(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  }),
  stages: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        status: z.enum(["demonstrated", "partial", "unestablished"]),
        signal: z.string().min(1),
        missing: z.string().min(1),
        evidence_refs: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  claims: z
    .array(
      z.object({
        id: z.string().min(1),
        pages: z.array(z.number().int().positive()).min(1),
        claim: z.string().min(1),
        status: z.enum(["supported", "qualified", "unverified", "context"]),
        assessment: z.string().min(1),
        evidence_refs: z.array(z.string().min(1)),
      }),
    )
    .min(1),
  featured_evidence: z.array(z.string().min(1)).min(1),
  additional_evidence: z.array(z.string().min(1)).min(1),
  supplements: z.array(
    z.object({
      id: z.string().min(1),
      origin: z.string().min(1),
      claim: z.string().min(1),
      assessment: z.string().min(1),
      evidence_refs: z.array(z.string().min(1)).min(1),
    }),
  ),
  measurements: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        title: z.string().min(1),
        value: z.number().finite().nonnegative(),
        unit: z.string().min(1),
        low: z.number().finite().nonnegative().optional(),
        high: z.number().finite().nonnegative().optional(),
        reference: z.number().finite().positive(),
        reference_label: z.string().min(1),
        detail: z.string().min(1),
        source_ref: z.string().min(1),
      }),
    )
    .min(1),
  forecast_impacts: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        direction: z.string().min(1),
        detail: z.string().min(1),
        evidence_refs: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

export const CanonicalSchema = z
  .object({
    meta: MetaSchema,
    methodology: MethodologySchema,
    milestones: z.array(MilestoneSchema).min(1),
    forecasts: z.array(ForecastSchema).min(1),
    falsifiers: z.array(FalsifierSchema).min(1),
    evidence: z.array(EvidenceSchema).min(1),
    bottlenecks: z.array(BottleneckSchema).min(1),
    capability_progress: z.array(CapabilityProgressSchema).min(1),
    outside_views: z.array(OutsideViewSchema).min(1),
    forecast_drivers: z.array(ForecastDriverSchema).min(1),
    safety_readiness: z.array(SafetyReadinessSchema).min(1),
    open_weight_indicators: z.array(OpenWeightIndicatorSchema).min(1),
    glossary: z.array(GlossaryEntrySchema).min(1),
    changelog: z.array(ChangelogSchema).min(1),
    research_review: ResearchReviewSchema,
    agent_assessment: AgentAssessmentSchema,
  })
  .superRefine((data, ctx) => {
    const unique = (
      items: Array<{ id: string }>,
      path: (string | number)[],
      label: string,
    ) => {
      const seen = new Set<string>();
      items.forEach((item, index) => {
        if (seen.has(item.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate ${label} id: ${item.id}`,
            path: [...path, index, "id"],
          });
        }
        seen.add(item.id);
      });
      return seen;
    };

    const trackIds = unique(data.meta.tracks, ["meta", "tracks"], "track");
    const milestoneIds = unique(data.milestones, ["milestones"], "milestone");
    const forecastIds = unique(data.forecasts, ["forecasts"], "forecast");
    const falsifierIds = unique(data.falsifiers, ["falsifiers"], "falsifier");
    const evidenceIds = unique(data.evidence, ["evidence"], "evidence");
    const review = data.research_review;
    const checkReviewRefs = (refs: string[], path: (string | number)[]) => {
      refs.forEach((ref, index) => {
        if (!evidenceIds.has(ref))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: [...path, index],
          });
      });
    };
    for (const key of [
      "stages",
      "claims",
      "forecast_impacts",
      "supplements",
    ] as const) {
      unique(review[key], ["research_review", key], key);
      review[key].forEach((item, index) =>
        checkReviewRefs(item.evidence_refs, [
          "research_review",
          key,
          index,
          "evidence_refs",
        ]),
      );
    }
    for (const key of ["featured_evidence", "additional_evidence"] as const) {
      checkReviewRefs(review[key], ["research_review", key]);
    }
    unique(
      review.measurements,
      ["research_review", "measurements"],
      "measurement",
    );
    review.measurements.forEach((m, index) => {
      checkReviewRefs(
        [m.source_ref],
        ["research_review", "measurements", index, "source_ref"],
      );
      if (
        (m.low === undefined) !== (m.high === undefined) ||
        (m.low !== undefined &&
          m.high !== undefined &&
          (m.low > m.value || m.high < m.value))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Interval must be complete and contain the estimate",
          path: ["research_review", "measurements", index],
        });
      }
    });
    const pages = new Set<number>();
    review.claims.forEach((claim, index) => {
      if (
        ["supported", "qualified"].includes(claim.status) &&
        !claim.evidence_refs.length
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Admitted claims need primary evidence",
          path: ["research_review", "claims", index, "evidence_refs"],
        });
      }
      claim.pages.forEach((page, pageIndex) => {
        if (page > review.packet.page_count || pages.has(page)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Packet page must be in range and covered once",
            path: ["research_review", "claims", index, "pages", pageIndex],
          });
        }
        pages.add(page);
      });
    });
    if (pages.size !== review.packet.page_count)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Every packet page must have an audit disposition",
        path: ["research_review", "claims"],
      });
    data.evidence.forEach((e, index) => {
      if (
        e.reviewed_on &&
        (e.reviewed_on < e.date ||
          e.reviewed_on >
            [review.as_of, data.agent_assessment.as_of].sort().at(-1)!)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Review date must follow the source date and not exceed the review cutoff",
          path: ["evidence", index, "reviewed_on"],
        });
      }
    });
    data.falsifiers.forEach((f, index) => {
      if (f.latest_review)
        checkReviewRefs(f.latest_review.evidence_refs, [
          "falsifiers",
          index,
          "latest_review",
          "evidence_refs",
        ]);
    });
    const bottleneckIds = unique(
      data.bottlenecks,
      ["bottlenecks"],
      "bottleneck",
    );
    const changelogIds = unique(data.changelog, ["changelog"], "changelog");
    const progressIds = unique(
      data.capability_progress,
      ["capability_progress"],
      "capability progress",
    );
    const assessment = data.agent_assessment;
    unique(assessment.agents, ["agent_assessment", "agents"], "agent");
    unique(assessment.pace, ["agent_assessment", "pace"], "pace assessment");
    const referenceIssue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });
    const validateForecastRef = (
      id: string,
      milestoneId: string,
      path: (string | number)[],
    ) => {
      const forecast = data.forecasts.find((f) => f.id === id);
      if (
        !forecast ||
        forecast.milestone_id !== milestoneId ||
        forecast.track !== "codex" ||
        forecast.superseded_by ||
        forecast.committed_on > assessment.as_of
      )
        referenceIssue(
          "Assessment must reference a current house forecast for the same milestone, available by its review date",
          path,
        );
    };
    assessment.agents.forEach((agent, index) => {
      const path = ["agent_assessment", "agents", index];
      const progress = data.capability_progress.find(
        (p) => p.id === agent.progress_id,
      );
      if (
        !progress ||
        progress.milestone_id !== agent.milestone_id ||
        progress.as_of !== assessment.as_of ||
        data.capability_progress.some((p) => p.supersedes === progress.id)
      )
        referenceIssue(
          "Agent must reference its current dated capability assessment",
          [...path, "progress_id"],
        );
      if (!milestoneIds.has(agent.milestone_id))
        referenceIssue("Unknown milestone", [...path, "milestone_id"]);
      if (
        agent.status === "assessed-met" &&
        progress?.criteria.some((c) => c.completion < 1)
      )
        referenceIssue("A met agent requires every criterion to be met", [
          ...path,
          "status",
        ]);
      checkReviewRefs(
        [agent.story_date.source_ref],
        [...path, "story_date", "source_ref"],
      );
      checkReviewRefs(agent.evidence_refs, [...path, "evidence_refs"]);
      checkReviewRefs(agent.counterevidence_refs, [
        ...path,
        "counterevidence_refs",
      ]);
      if (agent.forecast_id)
        validateForecastRef(agent.forecast_id, agent.milestone_id, [
          ...path,
          "forecast_id",
        ]);
    });
    assessment.pace.forEach((item, index) =>
      checkReviewRefs(item.evidence_refs, [
        "agent_assessment",
        "pace",
        index,
        "evidence_refs",
      ]),
    );
    assessment.outlook.forEach((item, index) => {
      validateForecastRef(item.forecast_id, item.milestone_id, [
        "agent_assessment",
        "outlook",
        index,
        "forecast_id",
      ]);
      checkReviewRefs(
        [item.scenario.source_ref],
        ["agent_assessment", "outlook", index, "scenario", "source_ref"],
      );
    });
    const outsideViewIds = unique(
      data.outside_views,
      ["outside_views"],
      "outside view",
    );
    const driverIds = unique(
      data.forecast_drivers,
      ["forecast_drivers"],
      "forecast driver",
    );
    const safetyIds = unique(
      data.safety_readiness,
      ["safety_readiness"],
      "safety readiness",
    );
    const openWeightIds = unique(
      data.open_weight_indicators,
      ["open_weight_indicators"],
      "open-weight indicator",
    );
    const glossaryIds = unique(data.glossary, ["glossary"], "glossary entry");
    const methodStepIds = unique(
      data.methodology.steps,
      ["methodology", "steps"],
      "method step",
    );
    const methodAxisIds = unique(
      data.methodology.evidence_axes,
      ["methodology", "evidence_axes"],
      "evidence axis",
    );
    const scoreBandIds = unique(
      data.methodology.score_bands,
      ["methodology", "score_bands"],
      "score band",
    );

    if (methodStepIds.size !== 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Methodology must contain five unique decision steps",
        path: ["methodology", "steps"],
      });
    }
    if (methodAxisIds.size !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Methodology must contain three unique evidence axes",
        path: ["methodology", "evidence_axes"],
      });
    }
    if (scoreBandIds.size !== 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Methodology must contain five unique score bands",
        path: ["methodology", "score_bands"],
      });
    }
    data.methodology.score_bands.forEach((band, index) => {
      if (band.min > band.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Score band minimum must not exceed maximum",
          path: ["methodology", "score_bands", index],
        });
      }
    });
    const [lagLow, lagCenter, lagHigh] = data.methodology.lag_scenarios_months;
    if (lagLow > lagCenter || lagCenter > lagHigh) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lag scenarios must be ordered from shortest to longest",
        path: ["methodology", "lag_scenarios_months"],
      });
    }
    if (lagCenter !== data.meta.internal_lag_months) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The center lag scenario must match meta.internal_lag_months",
        path: ["methodology", "lag_scenarios_months", 1],
      });
    }

    data.glossary.forEach((entry, index) => {
      entry.related?.forEach((ref, refIndex) => {
        if (!glossaryIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown related glossary id: ${ref}`,
            path: ["glossary", index, "related", refIndex],
          });
        }
      });
    });

    const allEntityIds = new Set([
      review.id,
      assessment.id,
      data.methodology.id,
      ...trackIds,
      ...milestoneIds,
      ...forecastIds,
      ...falsifierIds,
      ...evidenceIds,
      ...bottleneckIds,
      ...changelogIds,
      ...progressIds,
      ...outsideViewIds,
      ...driverIds,
      ...safetyIds,
      ...openWeightIds,
      ...glossaryIds,
    ]);

    data.forecasts.forEach((forecast, index) => {
      if (!trackIds.has(forecast.track)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown track id: ${forecast.track}`,
          path: ["forecasts", index, "track"],
        });
      }
      if (!milestoneIds.has(forecast.milestone_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown milestone id: ${forecast.milestone_id}`,
          path: ["forecasts", index, "milestone_id"],
        });
      }
      if (forecast.superseded_by && !forecastIds.has(forecast.superseded_by)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown superseding forecast id: ${forecast.superseded_by}`,
          path: ["forecasts", index, "superseded_by"],
        });
      }
      if (
        forecast.moved_by &&
        !falsifierIds.has(forecast.moved_by) &&
        !evidenceIds.has(forecast.moved_by)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `moved_by must reference an evidence or falsifier id: ${forecast.moved_by}`,
          path: ["forecasts", index, "moved_by"],
        });
      }

      const q = forecast.distribution;
      const ordered = [
        q.p10.value,
        q.p25?.value,
        q.p50.value,
        q.p75?.value,
        q.p90.value,
      ].filter((value): value is number => value !== undefined);
      for (let cursor = 1; cursor < ordered.length; cursor += 1) {
        if (ordered[cursor] < ordered[cursor - 1]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Forecast quantiles must be ordered p10 <= p25 <= p50 <= p75 <= p90",
            path: ["forecasts", index, "distribution"],
          });
          break;
        }
      }
    });

    data.falsifiers.forEach((falsifier, index) => {
      const evidenceRef = falsifier.resolution_record?.evidence_ref;
      if (evidenceRef && !evidenceIds.has(evidenceRef)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown evidence id: ${evidenceRef}`,
          path: ["falsifiers", index, "resolution_record", "evidence_ref"],
        });
      }
      falsifier.affected_milestones.forEach((ref, refIndex) => {
        if (!milestoneIds.has(ref))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown milestone id: ${ref}`,
            path: ["falsifiers", index, "affected_milestones", refIndex],
          });
      });
      falsifier.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: ["falsifiers", index, "evidence_refs", refIndex],
          });
      });
    });

    data.evidence.forEach((item, index) => {
      if (item.archived && !item.archive_reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Archived evidence must explain why it left the live ledger",
          path: ["evidence", index, "archive_reason"],
        });
      }
      if (!item.archived && item.archive_reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "archive_reason is only valid when archived is true",
          path: ["evidence", index, "archive_reason"],
        });
      }
      item.milestone_tags.forEach((tag, tagIndex) => {
        if (!milestoneIds.has(tag)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown milestone id: ${tag}`,
            path: ["evidence", index, "milestone_tags", tagIndex],
          });
        }
      });
    });

    const reasoning = data.meta.briefing.reasoning;
    reasoning.steps.forEach((step, stepIndex) => {
      step.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: [
              "meta",
              "briefing",
              "reasoning",
              "steps",
              stepIndex,
              "evidence_refs",
              refIndex,
            ],
          });
        }
      });
    });
    reasoning.disagreement_evidence_refs.forEach((ref, refIndex) => {
      if (!evidenceIds.has(ref)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown evidence id: ${ref}`,
          path: [
            "meta",
            "briefing",
            "reasoning",
            "disagreement_evidence_refs",
            refIndex,
          ],
        });
      }
    });
    reasoning.cruxes.forEach((crux, cruxIndex) => {
      crux.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: [
              "meta",
              "briefing",
              "reasoning",
              "cruxes",
              cruxIndex,
              "evidence_refs",
              refIndex,
            ],
          });
        }
      });
    });

    data.bottlenecks.forEach((bottleneck, index) => {
      [...bottleneck.evidence_for, ...bottleneck.evidence_against].forEach(
        (ref, refIndex) => {
          if (!evidenceIds.has(ref))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Unknown evidence id: ${ref}`,
              path: ["bottlenecks", index, "evidence_refs", refIndex],
            });
        },
      );
    });

    data.capability_progress.forEach((progress, index) => {
      unique(
        progress.criteria,
        ["capability_progress", index, "criteria"],
        "criterion",
      );
      if (progress.supersedes) {
        const previous = data.capability_progress.find(
          (p) => p.id === progress.supersedes,
        );
        if (
          !previous ||
          previous.milestone_id !== progress.milestone_id ||
          previous.as_of >= progress.as_of
        )
          referenceIssue(
            "Superseded progress must be an earlier assessment of the same milestone",
            ["capability_progress", index, "supersedes"],
          );
        if (
          data.capability_progress.filter(
            (p) => p.supersedes === progress.supersedes,
          ).length > 1
        )
          referenceIssue(
            "A capability assessment may only have one successor",
            ["capability_progress", index, "supersedes"],
          );
      }
      if (!milestoneIds.has(progress.milestone_id))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown milestone id: ${progress.milestone_id}`,
          path: ["capability_progress", index, "milestone_id"],
        });
      const totalWeight = progress.criteria.reduce(
        (sum, criterion) => sum + criterion.weight,
        0,
      );
      if (Math.abs(totalWeight - 1) > 0.001)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Capability progress criterion weights must sum to 1",
          path: ["capability_progress", index, "criteria"],
        });
      const calculated = Math.round(
        (progress.criteria.reduce(
          (sum, criterion) => sum + criterion.weight * criterion.completion,
          0,
        ) +
          Number.EPSILON) *
          100,
      );
      if (calculated !== progress.score)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Capability progress score must equal weighted criteria (${calculated})`,
          path: ["capability_progress", index, "score"],
        });
      progress.criteria.forEach((criterion, criterionIndex) => {
        if (
          criterion.completion_range.low > criterion.completion ||
          criterion.completion > criterion.completion_range.high
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Criterion completion must fall inside its uncertainty range",
            path: [
              "capability_progress",
              index,
              "criteria",
              criterionIndex,
              "completion_range",
            ],
          });
        }
        const band = data.methodology.score_bands.find(
          (item) => item.id === criterion.rating,
        );
        if (
          band &&
          (criterion.completion < band.min || criterion.completion > band.max)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Criterion completion does not match the ${criterion.rating} score band`,
            path: [
              "capability_progress",
              index,
              "criteria",
              criterionIndex,
              "rating",
            ],
          });
        }
        const supportingRefs = new Set(criterion.evidence_refs);
        criterion.evidence_refs.forEach((ref, refIndex) => {
          if (!evidenceIds.has(ref)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Unknown evidence id: ${ref}`,
              path: [
                "capability_progress",
                index,
                "criteria",
                criterionIndex,
                "evidence_refs",
                refIndex,
              ],
            });
          }
        });
        criterion.counterevidence_refs.forEach((ref, refIndex) => {
          if (!evidenceIds.has(ref)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Unknown evidence id: ${ref}`,
              path: [
                "capability_progress",
                index,
                "criteria",
                criterionIndex,
                "counterevidence_refs",
                refIndex,
              ],
            });
          }
          if (supportingRefs.has(ref)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "A criterion cannot list the same record as evidence and counterevidence",
              path: [
                "capability_progress",
                index,
                "criteria",
                criterionIndex,
                "counterevidence_refs",
                refIndex,
              ],
            });
          }
        });
      });
    });

    data.outside_views.forEach((view, index) => {
      if (!evidenceIds.has(view.evidence_ref)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown evidence id: ${view.evidence_ref}`,
          path: ["outside_views", index, "evidence_ref"],
        });
      }
      const ordered = [view.p25_year, view.p50_year, view.p75_year].filter(
        (value): value is number => value !== undefined,
      );
      for (let cursor = 1; cursor < ordered.length; cursor += 1) {
        if (ordered[cursor] < ordered[cursor - 1]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Outside-view percentiles must be ordered p25 <= p50 <= p75",
            path: ["outside_views", index],
          });
          break;
        }
      }
    });

    data.forecast_drivers.forEach((driver, index) => {
      driver.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: ["forecast_drivers", index, "evidence_refs", refIndex],
          });
        }
      });
      const seenTracks = new Set<string>();
      driver.track_positions.forEach((position, positionIndex) => {
        if (!trackIds.has(position.track_id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown track id: ${position.track_id}`,
            path: [
              "forecast_drivers",
              index,
              "track_positions",
              positionIndex,
              "track_id",
            ],
          });
        }
        if (seenTracks.has(position.track_id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate track position: ${position.track_id}`,
            path: [
              "forecast_drivers",
              index,
              "track_positions",
              positionIndex,
              "track_id",
            ],
          });
        }
        seenTracks.add(position.track_id);
      });
    });

    data.safety_readiness.forEach((item, index) => {
      item.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: ["safety_readiness", index, "evidence_refs", refIndex],
          });
        }
      });
    });

    data.open_weight_indicators.forEach((item, index) => {
      item.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: ["open_weight_indicators", index, "evidence_refs", refIndex],
          });
        }
      });
    });

    data.changelog.forEach((entry, index) => {
      entry.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown evidence id: ${ref}`,
            path: ["changelog", index, "evidence_refs", refIndex],
          });
        }
      });
      entry.affected_entities.forEach((ref, refIndex) => {
        if (!allEntityIds.has(ref)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown affected entity id: ${ref}`,
            path: ["changelog", index, "affected_entities", refIndex],
          });
        }
      });
    });
  });

export type CanonicalData = z.infer<typeof CanonicalSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export type Forecast = z.infer<typeof ForecastSchema>;
export type QuantileDate = z.infer<typeof QuantileDateSchema>;
export type Falsifier = z.infer<typeof FalsifierSchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type Bottleneck = z.infer<typeof BottleneckSchema>;
export type CapabilityProgress = z.infer<typeof CapabilityProgressSchema>;
export type OutsideView = z.infer<typeof OutsideViewSchema>;
export type ForecastDriver = z.infer<typeof ForecastDriverSchema>;
export type SafetyReadiness = z.infer<typeof SafetyReadinessSchema>;
export type OpenWeightIndicator = z.infer<typeof OpenWeightIndicatorSchema>;
export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
export type ReadingPath = z.infer<typeof ReadingPathSchema>;
export type PaceSource = z.infer<typeof PaceSourceSchema>;
export type ChangelogEntry = z.infer<typeof ChangelogSchema>;
export type Methodology = z.infer<typeof MethodologySchema>;
