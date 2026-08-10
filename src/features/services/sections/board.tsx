import { SERVICES, type Service } from "@/content/services";
import { SERVICE_IMAGE } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { BoardRail } from "@/features/services/sections/board-rail";

/**
 * The line-up, built as a DISPATCH BOARD.
 *
 * Two things are happening at once here, and they are separable.
 *
 * THE RAIL REPORTS. Ten entries scroll past on the right; a column on the
 * left stays put and reports which one you are inside, the way a dispatch
 * board reports the load currently on the road. The index numerals were taken
 * out of the entries — where ten grey ghosts restated an order already
 * visible — and given to one instrument that means something because it
 * changes. A reader eleven entries deep now always knows where they are,
 * which is the actual complaint about a ten-item read.
 *
 * THE ENTRIES ARE CARDS, AND THEY CARRY THEIR PLATE. An earlier build ran
 * this page as pure type on the argument that the homepage already shows
 * these ten as photographs. That argument was consistent and it produced a
 * page that looked like a specification sheet: correct, dense, and impossible
 * to scan. A superintendent looking for "the tanker one" finds it by
 * silhouette in about a third of the time it takes to read ten headings, and
 * the plates were already registered per service in `SERVICE_IMAGE` — ten
 * distinct frames, no repeats — so nothing had to be invented to do it.
 *
 * The cards are HORIZONTAL rather than a grid, and that follows from the
 * rail: a two-column grid puts two entries at the same scroll position, and
 * a readout that has to choose between a pair flickers between them. One
 * column also keeps the plate at a size where it is a photograph rather than
 * a thumbnail, at about a third of the page's height per entry.
 *
 * `TiltCard` does the rest. The plane turns toward the pointer, the text
 * block stands off the surface, and a specular sweep tracks the cursor —
 * see that component for why the numbers are as small as they are.
 *
 * DEEP LINKS ARE LOAD-BEARING. Every homepage service row points at
 * `/services#<slug>`, so each card keeps its `id` and its `anchor-offset`,
 * and the rail's ten entries are real fragment links rather than scroll
 * handlers — they work before hydration and they survive it.
 *
 * Server component. The rail and the tilt are the only islands, and neither
 * holds any of the page's content.
 */
export function Board() {
  return (
    <section className="section-y" aria-labelledby="board-heading">
      <div className="container-edge">
        <div className="mb-16 grid gap-y-8 md:mb-24 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">The line-up</p>
          <h2
            id="board-heading"
            className="type-h1 optical-flush max-w-[13ch] text-ink lg:col-span-6"
          >
            Ten ways we move your project.
          </h2>
          <p className="max-w-xs self-end text-[0.9375rem] leading-relaxed text-ink-3 lg:col-span-3">
            Most jobs use two or three of these at once. One dispatch desk
            sequences them so they do not collide on your site.
          </p>
        </div>

        {/*
          The narrow-width stand-in for the rail. Below `lg` there is no
          second column to park a readout in, so the ten jump links revert to
          a plain contents strip — still the fastest route for someone who
          arrived knowing which line they came for.
        */}
        <nav
          aria-label="Service lines"
          className="border-y border-line-strong py-8 lg:hidden"
        >
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <a
                  href={`#${service.slug}`}
                  className="flex items-baseline gap-4 text-ink-2 transition-colors duration-500 hover:text-brand"
                >
                  <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                    {service.index}
                  </span>
                  <span className="text-[0.9375rem]">{service.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 lg:mt-0 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <BoardRail
            items={SERVICES.map(({ slug, name, index }) => ({
              slug,
              name,
              index,
            }))}
          />

          {/*
            Seven columns of twelve, starting at six. The one-column gap
            between the rail and the cards is what stops the readout from
            reading as a label attached to the first card.
          */}
          <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
            {SERVICES.map((service) => (
              <Entry key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One line, as a card.
 *
 * `data-service-entry` is the contract with the rail: it marks the elements
 * whose passage drives the readout, and the ORDER of these elements in the
 * document is the order of the labels on the reel. Both come from the same
 * `SERVICES` array, so they cannot disagree.
 *
 * THE CARD IS A FRAME, NOT A BOX. A 10px paper border around a clipped plate
 * is what makes it read as a mounted print rather than as a div with a photo
 * in it, and it is what gives the tilt something to catch the light on. The
 * inner radius is deliberately tighter than the outer one — concentric
 * corners with equal radii look wrong at every size.
 */
function Entry({ service }: { service: Service }) {
  return (
    <article id={service.slug} data-service-entry className="anchor-offset">
      <Reveal>
        <TiltCard className="rounded-plate border border-line bg-paper p-2.5 shadow-lift transition-shadow duration-700 ease-[var(--ease-brand)] group-hover/tilt:shadow-float">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-6">
            <div className="relative overflow-hidden rounded-[0.85rem] [grid-area:1/1]">
              <Media
                asset={SERVICE_IMAGE[service.slug]}
                ratio="4/3"
                radius="none"
                className="h-full w-full"
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 40vw, 100vw"
                scrim="bottom"
                zoomOnHover
              />
            </div>

            {/*
              THE NUMERAL IS A GRID ITEM SHARING THE PLATE'S CELL, not a child
              of it. Two things fall out of that, and both are the reason for
              the explicit `grid-area`.

              An element with `overflow: hidden` flattens its own subtree, so
              a numeral inside the clipped plate could not stand off the card
              in 3D. Out here it lifts a full 60px and parallaxes as the card
              turns.

              And it stays ON the plate at both widths. Absolutely positioning
              it against the card would land it over the plate on the
              two-column layout and over white body copy — white on white —
              once the card stacks. Sharing the cell tracks the plate instead
              of the card.
            */}
            <p
              aria-hidden="true"
              className="pointer-events-none mb-5 ml-6 self-end justify-self-start font-display text-[clamp(2.25rem,3.4vw,3.25rem)] leading-none text-white [grid-area:1/1]"
              style={{ transform: "translateZ(60px)" }}
            >
              {service.index}
            </p>

            {/*
              35px of lift. At the 1400px perspective the card is drawn with,
              that is a 2.6% magnification — enough to separate the text from
              the surface as the card turns, small enough that the block stays
              inside the padding on the near edge.
            */}
            <div
              className="flex flex-col py-2 pr-1 sm:py-4 sm:pr-3"
              style={{ transform: "translateZ(35px)" }}
            >
              <h3 className="type-h3 max-w-[18ch] text-ink">{service.name}</h3>

              <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-snug tracking-tight text-ink-2">
                {service.summary}
              </p>

              <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-ink-3">
                {service.description}
              </p>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {service.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full border border-line px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.14em] text-ink-4"
                  >
                    {capability}
                  </li>
                ))}
              </ul>

              {/*
                A text link, not a button. Ten filled buttons down one column
                reads as ten decisions to make; the ask on this page is to
                keep reading, and the page closes on a full-weight call.
              */}
              <div className="mt-auto pt-6">
                <TextLink href="/quote">Quote this line</TextLink>
              </div>
            </div>
          </div>
        </TiltCard>
      </Reveal>
    </article>
  );
}
