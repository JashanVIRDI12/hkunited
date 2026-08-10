import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * The unannounced audit.
 *
 * THE PAGE'S ONE DARK BAND. The hero above it is a dark PLATE — a
 * photograph in a rounded card, inset from the page — which is a different
 * object; this is ink running the full width, and it is the only place on
 * /safety the page itself goes dark. It is spent here because this is the
 * single claim on the site that a competitor cannot copy without changing
 * how they operate. Interrupting the page for it is the point — spend the
 * device twice and it stops being an interruption.
 *
 * The list is an ITEMISATION, not a restatement. Pillar 03 above says our
 * safety team conducts unannounced site visits; this says what they open
 * when they arrive. Every item is drawn from the published programme —
 * documentation, safety equipment, licences, log books, daily trip
 * inspections and personal protective equipment — and nothing has been
 * added to round the list out to a nicer number.
 *
 * Type on `bg-ink` is white or `white/60`, matching the homepage Stats band
 * and /about Standards; both clear AA on this surface.
 */
const CHECKED = [
  {
    index: "01",
    item: "Documentation",
    note: "Load paperwork, receiving-site records and the chain that proves where material went.",
  },
  {
    index: "02",
    item: "Safety equipment",
    note: "Present, in date, and in working order on the unit rather than in the yard.",
  },
  {
    index: "03",
    item: "Licences",
    note: "Current and correct for the class of vehicle actually being operated.",
  },
  {
    index: "04",
    item: "Log books",
    note: "Hours recorded and consistent with the day's dispatch, not reconstructed after it.",
  },
  {
    index: "05",
    item: "Daily trip inspections",
    note: "Completed before the shift, with defects reported rather than carried.",
  },
  {
    index: "06",
    item: "Personal protective equipment",
    note: "Worn on site, to the standard the site requires.",
  },
];

export function Audit() {
  return (
    <section className="section-y overflow-hidden bg-ink" aria-labelledby="audit-heading">
      <div className="container-edge">
        <p className="mb-12 tnum text-[0.75rem] uppercase tracking-[0.16em] text-white/50 md:mb-16">
          The audit
        </p>

        <h2 id="audit-heading" className="sr-only">
          What an unannounced inspection opens.
        </h2>

        <div aria-hidden="true">
          <Drift distance={-34} triggerSelector="section">
            <MaskLines
              presentational
              onScroll
              as="p"
              lines={["No notice."]}
              className="type-display optical-flush text-white"
            />
          </Drift>
          <Drift distance={28} triggerSelector="section">
            <MaskLines
              presentational
              onScroll
              as="p"
              lines={["No warning."]}
              delay={0.09}
              className="type-display text-white lg:pl-[16%]"
            />
          </Drift>
        </div>

        <Reveal className="ml-auto mt-16 max-w-lg md:mt-24">
          <p className="text-[1.0625rem] leading-[1.75] text-white/70">
            Our safety team turns up at active sites unannounced, because an
            inspection that appears in the calendar measures preparation
            rather than practice. This is what they open when they arrive.
          </p>
        </Reveal>

        <Reveal
          stagger
          className="mt-20 grid gap-x-12 gap-y-10 border-t border-white/15 pt-14 md:grid-cols-2 lg:grid-cols-3"
        >
          {CHECKED.map((entry) => (
            <div key={entry.index} className="border-t border-white/15 pt-6">
              <div className="flex items-baseline gap-4">
                <span className="tnum text-[0.6875rem] tracking-[0.16em] text-white/50">
                  {entry.index}
                </span>
                <h3 className="text-[1.0625rem] font-medium tracking-tight text-white">
                  {entry.item}
                </h3>
              </div>
              <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/70">
                {entry.note}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
