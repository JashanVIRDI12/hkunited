import { COMPANY } from "@/content/company";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * The direct line.
 *
 * THIS IS WHY /quote DOES NOT USE `ClosingCta`. Every other page closes on
 * Royal Blue with a button pointing here — closing this page with a button
 * pointing at the form six inches above it would be furniture, not a call to
 * action. The blue is still spent once, at the end, but what it carries is
 * the alternative to the form rather than a second copy of it.
 *
 * Both channels are set at display scale because they ARE the content, and
 * both are live links: a phone number that cannot be tapped on the device it
 * is being read on is a picture of a phone number.
 */
export function Direct() {
  return (
    <section className="overflow-hidden bg-brand" aria-labelledby="direct-heading">
      <div className="container-edge section-y">
        <p className="mb-14 tnum text-[0.75rem] uppercase tracking-[0.16em] text-white/60 md:mb-20">
          Direct
        </p>

        <h2 id="direct-heading" className="sr-only">
          Or skip the form entirely.
        </h2>

        <div aria-hidden="true">
          <Drift distance={24} triggerSelector="section">
            <MaskLines
              presentational
              onScroll
              as="p"
              lines={["Or skip the"]}
              className="type-display optical-flush text-white"
            />
          </Drift>
          <Drift distance={-30} triggerSelector="section">
            <MaskLines
              presentational
              onScroll
              as="p"
              lines={["form entirely."]}
              delay={0.08}
              className="type-display text-white lg:pl-[12%]"
            />
          </Drift>
        </div>

        <Reveal
          stagger
          className="mt-20 grid gap-x-16 gap-y-12 border-t border-white/25 pt-14 md:mt-28 md:grid-cols-2"
        >
          <a href={`tel:${COMPANY.phoneHref}`} className="group block">
            <span className="text-[0.75rem] uppercase tracking-[0.16em] text-white/60">
              Dispatch
            </span>
            <span className="type-h1 tnum mt-4 block text-white transition-opacity duration-500 group-hover:opacity-75">
              {COMPANY.phone}
            </span>
            <span className="mt-4 block text-[0.9375rem] text-white/70">
              Around the clock for active jobs
            </span>
          </a>

          <a href={`mailto:${COMPANY.email}`} className="group block">
            <span className="text-[0.75rem] uppercase tracking-[0.16em] text-white/60">
              Email
            </span>
            <span className="type-h2 mt-4 block break-all text-white transition-opacity duration-500 group-hover:opacity-75">
              {COMPANY.email}
            </span>
            <span className="mt-4 block text-[0.9375rem] text-white/70">
              {COMPANY.address.street}, {COMPANY.address.city},{" "}
              {COMPANY.address.region}
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
