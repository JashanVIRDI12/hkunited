import { COMPANY } from "@/content/company";
import { SERVICES } from "@/content/services";
import { pageMeta, breadcrumbSchema, jsonLd } from "@/lib/seo";

import { ClosingCta } from "@/components/layout/closing-cta";
import { ServicesHero } from "@/features/services/sections/hero";
import { Board } from "@/features/services/sections/board";
import { Materials } from "@/features/services/sections/materials";
import { Sectors } from "@/features/services/sections/sectors";

export const metadata = pageMeta({
  title: "Services",
  description: `${SERVICES.length} service lines from ${COMPANY.shortName} — dump truck and aggregate haulage, tank trailer transport, excavation support, environmental hauling, heavy hauling, snow removal and municipal contracts across ${COMPANY.serviceArea}.`,
  path: "/services",
});

/**
 * Services.
 *
 * ART DIRECTION — THE DISPATCH BOARD. This page is the one a superintendent
 * lands on from a search, and it has about two seconds to answer whether this
 * carrier runs work at their scale. An earlier build answered in prose: a
 * type-only masthead, a contents strip, ten identical ruled blocks. Every
 * fact on it was correct, nothing on it moved, and it read as a specification
 * sheet — dense, accurate and impossible to scan.
 *
 * So the page is now built from PLATES AND CARDS, and four things carry it:
 *
 *  · `ServicesHero` opens on a photographic plate rather than on white. It
 *    keeps the interior set's vocabulary — hand-broken display lines, lateral
 *    shear, the record strip — and changes the ground under it. The facts sit
 *    on the plate, so the hero stays one object instead of two.
 *  · `Board` holds a rolling readout at the left that reports which of the
 *    ten lines you are currently inside, and runs the entries as tilting
 *    cards that each carry their own plate. Ten distinct frames were already
 *    registered per service in `SERVICE_IMAGE`; a superintendent finds "the
 *    tanker one" by silhouette in a third of the time it takes to read ten
 *    headings.
 *  · `Materials` is the page's one dark band, and the only place on the site
 *    that answers WHAT we move. Its belt runs on scroll velocity, so it
 *    responds to the reader rather than looping at them.
 *  · `Sectors` carries its plate on the cursor instead of in the layout,
 *    which lets the closing block be photographic without spending a screen
 *    of height on five more frames.
 *
 * SURFACE RHYTHM: plate (hero) → paper (board) → INK (materials) → paper-alt
 * (sectors) → brand (close). One dark band and one blue band, each spent
 * once, which is the same discipline /about and the homepage follow.
 *
 * READING RHYTHM, unchanged because it was never the problem: how we move it
 * → what we move → who we move it for → ask. A visitor is either shopping a
 * specific line (and jumps, via the rail or the narrow-width contents strip)
 * or sizing up the range (and scrolls); both are served without either
 * costing the other anything.
 *
 * The service catalogue is already emitted site-wide in `organizationSchema`
 * (`hasOfferCatalog`, keyed to these same slugs and anchors), so this page
 * adds only its breadcrumb rather than a second, competing description of
 * the same offers.
 *
 * Every section is a server component. The islands are all behaviour and no
 * content — the board's readout, the cards' tilt, the belt, the sectors'
 * cursor plate — so every word and every plate on the page is server-rendered
 * and present before a line of JavaScript runs.
 */
export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
          ),
        }}
      />

      <ServicesHero />
      <Board />
      <Materials />
      <Sectors />
      <ClosingCta
        eyebrow="Start"
        headingId="services-cta-heading"
        heading="Tell us what needs moving."
        lines={[
          { text: "Tell us what", drift: 26 },
          { text: "needs moving.", indent: "lg:pl-[13%]", drift: -32 },
        ]}
        lead="Send your material, volume, site location and schedule. Dispatch will come back with the right configuration and a firm price."
        primary={{ label: "Request a Quote", href: "/quote" }}
        secondary={{ label: "See the fleet", href: "/fleet" }}
      />
    </>
  );
}
