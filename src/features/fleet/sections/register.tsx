import {
  FLEET,
  DIVISIONS,
  type FleetCategory,
  type FleetUnit,
} from "@/content/fleet";
import { FLEET_IMAGE } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel, SectionLabel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { ClipReveal } from "@/components/motion/clip-reveal";

/**
 * The register.
 *
 * ONE CARD PER UNIT, FULL WIDTH. The homepage runs the same six units as a
 * three-column card grid — small plate, name, one line of summary — which
 * is right for recognition and useless for specification. These are the
 * same six opened out: the long description, the spec table and the full
 * payload list, none of which fit on a homepage card.
 *
 * ORIENTATION IS CONSTANT. Plate left, dossier right, every entry. A
 * catalogue is scanned by jumping between entries, and alternating sides
 * would mean re-finding the specification column each time. The editorial
 * version of this page alternated precisely because it was read straight
 * through; a card stack is not.
 *
 * EACH CARD IS A LANDING TARGET. `id` plus `anchor-offset` makes
 * `/fleet#live-bottom` — linked from the homepage fleet grid, from the
 * divisions cards above, and from the project studies — arrive with the
 * entry's head clear of the fixed header.
 *
 * No scroll reveals anywhere on this page: a specification a visitor
 * deep-linked to must be on screen when they land, not waiting for a
 * trigger to fire.
 *
 * Server component throughout.
 */
const DIVISION_OF = Object.fromEntries(
  DIVISIONS.map((division) => [division.id, division.name]),
) as Record<FleetCategory, string>;

export function Register() {
  return (
    <section className="container-page band-y" aria-labelledby="register-heading">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>The register</SectionLabel>
          <SplitHeading id="register-heading" className="type-h2 mt-6 max-w-[16ch] text-ink">
            Every unit, with its numbers
          </SplitHeading>
        </div>
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
          Clearance, ground conditions and access decide the configuration as
          much as the material does — we confirm it against your site before
          dispatch.
        </p>
      </div>

      <Reveal
        stagger
        variant="cards"
        className="mt-10 flex flex-col gap-3 md:mt-14"
      >
        {FLEET.map((unit) => (
          <Entry key={unit.slug} unit={unit} />
        ))}
      </Reveal>
    </section>
  );
}

function Entry({ unit }: { unit: FleetUnit }) {
  const Icon = unit.icon;

  return (
    <Panel
      as="article"
      id={unit.slug}
      tone="paper"
      className="anchor-offset group overflow-hidden p-0"
    >
      <div className="grid lg:grid-cols-12">
        {/*
          `ratio="auto"` plus `h-full`: in a stretched grid row the column is
          already as tall as the dossier beside it, so letting the plate fill
          that height keeps the two sides flush. The `min-h` is what carries
          it on the narrow breakpoint, where the grid collapses and there is
          no sibling to inherit height from.
        */}
        <div className="relative min-h-[15rem] lg:col-span-5 lg:min-h-[22rem]">
          {/*
            The plate is absolutely filled inside a sized column so the clip
            frame has a height to wipe across. ClipReveal sizes to its own
            box, and a frame with no height wipes nothing at all.
          */}
          <ClipReveal from="left" className="absolute inset-0">
            <Media
              asset={FLEET_IMAGE[unit.slug]}
              ratio="auto"
              radius="none"
              className="h-full w-full"
              sizes="(max-width: 1024px) 100vw, 42vw"
              zoomOnHover
            />
          </ClipReveal>
        </div>

        <div className="p-7 md:p-10 lg:col-span-7">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-baseline gap-4">
              <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                {unit.index}
              </span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-brand">
                {DIVISION_OF[unit.category]}
              </span>
            </div>
            <Icon
              className="size-6 shrink-0 text-ink-4"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </div>

          <h3 className="type-h2 mt-5 text-ink">{unit.name}</h3>
          <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-snug tracking-tight text-ink-2">
            {unit.summary}
          </p>
          <p className="mt-6 max-w-[56ch] leading-[1.7] text-ink-3">
            {unit.description}
          </p>

          <div className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            <div>
              <h4 className="section-label mb-4">Specification</h4>
              <dl className="border-t border-line">
                {unit.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-6 border-b border-line py-2.5"
                  >
                    <dt className="text-[0.8125rem] text-ink-3">{spec.label}</dt>
                    <dd className="tnum text-right text-[0.9375rem] text-ink">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h4 className="section-label mb-4">Configured to carry</h4>
              <ul className="flex flex-wrap gap-2">
                {unit.payloads.map((payload) => (
                  <li
                    key={payload}
                    className="rounded-full bg-paper-sunk px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3"
                  >
                    {payload}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button href="/quote" variant="outline" size="sm" className="mt-9" arrow>
            Request this unit
          </Button>
        </div>
      </div>
    </Panel>
  );
}
