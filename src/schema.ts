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

export const BriefingSchema = z.object({
  as_of: IsoDateSchema,
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  pace_label: z.string().min(1),
  pace_value: z.string().min(1),
  pace_detail: z.string().min(1),
  pace_source_label: z.string().min(1),
  pace_source_url: z.string().url(),
  lenses: z.array(BriefingLensSchema).length(3),
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
  progress_label: z.string().min(1),
  progress_disclaimer: z.string().min(1),
  distribution_warning: z.string().min(1),
  sample_warning: z.string().min(1),
  last_updated_label: z.string().min(1),
  next_review_label: z.string().min(1),
  headline_stats: z.array(HeadlineStatSchema).max(4).optional(),
  briefing: BriefingSchema,
  action_center: ActionCenterSchema,
  tracks: z.array(TrackSchema).min(1),
  views: z.array(ViewMetaSchema).length(7),
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

export const FalsifierStatusSchema = z.enum(["watching", "met", "not-met", "inconclusive"]);

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
});

export const EvidenceSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  date: IsoDateSchema,
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
  themes: z.array(z.enum([
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
  ])).optional(),
  independence: z.enum(["first-party", "independent", "mixed"]).optional(),
  verification: z.enum([
    "documented",
    "reported",
    "independently-evaluated",
    "reproduced",
    "preliminary",
  ]).optional(),
  evaluation_context: z.string().min(1).optional(),
});

export const BottleneckStatusSchema = z.enum(["easing", "mixed", "binding", "unresolved"]);

export const BottleneckSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
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
  rationale: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)).min(1),
});

export const CapabilityProgressSchema = z.object({
  id: z.string().min(1),
  milestone_id: z.string().min(1),
  label: z.string().min(1),
  score: z.number().int().min(0).max(100),
  confidence: z.enum(["high", "medium", "low"]),
  as_of: IsoDateSchema,
  summary: z.string().min(1),
  criteria: z.array(ProgressCriterionSchema).min(1),
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

export const ChangelogSchema = SampleFieldsSchema.extend({
  id: z.string().min(1),
  date: IsoDateSchema,
  change_summary: z.string().min(1),
  evidence_refs: z.array(z.string().min(1)),
  affected_entities: z.array(z.string().min(1)).min(1),
});

export const CanonicalSchema = z
  .object({
    meta: MetaSchema,
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
    changelog: z.array(ChangelogSchema).min(1),
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
    const bottleneckIds = unique(data.bottlenecks, ["bottlenecks"], "bottleneck");
    const changelogIds = unique(data.changelog, ["changelog"], "changelog");
    const progressIds = unique(data.capability_progress, ["capability_progress"], "capability progress");
    const outsideViewIds = unique(data.outside_views, ["outside_views"], "outside view");
    const driverIds = unique(data.forecast_drivers, ["forecast_drivers"], "forecast driver");
    const safetyIds = unique(data.safety_readiness, ["safety_readiness"], "safety readiness");
    const openWeightIds = unique(data.open_weight_indicators, ["open_weight_indicators"], "open-weight indicator");

    const allEntityIds = new Set([
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
      const ordered = [q.p10.value, q.p25?.value, q.p50.value, q.p75?.value, q.p90.value].filter(
        (value): value is number => value !== undefined,
      );
      for (let cursor = 1; cursor < ordered.length; cursor += 1) {
        if (ordered[cursor] < ordered[cursor - 1]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Forecast quantiles must be ordered p10 <= p25 <= p50 <= p75 <= p90",
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
        if (!milestoneIds.has(ref)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown milestone id: ${ref}`, path: ["falsifiers", index, "affected_milestones", refIndex] });
      });
      falsifier.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown evidence id: ${ref}`, path: ["falsifiers", index, "evidence_refs", refIndex] });
      });
    });

    data.evidence.forEach((item, index) => {
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

    data.bottlenecks.forEach((bottleneck, index) => {
      [...bottleneck.evidence_for, ...bottleneck.evidence_against].forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown evidence id: ${ref}`, path: ["bottlenecks", index, "evidence_refs", refIndex] });
      });
    });

    data.capability_progress.forEach((progress, index) => {
      if (!milestoneIds.has(progress.milestone_id)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown milestone id: ${progress.milestone_id}`, path: ["capability_progress", index, "milestone_id"] });
      const totalWeight = progress.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
      if (Math.abs(totalWeight - 1) > 0.001) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Capability progress criterion weights must sum to 1", path: ["capability_progress", index, "criteria"] });
      const calculated = Math.round(progress.criteria.reduce((sum, criterion) => sum + criterion.weight * criterion.completion, 0) * 100);
      if (calculated !== progress.score) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Capability progress score must equal weighted criteria (${calculated})`, path: ["capability_progress", index, "score"] });
      progress.criteria.forEach((criterion, criterionIndex) => criterion.evidence_refs.forEach((ref, refIndex) => {
        if (!evidenceIds.has(ref)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown evidence id: ${ref}`, path: ["capability_progress", index, "criteria", criterionIndex, "evidence_refs", refIndex] });
      }));
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
            message: "Outside-view percentiles must be ordered p25 <= p50 <= p75",
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
            path: ["forecast_drivers", index, "track_positions", positionIndex, "track_id"],
          });
        }
        if (seenTracks.has(position.track_id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate track position: ${position.track_id}`,
            path: ["forecast_drivers", index, "track_positions", positionIndex, "track_id"],
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
export type ChangelogEntry = z.infer<typeof ChangelogSchema>;
