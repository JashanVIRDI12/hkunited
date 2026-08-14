import { SAFETY_PILLARS, type SafetyPillar } from "@/content/safety";
import { Reveal } from "@/components/motion/reveal";
import { Checklist } from "@/components/motion/checklist";
import { SplitHeading } from "@/components/motion/split-heading";

/**
 * The programme, in full.
 *
 * The homepage shows these four as a card stack that assembles on scroll;
 * /about shows them as a two-column index on a dark surface. Both are
 * SUMMARIES — they carry the statement and the practices, and neither has
 * room for the detail paragraph that explains what the practice actually is.
 * This is the unabridged version, and its job is to be quotable: a general
 * contractor prequalifying a carrier should be able to send a colleague a
 * link that lands on the exact pillar they were asked about. Hence the
 * anchor per pillar, and hence the four words in the hero being links.
 *
 * A 2×2 GRID, WHERE THIS PAGE USED A COLUMN OF RULED ENTRIES. The column was
 * a long read with a sticky heading, which is the right shape for prose you
 * work through in order. Nobody works through a prequalification document in
 * order — they arrive knowing which of the four they were asked about. Four
 * cards put all four on one screen, so the one you came for is a glance
 * rather than a scroll, and the other three are visible enough to be read
 * afterwards.
 *
 * CARDS, BUT NOT THE OTHER PAGES' CARDS. /services tilts under the pointer
 * and /projects stacks under the scroll; both are ways of making a card feel
 * like an object. These are flat, ruled and evenly weighted on purpose —
 * this is the page a safety officer prints. What moves here is the one thing
 * that should: the ticks draw themselves as each card is reached, because
 * the claim underneath them is that these are verified rather than asserted.
 * See `components/motion/checklist.tsx`.
 *
 * The numeral is a watermark rather than a label. The index that carries
 * meaning is the one beside the pillar's name; this one is scale, and it is
 * `aria-hidden` and set in `line-strong` to say so.
 */
export function Programme() {
  return (
    <section className="section-y bg-paper-alt" aria-labelledby="programme-heading">
      <div className="container-edge">
        <div className="mb-16 grid gap-y-8 md:mb-20 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">The programme</p>
          <SplitHeading
            id="programme-heading"
            className="type-h1 optical-flush max-w-[15ch] text-ink lg:col-span-6"
          >
            Four pillars, held continuously.
          </SplitHeading>
          <p className="max-w-xs self-end text-[0.9375rem] leading-relaxed text-ink-3 lg:col-span-3">
            Training that surpasses the industry standard, assessment before
            mobilisation, audit without warning, and maintenance that never
            waits for a failure.
          </p>
        </div>

        <Reveal stagger className="grid gap-5 lg:grid-cols-2">
          {SAFETY_PILLARS.map((pillar) => (
            <Pillar key={pillar.id} pillar={pillar} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Pillar({ pillar }: { pillar: SafetyPillar }) {
  return (
    <article
      id={pillar.id}
      className="anchor-offset relative flex flex-col overflow-hidden rounded-panel border border-line bg-paper p-8 md:p-10"
    >
      {/*
        The watermark is positioned rather than in flow, so it cannot push
        the card's content around as the numeral's width changes, and it is
        clipped by the card's own radius.
      */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-6 font-display text-[clamp(4rem,7vw,6.5rem)] leading-none text-line-strong/60"
      >
        {pillar.index}
      </p>

      <div className="relative flex items-baseline gap-5">
        <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
          {pillar.index}
        </span>
        <span className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-brand">
          {pillar.title}
        </span>
      </div>

      <h3 className="type-h3 relative mt-6 max-w-[18ch] text-ink">
        {pillar.statement}
      </h3>

      <p className="relative mt-5 max-w-[48ch] text-[0.9375rem] leading-[1.75] text-ink-2">
        {pillar.detail}
      </p>

      {/*
        `mt-auto` so the checklists on a row of cards line up with each other
        rather than each floating under a paragraph of its own length — the
        one thing that would make four flat cards read as four accidents.
      */}
      <div className="relative mt-auto pt-9">
        <h4 className="eyebrow mb-5">In practice</h4>
        <Checklist items={pillar.practices} />
      </div>
    </article>
  );
}
