/**
 * Safety programme. Every pillar below is drawn from the safety section of
 * hkunited.ca/about-us.html — this is the company's strongest verified
 * differentiator and is quoted closely.
 *
 * THE THREE FIELDS DO NOT REPEAT EACH OTHER, and keeping them that way is an
 * editing rule rather than a preference. Each pillar renders all three at
 * once, so any claim made twice is read twice:
 *
 *   statement   the argument, in display type. The line worth quoting.
 *   detail      HOW it is held - the mechanism, the cadence, who does it.
 *               This is the only field the summaries elsewhere omit, so it
 *               has to earn its place by saying something they cannot.
 *   practices   WHAT is done, as discrete verifiable items.
 *
 * The details previously restated their own statements and re-listed their
 * own practices - pillar 04 said "high standard" three times between the two
 * fields, and pillar 03 closed on "compliance that only appears when
 * scheduled is not compliance", which is also the homepage safety heading.
 * A safety page that says the same thing three ways reads as marketing,
 * which is the one thing this content must not do.
 *
 * WHEN EDITING: a detail may only use facts already present in the practices
 * or on the source page. Nothing here may be invented - see the sourcing
 * rule in content/company.ts.
 */

export interface SafetyPillar {
  id: string;
  title: string;
  /** Editorial statement, large type. */
  statement: string;
  detail: string;
  /** Concrete, verifiable practices. */
  practices: readonly string[];
  index: string;
}

export const SAFETY_PILLARS: readonly SafetyPillar[] = [
  {
    id: "training",
    title: "Professional Training",
    statement: "Training that surpasses industry standards.",
    detail:
      "Training is completed before a driver carries a load, and it does not stop there — the road test taken on hire is repeated every six months. That repetition is the point: competence is re-proven rather than assumed.",
    practices: [
      "Fatigue management curriculum",
      "Incident response training",
      "Road testing on hire",
      "Semi-annual re-evaluation",
    ],
    index: "01",
  },
  {
    id: "assessment",
    title: "Proactive Assessment",
    statement: "The risk is reduced before the first load moves.",
    detail:
      "The assessment is made before mobilisation rather than after an incident, so hazards are identified and site-specific controls agreed while there is still time to design around them. The day-one meeting then puts the crew and the site on one account of what those hazards are.",
    practices: [
      "Pre-project job safety assessment",
      "Day-one site safety meeting",
      "Hazard identification",
      "Site-specific controls",
    ],
    index: "02",
  },
  {
    id: "inspection",
    title: "Unannounced Inspection",
    statement: "Audited without warning, because that is the only honest audit.",
    detail:
      "The visits are made by our own safety team and are never scheduled with the site. What gets checked is the paperwork a load actually travels with — licences, log books, the day’s trip inspection — alongside the safety equipment and protective gear in use.",
    practices: [
      "Unannounced site visits",
      "Log book & licence audit",
      "Daily trip inspection review",
      "PPE and equipment checks",
    ],
    index: "03",
  },
  {
    id: "maintenance",
    title: "Vehicle Maintenance",
    statement: "A high standard of maintenance, held continuously.",
    detail:
      "Maintenance runs to a schedule rather than to failure, and every unit is inspected daily before it leaves the yard. A fleet kept current is a fleet that is available, which is why availability and safety are treated here as the same discipline.",
    practices: [
      "Scheduled preventive maintenance",
      "Daily trip inspections",
      "Modern fleet renewal",
      "Documented service history",
    ],
    index: "04",
  },
] as const;

/**
 * "Why HK United" timeline. Ordered narrative, not a feature grid.
 */
export const DIFFERENTIATORS = [
  {
    id: "experience",
    label: "Experience",
    heading: "Fifteen-plus years at the forefront",
    body: "HK United has spent over fifteen years at the forefront of premier fleet and logistics services in the Greater Toronto Area — through every construction cycle the region has run.",
  },
  {
    id: "equipment",
    label: "Equipment",
    heading: "One of Ontario's largest fleets",
    body: "Bulk, tank, waste and flatbed divisions under one operator. Fleet depth means we absorb your surge without subcontracting away control of your schedule.",
  },
  {
    id: "safety",
    label: "Safety",
    heading: "Unwavering commitment to health and safety",
    body: "Training that exceeds the industry baseline, pre-project risk assessment and unannounced auditing — an unwavering commitment to health and safety standards.",
  },
  {
    id: "reliability",
    label: "Reliability",
    heading: "Delivered on schedule, in the right order",
    body: "Able to handle jobs of any scale, with the intelligence to deliver on schedule and in the appropriate order. Sequence is the difference between material on site and material in the way.",
  },
] as const;
