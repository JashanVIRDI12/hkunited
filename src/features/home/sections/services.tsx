import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/content/services";
import { SERVICE_IMAGE } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { SectionLabel } from "@/components/ui/panel";
import { TextLink } from "@/components/ui/button";

/**
 * Services.
 *
 * A DIRECTORY, NOT A CARD GRID. Ten services as tall photo cards ran four
 * rows deep and cost roughly two full screens of scrolling — on a homepage,
 * where this block's only job is to say what we do and route you onward.
 * Worse, it was the third card grid on the page: services, fleet and
 * sectors all read as the same object, so the eye stopped distinguishing
 * them and the page felt like one long list of tiles.
 *
 * Compact rows in two columns fix all of that. Every one of the ten is
 * visible at once instead of four-at-a-time, the block occupies about a
 * third of the height, and a row is a visibly different object from the
 * cards above and below it.
 *
 * WHY THE THUMBNAIL SURVIVED THE SHRINK. At 80px a photograph stops being
 * an image you look at and becomes a mark you recognise — which is the
 * actual job here, since a superintendent scanning for "the tanker one"
 * finds it by silhouette faster than by reading ten headings. Ten distinct
 * frames, one per row, from `SERVICE_IMAGE`.
 *
 * The rows are a `<ul>`: this is a list of links, and announcing it as
 * "list, 10 items" is free navigation for a screen reader.
 *
 * Server component — the hover state is CSS on each row's `group`.
 */
export function Services() {
  return (
    <section className="bg-paper-alt" aria-labelledby="services-heading">
      <div className="container-page band-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Services</SectionLabel>
            <h2 id="services-heading" className="type-h2 mt-6 max-w-[16ch] text-ink">
              Ten ways we move your project
            </h2>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-3 md:pb-2">
            Most jobs use two or three at once. One dispatch desk sequences
            them so they do not collide on your site.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 md:mt-14 lg:grid-cols-2">
          {SERVICES.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services#${service.slug}`}
                className="group flex h-full items-center gap-5 rounded-plate border border-line bg-paper p-4 transition-colors duration-500 hover:border-line-strong hover:bg-paper-alt"
              >
                <Media
                  asset={SERVICE_IMAGE[service.slug]}
                  ratio="1/1"
                  radius="soft"
                  className="w-20 shrink-0"
                  sizes="80px"
                  zoomOnHover
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                      {service.index}
                    </span>
                    <h3 className="text-[1.0625rem] font-medium leading-snug tracking-tight text-ink transition-colors duration-500 group-hover:text-brand">
                      {service.name}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-3">
                    {service.summary}
                  </p>
                </div>

                <ArrowUpRight
                  className="size-5 shrink-0 text-ink-4 transition-all duration-500 ease-[var(--ease-brand)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <TextLink href="/services">All ten service lines</TextLink>
        </div>
      </div>
    </section>
  );
}
