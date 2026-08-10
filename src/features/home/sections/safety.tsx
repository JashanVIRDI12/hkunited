import { SAFETY_PILLARS } from "@/content/safety";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

/**
 * Safety.
 *
 * THE ONE DARK BLOCK ON THE HOMEPAGE, and the only one that runs the full
 * width of the page rather than sitting inside the card stack. Safety is HK
 * United's strongest verified differentiator — every claim here is quoted
 * from their own published programme rather than written as marketing — so
 * it gets the page's one interruption.
 *
 * `bg-ink` rather than `ink-panel`: this is a full-bleed BAND, not a card,
 * and near-black is the point when the surface reaches both edges. The
 * softer panel tone exists for cards sitting between two light ones.
 *
 * FOUR PILLARS, HEADLINES ONLY. The detail paragraph and the practice
 * checklist live on /safety, which publishes the programme unabridged so it
 * can be prequalified against. A homepage that reproduced all four in full
 * would bury the six sections after it.
 */
export function Safety() {
  return (
    <section className="bg-ink" aria-labelledby="safety-heading">
      <div className="container-page band-y">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="section-label text-white/50">/ Safety</p>
            <h2 id="safety-heading" className="type-h2 mt-6 max-w-[15ch] text-white">
              Compliance that only appears when scheduled is not compliance
            </h2>
            <p className="mt-7 max-w-md text-[0.9375rem] leading-relaxed text-white/70">
              An unwavering commitment to health and safety standards — held
              through training, assessment, unannounced inspection and
              maintenance.
            </p>

            <Media
              asset={IMAGES.safetyInspection}
              ratio="16/10"
              radius="plate"
              className="mt-10 w-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />

            <Button href="/safety" variant="onImageOutline" className="mt-8" arrow>
              The full programme
            </Button>
          </div>

          <div className="grid gap-3 self-start sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {SAFETY_PILLARS.map((pillar) => (
              <Panel
                key={pillar.id}
                tone="dark"
                className="flex flex-col justify-between gap-10 p-7"
              >
                <div className="flex items-baseline gap-4">
                  <span className="tnum text-[0.6875rem] tracking-[0.16em] text-white/50">
                    {pillar.index}
                  </span>
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/70">
                    {pillar.title}
                  </span>
                </div>
                <h3 className="type-h3 max-w-[18ch] text-white">
                  {pillar.statement}
                </h3>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
