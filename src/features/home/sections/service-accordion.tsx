"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ImageAsset } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import {
  gsap,
  registerGsap,
  motionMedia,
  inViewport,
  hasEntered,
  markEntered,
  EASE,
  DUR,
} from "@/lib/motion";

export interface AccordionItem {
  slug: string;
  index: string;
  name: string;
  summary: string;
  plate: ImageAsset;
}

/**
 * Share of the frame the open panel takes. At 0.33 a ten-panel rail leaves
 * each closed slice about 95px on a 1440 viewport — wide enough to carry a
 * vertical label and a numeral, narrow enough that all ten still read as a
 * single band rather than as a row of cards.
 */
const OPEN_SHARE = 0.33;

/**
 * Runs before paint on the client, so the closed panels are never painted
 * open and then collapsed. Degrades to `useEffect` during SSR.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * THE SERVICE ACCORDION.
 *
 * Ten photographic panels standing side by side as one band. The panel under
 * the pointer opens to a third of the frame and shows its name, summary and
 * route in; the other nine stay as narrow slices carrying a vertical label
 * and a numeral. Ten services in one screen, every one of them a photograph
 * rather than a thumbnail.
 *
 * IT DOES NOT ANIMATE WIDTH, AND THAT IS THE WHOLE ENGINEERING PROBLEM.
 *
 * The obvious build tweens `flex-grow` or `grid-template-columns`. Both are
 * layout properties: every frame of the open forces the browser to re-lay-out
 * ten panels, re-wrap the text inside them and repaint the lot. On a band of
 * ten photographs that is the single most expensive thing this site could
 * choose to animate, and it is the reason most accordions on the web feel
 * like they are dragging.
 *
 * So the geometry is inverted. EVERY PANEL IS PERMANENTLY THE OPEN WIDTH and
 * absolutely positioned; each one overlaps the one before it, hiding all but
 * a slice. What "opening" a panel actually does is push the panels to its
 * right further right, which uncovers it. The only property that changes is
 * `x`.
 *
 *     x(i) = i·slice + (i > open ? open_width − slice : 0)
 *
 * Panels are stacked in source order with ascending `z-index` so each covers
 * its left-hand neighbour, and the frame clips the last panel's overhang. The
 * arithmetic is exact: the visible slice of every closed panel is the
 * distance to the next panel's left edge, and those distances sum to the
 * frame width by construction.
 *
 * The result is a full accordion running entirely on the compositor — ten
 * transforms per open, no layout, no reflow, no repaint of the photographs.
 *
 * THE PANELS ARE SIZED IN JAVASCRIPT, ONCE. `width` is set — not tweened —
 * on mount and on resize. Setting a layout property once when the viewport
 * changes is ordinary layout work; animating it sixty times a second is not.
 *
 * BELOW `lg`, AND UNDER REDUCED MOTION AT ANY SIZE, THERE IS NO ACCORDION.
 * The same ten panels render as a stacked column of full-width photo cards
 * with every name and summary permanently visible. That is not a degraded
 * version of this section — an accordion hides nine summaries behind a hover
 * that a touchscreen does not have, so the stack is the honest form there.
 * The markup is identical in both; only positioning changes, so there is no
 * second tree to hydrate and nothing to mismatch.
 *
 * KEYBOARD OPENS IT TOO. Every panel is a real link carrying its full name
 * and summary in the DOM at all times — the closed state hides them with
 * opacity, never with `display`, so all ten are reachable and announced
 * whatever is open. Tabbing to a panel opens it, so a keyboard user sees what
 * a pointer user sees.
 */
