import { Phone, Mail } from "lucide-react";
import { COMPANY } from "@/content/company";
import { Button } from "@/components/ui/button";

/**
 * Closing card.
 *
 * THE ONE SURFACE ROYAL BLUE FILLS on any page that uses it. The accent is
 * held to marks — a button, a route node, an icon glyph — for the whole
 * page so that it lands here with weight rather than being spent on
 * decoration along the way.
 *
 * Inset like the hero, so a page opens and closes on the same shape and the
 * stack reads as bookended rather than as simply having stopped.
 *
 * Shared by the homepage and /about rather than copied into each, because
 * "spend the accent once, at the end" is a rule about the whole site and a
 * rule implemented twice is a rule that will eventually be followed once.
 */
interface ClosingCardProps {
  label: string;
  heading: string;
  headingId: string;
  lead: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function ClosingCard({
  label,
  heading,
  headingId,
  lead,
  primary,
  secondary,
}: ClosingCardProps) {
  return (
    <section className="container-page pb-3 pt-4 md:pt-6" aria-labelledby={headingId}>
      <div>
        <div className="rounded-plate bg-brand p-7 md:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <p className="section-label text-white/60">/ {label}</p>
              <h2
                id={headingId}
                className="type-h2 mt-6 max-w-[14ch] text-balance text-white"
              >
                {heading}
              </h2>
              <p className="mt-7 max-w-md text-[0.9375rem] leading-relaxed text-white/85">
                {lead}
              </p>
            </div>

            <div className="flex flex-col items-start gap-8 lg:col-span-4 lg:col-start-9">
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

              <div className="flex flex-col gap-3 border-t border-white/25 pt-6">
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="flex items-center gap-3 text-white transition-opacity duration-500 hover:opacity-75"
                >
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  <span className="tnum text-[0.9375rem] tracking-wider">
                    {COMPANY.phone}
                  </span>
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-3 text-white transition-opacity duration-500 hover:opacity-75"
                >
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  <span className="text-[0.9375rem] tracking-wider">
                    {COMPANY.email}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
