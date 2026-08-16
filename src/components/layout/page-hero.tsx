import type { ImageAsset } from "@/content/imagery";
import { cn } from "@/lib/utils";
import { Media } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * THE INTERIOR PAGE HERO — one plate, one composition, every page but home.
 *
 * This is the /services hero generalised. That page had the best opening on
 * the site and three others had already grown toward it independently
 * (/safety, /contact, /projects all run a plate with sheared display lines),
 * while /about, /fleet and /quote were each doing something else. Four
 * near-identical implementations and three outliers is not a system; it is a
 * set of pages that happen to share a stylesheet.
 *
 * THE COMPOSITION, top to bottom:
 *
 *     eyebrow · readout      technical labels on the plate's shoulder
 *     display lines          hand-broken, sheared laterally as they pass
 *     lead · call to action  the claim, and the way in
 *     fact strip            four values divided by hairlines, ON the plate
 *
 * THE FACTS SIT INSIDE THE PLATE, and that is the decision that makes the
 * hero one object. Four numbers on their own grey card below it would be a
 * second thing to take in before the page has said anything; on the plate
 * they read as the caption to what is already being looked at.
 *
 * THE VISIBLE LINES ARE PRESENTATIONAL AND THE `h1` IS `sr-only`. Splitting a
 * headline across separately-drifting elements means each one is its own node,
 * so without that contract the page announces its headline once per line. The
 * readable string is carried once, above, and it is the one that may safely
 * derive from the content model — the visible break is a composition decision
 * and stays hand-authored.
 *
 * IT CLEARS THE HEADER RATHER THAN PASSING UNDER IT. The header paints as
 * white glass everywhere except the homepage, so a plate starting at the top
 * of the document would have an opaque bar across its first 96px and its top
 * corners eaten. `--header-h` is that bar's height; the 0.75rem after it is
 * the card layout's 12px gap.
 *
 * The plate is `priority` — on every page that uses this it is unambiguously
 * the LCP element.
 *
 * Server component apart from the motion wrappers.
 */

export interface HeroLine {
  text: string;
  /**
   * Full Tailwind class, e.g. `lg:pl-[11%]`. Omit for a flush-left line.
   *
   * AUTHORED AS A COMPLETE CLASS STRING, always. Tailwind compiles by scanning
   * source text, so an interpolated `lg:pl-[${n}%]` produces no CSS at all and
   * the line silently sits flush.
   */
  indent?: string;
  /** Lateral shear in px. Alternate the sign down the stack. */
  drift: number;
}

interface PageHeroProps {
  /** Section marker — rendered as `/ Services`. */
  eyebrow: string;
  /** Optional technical readout on the plate's top right. */
  meta?: string;
  /** The readable headline, announced once. Derive it from content freely. */
  heading: string;
  headingId: string;
  /** Hand-broken display lines. Where a headline breaks is a decision. */
  lines: readonly HeroLine[];
  lead: string;
  cta?: { label: string; href: string };
  /** Exactly four — the hairline rules below are written for a 2×2 / 1×4. */
  facts?: readonly { k: string; v: string }[];
  plate: ImageAsset;
}

export function PageHero({
  eyebrow,
  meta,
  heading,
  headingId,
  lines,
  lead,
  cta,
  facts,
  plate,
}: PageHeroProps) {
  return (
    <section
      className="container-page pt-[calc(var(--header-h)+0.75rem)]"
      aria-labelledby={headingId}
    >
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
          `svh`, not `vh`: on mobile browsers `vh` measures the viewport with
          the URL bar retracted, so a `vh`-sized hero is always taller than
          what is actually on screen at first paint. The 9rem subtracted is the
          header, the gap above the plate and the gap below it.

          NO `max-h` COMPANION, and that is not an omission. When the two
          conflict CSS resolves min-height LAST — `max(min-height,
          min(max-height, height))` — so any cap above the viewport-derived
          floor is unreachable and any cap below it is silently ignored. A hero
          that grows with a tall display is the intended behaviour; the base
          `34rem` is what holds it up on short viewports.
        */}
        <div className="relative z-10 flex min-h-[34rem] flex-col md:min-h-[calc(100svh-9rem)]">
          <div className="flex items-center justify-between gap-6 p-6 md:p-10">
            <p className="section-label text-white/60">/ {eyebrow}</p>
            {meta && (
              <p className="tnum text-right text-[0.6875rem] uppercase tracking-[0.16em] text-white/45">
                {meta}
              </p>
            )}
          </div>

          {/* `mt-auto` parks the headline on the plate's floor at any height. */}
          <div className="mt-auto px-6 pb-10 md:px-10 md:pb-14">
            <h1 id={headingId} className="sr-only">
              {heading}
            </h1>

            <div aria-hidden="true">
              {lines.map((line, i) => (
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
                {lead}
              </p>
              {cta && (
                <Button href={cta.href} size="lg" variant="onImage" arrow>
                  {cta.label}
                </Button>
              )}
            </Reveal>
          </div>

          {facts && (
            <dl className="grid grid-cols-2 border-t border-white/15 md:grid-cols-4">
              {facts.map((fact, i) => (
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
          )}
        </div>
      </div>
    </section>
  );
}
