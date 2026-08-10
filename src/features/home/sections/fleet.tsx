import Link from "next/link";
import { FLEET, DIVISIONS, type FleetCategory } from "@/content/fleet";
import { FLEET_IMAGE } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel, SectionLabel } from "@/components/ui/panel";
import { TextLink } from "@/components/ui/button";

/**
 * The fleet.
 *
 * Six cards, one per configuration, each a link into its entry in the
 * register on /fleet. The homepage's job here is recognition — a site
 * superintendent should spot the unit they need in the photograph and click
 * it — so the plate leads and the specification is reduced to the division
 * badge and the payload it is configured for.
 *
 * THE FULL SPREAD LIVES ON /fleet. This deliberately does not carry the
 * long description or the spec table: that page is the catalogue, and
 * duplicating it here would mean the homepage ends with six long reads.
 *
 * Server component — the hover zoom is CSS on the card's `group`.
 */
const DIVISION_OF = Object.fromEntries(
  DIVISIONS.map((division) => [division.id, division.name]),
) as Record<FleetCategory, string>;

export function Fleet() {
  return (
    <section className="container-page band-y" aria-labelledby="fleet-heading">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Fleet</SectionLabel>
          <h2 id="fleet-heading" className="type-h2 mt-6 max-w-[16ch] text-ink">
            Six configurations, one operator
          </h2>
        </div>
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
          Bulk, tank, waste and flatbed under a single roof — so the right
          unit shows up, not the one that happened to be free.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {FLEET.map((unit) => (
          <Panel key={unit.slug} tone="paper" className="group overflow-hidden p-0">
            <Link href={`/fleet#${unit.slug}`} className="block">
              <Media
                asset={FLEET_IMAGE[unit.slug]}
                ratio="4/3"
                radius="none"
                className="w-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                zoomOnHover
              />

              <div className="p-7">
                <div className="flex items-baseline gap-4">
                  <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                    {unit.index}
                  </span>
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-brand">
                    {DIVISION_OF[unit.category]}
                  </span>
                </div>

                <h3 className="type-h3 mt-4 text-ink transition-colors duration-500 group-hover:text-brand">
                  {unit.name}
                </h3>
                <p className="mt-3 max-w-[32ch] text-[0.9375rem] leading-relaxed text-ink-3">
                  {unit.summary}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {unit.payloads.slice(0, 3).map((payload) => (
                    <li
                      key={payload}
                      className="rounded-full bg-paper-sunk px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3"
                    >
                      {payload}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </Panel>
        ))}
      </div>

      <div className="mt-10">
        <TextLink href="/fleet">Full fleet specifications</TextLink>
      </div>
    </section>
  );
}
