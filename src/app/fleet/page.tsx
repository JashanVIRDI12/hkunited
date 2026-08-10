import { COMPANY } from "@/content/company";
import { FLEET, DIVISIONS } from "@/content/fleet";
import { IMAGES } from "@/content/imagery";
import { pageMeta, breadcrumbSchema, jsonLd, SITE_URL } from "@/lib/seo";

import { PageHero } from "@/components/layout/page-hero";
import { ClosingCard } from "@/components/layout/closing-card";
import { Divisions } from "@/features/fleet/sections/divisions";
import { Register } from "@/features/fleet/sections/register";
import { Matrix } from "@/features/fleet/sections/matrix";

export const metadata = pageMeta({
  title: "Fleet",
  description: `${COMPANY.shortName} operates ${FLEET.length} equipment configurations across ${DIVISIONS.length} divisions — dump trucks, dump and live bottom trailers, tankers, walking floor and flatdeck — from its ${COMPANY.address.city} terminal.`,
  path: "/fleet",
});

/**
 * Fleet.
 *
 * ART DIRECTION — THE CARD STACK, matching the homepage and /about. This
 * page previously ran the editorial system: a display-line masthead and
 * entries divided by hairlines down a continuous column. Arriving here from
 * the new homepage felt like arriving at a different site, so it now speaks
 * the same vocabulary — inset cards on a page frame, three tones, Royal
 * Blue held back for the close.
 *
 * The READING RHYTHM is unchanged, because it was never the problem:
 * contents first (divisions, each listing its units as jump links), then
 * the register, then the matrix that answers the question the register
 * cannot — which unit takes MY material. Only the instrument changed.
 *
 * A CATALOGUE, NOT AN ESSAY. The register holds one orientation for all six
 * entries — plate left, dossier right — because this page is jumped around
 * rather than read through. The reasoning is in `sections/register.tsx`.
 *
 * NO SCROLL REVEALS ANYWHERE. Every unit is a deep-link target, and a
 * specification someone landed on directly has to be on screen when they
 * arrive rather than waiting for a trigger that may never fire.
 *
 * Surfaces: hero card → paper-alt → paper → paper-alt → brand.
 *
 * Every section is a server component except the hero's clip reveal.
 */
export default function FleetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Fleet", path: "/fleet" },
            ]),
          ),
        }}
      />
      {/*
        An ItemList of the equipment, so the six units are indexable as a set
        rather than as one page of prose. Only names, descriptions and the
        anchors they live at — no invented model numbers, capacities or
        counts. See the sourcing rule in `content/company.ts`.
      */}
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${COMPANY.name} fleet`,
            itemListElement: FLEET.map((unit, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: unit.name,
              description: unit.summary,
              url: `${SITE_URL}/fleet#${unit.slug}`,
            })),
          }),
        }}
      />

      <PageHero
        eyebrow="Fleet"
        headingId="fleet-heading"
        heading={`${FLEET.length} configurations, ${DIVISIONS.length} divisions, one operator`}
        lead={`${COMPANY.positioning} — kept modern, maintained to a documented standard, and configured so the right unit shows up rather than the one that happened to be free.`}
        facts={[
          { k: "Configurations", v: String(FLEET.length) },
          { k: "Divisions", v: DIVISIONS.map((d) => d.name).join(" · ") },
          { k: "Terminal", v: `${COMPANY.address.city}, ${COMPANY.address.region}` },
          { k: "Coverage", v: COMPANY.serviceArea },
        ]}
        plate={IMAGES.terminalAerial}
      />
      <Divisions />
      <Register />
      <Matrix />
      <ClosingCard
        label="Start"
        headingId="fleet-cta-heading"
        heading="Tell us the site, we will name the unit"
        lead="Clearance, ground conditions and access decide the configuration as much as the material does. Send the constraints and dispatch will come back with the right equipment and a firm price."
        primary={{ label: "Request a quote", href: "/quote" }}
        secondary={{ label: "See the services", href: "/services" }}
      />
    </>
  );
}
