import Link from "next/link";
import { COMPANY, AFFILIATIONS } from "@/content/company";
import { FOOTER_NAV } from "@/content/site";
import { Logo } from "@/components/layout/logo";
import { Reveal } from "@/components/motion/reveal";

/**
 * Footer. Server component — no interactivity, so it ships no JS.
 * The oversized wordmark is the page's closing statement rather than a
 * strip of links tacked on the end.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-edge pb-10 pt-24 md:pt-32">
        {/*
          The footer columns arrive as content rather than as cards — they
          are lists of links on an open surface, with no card edge for a
          settle scale to belong to.
        */}
        <Reveal stagger className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <p className="eyebrow mb-6">{COMPANY.serviceArea}</p>
            <p className="max-w-xs text-lg leading-snug tracking-tight text-ink">
              {COMPANY.positioning}.
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="eyebrow mb-6">{group.heading}</h2>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-2 transition-colors duration-500 hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="eyebrow mb-6">Terminal</h2>
            <address className="flex flex-col gap-4 not-italic text-ink-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.region}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-500 hover:text-brand"
              >
                {COMPANY.address.street}
                <br />
                {COMPANY.address.city}, {COMPANY.address.region}
              </a>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="tabular-nums text-sm tracking-wider transition-colors duration-500 hover:text-brand"
              >
                {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="transition-colors duration-500 hover:text-brand"
              >
                {COMPANY.email}
              </a>
            </address>
          </div>
        </Reveal>

        {/*
          CLOSING MARK. This was the logotype stretched to the full page
          width as a graphic; with the wordmark retired from the site it is
          the monogram instead, at a size that reads as a sign-off rather
          than as a banner. A square mark cannot take `w-full` — stretching
          a logo to the width of a page is the one thing a logo may never do.

          Left-aligned to the same edge every other element on this page sits
          on, so it closes the column rather than floating in the middle of it.
        */}
        <div className="mt-24 md:mt-32" aria-hidden="true">
          <Logo className="h-16 opacity-25 md:h-20" sizes="160px" />
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="tabular-nums text-[0.6875rem] uppercase tracking-[0.16em] text-ink-4">
            © {year} {COMPANY.legalName}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {AFFILIATIONS.map((a) => (
              <li
                key={a.abbr}
                className="tabular-nums text-[0.6875rem] uppercase tracking-[0.16em] text-ink-4"
              >
                <abbr title={a.name} className="no-underline">
                  {a.abbr}
                </abbr>{" "}
                {a.note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
