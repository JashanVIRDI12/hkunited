/**
 * Fleet inventory. Equipment types are sourced from hkunited.ca/fleet.html
 * and division.html. Specifications marked TODO are industry-standard
 * configurations shown for layout completeness — confirm before launch.
 */

import type { LucideIcon } from "lucide-react";
import { Truck, Container, Layers, Fuel, Move3d, PackageOpen } from "lucide-react";

export type FleetCategory = "bulk" | "tank" | "waste" | "flatbed";

export interface FleetUnit {
  slug: string;
  name: string;
  category: FleetCategory;
  /** Short editorial line — appears on the card face. */
  summary: string;
  /** Long-form description for the detail view. */
  description: string;
  /** Materials this unit is configured to move. */
  payloads: readonly string[];
  /** Displayed as a technical spec strip. Values pending client confirmation. */
  specs: readonly { label: string; value: string }[];
  icon: LucideIcon;
  /** Ordinal used for the large editorial index number. */
  index: string;
}

export const FLEET: readonly FleetUnit[] = [
  {
    slug: "dump-truck",
    name: "Dump Trucks",
    category: "bulk",
    summary: "Tri-axle and quad configurations for high-cycle aggregate work.",
    description:
      "The backbone of the HK United fleet. Configured for high-frequency loading cycles on active construction sites, our dump trucks move aggregate, fill and excavated material with the turnaround discipline that keeps a site on schedule.",
    payloads: ["Gravel", "Sand", "Clean fill", "Contaminated soil", "Excavated material"],
    specs: [
      { label: "Configuration", value: "Tri-axle / Quad" },
      { label: "Body", value: "Steel & aluminium" },
      { label: "Operation", value: "Year-round" },
    ],
    icon: Truck,
    index: "01",
  },
  {
    slug: "dump-trailer",
    name: "Dump Trailers",
    category: "bulk",
    summary: "High-capacity tractor-trailer units for long-haul bulk volume.",
    description:
      "Where volume matters more than manoeuvrability. Dump trailers carry substantially more per trip than a straight truck, reducing load counts and site traffic on large-scale earthworks and highway projects.",
    payloads: ["Aggregate", "Topsoil", "Granular A/B", "Recycled material"],
    specs: [
      { label: "Configuration", value: "Tractor-trailer" },
      { label: "Discharge", value: "End dump" },
      { label: "Best for", value: "Long haul volume" },
    ],
    icon: Container,
    index: "02",
  },
  {
    slug: "live-bottom",
    name: "Live Bottom Trailers",
    category: "bulk",
    summary: "Conveyor discharge for controlled, no-tip unloading.",
    description:
      "A moving conveyor floor discharges material without raising the box — essential under overhead wires, inside structures, and on the uneven or sloped ground where tipping a trailer is unsafe. The preferred unit for asphalt paving trains.",
    payloads: ["Hot mix asphalt", "Aggregate", "Sand", "Granular"],
    specs: [
      { label: "Discharge", value: "Belt conveyor" },
      { label: "Clearance", value: "No tip required" },
      { label: "Best for", value: "Paving & overhead" },
    ],
    icon: Layers,
    index: "03",
  },
  {
    slug: "tanker-trailer",
    name: "Tanker Trailers",
    category: "tank",
    summary: "Sealed liquid transport, including heated liquid asphalt.",
    description:
      "Purpose-built liquid haulage operated to strict handling and documentation standards. Our tank division moves liquid asphalt and industrial liquids across Ontario with insulated, temperature-held units.",
    payloads: ["Liquid asphalt", "Industrial liquids", "Water"],
    specs: [
      { label: "Type", value: "Insulated tank" },
      { label: "Handling", value: "Sealed transfer" },
      { label: "Division", value: "Tanks" },
    ],
    icon: Fuel,
    index: "04",
  },
  {
    slug: "walking-floor",
    name: "Walking Floor Trailers",
    category: "waste",
    summary: "Hydraulic floor slats for baled, loose and bulk waste streams.",
    description:
      "Self-unloading trailers built for the waste and recycling stream. Hydraulic floor slats walk material out of the trailer, handling loose, baled and irregular loads that will not flow from a tipping body.",
    payloads: ["Municipal waste", "Recyclables", "Wood waste", "Biomass"],
    specs: [
      { label: "Discharge", value: "Hydraulic slats" },
      { label: "Load type", value: "Loose / baled" },
      { label: "Division", value: "Waste" },
    ],
    icon: Move3d,
    index: "05",
  },
  {
    slug: "flatdeck",
    name: "Flatdeck Trailers",
    category: "flatbed",
    summary: "Open-deck haulage for construction supply and oversize freight.",
    description:
      "Open-deck transport for material that does not travel in a box. Steel, culverts, shingles, equipment and palletised construction supply — secured, tarped where required, and delivered in the sequence the site needs it.",
    payloads: ["Steel bars", "Cement culverts", "Shingles", "Heavy equipment", "Palletised supply"],
    specs: [
      { label: "Deck", value: "Open flatdeck" },
      { label: "Securement", value: "Chain & strap" },
      { label: "Division", value: "Flatbed" },
    ],
    icon: PackageOpen,
    index: "06",
  },
] as const;

/** Source: division.html — the four operating divisions. */
export const DIVISIONS = [
  { id: "bulk", name: "Bulk", blurb: "Aggregate, fill and excavated material at site cadence." },
  { id: "tank", name: "Tanks", blurb: "Sealed liquid transport including heated asphalt." },
  { id: "waste", name: "Waste", blurb: "Municipal, industrial and recycling streams." },
  { id: "flatbed", name: "Flatbed", blurb: "Open-deck supply and oversize freight." },
] as const satisfies readonly { id: FleetCategory; name: string; blurb: string }[];

export const getFleetUnit = (slug: string): FleetUnit | undefined =>
  FLEET.find((unit) => unit.slug === slug);
