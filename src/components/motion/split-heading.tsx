"use client";

import { useEffect, useRef } from "react";
import { revealLines } from "@/lib/motion";

interface SplitHeadingProps {
  /** Plain text. SplitText measures real line boxes, so no markup inside. */
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  delay?: number;
  start?: string;
  /** Play on mount rather than on scroll — for headings above the fold. */
  immediate?: boolean;
}

/**
 * A heading that reveals line by line, with the lines measured rather than
 * declared.
 *
 * THE DIVISION OF LABOUR WITH `MaskLines` IS THE POINT, and it is a real
 * distinction rather than two ways of doing one thing.
 *
 * `MaskLines` takes lines broken BY HAND. At `type-display` and above, where
 * a headline gets a whole screen and three words, the break is a composition
 * decision — "from Mississauga" belongs on its own line because of what it
 * does to the shape of the block, not because it happens to fit.
 *
 * This takes a string and lets the browser break it. At `type-h2` and below,
 * running in a grid column, the same headline is two lines on a laptop and
 * three on a tablet and one on a wide desktop. Hand-breaking that is not a
 * design decision, it is a guess that is wrong at two widths out of three —
 * and a mask measured against the wrong line box clips a line in half.
 *
 * SPLITTEXT RE-SPLITS ITSELF, which is the reason it is worth the plugin
 * here. `autoSplit` re-measures on resize AND on font load, and this site
 * loads its display serif with `display: swap` — so every heading's line
 * breaks change once, after first paint, on every cold visit. A hand-rolled
 * splitter would have to reimplement that, and the version that does not is
 * exactly the version that ships masks measured against Georgia.
 *
 * ACCESSIBILITY IS THE PLUGIN'S, NOT OURS. `aria: "auto"` puts an
 * `aria-label` carrying the original string on the element and hides the
 * generated line spans, so the heading is announced once, intact, in the
 * right order. That is why there is no `sr-only` duplicate here — the thing
 * `MaskLines` does by hand is handled.
 *
 * THE TEXT RENDERS NORMALLY AND IS SPLIT AFTERWARDS. Server output is a
 * plain heading; if this never hydrates, or `prefers-reduced-motion` is set,
 * that is what stays on the page. Nothing is hidden that this component is
 * not also, in the same breath, arranging to show.
 */
export function SplitHeading({
  children,
  className,
  as: Tag = "h2",
  id,
  delay = 0,
  start,
  immediate = false,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return revealLines(el, { delay, start, immediate });
    // `children` is in the deps because a changed string needs a re-split:
    // the old lines are stale DOM the moment the text under them changes.
  }, [children, delay, start, immediate]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
