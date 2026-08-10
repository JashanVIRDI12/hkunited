/**
 * Capability studies.
 *
 * IMPORTANT: hkunited.ca names project *types* it has managed
 * ("downtown condominiums, transit line excavation, and highway paving")
 * but names no clients, sites, dates or contract values.
 *
 * These entries therefore describe verified capability, not specific
 * named contracts. Do not add client names, project names or metrics
 * without written client confirmation.
 */

export interface CaseStudy {
  slug: string;
  /** Project type — verified from construction.html. */
  title: string;
  /** Where this class of work happens. */
  context: string;
  challenge: string;
  approach: string;
  /** Fleet slugs deployed. */
  equipment: readonly string[];
  materials: readonly string[];
  index: string;
}

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "downtown-condominium",
    title: "Downtown Condominium Excavation",
    context: "Toronto core — constrained site",
    challenge:
      "Deep excavation in the downtown core offers no laydown area, restricted access windows and continuous public interface. Spoil cannot accumulate; every load must leave as it is dug.",
    approach:
      "Continuous tri-axle rotation matched to excavator output, staged so trucks arrive as the machine is ready rather than queueing on live streets. Contaminated material tracked and documented to approved receiving sites.",
    equipment: ["dump-truck", "dump-trailer"],
    materials: ["Contaminated soil", "Clean fill", "Excavated material"],
    index: "01",
  },
  {
    slug: "transit-line-excavation",
    title: "Transit Line Excavation",
    context: "Greater Toronto Area — linear infrastructure",
    challenge:
      "Transit corridor work is linear, sequenced and unforgiving of delay. Haulage must follow the heading as it advances, across multiple access points and shifting traffic management.",
    approach:
      "Fleet depth assigned to the corridor with dispatch following the advancing works, so capacity moves with the heading. Documentation maintained to the standard public infrastructure contracts require.",
    equipment: ["dump-truck", "live-bottom"],
    materials: ["Excavated material", "Granular", "Contaminated soil"],
    index: "02",
  },
  {
    slug: "highway-paving",
    title: "Highway Paving",
    context: "Ontario highway network",
    challenge:
      "A paving train cannot stop. Hot mix must arrive at temperature, in sequence, with no gap in supply — and often beneath overhead constraints that make tipping a trailer impossible.",
    approach:
      "Live bottom trailers discharge by conveyor without raising the box, keeping supply continuous under overhead clearance. Insulated tankers deliver liquid asphalt held at temperature to the plant.",
    equipment: ["live-bottom", "tanker-trailer"],
    materials: ["Hot mix asphalt", "Liquid asphalt", "Granular A/B"],
    index: "03",
  },
] as const;

export const getCaseStudy = (slug: string): CaseStudy | undefined =>
  CASE_STUDIES.find((study) => study.slug === slug);
