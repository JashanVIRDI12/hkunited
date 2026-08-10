/**
 * Safety programme. Every pillar below is drawn from the safety section of
 * hkunited.ca/about-us.html — this is the company's strongest verified
 * differentiator and is quoted closely.
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
      "Every driver completes comprehensive professional training covering fatigue management and incident response. The programme goes beyond the industry baseline by adding road testing and semi-annual evaluations — competence is re-proven, not assumed.",
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
      "Job safety assessments are performed ahead of project start to proactively reduce the likelihood of incidents, and a safety meeting is held on day one — so the crew and the site share one understanding of the hazards before work begins.",
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
      "Our safety team conducts unannounced site visits inspecting documentation, safety equipment, licences, log books, daily trip inspections and personal protective equipment. Compliance that only appears when scheduled is not compliance.",
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
      "We maintain a high standard of vehicle maintenance alongside driver training in order to deliver exceptional service and adhere to industry standards. A modern fleet is maintained to the highest standards — availability and safety are the same discipline.",
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
