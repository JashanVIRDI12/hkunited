import { Quote } from "lucide-react";
import { Panel, IconBadge, SectionLabel } from "@/components/ui/panel";
import { ScrollText } from "@/components/motion/scroll-text";

/**
 * The company, in its own words.
 *
 * EVERY CLAUSE HERE IS QUOTED from hkunited.ca/about-us.html. This is the
 * page where the temptation to write mission-statement filler is strongest,
 * and the sourcing rule in `content/company.ts` applies hardest: a real
 * carrier's About page is read by people deciding whether to trust them
 * with a schedule, so nothing on it may be invented.
 *
 * `ScrollText` lights the sentence a phrase at a time as it passes. It is
 * the one piece of motion on this page that is not a fade, and it earns
 * that because the statement is the only thing on /about the company wrote
 * itself — everything else is a fact about them. The type tier is well
 * below the old editorial treatment: inside a card the sentence has a
 * measure to respect, and at 3.5rem it would run four words to the line.
 */
const STATEMENT =
  "HK United has spent the last fifteen-plus years as a premier fleet and logistics provider in the Greater Toronto Area. Our objective is to deliver effective and economical solutions during periods of economic challenge — without moving on our commitment to health and safety.";

export function Statement() {
  return (
    <section className="container-page band-y" aria-labelledby="statement-heading">
      <SectionLabel>In our own words</SectionLabel>
      <h2 id="statement-heading" className="sr-only">
        HK United in its own words
      </h2>

      <div className="mt-6">
        <Panel tone="paper" className="p-7 md:p-12 lg:p-16">
          <IconBadge icon={Quote} />
          <ScrollText className="mt-8 max-w-[26ch] font-display text-[clamp(1.375rem,2.6vw,2.25rem)] leading-[1.3] tracking-[-0.012em] text-ink md:max-w-[34ch]">
            {STATEMENT}
          </ScrollText>

          <p className="mt-10 max-w-md border-t border-line pt-8 text-[0.9375rem] leading-relaxed text-ink-3">
            In practice that means a high standard of vehicle maintenance and
            driver training, held continuously rather than proven once.
          </p>
        </Panel>
      </div>
    </section>
  );
}
