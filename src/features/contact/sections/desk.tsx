import { ArrowUpRight } from "lucide-react";
import { COMPANY } from "@/content/company";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";

/**
 * The desk and the terminal.
 *
 * This replaces the ranked list of four channels that used to sit here. The
 * hero now carries all four, live, above the fold — repeating them as a
 * ruled column immediately underneath would have been the same information
 * twice in one screen, which is how a contact page ends up feeling padded.
 *
 * What survives the move is the ARGUMENT the list was making: haulage starts
 * on the phone, so the number is the biggest thing on the page. Here it is
 * set at the display tier on ink, which is larger and louder than it was as
 * a row in a table — a phone number at `type-h1` on a dark card is
 * unmistakably the thing to do next.
 *
 * TWO CARDS, DELIBERATELY UNEQUAL. They are not two options: the desk is the
 * action and the terminal is the reassurance that there is a real yard and a
 * real address behind it. So the desk takes seven columns and the accent
 * surface, the terminal takes five and stays on paper, and nobody has to
 * decide between them.
 *
 * The address is a maps link and the number is a `tel:` link, because an
 * address that cannot be navigated to and a number that cannot be tapped are
 * the two most common ways a contact page fails on a phone — which is where
 * most of them are opened.
 *
 * Server component apart from the reveal.
 */
export function Desk() {
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
    `${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.region}`,
  )}`;

  return (
    <section className="section-y" aria-labelledby="desk-heading">
      <div className="container-edge">
        <div className="mb-14 grid gap-y-8 md:mb-20 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">Direct</p>
          <SplitHeading
            id="desk-heading"
            className="type-h1 optical-flush max-w-[13ch] text-ink lg:col-span-6"
          >
            Dispatch answers the phone.
          </SplitHeading>
          <p className="max-w-xs self-end text-[0.9375rem] leading-relaxed text-ink-3 lg:col-span-3">
            Around the clock for active jobs. Quotes and new enquiries are
            answered during business hours.
          </p>
        </div>

        <Reveal stagger className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-12 rounded-panel bg-ink-panel p-8 text-white md:p-12 lg:col-span-7">
            <div>
              <p className="eyebrow text-white/55">Dispatch</p>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="type-h1 tnum mt-6 block text-white transition-colors duration-500 hover:text-white/70"
              >
                {COMPANY.phone}
              </a>
              <p className="mt-8 max-w-[38ch] text-[0.9375rem] leading-relaxed text-white/70">
                One desk sequences every division, so the person who answers
                can tell you what is available this afternoon rather than
                taking a message for someone who can.
              </p>

              {/*
                THE TWO WINDOWS, SPLIT RATHER THAN AVERAGED. "Open 24/7" and
                "business hours" are both wrong on their own: the first
                oversells the quoting desk, the second reads as unreachable to
                a site that has a truck problem at 4am. Saying which is which
                is the honest version and it is what `COMPANY.hours` actually
                records — the office window is still unconfirmed, so nothing
                here states one. See the TODO in `content/company.ts`.
              */}
              <dl className="mt-10 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow text-white/55">Active jobs</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-snug text-white">
                    Around the clock
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-white/55">Quotes &amp; enquiries</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-snug text-white">
                    Business hours
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-white/15 pt-8">
              <p className="eyebrow mb-3 text-white/55">Email</p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="type-h3 break-all text-white transition-colors duration-500 hover:text-white/70"
              >
                {COMPANY.email}
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-panel border border-line bg-paper lg:col-span-5">
            {/*
              THE YARD FROM THE GROUND, because the hero now flies over it.
              This was the terminal aerial until the hero took the terminal
              clip; two aerials of the same yard on one page is the same
              photograph twice, and the card's job is not to establish the
              place — the hero has done that — but to put you at the gate of
              the address printed underneath it.

              The plate is clipped by the card, so it carries no radius of its
              own — concentric corners at two different radii read as a defect.
            */}
            <Media
              asset={IMAGES.fleetTerminal}
              ratio="4/3"
              radius="none"
              sizes="(min-width: 1024px) 34vw, 100vw"
            />

            <div className="p-8 md:p-10">
              <address className="not-italic">
                <p className="eyebrow mb-4">Terminal</p>
                <p className="text-[1.0625rem] leading-relaxed text-ink">
                  {COMPANY.address.street}
                  <br />
                  {COMPANY.address.city}, {COMPANY.address.region}{" "}
                  {COMPANY.address.postalCode}
                  <br />
                  {COMPANY.address.countryName}
                </p>
              </address>

              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] text-ink transition-colors duration-500 hover:text-brand"
              >
                Open in maps
                <ArrowUpRight
                  className="size-4 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <div className="mt-8 border-t border-line pt-6">
                <p className="eyebrow mb-3">Coverage</p>
                <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                  {COMPANY.serviceArea}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10">
          <TextLink href="/quote">Know what needs moving? Get a price</TextLink>
        </div>
      </div>
    </section>
  );
}
