/**
 * Navigation, FAQ and client voice.
 */

import { COMPANY } from "./company";

export interface NavItem {
  label: string;
  href: string;
  /** Shown in the mega-menu as supporting context. */
  description?: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "About", href: "/about", description: "Fifteen years of Ontario haulage" },
  { label: "Fleet", href: "/fleet", description: "Six unit types, four divisions" },
  { label: "Services", href: "/services", description: "Ten service lines" },
  { label: "Projects", href: "/projects", description: "Capability in the field" },
  { label: "Safety", href: "/safety", description: "Beyond the industry standard" },
  { label: "Contact", href: "/contact", description: "Mississauga, Ontario" },
] as const;

export const FOOTER_NAV = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Safety", href: "/safety" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    heading: "Operations",
    links: [
      { label: "Fleet", href: "/fleet" },
      { label: "Services", href: "/services" },
      { label: "Request a Quote", href: "/quote" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

/**
 * Client voice.
 *
 * SOURCING: hkunited.ca surfaces these characterisations from clients but
 * publishes no attribution. They are presented unattributed on purpose —
 * do NOT invent company names, people or job titles for a real B2B carrier.
 * Replace with client-approved, attributed testimonials before launch.
 */
export const CLIENT_VOICE = [
  {
    quote: "A very well managed and professional company.",
    attribution: "Client",
    context: "Greater Toronto Area",
  },
] as const;

export const FAQ = [
  {
    q: "What areas does HK United serve?",
    a: `We operate throughout the Greater Toronto Area and across Ontario from our Mississauga terminal at ${COMPANY.address.street}. Long-haul and cross-province work is arranged by contract.`,
  },
  {
    q: "What materials can you haul?",
    a: "Aggregate, gravel, sand, clean fill and contaminated soil; liquid asphalt and industrial liquids; municipal and industrial waste; and open-deck freight including steel bars, cement culverts, shingles and equipment.",
  },
  {
    q: "Are you able to handle contaminated soil?",
    a: "Yes. We are a trusted carrier in the Greater Toronto Area for contaminated soil, moved with tracked documentation to approved receiving sites and backed by a strong environmental record.",
  },
  {
    q: "How large is your fleet?",
    a: "HK United operates one of the largest fleets in the province of Ontario, across four divisions — bulk, tanks, waste and flatbed. Fleet depth means we can absorb schedule surges without subcontracting away control of your project.",
  },
  {
    q: "What are your safety credentials?",
    a: "Drivers complete training covering fatigue management and incident response, with road testing and semi-annual evaluations. Job safety assessments precede every project and our safety team conducts unannounced site inspections. We are members of the Ontario Dump Truck Association and the Canada Truck Operators Association.",
  },
  {
    q: "Do you take on jobs of any scale?",
    a: "Yes — we are able to handle jobs of any scale, from single-load deliveries to sustained haulage on downtown condominium excavation, transit line construction and highway paving.",
  },
  {
    q: "How do I request a quote?",
    a: `Submit the quote request form with your material, volume, site location and schedule, or call dispatch directly at ${COMPANY.phone}.`,
  },
] as const;

/**
 * Recruitment content is deliberately absent.
 *
 * hkunited.ca/career.html publishes driver and owner-operator benefits, and
 * this file used to carry them. The site no longer has a /careers route, so
 * the data has been removed rather than left orphaned — an unused export is
 * an invitation to build the page back by accident, and stale recruitment
 * terms are worse than none.
 *
 * If /careers returns, take the lists from career.html again rather than
 * from git history, which may by then be out of date.
 */
