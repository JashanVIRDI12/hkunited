import { COMPANY, AFFILIATIONS } from "@/content/company";
import { IMAGES } from "@/content/imagery";
import { pageMeta, breadcrumbSchema, jsonLd } from "@/lib/seo";

import { PageHero } from "@/components/layout/page-hero";
import { ClosingCard } from "@/components/layout/closing-card";
import { Statement } from "@/features/about/sections/statement";
import { Record } from "@/features/about/sections/record";
import { Standards } from "@/features/about/sections/standards";
import { Credentials } from "@/features/about/sections/credentials";

export const metadata = pageMeta({
  title: "About",
  description: `${COMPANY.shortName} has spent over ${COMPANY.yearsInOperation} years as a premier fleet and logistics provider in the Greater Toronto Area, operating bulk, tank, waste and flatbed divisions from its Mississauga terminal.`,
  path: "/about",
});

/**
 * About.
 *
 * ART DIRECTION — THE CARD STACK, matching the homepage. This page
 * previously ran its own system: colossal display type colliding with
 * photographic plates on a grid. That was a strong page and a lonely one —
 * it shared no vocabulary with anything else on the site, so arriving here
 * from the homepage felt like arriving at a different company.
 *
 * The reading rhythm is unchanged, because it was never the problem: the
 * homepage opens on footage and argues toward the facts; this opens on the
 * company's own words, then produces the record, then the standards behind
 * it. Someone here has already decided to look — they are checking, not
 * being convinced. Only the instrument changed.
 *
 * Surfaces: hero card → paper → paper-alt → INK → paper → brand. One dark
 * band, spent on Standards — the claim most worth interrupting the page for
 * — and Royal Blue held back until the closing card.
 *
 * What this page keeps that the homepage does not: `ScrollText` on the
 * statement, and the affiliation abbreviations set at display scale. Both
 * are argued for in their own files.
 *
 * Every section is a server component except the motion wrappers.
 */
export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="About"
        headingId="about-heading"
        heading="Fifteen years of moving Ontario"
        lead={`${COMPANY.positioning} — moving bulk, liquid, waste and open-deck freight for the projects that reshape the Greater Toronto Area.`}
        facts={[
          { k: "Founded", v: String(COMPANY.founded) },
          { k: "Terminal", v: `${COMPANY.address.city}, ${COMPANY.address.region}` },
          { k: "Coverage", v: COMPANY.serviceArea },
          { k: "Member of", v: AFFILIATIONS.map((a) => a.abbr).join(" · ") },
        ]}
        plate={IMAGES.terminalAerial}
      />
      <Statement />
      <Record />
      <Standards />
      <Credentials />
      <ClosingCard
        label="Start"
        headingId="about-closing-heading"
        heading="Fifteen years in, still answering the phone"
        lead="Send your material, volume, site location and schedule, and dispatch will come back with the right configuration and a firm price. If you would rather talk it through first, so will we."
        primary={{ label: "Request a quote", href: "/quote" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
