import { MapPin, Phone, Mail, Globe2 } from "lucide-react";
import { AFFILIATIONS, COMPANY } from "@/content/company";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel, IconBadge, SectionLabel } from "@/components/ui/panel";
import { TextLink } from "@/components/ui/button";

/**
 * Credentials.
 *
 * MEMBERSHIPS, NOT A LOGO WALL. HK United's verifiable third-party standing
 * is its association membership — we have no right to display client marks
 * we cannot confirm, and a wall of borrowed logos is the oldest way to make
 * an About page look substantiated without substantiating anything.
 *
 * The abbreviations run at display scale because they ARE the credential:
 * "ODTA" is the thing worth being large, and the full name is the footnote
 * to it. That was true of the editorial version of this section and it
 * survives the move into cards unchanged — it is the one piece of type on
 * /about still set well above its neighbours.
 *
 * The terminal row repeats the footer's facts on purpose. Someone who has
 * read this far has been evaluating the company for several screens; making
 * them scroll past a closing CTA to find a phone number is the wrong place
 * to be economical.
 */
export function Credentials() {
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
    `${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.region}`,
  )}`;

  return (
    <section className="container-page band-y" aria-labelledby="credentials-heading">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Credentials</SectionLabel>
          <h2 id="credentials-heading" className="type-h2 mt-6 max-w-[14ch] text-ink">
            Accountable to more than ourselves
          </h2>
        </div>
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
          Membership means an outside body has standards we agreed to be held
          to. It is the only credential on this page we did not award
          ourselves.
        </p>
      </div>

      <div className="mt-10 grid gap-3 md:mt-14 lg:grid-cols-12">
        {AFFILIATIONS.map((affiliation) => (
          <Panel key={affiliation.abbr} tone="paper" className="p-7 lg:col-span-4">
            <p className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-[-0.016em] text-brand">
              {affiliation.abbr}
            </p>
            <h3 className="mt-7 max-w-[20ch] text-[1.0625rem] leading-snug tracking-tight text-ink">
              {affiliation.name}
            </h3>
            <p className="section-label mt-3">{affiliation.note}</p>
          </Panel>
        ))}

        <Panel tone="paper" className="overflow-hidden p-0 lg:col-span-4">
          <Media
            asset={IMAGES.safetyInspection}
            ratio="4/3"
            radius="none"
            className="w-full"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <p className="section-label p-7">Daily trip inspection</p>
        </Panel>
      </div>

      <div className="mt-3">
        <Panel tone="sunk" className="p-7 md:p-10">
          <p className="max-w-2xl text-[1.0625rem] leading-[1.6] text-ink-2">
            We are a trusted carrier in the Greater Toronto Area for
            contaminated soil, moved with tracked documentation to approved
            receiving sites and backed by a strong environmental record.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
            <TextLink href="/safety">Safety programme</TextLink>
            <TextLink href="/fleet">What we run</TextLink>
            <TextLink href="/projects">The work</TextLink>
          </div>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: MapPin,
            k: "Terminal",
            v: COMPANY.address.street,
            sub: `${COMPANY.address.city}, ${COMPANY.address.region}`,
            href: mapsHref,
          },
          {
            icon: Phone,
            k: "Dispatch",
            v: COMPANY.phone,
            sub: "Around the clock",
            href: `tel:${COMPANY.phoneHref}`,
          },
          {
            icon: Mail,
            k: "Email",
            v: COMPANY.email,
            sub: "Quotes & enquiries",
            href: `mailto:${COMPANY.email}`,
          },
          {
            icon: Globe2,
            k: "Coverage",
            v: COMPANY.address.regionName,
            sub: COMPANY.serviceArea,
          },
        ].map((cell) => {
          const body = (
            <>
              <IconBadge icon={cell.icon} />
              <p className="section-label mt-6">{cell.k}</p>
              <p className="mt-2 break-words text-[1.0625rem] leading-snug tracking-tight text-ink transition-colors duration-500 group-hover:text-brand">
                {cell.v}
              </p>
              <p className="mt-2 text-[0.8125rem] text-ink-3">{cell.sub}</p>
            </>
          );

          return (
            <Panel key={cell.k} tone="paper" className="p-0">
              {cell.href ? (
                <a
                  href={cell.href}
                  className="group block rounded-plate p-7 transition-colors duration-500 hover:bg-paper-alt"
                  {...(cell.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {body}
                </a>
              ) : (
                <div className="p-7">{body}</div>
              )}
            </Panel>
          );
        })}
      </div>
    </section>
  );
}
