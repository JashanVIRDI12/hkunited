"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Cursor-borne plate preview for a list of links.
 *
 * A list of five sector names is a routing device, and routing devices are
 * scanned rather than read — which is exactly the moment a photograph earns
 * its place. Printing five plates INTO the layout would cost a screen and a
 * half of height and turn the list back into the gallery the homepage
 * already runs. Carrying one plate on the cursor costs no layout at all: it
 * appears only for the row being considered, and it disappears the instant
 * attention moves on.
 *
 * FOUR THINGS MAKE THIS SAFE RATHER THAN A GIMMICK:
 *
 *  · POINTER-FINE ONLY. There is no hover on a touchscreen; a plate that
 *    latches to the last tapped row and then follows nothing is worse than
 *    no plate. The listeners are never attached on coarse pointers, and the
 *    frame is `lg:block` so it cannot occupy space on small screens either.
 *  · IT IS DECORATION, AND SAYS SO. `aria-hidden` and `pointer-events-none`.
 *    Every row is a complete link without it — the plate adds recognition
 *    for a sighted mouse user and nothing else, so keyboard and screen
 *    reader users lose nothing by never seeing it.
 *  · REDUCED MOTION OPTS OUT ENTIRELY. The effect IS motion; there is no
 *    meaningful still version of it.
 *  · THE POSITION IS A LERP, NOT A LATCH. `quickTo` trails the pointer by
 *    its own duration, which is what makes the plate feel carried rather
 *    than glued — and what keeps it readable while the cursor is moving.
 *
 * CENTRING IS DONE WITH NEGATIVE MARGINS, NOT A TRANSFORM. GSAP owns this
 * element's `transform`, and a Tailwind `-translate-x-1/2` would compose
 * with it rather than replace it — legal, but it makes the offset invisible
 * to anyone reading the GSAP call. Margins keep the two concerns separate.
 */

interface HoverPreviewProps {
  /** Key -> plate. Rows opt in by carrying `data-preview="<key>"`. */
  plates: Record<string, ImageAsset>;
  children: React.ReactNode;
  className?: string;
}

/** Frame size. The negative margins below are exactly half of each. */
const FRAME_W = "20rem";
const FRAME_H = "15rem";

export function HoverPreview({ plates, children, className }: HoverPreviewProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const el = wrap.current;
    const box = frame.current;
    if (!el || !box) return;

    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    registerGsap();

    const xTo = gsap.quickTo(box, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(box, "y", { duration: 0.7, ease: "power3.out" });

    const at = (event: PointerEvent) => {
      const bounds = el.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    const onMove = (event: PointerEvent) => {
      const { x, y } = at(event);
      xTo(x);
      yTo(y);
    };

    /*
     * PRIMING, and it is not optional. The frame's transform is whatever the
     * last visit left on it — on the very first hover, the origin. Without
     * this the plate fades in at the top-left corner of the list and flies
     * to the cursor, once per entry into the block. Setting the position
     * instantly on entry, before anything is visible, means the lerp only
     * ever runs between two points the pointer has actually been.
     */
    const onEnter = (event: PointerEvent) => gsap.set(box, at(event));

    /*
     * `pointerover` rather than a listener per row: it bubbles, so one
     * handler covers every row including any added later, and reading the
     * key off the closest opted-in ancestor means the nested spans inside a
     * row cannot break the lookup.
     */
    const onOver = (event: PointerEvent) => {
      const row = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-preview]",
      );
      setActive(row?.dataset.preview ?? null);
    };

    const onLeave = () => setActive(null);

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerover", onOver);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerover", onOver);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} className={cn("relative", className)}>
      {children}

      <div
        ref={frame}
        aria-hidden="true"
        style={{
          width: FRAME_W,
          height: FRAME_H,
          marginLeft: `calc(${FRAME_W} / -2)`,
          marginTop: `calc(${FRAME_H} / -2)`,
        }}
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 hidden overflow-hidden rounded-plate shadow-float lg:block",
          /*
            `scale` and `opacity` only. Transitioning `transform` would fight
            `quickTo`, which writes that property every frame — the plate
            would arrive at the cursor twice-smoothed and feel like it was
            being dragged through syrup.
          */
          "transition-[opacity,scale] duration-500 ease-[var(--ease-brand)]",
          active ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        {Object.entries(plates).map(([key, asset]) => (
          <div
            key={key}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-[var(--ease-brand)]",
              key === active ? "opacity-100" : "opacity-0",
            )}
          >
            <Media
              asset={asset}
              ratio="auto"
              radius="none"
              className="h-full w-full"
              sizes="320px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
