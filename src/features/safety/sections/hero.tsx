import { AFFILIATIONS } from "@/content/company";
import { SAFETY_PILLARS } from "@/content/safety";
import { IMAGES } from "@/content/imagery";
import { cn } from "@/lib/utils";
import { Media } from "@/components/ui/media";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * Safety hero.
 *
 * THE FOUR WORDS ARE THE PAGE, and they are now also its navigation. Nothing
 * else on this site is set as four one-word display lines; that sequence —
 * trained, assessed, inspected, maintained — is the entire claim stated
 * before a word of it is explained. What is new is that each word is a link
 * into the pillar that substantiates it, so the masthead stops being a
 * statement the reader has to scroll past and becomes the index of the
 * document underneath.
 *
 * That also fixes the thing this page is actually for. A general contractor
 * lands here to prequalify a carrier, usually looking for one specific
 * answer; the four words are the four answers, and they are now one click
 * each rather than a scroll and a search.
 *
 * THE PLATE IS THE ONLY FRAME ON THE SITE THAT SHOWS AN INSPECTION — a
 * gloved hand on a brake chamber during a pre-trip check. It appears small
 * on the homepage and on /about; this is the one place it is shown at the
 * size the subject deserves, on the one page whose subject it is. A wider
 * establishing shot of trucks would be illustrating "haulage" on a page
 * about scrutiny.
 *
 * THE HEADING CONTRACT. The `h1` is `sr-only` and carries the four words as
 * one sentence, because four separate display lines would otherwise be
 * announced as four unrelated links with no statement between them. The
 * links keep their own accessible names — `MaskLines` emits the line as real
 * text when it is not marked presentational — and each carries a
 * visually-hidden suffix naming the pillar it lands on.
 *
 * Server component apart from the motion wrappers.
 */

/**
 * The four words, and the pillar each one lands on.
 *
 * AUTHORED, NOT DERIVED. The obvious build takes the last word of each
 * pillar title — and gets "Training, Assessment, Inspection, Maintenance",
 * four nouns where the page's claim is four past participles. The difference
 * is the whole line: nouns name departments, participles say the work has
 * been done. So the words live here and `id` ties them to
 * `content/safety.ts`; change an id there and the link breaks loudly rather
 * than pointing at nothing.
 *
 * Indents are authored as full class strings — Tailwind compiles by scanning
 * source text and cannot see an interpolated one.
 */
const WORDS: readonly {
  id: string;
  word: string;
  indent?: string;
  /** Lateral shear in px. Alternate the sign down the stack. */
  drift: number;
}[] = [
  { id: "training", word: "Trained.", drift: 18 },
  { id: "assessment", word: "Assessed.", indent: "lg:pl-[8%]", drift: -26 },
  { id: "inspection", word: "Inspected.", indent: "lg:pl-[16%]", drift: 28 },
  { id: "maintenance", word: "Maintained.", indent: "lg:pl-[5%]", drift: -20 },
];

const FACTS = [
  { k: "Pillars", v: String(SAFETY_PILLARS.length) },
  { k: "Driver evaluation", v: "Semi-annual" },
  { k: "Site audits", v: "Unannounced" },
  { k: "Member of", v: AFFILIATIONS.map((a) => a.abbr).join(" · ") },
] as const;

export function SafetyHero() {
  return (
    <section
      className="container-page pt-[calc(var(--header-h)+0.75rem)]"
      aria-labelledby="safety-heading"
    >
      <div className="relative overflow-hidden rounded-plate bg-ink">
        <div className="absolute inset-0">
          <Media
            asset={IMAGES.safetyInspection}
            ratio="auto"
            radius="none"
            className="h-full w-full"
            sizes="100vw"
            scrim="bottom"
            priority
          />
        </div>

        {/* The top row sits on whatever the crop happens to put there; a
            short gradient makes it legible over any of it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-scrim/70 via-scrim/25 to-transparent"
        />

        <div className="relative z-10 flex min-h-[34rem] flex-col md:min-h-[calc(100svh-9rem)]">
          <div className="flex items-center justify-between gap-6 p-6 md:p-10">
            <p className="section-label text-white/70">/ Safety</p>
            <p className="tnum text-[0.6875rem] uppercase tracking-[0.16em] text-white/70">
              {SAFETY_PILLARS.length} pillars · Audited unannounced
            </p>
          </div>

          <div className="mt-auto px-6 pb-10 md:px-10 md:pb-14">
            <h1 id="safety-heading" className="sr-only">
              Trained, assessed, inspected, maintained.
            </h1>

            <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
              <div className="lg:col-span-7">
                {WORDS.map((line, i) => {
                  const pillar = SAFETY_PILLARS.find((p) => p.id === line.id);
                  return (
                    <Drift
                      key={line.id}
                      distance={line.drift}
                      triggerSelector="section"
                    >
                      <a
                        href={`#${line.id}`}
                        className={cn(
                          "group flex items-baseline gap-5 md:gap-7",
                          line.indent,
                        )}
                      >
                        <span className="tnum pb-2 text-[0.6875rem] tracking-[0.16em] text-white/60 transition-colors duration-500 group-hover:text-white md:pb-4">
                          {pillar?.index}
                        </span>
                        {/*
                          `type-h1`, not `type-display`. Four lines of the
                          display tier is 32rem of headline before the
                          standfirst has started, which fits no laptop — and a
                          four-word stack already reads as display type from
                          its rhythm rather than from its size.
                        */}
                        <MaskLines
                          as="span"
                          lines={[line.word]}
                          delay={0.15 + i * 0.07}
                          className="type-h1 block text-white transition-colors duration-500 group-hover:text-white/75"
                        />
                        <span className="sr-only">— {pillar?.title}</span>
                      </a>
                    </Drift>
                  );
                })}
              </div>

              <Reveal delay={0.5} className="lg:col-span-4 lg:col-start-9">
                <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/80">
                  Every driver is re-proven rather than assumed competent,
                  every project is assessed before the first load moves, and
                  every site is audited without warning. What follows is the
                  programme in full, not a summary of it.
                </p>
              </Reveal>
            </div>
          </div>

          <dl className="grid grid-cols-2 border-t border-white/15 md:grid-cols-4">
            {FACTS.map((fact, i) => (
              <div
                key={fact.k}
                className={cn(
                  "px-6 py-5 md:px-10 md:py-6",
                  // Hairlines between cells only; which cells start a row
                  // changes between the two-column and four-column layouts.
                  i % 2 === 1 && "border-l border-white/15",
                  i >= 2 && "border-t border-white/15 md:border-t-0",
                  i > 0 ? "md:border-l md:border-white/15" : "md:border-l-0",
                )}
              >
                <dt className="eyebrow text-white/55">{fact.k}</dt>
                <dd className="tnum mt-2 text-[0.9375rem] leading-snug text-white">
                  {fact.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
