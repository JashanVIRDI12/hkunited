/**
 * Single source of truth for HK United Trucks Ltd.
 *
 * SOURCING RULE: every value here is traceable to hkunited.ca.
 * Do not add statistics, awards, or claims that cannot be verified —
 * this powers a live commercial site and JSON-LD structured data.
 * Unverified figures belong in `PENDING_VERIFICATION` below, not inline.
 */

export const COMPANY = {
  name: "HK United Trucks Ltd",
  shortName: "HK United",
  legalName: "HK United Trucks Ltd",
  /** Source: homepage hero. */
  positioning: "One of the largest fleets in the province of Ontario",
  /** Source: about-us.html — "the last 15 plus years". */
  yearsInOperation: 15,
  founded: 2009,
  tagline: "Heavy haul, precisely executed.",
  description:
    "HK United Trucks Ltd is a premier fleet and logistics provider serving the Greater Toronto Area for over 15 years, specializing in bulk, tank, waste and flatbed transport for construction, mining, energy, agriculture and waste management.",
  phone: "905-670-1666",
  phoneHref: "+19056701666",
  email: "info@hkunited.ca",
  address: {
    street: "6191 Atlantic Drive",
    city: "Mississauga",
    region: "ON",
    regionName: "Ontario",
    country: "CA",
    countryName: "Canada",
    postalCode: "L4W 1S5", // TODO(client): confirm — not published on hkunited.ca
  },
  /** Approximate coordinates for 6191 Atlantic Dr, Mississauga. */
  geo: { lat: 43.6469, lng: -79.6469 },
  serviceArea: "Greater Toronto Area & Ontario",
  url: "https://www.hkunited.ca",
  hours: "Mo-Su 00:00-23:59", // 24/7 dispatch — TODO(client): confirm office hours
} as const;

/** Source: homepage footer — industry association memberships. */
export const AFFILIATIONS = [
  {
    abbr: "ODTA",
    name: "Ontario Dump Truck Association",
    note: "Member",
  },
  {
    abbr: "CTOA",
    name: "Canada Truck Operators Association",
    note: "Member",
  },
] as const;

/**
 * Figures the redesign has room for but the current site does not substantiate.
 * Fill these in with client-confirmed numbers, then surface them in the
 * Statistics section (see `src/features/home/sections/stats-section.tsx`).
 */
export const PENDING_VERIFICATION = [
  "Total power units / trailers in fleet",
  "Projects completed to date",
  "Active client count",
  "Kilometres driven annually",
  "Safety record (e.g. collision-free km, CVOR rating)",
] as const;

export type Company = typeof COMPANY;
