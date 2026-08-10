import type { ImageAsset } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel } from "@/components/ui/panel";
import { ClipReveal } from "@/components/motion/clip-reveal";

/**
 * Card masthead.
 *
 * The static counterpart to the homepage hero: same inset rounded card,
 * same header-clearance padding, same headline-bottom-left composition —
 * without the GSAP entrance, because an interior page is arrived at rather
 * than landed on and a 1.4-second reveal in front of content someone
 * navigated to is a toll.
 *
 * WHY A CARD AND NOT THE DISPLAY-LINE MASTHEAD. `page-masthead.tsx` opens
 * the other interior pages with sheared display type on paper. That belongs
 * to the editorial system; this belongs to the card system, and a page
 * cannot be in both. Which one a page uses is a statement about what it is:
 * an argued read, or a scanned one.
 *
 * `facts` renders as the same stat row the homepage uses under its hero, so
 * a visitor moving between the two meets one instrument panel rather than
 * two conventions for the same job.
 */

interface PageHeroProps {
  eyebrow: string;
  heading: string;
  headingId: string;
  lead: string;
  facts?: readonly { k: string; v: string }[];
  plate: ImageAsset;
}

export function PageHero({
  eyebrow,
  heading,
  headingId,
  lead,
  facts,
  plate,
}: PageHeroProps) {
  return (
    <>
      {/*
        THE CARD CLEARS THE HEADER RATHER THAN PASSING UNDER IT. The homepage
        hero opens at `pt-3` because its header state is transparent, so the
        bar reads as part of the footage. Here the header is white glass: the
        same `pt-3` put its opaque bar across the top of the plate and ate the
        card's top corners. `--header-h` is the bar's own height; the `0.75rem`
        after it is the card layout's 12px gap, so the plate sits below the
        header on the same rhythm every other card sits on.
      */}
      <section
        className="container-page pt-[calc(var(--header-h)+0.75rem)]"
        aria-labelledby={headingId}
      >
        <ClipReveal from="bottom" duration={1.2} scale={false}>
          <div className="relative overflow-hidden rounded-plate bg-ink">
            <div className="absolute inset-0">
              <Media
                asset={plate}
                ratio="auto"
                radius="none"
                className="h-full w-full"
                sizes="100vw"
                scrim="bottom"
                priority
              />
            </div>

            {/*
              No header clearance is reserved in here any more — the section
              above now holds the card clear of the bar, so this is ordinary
              padding. It stays larger than the bottom inset only so a
              headline that grows past `min-h` still opens with air above it.
            */}
            <div className="relative z-10 flex min-h-[26rem] flex-col justify-end p-6 pt-16 md:min-h-[32rem] md:p-10 md:pt-20">
              <p className="section-label text-white/60">/ {eyebrow}</p>
              <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
                <h1
                  id={headingId}
                  className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.06] tracking-[-0.014em] text-white lg:col-span-7"
                >
                  {heading}
                </h1>
                <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/80 lg:col-span-4 lg:col-start-9">
                  {lead}
                </p>
              </div>
            </div>
          </div>
        </ClipReveal>
      </section>

      {facts && (
        <section className="container-page pt-3" aria-label={`${eyebrow} at a glance`}>
          {/*
            NO SCROLL REVEAL. This row sits ON the fold, where a
            ScrollTrigger's start point is ambiguous — and `Reveal` in
            stagger mode has GSAP set every card to `opacity: 0` the moment
            it initialises, so a trigger that never fires leaves the page's
            opening facts blank. Same reasoning as the homepage stat row.
          */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <Panel key={fact.k} tone="sunk" className="p-6">
                <p className="section-label">{fact.k}</p>
                <p className="tnum mt-3 text-[1.0625rem] leading-snug text-ink">
                  {fact.v}
                </p>
              </Panel>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
