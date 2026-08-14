import { SERVICES } from "@/content/services";
import { SERVICE_IMAGE } from "@/content/imagery";
import { SectionLabel } from "@/components/ui/panel";
import { TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { ServiceAccordion } from "@/features/home/sections/service-accordion";

/**
 * Services.
 *
 * AN ACCORDION OF PHOTOGRAPHS, NOT A GRID OF CARDS. Ten panels standing side
 * by side as one band; the one under the pointer opens to a third of the
 * frame and the other nine hold as narrow slices carrying a vertical label.
 * `service-accordion.tsx` carries the full argument for the form and the
 * transform arithmetic that makes it cheap.
 *
 * WHAT THIS REPLACED, AND WHY. The previous build was ten rows in two
 * columns with an 80px thumbnail on each. Three things were wrong with it:
 * an 80px photograph is not a photograph, it read as the third grid on a
 * page that already had two, and a numbered list that runs 01–05 down the
 * left then restarts at 06 on the right makes the reader re-find their place
 * halfway through. The accordion answers all three — every service is a
 * full-height photograph, the band is a shape that appears nowhere else on
 * the site, and the numbering runs straight across in one direction.
 *
 * IT ALSO FITS. Ten services in roughly one screen, against the two screens
 * the original card grid cost and the thousand pixels a single-column ledger
 * would. On a homepage that is not a detail — this block's job is to say
 * what we do and route onward, and it now does it without asking for the
 * scroll budget of a section that makes an argument.
 *
 * THE BAND IS `paper-alt`, unchanged. This section sits between two white
 * ones, and with the accordion's own frame being a single dark rectangle the
 * surface change is what keeps that rectangle from reading as a hole punched
 * in the page.
 *
 * Server component. The accordion is the only island and holds no content of
 * its own — every panel is server-rendered markup passed into it.
 */
export function Services() {
  return (
    <section className="bg-paper-alt" aria-labelledby="services-heading">
      <div className="container-page band-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Services</SectionLabel>
            <SplitHeading
              id="services-heading"
              className="type-h2 mt-6 max-w-[16ch] text-ink"
            >
              Ten ways we move your project
            </SplitHeading>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
              Most jobs use two or three at once. One dispatch desk sequences
              them so they do not collide on your site.
            </p>
          </Reveal>
        </div>

        <ServiceAccordion
          items={SERVICES.map((service) => ({
            slug: service.slug,
            index: service.index,
            name: service.name,
            summary: service.summary,
            plate: SERVICE_IMAGE[service.slug],
          }))}
        />

        <Reveal className="mt-10">
          <TextLink href="/services">All ten service lines</TextLink>
        </Reveal>
      </div>
    </section>
  );
}
