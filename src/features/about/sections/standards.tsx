import { SAFETY_PILLARS } from "@/content/safety";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { ClipReveal } from "@/components/motion/clip-reveal";

/**
 * Standards.
 *
 * THE ONE DARK BAND ON /about, full-bleed rather than a card — `bg-ink`
 * rather than `ink-panel`, for the same reason the homepage safety block
 * is: near-black is the point when a surface reaches both edges, and the
 * softer panel tone exists for cards sitting between two light ones.
 *
 * The homepage shows these four pillars as dark CARDS carrying statements
 * only. This shows them as RULED ROWS carrying statement plus practices —
 * more evidence per pillar, no photograph, and a shape the homepage does
 * not use. The unabridged programme, with the detail paragraph behind each
 * statement, is on /safety; this page is the summary a prospective client
 * reads on the way past.
 *
 * Type on `bg-ink` is white or `white/70`; both clear AA on this surface,
 * asserted by `npm run audit:contrast`.
 */
export function Standards() {
  return (
    <section className="bg-ink" aria-labelledby="standards-heading">
      <div className="container-page band-y">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="section-label text-white/50">/ Standards</p>
              <SplitHeading id="standards-heading" className="type-h2 mt-6 max-w-[12ch] text-white">
                An unwavering commitment
              </SplitHeading>
              <p className="mt-7 max-w-sm text-[0.9375rem] leading-relaxed text-white/70">
                Training, assessment, inspection and maintenance — four things
                held continuously, because compliance that only appears when
                scheduled is not compliance.
              </p>
              <Button href="/safety" variant="onImageOutline" className="mt-8" arrow>
                The full programme
              </Button>

              {/*
                The yard the standard is actually held in. A dark band with no
                photograph asks the reader to take four claims entirely on
                trust; one establishing frame under them is the difference
                between an assertion and a place.
              */}
              <ClipReveal
                from="left"
                ratio="4/3"
                className="mt-10 w-full rounded-plate"
              >
                <Media
                  asset={IMAGES.terminalAerial}
                  ratio="auto"
                  radius="none"
                  className="h-full w-full"
                  sizes="(max-width: 1024px) 100vw, 30vw"
                />
              </ClipReveal>
            </div>
          </div>

          <Reveal
            stagger
            className="border-t border-white/15 lg:col-span-7 lg:col-start-6"
          >
            {SAFETY_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="grid gap-x-10 gap-y-5 border-b border-white/15 py-8 md:grid-cols-12"
              >
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="tnum text-[0.6875rem] tracking-[0.16em] text-white/50">
                    {pillar.index}
                  </span>
                  <h3 className="text-[0.75rem] uppercase tracking-[0.16em] text-white">
                    {pillar.title}
                  </h3>
                </div>

                <div className="md:col-span-8">
                  <p className="max-w-[34ch] text-[1.0625rem] leading-snug tracking-tight text-white">
                    {pillar.statement}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {pillar.practices.map((practice) => (
                      <li
                        key={practice}
                        className="text-[0.6875rem] uppercase tracking-[0.14em] text-white/70"
                      >
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
