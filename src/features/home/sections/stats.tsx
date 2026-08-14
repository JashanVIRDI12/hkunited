import { COMPANY } from "@/content/company";
import { FLEET, DIVISIONS } from "@/content/fleet";
import { INDUSTRIES } from "@/content/industries";
import { Panel } from "@/components/ui/panel";
import { Counter } from "@/components/motion/counter";

/**
 * The stat row.
 *
 * Four cards directly beneath the hero, before any argument is made. They are
 * the page's credentials — the reason to keep scrolling — so they get the
 * position where a visitor is still deciding, not a band two thirds down
 * where only committed readers arrive.
 *
 * THE NUMERALS COUNT UP, AND THE REST OF THE ROW DOES NOT MOVE AT ALL.
 *
 * That split is the design. A row where the cards also fade and rise reads as
 * a page still loading; a row where four numbers spin up inside four cards
 * that were already there reads as instruments taking a reading, which is
 * exactly what a credentials row is. The labels beside them stay completely
 * still — they are the calm the numbers are measured against.
 *
 * THIS ROW CARRIED NO MOTION FOR A REASON, AND THE REASON IS NOW FIXED
 * RATHER THAN OVERRULED. Both effects it previously ran had the same failure:
 * each hid something unconditionally on mount — cards to `opacity: 0`, numerals
 * to "0" — and depended on a ScrollTrigger to bring it back. On a row sitting
 * ON the fold, where the start point is ambiguous and Lenis has not yet
 * reported a position, that trigger does not always fire, and the visitor gets
 * four empty cards or four zeros. The row was stripped to a plain server
 * component as the fix.
 *
 * `Counter` no longer works that way. `immediateRender: false` means it does
 * not write to the DOM at all until its tween actually runs, so the figure on
 * screen is the server-rendered final value until the instant something is
 * going to animate it — and if nothing ever does, the number is simply right.
 * The effect became safe to reinstate by making its failure identical to its
 * success. The cards themselves are still deliberately motionless.
 *
 * STILL DELIBERATELY CONSERVATIVE ABOUT THE FIGURES. Every one is either
 * published on hkunited.ca (years in operation) or derived by counting the
 * content model (configurations, divisions, sectors). Fleet unit counts,
 * project totals and client counts are NOT shown — the source site does not
 * substantiate them. See `PENDING_VERIFICATION` in `content/company.ts`; when
 * the client confirms real numbers, this row is where they belong.
 */
const STATS = [
  {
    value: COMPANY.yearsInOperation,
    suffix: "+",
    label: "Years moving Ontario freight",
  },
  { value: FLEET.length, suffix: "", label: "Equipment configurations" },
  { value: DIVISIONS.length, suffix: "", label: "Operating divisions" },
  { value: INDUSTRIES.length, suffix: "", label: "Sectors served" },
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
              {/*
                `tnum` on the wrapper is what stops the count from jittering:
                proportional numerals change width as they roll, so the label
                beside them would shuffle sideways on every frame.
              */}
              <Counter value={stat.value} suffix={stat.suffix} />
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
