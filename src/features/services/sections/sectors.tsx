import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INDUSTRIES } from "@/content/industries";
import { INDUSTRY_IMAGE } from "@/content/imagery";
import { Reveal } from "@/components/motion/reveal";
import { HoverPreview } from "@/components/motion/hover-preview";

/**
 * Sectors.
 *
 * The homepage runs the same five sectors as a photographic gallery. This is
 * the INDEX of that gallery, and the difference in job is the difference in
 * form: on the homepage the sectors persuade, here they route. Every row is
 * a link into the work rather than a picture of it.
 *
 * WHY THE PLATES CAME BACK, AFTER THE PAGE SPENT TEN ENTRIES REFUSING THEM.
 * They never enter the layout. `HoverPreview` carries one on the cursor, for
 * the row being considered, and it is gone the moment attention moves —
 * which is a different claim from printing five photographs down a page. The
 * refusal upstream was about the page not becoming a brochure; a plate that
 * occupies no space and appears only on intent does not make it one. It does
 * make the last block on the page the one that moves, which is where a
 * reader who has come this far deserves to be rewarded.
 *
 * THE ROWS ARE SET AT DISPLAY SCALE, not list scale. Five names at `type-h2`
 * is the largest type on the page after the masthead, and it should be:
 * these are the five answers to "do you work with people like me", and it is
 * the last question a visitor asks before the quote form.
 *
 * The statement line is the sector's own editorial claim from
 * `content/industries.ts` — nothing is rewritten for this surface.
 *
 * Server component; `HoverPreview` is the island, and it holds no content.
 */
export function Sectors() {
  return (
    <section className="section-y bg-paper-alt" aria-labelledby="sectors-heading">
      <div className="container-edge">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-8">Sectors</p>
            <h2 id="sectors-heading" className="type-h1 max-w-[12ch] text-ink">
              Who we run for.
            </h2>
          </div>
          <p className="max-w-sm text-ink-2 md:pb-2">
            Five sectors, each with its own documentation standard and its own
            idea of what &ldquo;on schedule&rdquo; means.
          </p>
        </div>

        <HoverPreview plates={INDUSTRY_IMAGE}>
          <Reveal stagger className="border-t border-line-strong">
            {INDUSTRIES.map((industry) => (
              <Link
                key={industry.slug}
                href="/projects"
                data-preview={industry.slug}
                className="group grid items-baseline gap-x-10 gap-y-5 border-b border-line py-9 md:py-11 lg:grid-cols-12"
              >
                <div className="flex items-baseline gap-6 lg:col-span-5">
                  <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                    {industry.index}
                  </span>
                  {/*
                    The name shifts right on hover. It is 4px on a transform,
                    which costs nothing and does the one thing colour cannot:
                    it tells you the row is a door rather than a heading.
                  */}
                  <h3 className="type-h2 text-ink transition-[color,transform] duration-700 ease-[var(--ease-brand)] group-hover:translate-x-1 group-hover:text-brand">
                    {industry.name}
                  </h3>
                </div>

                <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-2 lg:col-span-5">
                  {industry.statement}
                </p>

                <span className="flex items-center gap-2 text-[0.8125rem] text-ink-4 transition-colors duration-500 group-hover:text-brand lg:col-span-2 lg:justify-end">
                  See the work
                  <ArrowUpRight
                    className="size-4 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </Reveal>
        </HoverPreview>
      </div>
    </section>
  );
}
