import { COMPANY } from "@/content/company";
import { Button } from "@/components/ui/button";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * Closing band for the interior pages.
 *
 * Royal Blue fills a surface exactly once per page, at the end — the same
 * rule the homepage and /about already follow. This is the shared
 * implementation of that rule so the six interior pages cannot drift apart
 * on it; the words change per page, the structure does not.
 *
 * `secondary` exists because not every page closes on the same ask. A
 * visitor finishing /safety may want to keep prequalifying rather than
 * price a job, and one finishing /projects is likelier to want the
 * equipment than the form.
 */

interface ClosingCtaProps {
  eyebrow: string;
  /** The readable heading, announced once. */
  heading: string;
  headingId: string;
  /** Hand-broken display lines with authored indents. */
  lines: readonly { text: string; indent?: string; drift: number }[];
  lead: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function ClosingCta({
  eyebrow,
  heading,
  headingId,
  lines,
  lead,
  primary,
  secondary,
}: ClosingCtaProps) {
  return (
    <section className="overflow-hidden bg-brand" aria-labelledby={headingId}>
      <div className="container-edge section-y">
        <p className="mb-14 tnum text-[0.75rem] uppercase tracking-[0.16em] text-white/60 md:mb-20">
          {eyebrow}
        </p>

        <h2 id={headingId} className="sr-only">
          {heading}
        </h2>

        <div aria-hidden="true">
          {lines.map((line, i) => (
            <Drift key={line.text} distance={line.drift} triggerSelector="section">
              <MaskLines
                presentational
                onScroll
                as="p"
                lines={[line.text]}
                delay={i * 0.08}
                className={`type-display text-white ${
                  line.indent ?? "optical-flush"
                }`}
              />
            </Drift>
          ))}
        </div>

        <Reveal
          stagger
          className="mt-20 flex flex-col gap-12 md:mt-28 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-[1.0625rem] leading-[1.75] text-white/85">
            {lead}
          </p>

          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-wrap gap-3">
              <Button
                href={primary.href}
                size="lg"
                className="bg-white text-brand hover:bg-paper-alt"
                arrow
              >
                {primary.label}
              </Button>
              {secondary && (
                <Button href={secondary.href} size="lg" variant="onImageOutline">
                  {secondary.label}
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="tnum text-sm tracking-wider text-white transition-opacity duration-500 hover:opacity-75"
              >
                {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="tnum text-sm tracking-wider text-white transition-opacity duration-500 hover:opacity-75"
              >
                {COMPANY.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
