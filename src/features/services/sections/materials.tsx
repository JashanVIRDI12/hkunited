import { INDUSTRIES } from "@/content/industries";
import { Marquee } from "@/components/motion/marquee";
import { SplitHeading } from "@/components/motion/split-heading";
import { SectionTransition } from "@/components/motion/section-transition";

/**
 * What we move.
 *
 * THE PAGE'S ONE DARK BAND, and it is spent here for a structural reason
 * rather than a decorative one. Either side of it is a long light read —
 * ten service entries above, five sector rows below — and without a surface
 * change between them the page is one continuous column from masthead to
 * closing card. The band is the breath.
 *
 * It also answers a question the rest of the page does not. The entries say
 * HOW we move it and the sectors say WHO we move it for; nothing on
 * /services said WHAT, even though the content model has held the answer all
 * along. `INDUSTRIES[].materials` was, until this section, rendered nowhere
 * on the site.
 *
 * DERIVED, NEVER TYPED. The list is flattened out of the sector model and
 * de-duplicated, so adding a material to a sector adds it to this belt and
 * the count in the heading moves with it. A hand-written list here would be
 * wrong within one content edit.
 *
 * The belt is set in the display serif at four times the size of anything
 * else on the page. That is the point of a band: it is meant to be read at a
 * glance from across the room, and material names are short enough to hold
 * at that scale where a sentence would not be.
 *
 * Server component — `Marquee` is the island, and it holds no content.
 */

/**
 * `Set` de-duplicates while preserving first-seen order, so the belt opens
 * on construction's materials — the sector this carrier is known for — and
 * the order stays deterministic between builds.
 */
const MATERIALS = Array.from(
  new Set(INDUSTRIES.flatMap((industry) => industry.materials)),
);

/*
 * The page's one dark band gets the site's section dissolve, the same
 * instrument the homepage safety band uses: the surface darkens into the dark
 * as it arrives, the copy resolves once it is dark enough to hold white type,
 * and on the way out the typography leaves upward before the surface lightens
 * back to paper. Either side of this is a long light read, so without it the
 * band is two hard horizontal cuts.
 */
export function Materials() {
  return (
    <SectionTransition
      className="overflow-hidden bg-ink py-20 md:py-28"
      labelledBy="materials-heading"
    >
      <div className="container-edge">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-white/45">What we move</p>
            <SplitHeading
              id="materials-heading"
              className="type-h2 mt-6 max-w-[16ch] text-white"
            >
              {/*
                One interpolated string, not a number beside a text node.
                `SplitHeading` measures real line boxes and needs the whole
                heading as a single string — two sibling nodes would be split
                independently and the count would get its own line box.
              */}
              {`${MATERIALS.length} material streams, one dispatch desk.`}
            </SplitHeading>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-white/60 md:pb-2">
            Each stream carries its own handling rule, its own paperwork and
            its own idea of what a late load costs. The desk sequences them
            against one another, not one at a time.
          </p>
        </div>
      </div>

      {/*
        Full bleed, outside `container-edge`. A belt that stops short of the
        viewport edge reads as a widget sitting on the page; one that runs off
        both sides reads as something passing THROUGH it, which is the whole
        illusion.

        The separator is white rather than brand: Royal Blue on near-black is
        the one pairing in the system that goes muddy, and the accent is
        already spoken for by the closing card.
      */}
      <Marquee className="mt-14 md:mt-20">
        <ul className="flex items-center">
          {MATERIALS.map((material) => (
            <li key={material} className="flex items-center whitespace-nowrap">
              <span className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-none text-white">
                {material}
              </span>
              <span
                aria-hidden="true"
                className="mx-8 size-1.5 shrink-0 rounded-full bg-white/30 md:mx-12"
              />
            </li>
          ))}
        </ul>
      </Marquee>
    </SectionTransition>
  );
}
