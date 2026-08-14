import Link from "next/link";
import { CASE_STUDIES, type CaseStudy } from "@/content/projects";
import { getFleetUnit } from "@/content/fleet";
import { IMAGES, type ImageAsset } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { StackCard } from "@/components/motion/stack-card";
import { SplitHeading } from "@/components/motion/split-heading";
import { ClipReveal } from "@/components/motion/clip-reveal";

/**
 * Capability studies, built as a STACKING DECK.
 *
 * SOURCING IS STILL THE CONSTRAINT THAT SHAPES THIS. hkunited.ca names the
 * TYPES of project it has managed — downtown condominiums, transit line
 * excavation, highway paving — and names no client, site, date or contract
 * value. So there is no "client / duration / tonnage" strip here, because
 * every number in it would have to be invented, and inventing them on a real
 * carrier's site is a legal problem before it is a design one. What the
 * content model DOES hold is a challenge and an approach per study, which is
 * a stronger thing to show anyway: it demonstrates that we understand the
 * constraint, rather than asserting that someone once paid us.
 *
 * WHAT CHANGED IS THE FORM, AND THE REASON IS THAT THERE ARE THREE. The
 * previous build ran each study as a full-bleed plate followed by a facing
 * pair of columns — a good treatment, and one that spent roughly a screen
 * and a half per study scrolling past establishing shots. Three items is too
 * few to justify that much travel and too few for an index; it is exactly
 * the number that suits a deck. Each study parks below the header, the next
 * rides up over it leaving an edge behind, and what the reader has at the
 * bottom is a visible pile of the three — which is the page's whole argument
 * (`Common` names the pattern running through them) made spatially before it
 * is made in words.
 *
 * THE CARDS ARE DARK, AND THEY ARE THE PAGE'S ONE DARK SURFACE. A deck reads
 * as a deck only if the cards are visibly one object type; three ink panels
 * on paper give the stacked edges something to be, where three white cards
 * on white would need borders to survive being layered and would read as
 * paperwork. It also makes the plates sit in the card rather than on it.
 *
 * The equipment list is not a tag cloud: each unit links to its entry in the
 * fleet register, so "how did you do that" is one click from "with what".
 *
 * Server component — `StackCard` is the island, and it holds no content.
 */

/** Study slug -> establishing plate. Keeps `content/projects.ts` asset-free. */
const STUDY_IMAGE: Record<string, ImageAsset> = {
  "downtown-condominium": IMAGES.industryConstruction,
  "transit-line-excavation": IMAGES.heroHighway,
  "highway-paving": IMAGES.paving,
};

/**
 * Visible edge left by each covered card, in rem. Small on purpose: this is
 * a stack of three, not a rolodex, and the edges are meant to be read as
 * depth rather than counted.
 */
const EDGE = 1.25;

export function Studies() {
  return (
    <section className="section-y" aria-labelledby="studies-heading">
      <div className="container-edge">
        <div className="mb-16 grid gap-y-8 md:mb-20 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">The work</p>
          <SplitHeading
            id="studies-heading"
            className="type-h1 optical-flush max-w-[14ch] text-ink lg:col-span-6"
          >
            Three jobs that do not forgive a late load.
          </SplitHeading>
          <p className="max-w-xs self-end text-[0.9375rem] leading-relaxed text-ink-3 lg:col-span-3">
            Each of these is a class of work we run continuously across the
            Greater Toronto Area, not a single contract.
          </p>
        </div>
      </div>

      {/*
        `container-page`, not `container-edge`. The deck is a card stack and
        it takes the card layout's tighter gutter, so the cards sit close to
        the viewport edge with the page showing as a frame around them — the
        same relationship the homepage's stack has.
      */}
      <div className="container-page">
        <div className="flex flex-col gap-6">
          {CASE_STUDIES.map((study, i) => (
            <StackCard
              key={study.slug}
              offset={i * EDGE}
              last={i === CASE_STUDIES.length - 1}
            >
              <Study study={study} />
            </StackCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * One study.
 *
 * The plate is a COLUMN of the card, full height, rather than a banner above
 * the text. A card that has to stay under the viewport's height cannot spend
 * a third of it on a header image, and the side-by-side arrangement is what
 * lets the constraint and the approach sit as a facing pair — which is how
 * this content has always wanted to be read.
 *
 * `overflow-hidden` on the card clips the plate to the panel radius, which
 * is why the plate itself is `radius="none"`: a rounded image inside an
 * already-rounded container draws two corners that never agree.
 */
function Study({ study }: { study: CaseStudy }) {
  return (
    <article
      id={study.slug}
      className="anchor-offset overflow-hidden rounded-panel bg-ink-panel text-white shadow-float"
    >
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[15rem] lg:col-span-5 lg:min-h-full">
          <ClipReveal from="left" className="absolute inset-0">
            <Media
              asset={STUDY_IMAGE[study.slug]}
              ratio="auto"
              radius="none"
              className="h-full w-full"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </ClipReveal>
        </div>

        <div className="p-7 md:p-10 lg:col-span-7 lg:p-12">
          <div className="flex items-baseline gap-5">
            <span className="tnum text-[0.6875rem] tracking-[0.16em] text-white/45">
              {study.index}
            </span>
            <span className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-white/70">
              {study.context}
            </span>
          </div>

          <h3 className="type-h2 mt-6 max-w-[16ch] text-white">{study.title}</h3>

          {/*
            The facing pair. On the narrow arrangement the divider becomes a
            rule above the second block — one rule, drawn on whichever axis
            the pair is currently laid out.
          */}
          <div className="mt-9 grid gap-8 sm:grid-cols-2 sm:gap-10">
            <div>
              <h4 className="eyebrow text-white/45">The constraint</h4>
              <p className="mt-4 text-[0.9375rem] leading-[1.7] text-white/75">
                {study.challenge}
              </p>
            </div>
            <div className="border-t border-white/15 pt-8 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0">
              <h4 className="eyebrow text-white/45">How we run it</h4>
              <p className="mt-4 text-[0.9375rem] leading-[1.7] text-white/75">
                {study.approach}
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-2 sm:gap-10">
            <div>
              <h4 className="eyebrow mb-4 text-white/45">Units deployed</h4>
              <ul className="flex flex-wrap gap-2">
                {study.equipment.map((slug) => {
                  const unit = getFleetUnit(slug);
                  if (!unit) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/fleet#${slug}`}
                        className="inline-flex rounded-full border border-white/25 px-3.5 py-1.5 text-[0.8125rem] text-white/80 transition-colors duration-500 hover:border-white hover:text-white"
                      >
                        {unit.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="sm:pl-10">
              <h4 className="eyebrow mb-4 text-white/45">Material moved</h4>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {study.materials.map((material) => (
                  <li
                    key={material}
                    className="text-[0.75rem] uppercase tracking-[0.14em] text-white/55"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
