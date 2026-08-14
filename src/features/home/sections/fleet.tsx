import Link from "next/link";
import { FLEET, DIVISIONS, type FleetCategory } from "@/content/fleet";
import { FLEET_IMAGE } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel, SectionLabel } from "@/components/ui/panel";
import { TextLink } from "@/components/ui/button";
import { PinnedTrack } from "@/components/motion/pinned-track";
import { SplitHeading } from "@/components/motion/split-heading";

/**
 * The fleet, as the page's one PINNED HORIZONTAL PASS.
 *
 * WHY THIS SECTION AND NO OTHER. A pinned track is the most expensive
 * interaction on a site — it takes the scrollbar away and asks the visitor to
 * trust that something is happening — so it has to be spent where the content
 * is genuinely a set of parallel things rather than a sequence of arguments.
 * Six equipment configurations is exactly that shape: they are peers, the
 * order between them means nothing, and the thing a superintendent is doing
 * here is COMPARING rather than reading. Sliding them past one at a time,
 * with the one in focus bright and its neighbours recessed, is that comparison
 * made physical.
 *
 * The alternative candidates were both wrong for it. The ten service lines are
 * a directory — someone is looking for one specific entry, and a directory you
 * have to scroll sideways through is a directory you have made worse. The
 * five process steps are a sequence, and a sequence already has a natural
 * vertical reading order that pinning would fight.
 *
 * IT IS ALSO THE ONLY ONE. A page with two pinned sections has neither: the
 * second one reads as the site doing its trick again, and the first stops
 * being an event.
 *
 * BELOW `lg` — AND UNDER REDUCED MOTION AT ANY SIZE — THERE IS NO PIN AND NO
 * TRACK. The same six cards render as an ordinary grid, every one at full
 * opacity, scrolled vertically like everything else on the page. That is not
 * a degraded version of this section; for a thumb it is the better one.
 *
 * THE FULL SPREAD LIVES ON /fleet. This deliberately does not carry the long
 * description or the spec table: that page is the catalogue, and duplicating
 * it here would mean the homepage ends with six long reads.
 */
const DIVISION_OF = Object.fromEntries(
  DIVISIONS.map((division) => [division.id, division.name]),
) as Record<FleetCategory, string>;

export function Fleet() {
  return (
    <PinnedTrack
      labelledBy="fleet-heading"
      count={FLEET.length}
      // `py-0` while pinned: `band-y` is several hundred pixels of padding,
      // and a pinned viewport already sized to the screen cannot carry it
      // without pushing its own cards past the fold.
      className="container-page band-y data-[mode=pinned]:py-0"
      trackClassName="sm:grid-cols-2 lg:grid-cols-3"
      header={
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Fleet</SectionLabel>
            <SplitHeading
              id="fleet-heading"
              className="type-h2 mt-6 max-w-[16ch] text-ink"
            >
              Six configurations, one operator
            </SplitHeading>
          </div>
          <div className="max-w-sm md:pb-2">
            <p className="text-[0.9375rem] leading-relaxed text-ink-3">
              Bulk, tank, waste and flatbed under a single roof — so the right
              unit shows up, not the one that happened to be free.
            </p>
            {/*
              The route onward lives in the header rather than under the
              track. While pinned there is no "under the track" — the section
              is the screen — and a link that only appears once the horizontal
              pass is finished is a link most visitors never reach.
            */}
            <TextLink href="/fleet" className="mt-5">
              Full fleet specifications
            </TextLink>
          </div>
        </div>
      }
    >
      {FLEET.map((unit) => (
        /*
          The data marker sits on a WRAPPER rather than on the Panel: `Panel`
          takes an explicit prop list rather than spreading arbitrary
          attributes, and widening it to pass one data attribute through would
          make every card in the system a possible carrier of anything. The
          wrapper is also the honest target for the active-state scale — it
          holds no surface styling of its own, so scaling it cannot interact
          with the card's border radius or shadow.
        */
        <div
          key={unit.slug}
          data-track-item
          className="group-data-[mode=pinned]/track:w-[min(24rem,62vw)] group-data-[mode=pinned]/track:shrink-0"
        >
          <Panel tone="paper" className="group h-full overflow-hidden p-0">
            <Link href={`/fleet#${unit.slug}`} className="block">
              {/*
                `data-track-media` is the brightness target. The recessed cards
                are dimmed and slightly desaturated rather than only faded — a
                photograph at reduced opacity over a white card washes out to
                grey, where a darkened one still reads as a photograph you have
                not got to yet.
              */}
              <div data-track-media>
                <Media
                  asset={FLEET_IMAGE[unit.slug]}
                  ratio="4/3"
                  radius="none"
                  className="w-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24rem"
                  zoomOnHover
                />
              </div>

              <div className="p-7">
                <div className="flex items-baseline gap-4">
                  <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                    {unit.index}
                  </span>
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-brand">
                    {DIVISION_OF[unit.category]}
                  </span>
                </div>

                {/*
                  The accent indicator. It expands under the heading of the
                  card in focus and is the only brand mark in the track — which
                  is what lets it carry the state on its own, without a border
                  or a shadow being added to say the same thing twice.

                  Parked at `scale-x-0` in the markup, which is safe here in a
                  way it is not for content: this is an `aria-hidden`
                  decoration with no information in it, so a build where it
                  never expands loses nothing a reader needed.
                */}
                <span
                  aria-hidden="true"
                  data-track-rule
                  className="mt-4 block h-px w-14 origin-left scale-x-0 bg-brand"
                />

                {/*
                  `transition-colors` only, and the transform left alone.
                  This heading is also the active-state target the track
                  tweens `y` on — a CSS transition on `transform` here would
                  run its own clock against GSAP's and the title would lag
                  the card it belongs to. The hover lift is applied to the
                  same axis by the wrapper below instead.
                */}
                <h3
                  data-track-title
                  className="type-h3 mt-4 text-ink transition-colors duration-[320ms] group-hover:text-brand"
                >
                  {unit.name}
                </h3>
                <p className="mt-3 max-w-[32ch] text-[0.9375rem] leading-relaxed text-ink-3">
                  {unit.summary}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {unit.payloads.slice(0, 3).map((payload) => (
                    <li
                      key={payload}
                      className="rounded-full bg-paper-sunk px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3"
                    >
                      {payload}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </Panel>
        </div>
      ))}
    </PinnedTrack>
  );
}
