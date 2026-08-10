import { Plus } from "lucide-react";
import { FAQ } from "@/content/site";
import { TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

/**
 * Questions.
 *
 * BUILT ON `<details>` / `<summary>`, so the accordion ships no JavaScript
 * and is keyboard-operable, screen-reader-announced and printable for free.
 * A hand-rolled accordion would need state, ARIA wiring and a focus
 * contract to reach the same place, and would still collapse its content
 * away from Ctrl+F.
 *
 * NO `FAQPage` STRUCTURED DATA HERE. The homepage already emits the same
 * seven questions as `faqSchema`, and publishing one FAQ set at two URLs
 * asks Google to pick a winner between them. The answers live in
 * `content/site.ts` either way, so the two surfaces cannot disagree.
 */
export function Faq() {
  return (
    <section className="section-y bg-paper-alt" aria-labelledby="faq-heading">
      <div className="container-edge">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-8">Questions</p>
              <h2 id="faq-heading" className="type-h1 max-w-[10ch] text-ink">
                Asked before.
              </h2>
              <p className="mt-8 max-w-sm leading-relaxed text-ink-2">
                If the answer you need is not here, dispatch will have it —
                and would rather you asked than guessed.
              </p>
              <div className="mt-10">
                <TextLink href="/quote">Request a quote</TextLink>
              </div>
            </div>
          </div>

          <Reveal stagger className="border-t border-line-strong lg:col-span-8">
            {FAQ.map((item) => (
              <details key={item.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 [&::-webkit-details-marker]:hidden">
                  <h3 className="type-h3 max-w-[28ch] text-ink transition-colors duration-500 group-hover:text-brand">
                    {item.q}
                  </h3>
                  <Plus
                    className="mt-1 size-5 shrink-0 text-ink-4 transition-transform duration-500 ease-[var(--ease-brand)] group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-[62ch] pb-8 leading-[1.75] text-ink-2">
                  {item.a}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
