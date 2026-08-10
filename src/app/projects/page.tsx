import { COMPANY } from "@/content/company";
import { pageMeta, breadcrumbSchema, jsonLd } from "@/lib/seo";

import { ClosingCta } from "@/components/layout/closing-cta";
import { ProjectsHero } from "@/features/projects/sections/hero";
import { Studies } from "@/features/projects/sections/studies";
import { Common } from "@/features/projects/sections/common";

export const metadata = pageMeta({
  title: "Projects",
  description: `Capability in the field — downtown condominium excavation, transit line construction and highway paving across ${COMPANY.serviceArea}, run by ${COMPANY.shortName} with bulk, tank and live bottom equipment.`,
  path: "/projects",
});

/**
 * Projects.
 *
 * ART DIRECTION — THE DECK. The page opens on moving footage and then hands
 * the reader three ink cards that stack: each study parks below the header,
 * the next rides up over it leaving an edge behind, and what is left at the
 * bottom of the section is a visible pile of all three. That is the page's
 * argument made spatially — `Common` then names the pattern running through
 * them in words — and it is what the previous build, three full-bleed plates
 * each followed by two columns of prose, could not do at any length.
 *
 * IT IS NOT THE /services TREATMENT WITH DIFFERENT WORDS, and the difference
 * is argued from the content rather than chosen for variety:
 *
 *  · Ten service lines need an INDEX and a readout to keep a reader located.
 *    Three studies need neither; three is the number you can hold in your
 *    hand, which is exactly what a deck does with it.
 *  · /services opens on a still, because ten capabilities want the eye on
 *    the type. This opens on footage, because its whole subject is work in
 *    motion — a corridor advancing, a paving train that cannot stop.
 *  · /services cards are paper and tilt under the pointer. These are ink and
 *    stack under the scroll. Neither page can borrow the other's card or the
 *    two collapse into one template.
 *
 * THE HONESTY CONSTRAINT IS LOAD-BEARING AND UNCHANGED. hkunited.ca names
 * the types of project it has managed and names no client, site, date or
 * contract value, so this page shows capability rather than a portfolio: no
 * logos, no tonnages, no "completed in 14 weeks". The reasoning, and the
 * rule for anyone tempted to add them later, is in `content/projects.ts`.
 * The page states its own terms in the hero lead, above the fold, rather
 * than burying a disclaimer at the foot.
 *
 * SURFACE RHYTHM: plate (hero) → INK deck on paper (studies) → paper-alt
 * (pattern) → brand (close). One dark surface and one blue one, each spent
 * once, which is the discipline every other page follows.
 *
 * Every section is a server component. The only island is the deck's recede,
 * and it holds none of the page's content.
 */
export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
            ]),
          ),
        }}
      />

      <ProjectsHero />
      <Studies />
      <Common />
      <ClosingCta
        eyebrow="Start"
        headingId="projects-cta-heading"
        heading="Bring us the hard one."
        lines={[
          { text: "Bring us", drift: 22 },
          { text: "the hard one.", indent: "lg:pl-[12%]", drift: -28 },
        ]}
        lead="Constrained access, a fixed window, material that needs documenting — those are the jobs the fleet was built around. Send the constraints and dispatch will tell you how it runs."
        primary={{ label: "Request a Quote", href: "/quote" }}
        secondary={{ label: "See the fleet", href: "/fleet" }}
      />
    </>
  );
}