export function ServiceAccordion({ items }: { items: readonly AccordionItem[] }) {
  const frame = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;

    registerGsap();

    return motionMedia(el, (c) => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", el);
      if (!panels.length) return;

      const isRail = !c.reduced && c.isDesktop;

      /*
       * THE RAIL LAYOUT IS SWITCHED ON HERE, NOT IN THE MARKUP, and that is
       * deliberate. Every panel's position and width is computed below; if
       * the CSS declared the absolute positioning on its own, a build where
       * this code never ran would stack ten absolutely-positioned panels on
       * top of each other at `left: 0` inside a fixed-height clipped frame —
       * one visible service out of ten. Declaring it from the same code that
       * does the placing means the two cannot come apart: no JavaScript, no
       * accordion, but a complete and legible column of ten photo cards.
       *
       * It is also set BEFORE the entry reveal is built, so the reveal is
       * measured against the layout it will actually run in.
       */
      if (isRail) el.dataset.mode = "rail";

      /** Whatever the entry animation left half-done, resolve it to this. */
      const settle = () => {
        gsap.set(el, { clipPath: "none" });
        gsap.set(panels, { clipPath: "none" });
      };

      const trigger = inViewport(el, -40)
        ? undefined
        : ({ trigger: el, start: "top 82%", once: true } as const);

      /* ---------------- Entry reveal ------------------------------------
       * TWO DIFFERENT REVEALS, BECAUSE THE TWO LAYOUTS ARE DIFFERENT SHAPES.
       * The first build used one — a staggered per-panel wipe — and in rail
       * mode it looked broken, for a reason that is worth writing down.
       *
       * In the rail every panel is the OPEN width and is covered by its
       * right-hand neighbour; what you see of it is the strip its neighbour
       * does not cover. So clipping a panel away does not reveal empty space,
       * it reveals THE PANEL UNDERNEATH AT FULL OPEN WIDTH. Staggering ten of
       * those means the band spends most of the animation showing the wrong
       * photographs at the wrong widths, flickering narrower as each panel
       * lands on top of the one before it. Nothing was wrong with the tween;
       * the effect was incompatible with the geometry.
       *
       * In rail mode the reveal is therefore ONE WIPE ON THE FRAME. The
       * panels are already in their final positions underneath it, so what
       * uncovers is the finished band and nothing can flicker. It runs
       * left to right, the same direction as every other image reveal on the
       * site, so the band arrives in the site's own language rather than in
       * one invented for it.
       *
       * The stacked column keeps the per-panel stagger, where it is correct:
       * nothing overlaps, so clipping a card away reveals the page.
       */
      let entry: gsap.core.Tween | null = null;

      if (!c.reduced && !hasEntered(el)) {
        entry = isRail
          ? gsap.fromTo(
              el,
              // `round` carries the frame's own corner radius through the
              // wipe. Without it the clip is a hard rectangle and the band's
              // rounded corners pop square for the length of the animation.
              { clipPath: "inset(0% 100% 0% 0% round 1.25rem)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
                duration: DUR.section,
                ease: EASE.cine,
                onStart: () => markEntered(el),
                onComplete: settle,
                scrollTrigger: trigger,
              },
            )
          : gsap.fromTo(
              panels,
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: DUR.reveal,
                stagger: 0.07,
                ease: EASE.cine,
                onStart: () => markEntered(el),
                onComplete: settle,
                scrollTrigger: trigger,
              },
            );
      }

      /*
       * The watchdog, scoped to the one failure that matters: a band on
       * screen that never revealed. Below the fold and unrevealed is correct;
       * in the viewport and unrevealed is a trigger that mis-measured against
       * a layout that moved under it.
       */
      const watchdog = window.setTimeout(() => {
        if (!entry || entry.isActive() || entry.progress() > 0) return;
        if (!inViewport(el)) return;
        // Killed, not merely overwritten: a resolved band with a live trigger
        // still aimed at it replays the whole entrance when that trigger fires.
        entry.scrollTrigger?.kill();
        entry.kill();
        settle();
      }, 3000);

      const stopWatchdog = () => window.clearTimeout(watchdog);

      // Stacked column below `lg` and under reduced motion. Nothing to place.
      if (!isRail) return stopWatchdog;

      const rails = panels.map((p) => p.querySelector("[data-rail]"));
      const bodies = panels.map((p) => p.querySelector("[data-body]"));
      const plates = panels.map((p) => p.querySelector("[data-plate]"));

      /*
       * The compositor hint is applied HERE rather than in the markup,
       * because these elements only animate in rail mode. Declared as a
       * class it would promote twenty layers — ten panels and ten
       * photographs — on every phone that loads this page and never moves
       * any of them, which is texture memory spent for nothing and is
       * exactly what the performance guidance warns against. It also has to
       * be off during the entry wipe on principle: promoted layers inside a
       * `clip-path`ed parent are re-rasterised as the clip moves.
       */
      gsap.set(panels, { willChange: "transform" });
      gsap.set(plates, { willChange: "transform" });

      let open = 0;
      let slice = 0;
      let width = 0;

      /** Size the panels. Layout work, done once per resize — never tweened. */
      const measure = () => {
        const total = el.clientWidth;
        width = Math.round(total * OPEN_SHARE);
        slice = (total - width) / (panels.length - 1);
        gsap.set(panels, { width });
        // Ascending stack order: each panel must cover its left neighbour,
        // which is what turns "width minus overlap" into the visible slice.
        panels.forEach((p, i) => gsap.set(p, { zIndex: i }));
      };

      /** Place every panel for a given open index. Transforms only. */
      const place = (next: number, animate: boolean) => {
        open = next;
        const duration = animate ? DUR.reveal : 0;

        panels.forEach((panel, i) => {
          gsap.to(panel, {
            x: i * slice + (i > open ? width - slice : 0),
            duration,
            ease: EASE.deep,
            overwrite: "auto",
          });

          const isOpen = i === open;

          gsap.to(rails[i], {
            opacity: isOpen ? 0 : 1,
            duration: duration * 0.6,
            ease: EASE.out,
            overwrite: "auto",
          });

          gsap.to(bodies[i], {
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 14,
            duration,
            // The copy trails the panel opening rather than arriving with
            // it — text that resolves while its own frame is still moving
            // reads as two things happening instead of one.
            delay: isOpen && animate ? 0.14 : 0,
            ease: EASE.out,
            overwrite: "auto",
          });

          // The closed panels sit fractionally over-scaled, so opening one
          // settles its photograph as well as revealing it.
          gsap.to(plates[i], {
            scale: isOpen ? 1 : 1.06,
            duration: duration * 1.2,
            ease: EASE.cine,
            overwrite: "auto",
          });
        });
      };

      measure();
      place(0, false);

      /*
       * Re-measure on width change. `matchMedia` only re-runs when a query
       * flips, so without this a window dragged from 1400 to 1100 keeps the
       * panel widths it was born with and the band tears away from its frame.
       */
      const ro = new ResizeObserver(() => {
        measure();
        place(open, false);
      });
      ro.observe(el);

      const teardowns: Array<() => void> = [];

      panels.forEach((panel, i) => {
        const enter = () => place(i, true);
        panel.addEventListener("pointerenter", enter);
        panel.addEventListener("focusin", enter);
        teardowns.push(() => {
          panel.removeEventListener("pointerenter", enter);
          panel.removeEventListener("focusin", enter);
        });
      });

      return () => {
        stopWatchdog();
        ro.disconnect();
        teardowns.forEach((fn) => fn());
        delete el.dataset.mode;
      };
    });
  }, []);

  return (
    /*
      The stacked column is the DEFAULT at every width, and the rail is an
      enhancement layered on top of it by `data-mode`. Rendering two different
      trees would mean a hydration mismatch on every load; driving the layout
      from React state would mean the server sending a layout that is wrong
      for most visitors. This way the server sends one complete, valid column
      and the accordion is applied to it — or is not, harmlessly.
    */
    <div
      ref={frame}
      className="group/svc relative mt-10 flex flex-col gap-3 md:mt-14 data-[mode=rail]:block data-[mode=rail]:h-[clamp(26rem,58vh,34rem)] data-[mode=rail]:gap-0 data-[mode=rail]:overflow-hidden data-[mode=rail]:rounded-plate"
    >
      {items.map((item) => (
        <div
          key={item.slug}
          data-panel
          className="relative h-56 overflow-hidden rounded-plate sm:h-64 group-data-[mode=rail]/svc:absolute group-data-[mode=rail]/svc:inset-y-0 group-data-[mode=rail]/svc:left-0 group-data-[mode=rail]/svc:h-auto group-data-[mode=rail]/svc:rounded-none"
        >
          <Link href={`/services#${item.slug}`} className="group/panel block h-full">
            <div data-plate className="absolute inset-0">
              <Media
                asset={item.plate}
                ratio="auto"
                radius="none"
                className="h-full w-full"
                sizes="(min-width: 1024px) 34vw, 100vw"
              />
            </div>

            {/*
              The scrim is not optional and it is not decoration: every panel
              carries white type over a photograph, and these frames run from
              bright wet asphalt to near-black tarpaulin. Without it the
              legibility of a name depends on which truck was photographed.
            */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/90 via-scrim/40 to-scrim/10"
            />

            {/*
              THE CLOSED LABEL. `aria-hidden`, because it repeats the name
              carried by the body below — a screen reader announcing every
              panel twice is a defect, not a courtesy. Desktop only: there is
              no closed state in the stacked column.

              `label-vertical` is the system's existing rotated-label
              utility. It paints sideways but stays real text in normal
              reading order, so selection and copy-paste are unaffected.
            */}
            <span
              aria-hidden="true"
              data-rail
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-[6rem] flex-col items-center justify-end gap-5 pb-7 group-data-[mode=rail]/svc:flex"
            >
              <span className="label-vertical text-white/85">{item.name}</span>
              <span className="tnum text-[0.6875rem] tracking-[0.16em] text-white/55">
                {item.index}
              </span>
            </span>

            {/*
              THE OPEN BODY, and the real content of the link. Hidden with
              opacity rather than `display` in the closed state, so all ten
              names and summaries stay in the accessibility tree and in
              Ctrl+F whatever the band happens to be showing.

              Its width is pinned to the open width so the text does not
              re-wrap as the panel moves — re-wrapping mid-transition is
              layout work, which is the exact cost this component is built to
              avoid.

              NOT parked at `opacity-0` in the markup. The closed state is set
              by the same layout effect that sets the panel positions, before
              paint, so a build where that never runs shows ten complete
              captions rather than ten blank photographs.
            */}
            <div
              data-body
              className="absolute inset-x-0 bottom-0 p-6 group-data-[mode=rail]/svc:w-[33vw] group-data-[mode=rail]/svc:p-8"
            >
              <span className="tnum text-[0.6875rem] tracking-[0.16em] text-white/60">
                {item.index}
              </span>
              <h3 className="type-h3 mt-3 max-w-[16ch] text-white">{item.name}</h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.875rem] leading-relaxed text-white/75">
                {item.summary}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] tracking-tight text-white">
                Read the line
                <ArrowUpRight
                  className="size-4 transition-transform duration-[320ms] ease-[var(--ease-brand)] group-hover/panel:-translate-y-0.5 group-hover/panel:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
