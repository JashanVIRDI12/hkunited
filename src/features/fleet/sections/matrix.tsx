import { FLEET } from "@/content/fleet";
import { Panel, SectionLabel } from "@/components/ui/panel";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * Payload matrix.
 *
 * The one thing a specification page can do that a marketing page cannot:
 * answer "which unit carries my material" at a glance, instead of making
 * the reader hold six payload lists in their head.
 *
 * IT IS A REAL TABLE, not a grid of divs. A matrix is exactly what tables
 * are for — the header cells are what let a screen reader announce "Live
 * Bottom Trailers, Hot mix asphalt, carried" when the user lands on a mark.
 * Built from divs, the same layout announces a wall of bullet characters.
 *
 * BOTH AXES ARE DERIVED FROM `content/fleet.ts`. Nothing here is a second,
 * hand-maintained list that can quietly disagree with the register above:
 * add a payload to a unit and the row appears, add a unit and the column
 * does. Sparseness is honest — where two units carry the same material
 * under different names, that is what the content model says today, and the
 * fix belongs in the content rather than in a lookup hidden in this file.
 *
 * The table scrolls inside the card so the page body never scrolls
 * sideways on a phone.
 */
const MATERIALS = [...new Set(FLEET.flatMap((unit) => unit.payloads))].sort(
  (a, b) => a.localeCompare(b),
);

export function Matrix() {
  return (
    <section className="bg-paper-alt" aria-labelledby="matrix-heading">
      <div className="container-page band-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>What carries what</SectionLabel>
            <SplitHeading id="matrix-heading" className="type-h2 mt-6 max-w-[16ch] text-ink">
              Match the material to the unit
            </SplitHeading>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
            If your material is not listed it almost certainly still travels
            with us — call dispatch and we will tell you in which unit.
          </p>
        </div>

        <Reveal variant="cards" className="mt-10 md:mt-14">
          <Panel tone="paper" className="overflow-hidden p-0">
          <div className="hide-scrollbar overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-left">
              <caption className="sr-only">
                Materials carried, by fleet unit
              </caption>

              <thead>
                <tr className="border-b border-line-strong">
                  <th
                    scope="col"
                    className="w-[16rem] py-5 pl-7 pr-6 align-bottom text-[0.6875rem] uppercase tracking-[0.16em] text-ink-4"
                  >
                    Material
                  </th>
                  {FLEET.map((unit) => (
                    <th
                      key={unit.slug}
                      scope="col"
                      className="px-3 py-5 align-bottom text-[0.6875rem] font-medium uppercase leading-tight tracking-[0.12em] text-ink"
                    >
                      {unit.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {MATERIALS.map((material) => (
                  <tr key={material} className="border-b border-line last:border-b-0">
                    <th
                      scope="row"
                      className="py-3.5 pl-7 pr-6 text-[0.9375rem] font-normal text-ink"
                    >
                      {material}
                    </th>
                    {FLEET.map((unit) => {
                      const carried = unit.payloads.includes(material);
                      return (
                        <td key={unit.slug} className="px-3 py-3.5">
                          {/*
                            The mark is decorative; the word beside it is
                            what assistive tech announces, so the cell is
                            never silent and never reads as "bullet".
                          */}
                          <span className="sr-only">
                            {carried ? "Carried" : "Not carried"}
                          </span>
                          <span
                            aria-hidden="true"
                            className={
                              carried
                                ? "block size-2 rounded-full bg-brand"
                                : "block h-px w-3 bg-line-strong"
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </Panel>
        </Reveal>

        <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-3">
          We are a trusted carrier in the Greater Toronto Area for contaminated
          soil, moved with tracked documentation to approved receiving sites.
        </p>
      </div>
    </section>
  );
}
