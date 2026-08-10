import { ArrowDown } from "lucide-react";
import { COMPANY } from "@/content/company";
import { CASE_STUDIES } from "@/content/projects";
import { VIDEOS } from "@/content/imagery";
import { cn } from "@/lib/utils";
import { VideoMedia } from "@/components/ui/video-media";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * Projects hero.
 *
 * MOVING FOOTAGE, WHERE /services HOLDS A STILL. Both pages now open on a
 * plate; they must not open on the SAME plate, or the two read as one
 * template with the words swapped. The distinction is argued from content
 * rather than from variety: /services sells ten capabilities and a still
 * frame lets the eye stay on the type, while this page's entire subject is
 * work in motion — a corridor advancing, a paving train that cannot stop —
 * and four trucks running an open highway says that before the headline
 * does.
 *
 * `VideoMedia` makes the clip free: the poster is the painted layer and the
 * LCP candidate, the video is only fetched near the viewport, and it is
 * skipped outright under reduced motion, on Save-Data and on 2g/3g. The clip
 * was already in `public/video/` and referenced by nothing.
 *
 * THE STRIP IS AN INDEX, NOT A RECORD. /services closes its hero on four
 * facts because a service page is asked "what do you do"; this page is asked
 * "have you done mine", so the three studies are named on the plate itself
 * and each one is a jump link into the deck below. It also sets the deck up:
 * a reader arrives at the stack already knowing it holds exactly three.
 *
 * THE HONESTY NOTE STAYS IN THE LEAD, and it stays above the fold. A reader
 * who came expecting named clients and tonnages should learn that they will
 * not find them here — and why — before they scroll, not in small type at the
 * foot of the page.
 *
 * Server component apart from the motion wrappers.
 */

/** Hand-broken. Where a display headline breaks is a design decision. */
const LINES: readonly {
  text: string;
  indent?: string;
  /** Lateral shear in px. Alternate the sign down the stack. */
  drift: number;
}[] = [
  { text: "Capability,", drift: 24 },
  { text: "in the field.", indent: "lg:pl-[12%]", drift: -30 },
];

export function ProjectsHero() {
  return (
    <section
      className="container-page pt-[calc(var(--header-h)+0.75rem)]"
      aria-labelledby="projects-heading"
    >
      <div className="relative overflow-hidden rounded-plate bg-ink">
        <div className="absolute inset-0">
          <VideoMedia
            poster={VIDEOS.highwayAerial.poster}
            src={VIDEOS.highwayAerial.src}
            ratio="auto"
            radius="none"
            className="h-full w-full"
            sizes="100vw"
            scrim="bottom"
            priority
          />
        </div>

        {/*
          A SECOND SCRIM, AT THE TOP, WHICH THE SERVICES HERO DOES NOT NEED.
          `Media`'s `bottom` scrim holds the headline; this clip opens on a
          golden-hour sky, so the eyebrow and the meta line at the top sit on
          the brightest part of the frame and were reading at roughly 1.5:1.
          A short gradient costs nothing over dark footage and rescues the
          top row over light footage, which is the difference between a hero
          that works with this clip and one that works with any clip.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-scrim/70 via-scrim/25 to-transparent"
        />

        {/* See `services/sections/hero.tsx` for why this is `svh` and why it
            carries no `max-h`. */}
        <div className="relative z-10 flex min-h-[34rem] flex-col md:min-h-[calc(100svh-9rem)]">
          <div className="flex items-center justify-between gap-6 p-6 md:p-10">
            <p className="section-label text-white/60">/ Projects</p>
            <p className="tnum text-[0.6875rem] uppercase tracking-[0.16em] text-white/70">
              Jobs of any size · Since {COMPANY.founded}
            </p>
          </div>

          <div className="mt-auto px-6 pb-10 md:px-10 md:pb-14">
            <h1 id="projects-heading" className="sr-only">
              Capability, in the field
            </h1>

            <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
              {/*
                Presentational — the readable headline is announced once,
                above. Without that the page announces it once per line.
              */}
              <div aria-hidden="true" className="lg:col-span-7">
                {LINES.map((line, i) => (
                  <Drift
                    key={line.text}
                    distance={line.drift}
                    triggerSelector="section"
                  >
                    <MaskLines
                      presentational
                      as="p"
                      lines={[line.text]}
                      delay={0.15 + i * 0.08}
                      className={`type-display text-white ${
                        line.indent ?? "optical-flush"
                      }`}
                    />
                  </Drift>
                ))}
              </div>

              <Reveal delay={0.5} className="lg:col-span-4 lg:col-start-9">
                <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/80">
                  Three classes of work we run continuously across the Greater
                  Toronto Area — a downtown dig, a transit corridor and a
                  paving train. Named clients, sites and contract values are
                  not published here, because they are not ours to publish.
                </p>
              </Reveal>
            </div>
          </div>

          <nav
            aria-label="Case studies"
            className="grid border-t border-white/15 md:grid-cols-3"
          >
            {CASE_STUDIES.map((study, i) => (
              <a
                key={study.slug}
                href={`#${study.slug}`}
                className={cn(
                  "group flex items-center gap-5 px-6 py-5 transition-colors duration-500 hover:bg-white/5 md:px-10 md:py-7",
                  // Hairlines between the cells only — one rule per axis per
                  // breakpoint, because which cells start a row changes when
                  // the strip goes from stacked to three across.
                  i > 0 && "border-t border-white/15 md:border-l md:border-t-0",
                )}
              >
                <span className="tnum text-[0.6875rem] tracking-[0.16em] text-white/45">
                  {study.index}
                </span>
                <span className="flex-1 text-[0.9375rem] leading-snug text-white/80 transition-colors duration-500 group-hover:text-white">
                  {study.title}
                </span>
                <ArrowDown
                  className="size-4 shrink-0 text-white/45 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
