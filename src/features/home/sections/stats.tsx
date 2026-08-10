import { COMPANY } from "@/content/company";
import { FLEET, DIVISIONS } from "@/content/fleet";
import { INDUSTRIES } from "@/content/industries";
import { Panel } from "@/components/ui/panel";

/**
 * The stat row.
 *
 * Four cards directly beneath the hero, before any argument is made. They
 * are the page's credentials — the reason to keep scrolling — so they get
 * the position where a visitor is still deciding, not a band two thirds
 * down where only committed readers arrive.
 *
 * NO MOTION AT ALL, AND THAT IS THE POINT. This row previously carried two
 * scroll-driven effects and each had the same failure mode. `Reveal` in
 * stagger mode has GSAP set every card to `opacity: 0` the moment it
 * initialises, and only a ScrollTrigger brings them back. `Counter` blanks
 * the numeral to "0" on mount and counts up on the same kind of trigger.
 * Both are betting that a trigger fires; when it does not — and on a row
 * that sits ON the fold, where the trigger's start point is ambiguous, it
 * often does not — the visitor is left with four empty cards or four zeros.
 *
 * A credential that is sometimes invisible is worse than one that never
 * animated. So this is now a plain server component: no client JavaScript,
 * nothing to park, nothing to restore.
 *
 * STILL DELIBERATELY CONSERVATIVE. Every figure is either published on
 * hkunited.ca (years in operation) or derived by counting the content model
 * (configurations, divisions, sectors). Fleet unit counts, project totals
 * and client counts are NOT shown — the source site does not substantiate
 * them. See `PENDING_VERIFICATION` in `content/company.ts`; when the client
 * confirms real numbers, this row is where they belong.
 */
const STATS = [
  {
    value: `${COMPANY.yearsInOperation}+`,
    label: "Years moving Ontario freight",
  },
  { value: String(FLEET.length), label: "Equipment configurations" },
  { value: String(DIVISIONS.length), label: "Operating divisions" },
  { value: String(INDUSTRIES.length), label: "Sectors served" },
];

export function Stats() {
  return (
    <section className="container-page pt-3" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        {COMPANY.shortName} by the numbers
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Panel
            key={stat.label}
            tone="sunk"
            className="flex items-center gap-4 p-5 md:gap-5 md:px-6"
          >
            {/*
              NOT `type-h2`. That tier tops out at 3.5rem, which made each
              card ~120px tall — enough to push the row off the fold the
              hero is sized to share with it. The numeral only has to
              out-weigh a 13px label, and at 2.25rem it already does.
            */}
            <p className="tnum shrink-0 font-display text-[clamp(1.75rem,2.4vw,2.25rem)] leading-none tracking-[-0.014em] text-ink">
              {stat.value}
            </p>
            <span className="h-8 w-px shrink-0 bg-line-strong" aria-hidden="true" />
            <p className="max-w-[15ch] text-[0.8125rem] leading-snug text-ink-3">
              {stat.label}
            </p>
          </Panel>
        ))}
      </div>
    </section>
  );
}
