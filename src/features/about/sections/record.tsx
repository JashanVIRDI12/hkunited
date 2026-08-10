import { COMPANY } from "@/content/company";
import { FLEET, DIVISIONS } from "@/content/fleet";
import { SERVICES } from "@/content/services";
import { INDUSTRIES } from "@/content/industries";
import { Panel, SectionLabel } from "@/components/ui/panel";

/**
 * The record.
 *
 * Every figure is either published on hkunited.ca or derived by counting
 * the content model. NOTHING about fleet size, project totals or client
 * counts appears — see `PENDING_VERIFICATION` in `content/company.ts`. When
 * the client confirms real numbers, they belong here as further cards.
 *
 * Six cards on a three-column grid, and the note under each is what makes
 * this a record rather than a stat row — the homepage's four-card panel
 * gives a number and a label, this gives a number and its evidence. The
 * distinction is why /about carries both a hero fact row and this.
 */
const RECORD = [
  {
    value: COMPANY.founded,
    label: "Founded",
    note: `Operating from ${COMPANY.address.street}, ${COMPANY.address.city}.`,
  },
  {
    value: COMPANY.yearsInOperation,
    suffix: "+",
    label: "Years in operation",
    note: "Through every construction cycle the region has run.",
  },
  {
    value: DIVISIONS.length,
    label: "Operating divisions",
    note: DIVISIONS.map((d) => d.name).join(" · "),
  },
  {
    value: FLEET.length,
    label: "Equipment configurations",
    note: "So the right unit shows up, not the one that happened to be free.",
  },
  {
    value: SERVICES.length,
    label: "Service lines",
    note: "From a single load to sustained haulage on a transit corridor.",
  },
  {
    value: INDUSTRIES.length,
    label: "Sectors served",
    note: INDUSTRIES.map((i) => i.name).join(" · "),
  },
];

export function Record() {
  return (
    <section className="bg-paper-alt" aria-labelledby="record-heading">
      <div className="container-page band-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>The record</SectionLabel>
            <h2 id="record-heading" className="type-h2 mt-6 max-w-[16ch] text-ink">
              What the years add up to
            </h2>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
            Only what we can substantiate. Fleet counts and project totals are
            held back until they can be published as fact.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {RECORD.map((row) => (
            <Panel key={row.label} tone="paper" className="flex flex-col p-7">
              {/*
                Rendered, not counted. `Counter` blanks the numeral to "0"
                on mount and counts up on a ScrollTrigger — so a trigger
                that never fires leaves six zeros where the company's record
                should be. Same reasoning as the homepage stat row: a figure
                that is sometimes wrong is worse than one that never moved.

                Plain interpolation also removes the need for the old
                `count: false` flag on the founding year: `Counter`
                formatted with locale separators, so 2009 ticked up to
                "2,009" unless opted out.
              */}
              <p className="type-h1 tnum leading-none text-ink">
                {row.value}
                {row.suffix ?? ""}
              </p>
              <h3 className="mt-7 text-[0.75rem] uppercase tracking-[0.16em] text-ink">
                {row.label}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[0.875rem] leading-relaxed text-ink-3">
                {row.note}
              </p>
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
}
