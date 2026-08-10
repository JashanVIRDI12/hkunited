import { MapPin, Calculator } from "lucide-react";
import { COMPANY } from "@/content/company";
import { FLEET } from "@/content/fleet";
import { Panel, IconBadge } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

/**
 * Coverage and terms.
 *
 * The reference layout this page follows puts a headline rate in the middle
 * of this block — a route, then a price per pallet. WE CANNOT. HK United
 * publishes no rates, and a made-up "from $X" on a real carrier's site is a
 * number their dispatchers would then have to honour or explain away.
 *
 * So the block keeps the shape and swaps what fills it: the route pill
 * carries the SCALE we will quote at instead of a price, and the panel that
 * would hold "prices for other directions — ask a manager" says plainly
 * that rates depend on material, access and schedule, with the button that
 * gets you one. The layout's job — route on the left, way in on the right —
 * survives intact; only the claim changes.
 *
 * The materials strip is derived from the fleet model, so it can never
 * drift from what the equipment actually carries.
 */
const MATERIALS = [...new Set(FLEET.flatMap((unit) => unit.payloads))].sort(
  (a, b) => a.localeCompare(b),
);

export function Coverage() {
  return (
    <section className="container-page band-y" aria-labelledby="coverage-heading">
      <div>
        <Panel tone="sunk" className="p-7 md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h2 id="coverage-heading" className="type-h2 max-w-[15ch] text-ink">
                One terminal, one province
              </h2>

              {/* The route. A drawn line, because a comma does not read as distance. */}
              <div className="mt-10 max-w-md">
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="size-2.5 shrink-0 rounded-full bg-brand" />
                  <span className="h-px flex-1 bg-line-strong" />
                  <span className="size-2.5 shrink-0 rounded-full border-2 border-brand" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-6 text-[0.9375rem] text-ink">
                  <span>{COMPANY.address.city}</span>
                  <span>Anywhere in {COMPANY.address.regionName}</span>
                </div>
              </div>

              <p className="mt-10 inline-flex rounded-full bg-paper px-5 py-3 text-[0.9375rem] text-ink shadow-lift">
                From a single load to sustained site haulage
              </p>

              <ul className="mt-10 flex flex-wrap gap-2">
                {MATERIALS.map((material) => (
                  <li
                    key={material}
                    className="rounded-full border border-line-strong px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </div>

            {/*
              Dashed rather than solid: this panel is an aside to the block,
              not a second column of it, and a solid rule would split the
              card into two equal halves.
            */}
            <div className="lg:col-span-4 lg:col-start-9 lg:border-l lg:border-dashed lg:border-line-strong lg:pl-12">
              <IconBadge icon={Calculator} />
              <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-2">
                Rates depend on the material, the volume, the access and the
                window. Send those four and dispatch comes back with a firm
                price rather than a range.
              </p>
              <Button href="/quote" className="mt-7 w-full sm:w-auto" arrow>
                Request a quote
              </Button>

              <div className="mt-8 flex items-start gap-3 border-t border-line-strong pt-6">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ink-4" aria-hidden="true" />
                <address className="text-[0.875rem] not-italic leading-relaxed text-ink-3">
                  {COMPANY.address.street}
                  <br />
                  {COMPANY.address.city}, {COMPANY.address.region}
                </address>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
