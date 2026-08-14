import { Plus } from "lucide-react";
import { FAQ } from "@/content/site";
import { COMPANY } from "@/content/company";
import { SectionLabel } from "@/components/ui/panel";
import { TextLink } from "@/components/ui/button";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * Questions.
 *
 * BUILT ON `<details>` / `<summary>`, so the accordion ships no JavaScript
 * and is keyboard-operable, screen-reader-announced and printable for free.
 * A hand-rolled version would need state, ARIA wiring and a focus contract
 * to reach the same place, and would still hide its content from Ctrl+F.
 *
 * THIS PAGE OWNS THE `FAQPage` SCHEMA — it is emitted in `app/page.tsx`,
 * where it has been since before this section existed. /contact renders the
 * same seven answers WITHOUT schema, deliberately, so the two surfaces
 * never compete for the same rich result. Both read `content/site.ts`, so
 * they cannot disagree on the answers themselves.
 */
export function Faq() {
  return (
    <section className="container-page band-y" aria-labelledby="faq-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel>FAQ</SectionLabel>
            <SplitHeading id="faq-heading" className="type-h2 mt-6 max-w-[12ch] text-ink">
              Asked before
            </SplitHeading>
            <p className="mt-7 max-w-sm text-[0.9375rem] leading-relaxed text-ink-3">
              If the answer you need is not here, dispatch will have it — and
              would rather you asked than guessed.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <TextLink href="/contact">Talk to dispatch</TextLink>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="tnum text-[0.9375rem] tracking-wider text-ink-2 transition-colors duration-500 hover:text-brand"
              >
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>

        {/*
          The questions stagger in as a group, as content rather than as
          cards: these are rows of type on a hairline grid, and a settle
          scale on a row with no surface of its own reads as text zooming.
        */}
        <Reveal stagger className="border-t border-line lg:col-span-7 lg:col-start-6">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="type-h3 max-w-[30ch] text-ink transition-colors duration-500 group-hover:text-brand">
                  {item.q}
                </h3>
                <Plus
                  className="mt-1 size-5 shrink-0 text-ink-4 transition-transform duration-500 ease-[var(--ease-brand)] group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[62ch] pb-7 leading-[1.75] text-ink-2">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
