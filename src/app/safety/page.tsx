import { COMPANY } from "@/content/company";
import { pageMeta, breadcrumbSchema, jsonLd } from "@/lib/seo";

import { ClosingCta } from "@/components/layout/closing-cta";
import { SafetyHero } from "@/features/safety/sections/hero";
import { Commitment } from "@/features/safety/sections/commitment";
import { Programme } from "@/features/safety/sections/programme";
import { Audit } from "@/features/safety/sections/audit";

export const metadata = pageMeta({
  title: "Safety",
  description: `${COMPANY.shortName}'s health and safety programme — driver training in fatigue management and incident response, road testing and semi-annual evaluation, pre-project job safety assessments and unannounced site audits across ${COMPANY.serviceArea}.`,
  path: "/safety",
});

/**
 * Safety.
 *
 * ART DIRECTION — THE EVIDENCE FILE. The four pillars appear three times on
 * this site and each surface has a different job: the homepage assembles
 * them as a card stack to persuade, /about indexes them on a dark band to
 * summarise, and this page publishes them unabridged so they can be
 * prequalified against. That is why every pillar is an anchor and why the
 * detail paragraph — dropped from both other surfaces for room — is here in
 * full.
 *
 * THE PAGE IS NOW READ THE WAY IT IS ACTUALLY USED. Nobody works through a
 * prequalification document in order; they arrive knowing which of the four
 * they were asked about. So the hero states the claim as four one-word
 * display lines — still the only place on the site set that way — and each
 * word is a LINK into the pillar that substantiates it, and the programme
 * puts all four on one screen as a grid rather than as a column you scroll.
 * The one you came for is a glance, not a search.
 *
 * WHAT MOVES HERE, AND WHY IT IS THE ONLY THING THAT DOES. The pillar cards
 * are flat and evenly weighted — no tilt, no stacking, nothing borrowed from
 * /services or /projects, because this is the page a safety officer prints.
 * The single piece of motion is the ticks drawing themselves as each card is
 * reached, which is the page's own argument rendered: these are verified,
 * not asserted.
 *
 * Surface rhythm: plate (hero) → paper (commitment) → paper-alt (programme)
 * → INK (audit) → brand (close). The dark band is spent on the unannounced
 * audit — see `sections/audit.tsx` for why that claim earns it.
 *
 * Every section is a server component. The islands are the hero's entrance
 * and the checklist's ticks, and neither holds any of the page's content —
 * the ticks in particular fail to fully drawn rather than to nothing.
 */
export default function SafetyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Safety", path: "/safety" },
            ]),
          ),
        }}
      />

      <SafetyHero />
      <Commitment />
      <Programme />
      <Audit />
      <ClosingCta
        eyebrow="Start"
        headingId="safety-cta-heading"
        heading="Prequalify us."
        lines={[
          { text: "Prequalify us.", drift: 24 },
          { text: "Then audit us.", indent: "lg:pl-[10%]", drift: -30 },
        ]}
        lead="Send the programme to whoever signs off your carriers. If they need documentation we have not published here, ask — it exists, and we would rather you checked."
        primary={{ label: "Request a Quote", href: "/quote" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
