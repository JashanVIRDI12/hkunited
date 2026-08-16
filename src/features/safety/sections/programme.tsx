import { SAFETY_PILLARS, type SafetyPillar } from "@/content/safety";
import { Reveal } from "@/components/motion/reveal";
import { Checklist } from "@/components/motion/checklist";
import { SplitHeading } from "@/components/motion/split-heading";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { ClipReveal } from "@/components/motion/clip-reveal";

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

        {/*
          THE SITE THE PROGRAMME IS FOR. A shored excavation with a unit
          working in it — which is the condition every one of the four pillars
          below is written against: the assessment happens before this, the
          meeting happens on its first morning, the inspection happens on its
          access road.

          It runs full width and carries parallax because it is an ESTABLISHING
          shot rather than an illustration of any one pillar. Putting a
          photograph on each of the four instead would make them read as four
          products; one frame over all of them reads as the place they apply.
        */}
        <ClipReveal
          from="left"
          parallax={8}
          ratio="21/9"
          className="mb-16 w-full rounded-plate md:mb-20"
        >
          <Media
            asset={IMAGES.industryConstruction}
            ratio="auto"
            radius="none"
            className="h-full w-full"
            sizes="100vw"
          />
        </ClipReveal>

        <Reveal stagger className="grid gap-5 lg:grid-cols-2">
          {SAFETY_PILLARS.map((pillar) => (
            <Pillar key={pillar.id} pillar={pillar} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/**
 * One pillar, as a RECORD rather than a tile.
 *
 * THE NUMERAL APPEARS ONCE NOW, and that is the change that mattered. The
 * previous card carried the index twice — a display-scale watermark in the
 * top corner and a small tabular one on the label row beneath it — so every
 * card read "02 02" before it said anything. Two sizes of the same number is
 * not hierarchy, it is a duplicate with a font change, and on a page a safety
 * officer is meant to scan for a specific pillar it actively slows the scan.
 *
 * The surviving numeral is the big one, and it is no longer a watermark: it
 * sits IN the header row, in brand, doing the job the small one was doing. It
 * is the only place the accent appears on this card, which is what lets a
 * number carry as much weight as it does here.
 *
 * THREE ZONES, AND THE DIVISION IS THE ARGUMENT. A header that identifies the
 * pillar, a body that makes the claim, and a bordered block that lists the
 * evidence for it. The old card ran all three together on one flat surface
 * with only whitespace between them, which is exactly the shape that makes a
 * safety programme read as marketing: claim and proof looked identical.
 * Putting the practices on their own sunk surface, behind their own label, is
 * the card saying these are a different KIND of statement — the receipts.
 *
 * IT STAYS PRINTABLE, which is this page's whole design constraint. No
 * photograph, no tilt, no shadow that only exists on screen: a hairline, a
 * fill and two type sizes. The one thing that moves is the ticks drawing
 * themselves as the card is reached, because the claim underneath them is
 * that these are verified rather than asserted.
 */
function Pillar({ pillar }: { pillar: SafetyPillar }) {
  return (
    <article
      id={pillar.id}
      className="anchor-offset group flex flex-col overflow-hidden rounded-panel border border-line bg-paper"
    >
      {/* ---- Header: who this pillar is -------------------------------- */}
      <div className="flex items-center gap-5 border-b border-line px-8 py-6 md:px-10">
        <span
          className="tnum font-display text-[clamp(2.25rem,3.4vw,3rem)] leading-none text-brand"
          aria-hidden="true"
        >
          {pillar.index}
        </span>

        {/*
          The rule is drawn between the numeral and the label rather than
          under both. It is what makes the row read as a field on a form — an
          identifier, a separator, a value — instead of as a heading with a
          number stuck in front of it.
        */}
        <span className="h-px flex-1 bg-line" aria-hidden="true" />

        <h3 className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink">
          {pillar.title}
        </h3>
      </div>

      {/* ---- Body: the claim ------------------------------------------- */}
      <div className="flex flex-1 flex-col px-8 pb-8 pt-9 md:px-10 md:pb-10">
        <p className="type-h3 max-w-[20ch] text-ink">{pillar.statement}</p>

        <p className="mt-5 max-w-[48ch] text-[0.9375rem] leading-[1.75] text-ink-2">
          {pillar.detail}
        </p>

        {/*
          `mt-auto` so the evidence blocks on a row of cards line up with each
          other rather than each floating under a paragraph of its own length
          — the one thing that would make four flat cards read as four
          accidents.
        */}
        <div className="mt-auto pt-9">
          <div className="rounded-soft bg-paper-sunk p-6">
            {/*
              Still an `h4`, nesting under the pillar's own `h3`. The label
              looks like an eyebrow but it heads a distinct block of content,
              and a safety officer navigating this page by headings should be
              able to reach the practices directly.
            */}
            <h4 className="eyebrow mb-5">In practice</h4>
            {/*
              One column. These cards run two-up, so the list is already at
              half the page's width — the component's default two columns
              would put two or three words on each line.
            */}
            <Checklist items={pillar.practices} className="sm:grid-cols-1" />
          </div>
        </div>
      </div>
    </article>
  );
}
