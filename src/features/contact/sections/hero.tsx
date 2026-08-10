import { ArrowUpRight } from "lucide-react";
import { COMPANY } from "@/content/company";
import { VIDEOS } from "@/content/imagery";
import { cn } from "@/lib/utils";
import { VideoMedia } from "@/components/ui/video-media";
import { MaskLines } from "@/components/motion/mask-lines";
import { Drift } from "@/components/motion/drift";
import { Reveal } from "@/components/motion/reveal";

/**
 * Contact hero.
 *
 * THE NUMBER IS ABOVE THE FOLD AND IT IS TAPPABLE. Haulage starts on the
 * phone — a superintendent who needs three more trucks this afternoon is not
 * filling in a form — and most contact pages are opened on a phone, held in
 * one hand, on a site. Everything else on this page is downstream of getting
 * that number under a thumb without a scroll.
 *
 * So the hero does the job the old masthead deferred to the section below
 * it: the four channels are ON the plate, each one live. Dispatch dials,
 * email composes, the terminal opens in maps, and coverage is the one cell
 * that is a fact rather than an action. An address that is not a maps link
 * and a number that is not tappable are the two most common ways a contact
 * page fails on the device it is most often opened on.
 *
 * THE PLATE IS THE TERMINAL, FROM THE AIR, AT DAWN — the yard this page is
 * asking you to phone, before it gives you the address. It is the one clip
 * in `VIDEOS` that nothing else uses; the convoy belongs to the homepage and
 * the highway aerial to /projects, and a hero that reuses either would tell
 * a returning visitor they had landed somewhere they had already been.
 *
 * `Desk` below stays on the same yard but from the ground, in fog — the same
 * place at a different distance, which reads as one location rather than as
 * two stock frames. What it must NOT be is a second aerial: that is the same
 * shot twice, and the reason `Desk`'s plate moved when this one did.
 *
 * `VideoMedia` makes the clip free rather than expensive: the poster is the
 * painted layer and the LCP candidate, the video is only fetched near the
 * viewport, and it is skipped entirely under reduced motion, on Save-Data
 * and on 2g/3g. It also pauses itself while scrolled away.
 *
 * Server component apart from the motion wrappers.
 */

const LINES: readonly {
  text: string;
  indent?: string;
  /** Lateral shear in px. Alternate the sign down the stack. */
  drift: number;
}[] = [
  { text: "Talk to", drift: 22 },
  { text: "dispatch.", indent: "lg:pl-[13%]", drift: -28 },
];

export function ContactHero() {
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
    `${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.region}`,
  )}`;

  const CHANNELS = [
    {
      k: "Dispatch",
      v: COMPANY.phone,
      href: `tel:${COMPANY.phoneHref}`,
      external: false,
    },
    {
      k: "Email",
      v: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
      external: false,
    },
    {
      k: "Terminal",
      v: `${COMPANY.address.street}, ${COMPANY.address.city}`,
      href: mapsHref,
      external: true,
    },
    { k: "Coverage", v: COMPANY.serviceArea, href: undefined, external: false },
  ] as const;

  return (
    <section
      className="container-page pt-[calc(var(--header-h)+0.75rem)]"
      aria-labelledby="contact-heading"
    >
      <div className="relative overflow-hidden rounded-plate bg-ink">
        <div className="absolute inset-0">
          <VideoMedia
            poster={VIDEOS.terminalFleet.poster}
            src={VIDEOS.terminalFleet.src}
            ratio="auto"
            radius="none"
            className="h-full w-full"
            sizes="100vw"
            scrim="bottom"
            priority
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-scrim/70 via-scrim/25 to-transparent"
        />

        <div className="relative z-10 flex min-h-[34rem] flex-col md:min-h-[calc(100svh-9rem)]">
          <div className="flex items-center justify-between gap-6 p-6 md:p-10">
            <p className="section-label text-white/70">/ Contact</p>
            <p className="tnum text-[0.6875rem] uppercase tracking-[0.16em] text-white/70">
              One terminal · Ontario-wide
            </p>
          </div>

          <div className="mt-auto px-6 pb-10 md:px-10 md:pb-14">
            <h1 id="contact-heading" className="sr-only">
              Talk to dispatch
            </h1>

            <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
              {/* Presentational — the readable heading is announced once,
                  above, or the page announces it once per line. */}
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
                  {COMPANY.address.street} in {COMPANY.address.city}, serving
                  the Greater Toronto Area and across Ontario — with the fleet
                  depth to absorb a schedule surge without subcontracting away
                  control of your project.
                </p>
              </Reveal>
            </div>
          </div>

          {/*
            The channels, ranked left to right by how a job actually begins.
            `dl` rather than a list of links: three of the four are actions,
            but all four are label-and-value pairs, and the pairing is what
            makes the strip scannable at a glance on a phone.
          */}
          <dl className="grid grid-cols-1 border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((channel, i) => {
              const value = channel.href ? (
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group inline-flex items-baseline gap-2 text-white transition-colors duration-500 hover:text-white/70"
                >
                  {channel.v}
                  {channel.external && (
                    <ArrowUpRight
                      className="size-3.5 shrink-0 self-center transition-transform duration-500 ease-[var(--ease-brand)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  )}
                </a>
              ) : (
                <span className="text-white">{channel.v}</span>
              );

              return (
                <div
                  key={channel.k}
                  className={cn(
                    "px-6 py-5 md:px-10 md:py-6",
                    // Hairlines between cells only. The strip is one, two
                    // and four columns across the three breakpoints, so each
                    // one needs its own rule about which cells start a row.
                    i > 0 && "border-t border-white/15",
                    i % 2 === 1 && "sm:border-l sm:border-white/15",
                    i >= 2 && "sm:border-t sm:border-white/15",
                    i > 0
                      ? "lg:border-l lg:border-white/15 lg:border-t-0"
                      : "lg:border-l-0",
                    i === 1 && "sm:border-t-0",
                  )}
                >
                  <dt className="eyebrow text-white/55">{channel.k}</dt>
                  {/*
                    `tnum` so the phone number's digits sit on a fixed pitch —
                    a number set in proportional figures reads as a word.
                  */}
                  <dd className="tnum mt-2 text-[0.9375rem] leading-snug">
                    {value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
