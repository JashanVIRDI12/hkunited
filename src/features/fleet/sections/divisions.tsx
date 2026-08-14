import { FLEET, DIVISIONS } from "@/content/fleet";
import { Panel, SectionLabel } from "@/components/ui/panel";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * The four divisions, as a contents page for the register below.
 *
 * The homepage names the divisions in a flat rail. Here they are also the
 * NAVIGATION for the register — each card lists the units that run under it
 * and every unit name is a jump link to its entry. On a page whose body is
 * six long entries, a reader who came for the tanker specification should
 * not have to scroll past four other units to find it.
 *
 * Counts are derived from the content model, never written down, so a
 * seventh unit appears here the moment it is added to `content/fleet.ts`.
 */
export function Divisions() {
  return (
    <section className="bg-paper-alt" aria-labelledby="divisions-heading">
      <div className="container-page band-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Divisions</SectionLabel>
            <SplitHeading id="divisions-heading" className="type-h2 mt-6 max-w-[16ch] text-ink">
              Four divisions, one dispatch desk
            </SplitHeading>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
            A job that needs three of them is still one phone call and one
            schedule.
          </p>
        </div>

        <Reveal
          stagger
          variant="cards"
          className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-4"
        >
          {DIVISIONS.map((division) => {
            const units = FLEET.filter((unit) => unit.category === division.id);

            return (
              <Panel key={division.id} tone="paper" className="flex flex-col p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="type-h3 text-ink">{division.name}</h3>
                  <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                    {String(units.length).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed text-ink-3">
                  {division.blurb}
                </p>

                <ul className="mt-7 flex flex-col gap-2 border-t border-line pt-5">
                  {units.map((unit) => (
                    <li key={unit.slug}>
                      <a
                        href={`#${unit.slug}`}
                        className="text-[0.9375rem] text-ink-2 transition-colors duration-500 hover:text-brand"
                      >
                        {unit.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Panel>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
