"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsap,
  motionMedia,
  EASE,
} from "@/lib/motion";

/**
 * THE JOB, DRAWN AS IT IS READ.
 *
 * A single stroke runs down the left gutter of the five process steps and
 * draws itself as the reader scrolls through them, with a node riding its
 * leading edge. By the time the last step is read the line is complete.
 *
 * WHY THIS SECTION AND NOT A DECORATION ANYWHERE ELSE. The list it sits
 * beside is called "How a job runs", and it is the one place on the site
 * where the content is genuinely a SEQUENCE — scope, assess, mobilise, haul,
 * document, in that order, each depending on the one before. A drawn line is
 * the only motion on this site that is an argument rather than a flourish
 * except the safety checklist, and for the same reason: the animation states
 * something the static page cannot, which is that these steps happen in
 * order and are still happening.
 *
 * SCRUBBED, NOT PLAYED. The line's progress is the reader's own scroll
 * position, so it cannot get ahead of them or finish while they are still on
 * step two. That is the difference between a progress indicator and an
 * animation of one.
 *
 * IT IS PURE DECORATION TO ASSISTIVE TECH. `aria-hidden`, and the list beside
 * it is a real `<ol>` whose order is already announced. Nothing here carries
 * information that is not in the markup.
 *
 * THE GEOMETRY IS MEASURED, NOT DECLARED. An SVG stretched with
 * `preserveAspectRatio="none"` would distort its own stroke width, so the
 * element is sized in real pixels against the list it tracks and re-measured
 * whenever that list changes height — which it does on every breakpoint and
 * every time the webfont swaps.
 *
 * DESKTOP ONLY. Below `lg` the list is not in a sticky column and has no
 * gutter to draw in; the steps are numbered and separated by hairlines, which
 * is the whole of what the line adds there anyway.
 */
export function ProcessSpine({ steps }: { steps: number }) {
  const host = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const node = useRef<SVGCircleElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = host.current;
    const path = line.current;
    const dot = node.current;
    const canvas = svg.current;
    if (!el || !path || !dot || !canvas) return;

    registerGsap();

    return motionMedia(el, (c) => {
      // The list this tracks is the spine's own parent.
      const list = el.parentElement;
      if (!list || c.reduced || !c.isDesktop) return;

      let height = 0;

      /** Size the stroke to the list in real pixels. Layout, done on resize. */
      const measure = () => {
        height = list.offsetHeight;
        canvas.setAttribute("height", String(height));
        canvas.setAttribute("viewBox", `0 0 2 ${height}`);
        path.setAttribute("d", `M1 0 V${height}`);
      };

      measure();

      const draw = gsap.fromTo(
        path,
        { drawSVG: "0% 0%" },
        {
          drawSVG: "0% 100%",
          // Scrubbed, so any ease would decouple the line from the hand
          // driving it.
          ease: EASE.none,
          scrollTrigger: {
            trigger: list,
            // Starts as the first step reaches the reading line and finishes
            // as the last one leaves it, so the stroke tracks what is being
            // read rather than where the block happens to sit.
            start: "top 70%",
            end: "bottom 75%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      const ride = gsap.fromTo(
        dot,
        { attr: { cy: 0 }, opacity: 0 },
        {
          attr: { cy: () => height },
          opacity: 1,
          ease: EASE.none,
          scrollTrigger: {
            trigger: list,
            start: "top 70%",
            end: "bottom 75%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      /*
       * Re-measure when the list changes height. `matchMedia` only re-runs on
       * a query flip, so a font swap or a reflowing paragraph would otherwise
       * leave the stroke measured for a list that no longer exists.
       */
      const ro = new ResizeObserver(() => {
        measure();
        draw.scrollTrigger?.refresh();
        ride.scrollTrigger?.refresh();
      });
      ro.observe(list);

      return () => ro.disconnect();
    });
  }, [steps]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="pointer-events-none absolute left-[0.6rem] top-0 hidden h-full lg:block"
    >
      <svg
        ref={svg}
        width="2"
        height="100%"
        viewBox="0 0 2 100"
        fill="none"
        overflow="visible"
      >
        <path
          ref={line}
          d="M1 0 V100"
          stroke="var(--color-brand)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle
          ref={node}
          cx={1}
          cy={0}
          r={3.5}
          fill="var(--color-brand)"
          opacity={0}
        />
      </svg>
    </div>
  );
}
