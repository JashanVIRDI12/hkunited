import { Reveal } from "@/components/motion/reveal";
import { TextLink } from "@/components/ui/button";

/**
 * What the three studies share.
 *
 * Every line below is a restatement of something already argued in
 * `content/projects.ts` — nothing new is claimed here. The block exists
 * because three studies read as three anecdotes until someone names the
 * pattern running through them; that pattern is the actual pitch, and
 * leaving the reader to infer it is leaving the page's best argument
 * unmade.
 */
const PATTERN = [
  {
    index: "01",
    title: "Nothing is allowed to accumulate",
    body: "A downtown excavation has no laydown area and a paving train cannot stop. On this class of work haulage is not a service that happens after the machine — it is the constraint the machine runs against, so capacity is sized to the excavation or paving rate rather than to a daily load count.",
  },
  {
    index: "02",
    title: "Capacity follows the work",
    body: "Linear jobs advance. Dispatch follows the heading across multiple access points and shifting traffic management, so the units are where the works have reached today rather than where they started.",
  },
  {
    index: "03",
    title: "The documentation travels with the load",
    body: "Contaminated and regulated material is tracked to approved receiving sites, and public infrastructure contracts are held to the documentation standard they require — maintained during the job, not assembled afterwards.",
  },
];

export function Common() {
  return (
    <section className="section-y bg-paper-alt" aria-labelledby="common-heading">
      <div className="container-edge">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-8">The pattern</p>
              <h2 id="common-heading" className="type-h1 max-w-[11ch] text-ink">
                What all three have in common.
              </h2>
              <p className="mt-8 max-w-sm leading-relaxed text-ink-2">
                Different sites, one discipline. It is why the same carrier
                runs a condominium dig, a transit corridor and a highway
                paving train without changing how it works.
              </p>

              <div className="mt-10">
                <TextLink href="/safety">How that discipline is held</TextLink>
              </div>
            </div>
          </div>

          {/*
            RULED ROWS, DELIBERATELY, DIRECTLY AFTER A DECK OF CARDS. The
            temptation is to answer three stacking ink cards with three more
            cards, and it is the wrong move twice over: it would make the
            deck's form ordinary by repeating it, and it would package a
            passage that is one continuous argument as three separate objects.
            The studies are things you can take one at a time; the pattern is
            not. A rule says "this continues" where a card says "this stands
            alone", so the pattern gets rules.

            What it does borrow from the deck is the numeral at display scale
            — the only thread the two sections share, and enough of one that
            the page reads as having been designed once.
          */}
          <Reveal stagger className="border-t border-line-strong lg:col-span-8">
            {PATTERN.map((item) => (
              <div
                key={item.index}
                className="grid gap-x-10 gap-y-5 border-b border-line py-12 md:grid-cols-12"
              >
                <p
                  aria-hidden="true"
                  className="font-display text-[clamp(2.25rem,3vw,3rem)] leading-none text-line-strong md:col-span-2"
                >
                  {item.index}
                </p>
                <div className="md:col-span-10">
                  <h3 className="type-h3 max-w-[20ch] text-ink">{item.title}</h3>
                  <p className="mt-4 max-w-[58ch] leading-[1.75] text-ink-2">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
