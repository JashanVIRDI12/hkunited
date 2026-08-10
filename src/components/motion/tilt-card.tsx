"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A card that sits in real 3D space.
 *
 * The card plane rotates toward the pointer, its contents stand off the
 * surface at different depths, and a specular sweep tracks the cursor across
 * it. Between them those three make the card read as a physical object under
 * a light rather than as a rectangle with a shadow — which is the whole
 * difference between a card layout that looks designed and one that looks
 * assembled.
 *
 * WHY THE ROTATION IS SMALL. The default is 7 degrees of travel in each
 * direction, and that is already at the top of the usable range for a card
 * carrying body copy: past about 10 the text on the receding edge starts to
 * lose its baseline and the card reads as a toy. The effect is meant to be
 * felt before it is noticed.
 *
 * DEPTH IS OPT-IN, PER LAYER. The plane is `preserve-3d`, so any child can
 * lift itself with a `translateZ` and it will parallax correctly as the card
 * turns. Two things to know before using it:
 *
 *  · An element with `overflow: hidden` FLATTENS its own subtree. A photo
 *    clipped by a rounded frame can be lifted as a whole, but nothing inside
 *    that frame can have its own depth — put those layers beside the frame,
 *    not within it.
 *  · Perspective magnifies: a layer at `Z` grows by `perspective / (perspective
 *    - Z)`. At the 1400px perspective set here, 40px of lift is a 3% growth,
 *    so a lifted layer needs at least that much padding around it or it will
 *    push past the card's edge on the near side.
 *
 * `rotationX/Y` and the glare's two custom properties are the only things
 * that change, so a turn costs one composite and no layout.
 *
 * OFF ON TOUCH, OFF UNDER REDUCED MOTION. There is no pointer to track on a
 * touchscreen, and a card that tilts once on tap and stays there is a defect;
 * `prefers-reduced-motion` rules out the sweep for the obvious reason. In
 * both cases the card renders as an ordinary flat card and every layer's
 * `translateZ` resolves to a harmless 3% of scale.
 */

interface TiltCardProps {
  children: React.ReactNode;
  /** Class for the rotating plane. Put the card's surface styling here. */
  className?: string;
  /** Maximum rotation, in degrees, at the card's edge. */
  intensity?: number;
  /** Specular sweep. Disable on surfaces where it would wash out. */
  glare?: boolean;
}

export function TiltCard({
  children,
  className,
  intensity = 7,
  glare = true,
}: TiltCardProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = wrap.current;
    const el = plane.current;
    if (!outer || !el) return;

    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    registerGsap();

    const rotX = gsap.quickTo(el, "rotationX", {
      duration: 0.6,
      ease: "power3.out",
    });
    const rotY = gsap.quickTo(el, "rotationY", {
      duration: 0.6,
      ease: "power3.out",
    });

    const onMove = (event: PointerEvent) => {
      const bounds = outer.getBoundingClientRect();
      // -0.5 at one edge, +0.5 at the other.
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      // Rotating AWAY from the pointer on X and TOWARD it on Y is what reads
      // as the card leaning under a finger. Inverting either one makes it
      // feel like it is being pushed rather than followed.
      rotX(-y * intensity * 2);
      rotY(x * intensity * 2);

      // The sweep is a paint on an existing gradient, not a new element.
      outer.style.setProperty("--sweep-x", `${(x + 0.5) * 100}%`);
      outer.style.setProperty("--sweep-y", `${(y + 0.5) * 100}%`);
    };

    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    outer.addEventListener("pointermove", onMove);
    outer.addEventListener("pointerleave", onLeave);

    return () => {
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerleave", onLeave);
    };
  }, [intensity]);

  return (
    /*
      BOTH `group` NAMES, deliberately. `group/tilt` is what this component's
      own hover states hook into; the bare `group` is what shared primitives
      like `Media`'s `zoomOnHover` already expect, and a card whose photograph
      does not respond because the only group on the card was a named one is a
      bug nobody finds by reading the call site.
    */
    <div ref={wrap} className="group group/tilt [perspective:1400px]">
      <div
        ref={plane}
        className={cn(
          "relative will-change-transform [transform-style:preserve-3d]",
          className,
        )}
      >
        {children}

        {glare && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-700 ease-[var(--ease-brand)] group-hover/tilt:opacity-100"
            style={{
              /*
                `soft-light` rather than `overlay` or plain alpha. On the
                paper surfaces this system is built from, a white overlay
                blows the card out to a flat highlight; soft-light lifts what
                is already there and leaves the photograph's own values
                intact, so the sweep reads as light on a surface rather than
                as a white shape moving across it.
              */
              background:
                "radial-gradient(24rem circle at var(--sweep-x, 50%) var(--sweep-y, 50%), rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)",
              mixBlendMode: "soft-light",
            }}
          />
        )}
      </div>
    </div>
  );
}
