import { AFFILIATIONS } from "@/content/company";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { TextLink } from "@/components/ui/button";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Reveal } from "@/components/motion/reveal";

/**
 * Why the programme leads.
 *
 * The one section on this page that argues rather than documents. Everything
 * below it is the programme itself; this says why a haulage company puts its
 * safety record in front of its equipment list.
 *
 * The portrait is the only photograph on the page and it is of a person, on
 * purpose. Every claim underneath — training, re-testing, unannounced audit —
 * is about a driver rather than about a truck, and a page that illustrated
 * "safety" with another photograph of equipment would be arguing against
 * its own text.
 */
export function Commitment() {
  return (
    <section className="section-y" aria-labelledby="commitment-heading">
      <div className="container-edge">
        <div className="grid items-center gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ClipReveal from="bottom">
              <Media
                asset={IMAGES.driverPortrait}
                ratio="4/5"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </ClipReveal>
            <p className="mt-4 tnum text-[0.6875rem] uppercase tracking-[0.14em] text-ink-4">
              Road tested on hire, re-evaluated twice a year
            </p>
          </div>

          <Reveal className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow mb-8">Why it leads</p>
            <h2 id="commitment-heading" className="type-h1 max-w-[15ch] text-ink">
              The programme is the product.
            </h2>

            <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-[1.75] text-ink-2">
              Anyone can put a truck on a site. What a general contractor is
              actually buying is the confidence that the truck arrives with a
              driver who has been trained and re-tested, on a job whose hazards
              were assessed before the first load moved, under documentation
              that will survive an audit.
            </p>

            <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.75] text-ink-2">
              That is why our health and safety standards are held
              continuously rather than produced on request — and why the
              programme below is published in full rather than summarised as
              a badge.
            </p>

            <p className="mt-10 border-t border-line pt-8 text-[0.9375rem] leading-relaxed text-ink-3">
              Member of{" "}
              {AFFILIATIONS.map((affiliation, i) => (
                <span key={affiliation.abbr}>
                  {i > 0 && " and "}
                  <abbr title={affiliation.name} className="no-underline">
                    {affiliation.name}
                  </abbr>
                </span>
              ))}
              .
            </p>

            <div className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
              <TextLink href="/about">The company record</TextLink>
              <TextLink href="/fleet">What we run</TextLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
