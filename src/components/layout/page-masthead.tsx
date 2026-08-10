import type { ImageAsset } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Parallax } from "@/components/motion/parallax";

/**
 * Interior-page masthead.
 *
 * THIS IS THE ONE PIECE OF FURNITURE THE INTERIOR PAGES SHARE, and that is
 * deliberate. The homepage and /about each own a bespoke opening because
 * each is a destination in its own right; the six interior pages are a SET,
 * and a set that opens six different ways reads as six different websites.
 * What differentiates them is their bodies — the register, the index, the
 * studies, the programme — not their first screen.
 *
 * The vocabulary sits deliberately between the two bespoke openings:
 *
 *  · `type-display`, never `type-colossal`. That tier belongs to /about's
 *    masthead and is used exactly once on the site. Borrowing it here would
 *    flatten the hierarchy that page is built on.
 *  · Lines shear rather than slide. Each line takes its own `Drift`
 *    distance, so the stack opens and closes as it passes — the same idea
 *    as /about, one tier quieter.
 *  · Indents are AUTHORED PER PAGE, as full class strings. Tailwind compiles
 *    by scanning source text, so an interpolated `lg:pl-[${n}%]` produces no
 *    CSS at all and every line would silently sit flush left.
 *
 * The plate, when present, sits BELOW the type at full bleed rather than
 * colliding with it. Collision is /about's idea; repeating it would make
 * that page's composition read as a template instead of as art direction.
 *
 * Server component apart from the motion wrappers.
 */

export interface MastheadLine {
  text: string;
  /** Full Tailwind class, e.g. `lg:pl-[12%]`. Omit for a flush-left line. */
  indent?: string;
  /** Lateral shear in px. Alternate the sign down the stack. */
  drift: number;
}

interface PageMastheadProps {
  /** Technical label above the headline. */
  eyebrow: string;
  /**
   * The readable headline, announced once. The visible lines below are
   * marked presentational — without this the page announces the headline
   * once per line.
   */
  heading: string;
  /** Hand-broken display lines. Where a headline breaks is a decision. */
  lines: readonly MastheadLine[];
  /** Standfirst. Deliberately small against type many times its size. */
  lead: string;
  /** Optional record strip — facts, not selling. */
  facts?: readonly { k: string; v: string }[];
  /** Optional full-bleed plate closing the masthead. */
  plate?: ImageAsset;
  /** `id` for the `aria-labelledby` contract with the section. */
  headingId: string;
}

export function PageMasthead({
  eyebrow,
  heading,
  headingId,
  lines,
  lead,
  facts,
  plate,
}: PageMastheadProps) {
  return (
    <section
      className="relative overflow-hidden pt-32 md:pt-44"
      aria-labelledby={headingId}
    >
      <div className="container-edge">
        <p className="eyebrow mb-10 md:mb-16">{eyebrow}</p>

        <h1 id={headingId} className="sr-only">
          {heading}
        </h1>

        <div aria-hidden="true">
          {lines.map((line, i) => (
            <Drift key={line.text} distance={line.drift} triggerSelector="section">
              <MaskLines
                presentational
                as="p"
                lines={[line.text]}
                delay={i * 0.08}
                className={`type-display text-ink ${
                  line.indent ?? "optical-flush"
                }`}
              />
            </Drift>
          ))}
        </div>

        <Reveal
          delay={0.45}
          className="mt-16 grid gap-x-10 gap-y-12 md:mt-24 lg:grid-cols-12"
        >
          <p className="type-lead text-ink-2 lg:col-span-5 lg:col-start-1">
            {lead}
          </p>

          {facts && (
            <dl className="grid grid-cols-2 gap-x-8 gap-y-8 self-end lg:col-span-5 lg:col-start-8">
              {facts.map((fact) => (
                <div key={fact.k}>
                  <dt className="eyebrow mb-2">{fact.k}</dt>
                  <dd className="tnum text-[0.9375rem] text-ink">{fact.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
      </div>

      {plate && (
        /*
          The ratio lives on the Parallax frame: the plate inside it is
          absolutely positioned and so cannot give the frame a height.
        */
        <ClipReveal from="bottom" duration={1.4} className="mt-20 md:mt-28">
          <Parallax ratio="21/9" amount={8} className="w-full">
            <Media
              asset={plate}
              ratio="auto"
              radius="none"
              className="h-full w-full"
              sizes="100vw"
              priority
            />
          </Parallax>
        </ClipReveal>
      )}
    </section>
  );
}
