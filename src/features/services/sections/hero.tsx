import { COMPANY } from "@/content/company";
import { SERVICES } from "@/content/services";
import { INDUSTRIES } from "@/content/industries";
import { IMAGES } from "@/content/imagery";
import { cn } from "@/lib/utils";
import { Media } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * Services hero.
 *
 * A PHOTOGRAPHIC PLATE, WHICH IS A DEPARTURE FROM THE INTERIOR SET. The other
 * interior pages open on `PageMasthead` — sheared display type on white with
 * the plate held back until after the standfirst. That is a good opening for
 * a page someone is going to READ, and this is not one of those: /services is
 * where a superintendent lands from a search and decides in about two seconds
 * whether this carrier runs work at their scale. Type alone does not answer
 * that. A night paving train does.
 *
 * WHAT IT KEEPS FROM THE SET, so it reads as the same company: the hand-broken
 * display lines, the lateral shear that opens and closes the stack as it
 * passes, the technical eyebrow, and the record strip of facts. What changes
 * is the ground under them.
 *
 * IT CLEARS THE HEADER RATHER THAN PASSING UNDER IT. The header paints as
 * white glass everywhere except the homepage, so a plate that started at the
 * top of the document would have an opaque bar laid across its first 96px and
 * its top corners eaten. `--header-h` is that bar's height; the 0.75rem after
 * it is the card layout's 12px gap.
 *
 * The facts sit INSIDE the plate, divided by a hairline, rather than in a
 * grey strip below it. Four numbers on their own card would be a second
 * object to take in before the page has said anything; on the plate they read
 * as the caption to what is already being looked at, and the hero stays one
 * thing.
 *
 * The plate is `priority` — it is unambiguously the LCP element.
 *
 * Server component apart from the motion wrappers.
 */

/**
 * Hand-broken. Where a display headline breaks is a design decision.
 *
 * Indents are AUTHORED AS FULL CLASS STRINGS. Tailwind compiles by scanning
 * source text, so an interpolated `lg:pl-[${n}%]` produces no CSS at all and
 * every line would silently sit flush left.
 */
const LINES: readonly {
  text: string;
  indent?: string;
  /** Lateral shear in px. Alternate the sign down the stack. */
  drift: number;
}[] = [
  { text: "Ten lines.", drift: 20 },
  { text: "One schedule", indent: "lg:pl-[9%]", drift: -28 },
  { text: "to keep.", indent: "lg:pl-[3%]", drift: 22 },
];

const FACTS = [
  { k: "Service lines", v: String(SERVICES.length) },
  { k: "Sectors", v: String(INDUSTRIES.length) },
  { k: "Scale", v: "Single load to sustained" },
  { k: "Coverage", v: COMPANY.serviceArea },
] as const;

export function ServicesHero() {
  return (
    <section
      className="container-page pt-[calc(var(--header-h)+0.75rem)]"
      aria-labelledby="services-heading"
    >
      <div className="relative overflow-hidden rounded-plate bg-ink">
        <div className="absolute inset-0">
          <Media
            asset={IMAGES.paving}
            ratio="auto"
            radius="none"
            className="h-full w-full"
            sizes="100vw"
            scrim="bottom"
            priority
          />
        </div>

        {/*
          `svh`, not `vh`: on mobile browsers `vh` measures the viewport with
          the URL bar retracted, so a `vh`-sized hero is always taller than
          what is actually on screen at first paint. The 9rem subtracted is
          the header, the gap above the plate and the gap below it.

          NO `max-h` COMPANION, and that is not an omission. When the two
          conflict CSS resolves min-height LAST — `max(min-height,
          min(max-height, height))` — so any cap above the viewport-derived
          floor is unreachable and any cap below it is silently ignored. A
          hero that grows with a tall display is the intended behaviour here
          anyway; the base `34rem` is what holds it up on short ones.
        */}
        <div className="relative z-10 flex min-h-[34rem] flex-col md:min-h-[calc(100svh-9rem)]">
          <div className="flex items-center justify-between gap-6 p-6 md:p-10">
            <p className="section-label text-white/60">/ Services</p>
            <p className="tnum text-[0.6875rem] uppercase tracking-[0.16em] text-white/45">
              {SERVICES.length} lines · {INDUSTRIES.length} sectors
            </p>
          </div>

          {/* `mt-auto` parks the headline on the plate's floor at any height. */}
          <div className="mt-auto px-6 pb-10 md:px-10 md:pb-14">
            <h1 id="services-heading" className="sr-only">
              {SERVICES.length} service lines across {INDUSTRIES.length} sectors
            </h1>

            {/*
              The visible lines are presentational — the readable headline is
              announced once, above. Without that the page would announce it
              once per line.
            */}
            <div aria-hidden="true">
              {LINES.map((line, i) => (
                <Drift
                  key={line.text}
                  distance={line.drift}
                  triggerSelector="section"
                >
                  <MaskLines
                    presentational
                    as="p"
                    lines={[line.text]}
                    delay={0.15 + i * 0.08}
                    className={`type-display text-white ${
                      line.indent ?? "optical-flush"
                    }`}
                  />
                </Drift>
              ))}
            </div>

            <Reveal
              delay={0.5}
              className="mt-10 flex flex-col gap-8 md:mt-14 lg:flex-row lg:items-end lg:justify-between"
            >
              <p className="max-w-xl text-[0.9375rem] leading-relaxed text-white/80">
                From a single load to sustained haulage on a transit corridor —
                and the scheduling intelligence to deliver on schedule and in
                the appropriate order, which is the difference between material
                on site and material in the way.
              </p>
              <Button href="/quote" size="lg" variant="onImage" arrow>
                Request a quote
              </Button>
            </Reveal>
          </div>

          <dl className="grid grid-cols-2 border-t border-white/15 md:grid-cols-4">
            {FACTS.map((fact, i) => (
              <div
                key={fact.k}
                className={cn(
                  "px-6 py-5 md:px-10 md:py-6",
                  // Hairlines BETWEEN the cells, never around them. The grid
                  // is two columns wide before `md` and four after, so which
                  // cells start a row changes — hence one rule per axis per
                  // breakpoint rather than a border on every box.
                  i % 2 === 1 && "border-l border-white/15",
                  i >= 2 && "border-t border-white/15 md:border-t-0",
                  i > 0 ? "md:border-l md:border-white/15" : "md:border-l-0",
                )}
              >
                <dt className="eyebrow text-white/45">{fact.k}</dt>
                <dd className="tnum mt-2 text-[0.9375rem] leading-snug text-white">
                  {fact.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
