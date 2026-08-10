/**
 * How a job runs.
 *
 * Grounded in HK United's published operating practice: job safety
 * assessments before project start, a day-one site safety meeting,
 * scheduled delivery "on schedule and in the appropriate order", and
 * documented inspection. Nothing here describes a system they have not
 * said they operate.
 */

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

export const PROCESS: readonly ProcessStep[] = [
  {
    index: "01",
    title: "Scope",
    body: "Material, volume, site access and schedule. We size the fleet to your excavation or delivery rate so haulage never becomes the constraint.",
  },
  {
    index: "02",
    title: "Assess",
    body: "A job safety assessment is performed before the project starts, identifying hazards and setting site-specific controls in advance.",
  },
  {
    index: "03",
    title: "Mobilise",
    body: "A safety meeting is held on day one so the crew and the site share one understanding of the work before the first load moves.",
  },
  {
    index: "04",
    title: "Haul",
    body: "Units are dispatched to your cadence and sequenced so material arrives in the order the site needs it — not simply as soon as possible.",
  },
  {
    index: "05",
    title: "Document",
    body: "Daily trip inspections, log books and load documentation are maintained throughout, and audited by unannounced site visits.",
  },
] as const;
