/**
 * Service lines. Capability language is drawn from hkunited.ca sector pages
 * (construction.html, mining.html, energy.html, agriculture.html,
 * waste-management.html) and division.html.
 */

export interface Service {
  slug: string;
  name: string;
  /** Editorial one-liner used in list views. */
  summary: string;
  description: string;
  capabilities: readonly string[];
  /** Two-digit editorial index. */
  index: string;
}

export const SERVICES: readonly Service[] = [
  {
    slug: "dump-truck-services",
    name: "Dump Truck Services",
    summary: "High-cycle aggregate and fill movement on active sites.",
    description:
      "Tri-axle and quad dump trucks dispatched to match your site cadence. We size the fleet to the excavation rate so loading never becomes the constraint on your critical path.",
    capabilities: ["Site loading cycles", "Aggregate delivery", "Fill removal", "Multi-unit dispatch"],
    index: "01",
  },
  {
    slug: "tank-trailer-transport",
    name: "Tank Trailer Transport",
    summary: "Sealed liquid haulage, including heated liquid asphalt.",
    description:
      "Our tank division moves liquid asphalt and industrial liquids under strict handling, temperature and documentation control across Ontario.",
    capabilities: ["Liquid asphalt", "Industrial liquids", "Temperature-held transport", "Sealed transfer"],
    index: "02",
  },
  {
    slug: "aggregate-hauling",
    name: "Aggregate Hauling",
    summary: "Gravel, sand and granular delivered in sequence.",
    description:
      "Pit-to-site aggregate supply with the scheduling intelligence to deliver in the appropriate order — so material arrives when the crew is ready for it, not before.",
    capabilities: ["Gravel & sand", "Granular A/B", "Pit-to-site supply", "Sequenced delivery"],
    index: "03",
  },
  {
    slug: "excavation-support",
    name: "Excavation Support",
    summary: "Haul-away capacity matched to the machine.",
    description:
      "Continuous haul-off for excavation and shoring operations, including transit line excavation and deep foundation work in constrained downtown sites.",
    capabilities: ["Spoil removal", "Transit excavation", "Foundation digs", "Constrained-site access"],
    index: "04",
  },
  {
    slug: "construction-materials",
    name: "Construction Materials",
    summary: "Steel, culverts, shingles and palletised supply.",
    description:
      "Flatdeck delivery of the material that builds the structure — steel bars, cement culverts, shingles and packaged supply, secured and staged to your site plan.",
    capabilities: ["Steel bars", "Cement culverts", "Shingles", "Palletised supply"],
    index: "05",
  },
  {
    slug: "heavy-hauling",
    name: "Heavy Hauling",
    summary: "Oversize and overweight freight across Ontario.",
    description:
      "Equipment moves and oversize loads planned around route, permit and clearance constraints, with securement engineered to the load rather than improvised on site.",
    capabilities: ["Equipment moves", "Oversize freight", "Route planning", "Engineered securement"],
    index: "06",
  },
  {
    slug: "snow-removal",
    name: "Snow Removal",
    summary: "Winter haul-off capacity when the city stops.",
    description:
      "Seasonal snow haulage for municipal and commercial properties. The same fleet that hauls aggregate in August clears accumulation in January — capacity you have already qualified.",
    capabilities: ["Snow haul-off", "Municipal contracts", "Commercial lots", "Storm response"],
    index: "07",
  },
  {
    slug: "municipal-services",
    name: "Municipal Services",
    summary: "Contract haulage for public infrastructure.",
    description:
      "Road rehabilitation, public works and municipal waste haulage delivered against the documentation and compliance standards public contracts require.",
    capabilities: ["Road rehabilitation", "Public works", "Municipal waste", "Compliance reporting"],
    index: "08",
  },
  {
    slug: "environmental-hauling",
    name: "Environmental Hauling",
    summary: "Contaminated soil and regulated material streams.",
    description:
      "We are a trusted carrier for contaminated soil in the Greater Toronto Area — tracked, documented and delivered to approved receiving sites with a strong environmental record.",
    capabilities: ["Contaminated soil", "Regulated fill", "Approved receiving sites", "Chain of documentation"],
    index: "09",
  },
  {
    slug: "industrial-transport",
    name: "Industrial Transport",
    summary: "Plant-to-plant bulk and liquid movement.",
    description:
      "Scheduled industrial haulage for mining, energy and agricultural operations, built around plant uptime rather than generic freight windows.",
    capabilities: ["Plant-to-plant", "Bulk industrial", "Mining & energy", "Scheduled contracts"],
    index: "10",
  },
] as const;

export const getService = (slug: string): Service | undefined =>
  SERVICES.find((service) => service.slug === slug);
