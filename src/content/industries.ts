/**
 * Sectors served. Source: hkunited.ca sector pages.
 * Construction copy quotes construction.html directly.
 */

export interface Industry {
  slug: string;
  name: string;
  /** Large editorial statement. */
  statement: string;
  description: string;
  materials: readonly string[];
  index: string;
}

export const INDUSTRIES: readonly Industry[] = [
  {
    slug: "construction",
    name: "Construction",
    statement: "The most trusted carrier in the GTA for contaminated soil and clean fill.",
    description:
      "From downtown condominium excavation to transit line construction and highway paving, we both remove what the site cannot keep and deliver what it needs — on schedule and in the appropriate order.",
    materials: ["Contaminated soil", "Clean fill", "Gravel & sand", "Liquid asphalt", "Steel & culverts"],
    index: "01",
  },
  {
    slug: "waste-management",
    name: "Waste Management",
    statement: "Continuous capacity for municipal and industrial waste streams.",
    description:
      "Walking floor and bulk units serving transfer stations, processing facilities and municipal contracts, with the documentation discipline regulated streams demand.",
    materials: ["Municipal waste", "Recyclables", "Wood waste", "Processed residuals"],
    index: "02",
  },
  {
    slug: "mining",
    name: "Mining",
    statement: "Aggregate and extracted material moved at production rate.",
    description:
      "Pit and quarry haulage sized to extraction output, keeping stockpiles clear and production uninterrupted through Ontario's operating season.",
    materials: ["Aggregate", "Ore", "Overburden", "Processed stone"],
    index: "03",
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    statement: "Seasonal bulk capacity when the harvest window is fixed.",
    description:
      "Agricultural bulk transport scheduled around a window that does not move — with fleet depth to surge when the season demands it.",
    materials: ["Grain", "Bulk feed", "Soil amendments", "Biomass"],
    index: "04",
  },
  {
    slug: "energy",
    name: "Energy",
    statement: "Liquid and bulk transport for energy infrastructure.",
    description:
      "Tank and flatdeck support for energy sector construction and operations, executed to the safety and documentation standard the sector requires.",
    materials: ["Industrial liquids", "Construction supply", "Equipment", "Bulk material"],
    index: "05",
  },
] as const;

export const getIndustry = (slug: string): Industry | undefined =>
  INDUSTRIES.find((industry) => industry.slug === slug);
