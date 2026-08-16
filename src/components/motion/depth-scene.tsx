"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsap,
  motionMedia,
  inViewport,
  hasEntered,
  markEntered,
  EASE,
  DUR,
  STAGGER,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface DepthSceneProps {
  /**
   * Direct children are the cards. Each must carry `data-card`, and may carry
   * `data-depth` — a resting Z offset in px, authored per card so the grid
   * has a front and a back. Omitted means 0.
   */
  children: React.ReactNode;
  /** Grid classes. Applied to the plane that actually rotates. */
  className?: string;
}

/** Perspective distance. Larger is a longer lens — less distortion, more calm. */
const LENS = 1600;

/** Maximum scene rotation at the far edge, in degrees. */
const TILT = 6;

/** How far the hovered card comes forward. */
const LIFT = 70;

/**
 * ONE 3D SPACE, NOT SIX 3D CARDS.
 *
 * The obvious way to make a card grid three-dimensional is to give every card
 * its own perspective and let each tilt toward the pointer. This site already
 * has that component — `TiltCard`, on the services board — and doing it again
 * here would be both a repeat and, on a grid, wrong: six cards each pivoting
 * about their own centre read as six separate objects reacting independently,
 * which is a widget effect. Nothing about it says the cards share a space.
 *
 * So the perspective lives on the SECTION and the whole grid is a single
 * plane inside it. The plane rotates toward the pointer as one rigid object,
 * and the cards are set at different depths on that plane. What you get from
 * that is real inter-card parallax: the near cards traverse further than the
 * far ones because they are further from the axis, exactly as objects in a
 * shallow box do when you lean over it. The grid stops being a diagram of
 * six rectangles and becomes an arrangement you are looking INTO.
 *
 * IT IS ALSO FAR CHEAPER. Two animated properties total — the plane's
 * `rotationX` and `rotationY` — against twelve for a per-card build, and one
 * promoted compositor layer against six. The depth itself costs nothing at
 * all: resting Z is set once and never animated.
 *
 * THE NUMBERS ARE CONSTRAINED BY LEGIBILITY, NOT BY TASTE.
 *
 *  · `LENS` is 1600px — a long lens. Perspective magnifies anything it lifts
 *    by `LENS / (LENS − Z)`, so a shorter lens would make the depth spread
 *    visibly resize the cards and eat the 16px grid gap. At 1600 a card 40px
 *    forward grows 2.6%, which on a 400px card is 5px per side.
 *  · `TILT` is 6°. Past about 8° the text on the receding edge starts losing
 *    its baseline and the grid reads as a toy. The brief's instruction to
 *    avoid flashy rotation is the reason this is a lean rather than a spin:
 *    it should be felt before it is noticed.
 *  · The heading stays OUTSIDE the scene. Display type re-rasterised through
 *    a 3D transform goes soft, and a soft headline is a real cost against an
 *    effect that is meant to be subliminal.
 *
 * OFF ON TOUCH, OFF UNDER REDUCED MOTION. There is no pointer to lean toward
 * on a touchscreen, and a grid that tilts once on tap and stays there is a
 * defect. In both cases the cards render as an ordinary flat grid with a
 * plain staggered reveal, and every `translateZ` resolves to a harmless
 * fraction of a percent of scale.
 */
export function DepthScene({ children, className }: DepthSceneProps) {
  const stage = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = stage.current;
    const grid = plane.current;
    if (!box || !grid) return;

    registerGsap();

    return motionMedia(box, (c) => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", grid);
      if (!cards.length) return;

      /** Resting depth, authored per card in the markup. */
      const depthOf = (card: HTMLElement) => Number(card.dataset.depth ?? 0);

      /*
       * Each card opens its own 3D context so its CONTENTS can hold depth
       * too — a heading standing off the photograph behind it, which is what
       * makes the lean read as layers rather than as a rotated picture.
       * Without this the card flattens its subtree onto itself the moment it
       * takes a `translateZ` of its own.
       *
       * Harmless where there is no perspective: `translateZ` with no
       * perspective ancestor has no visual effect at all, so the flat
       * breakpoints simply ignore every lift in the markup.
       */
      gsap.set(cards, { transformStyle: "preserve-3d" });

      const flat = c.reduced || !c.isDesktop;

      /* ---------------- Entry ------------------------------------------
       * The cards arrive FROM BEHIND the page rather than from below it.
       * A rise-and-fade says "content loaded"; coming forward out of depth,
       * one after the next, says the arrangement is being assembled — which
       * is the whole reason this section is three-dimensional at all.
       *
       * Flat contexts get the site's ordinary card reveal instead, because
       * without perspective a `translateZ` is not a movement, it is nothing.
       */
      const from = flat
        ? { opacity: 0, y: 48, scale: 0.97 }
        : { opacity: 0, z: -280, rotationX: 8 };

      const to = flat
        ? { opacity: 1, y: 0, scale: 1 }
        : {
            opacity: 1,
            z: (i: number, t: HTMLElement) => depthOf(t),
            rotationX: 0,
          };

      const entry = c.reduced || hasEntered(box)
        ? null
        : gsap.fromTo(cards, from, {
            ...to,
            duration: DUR.cinematic,
            stagger: STAGGER.cards,
            ease: EASE.deep,
            onStart: () => markEntered(box),
            scrollTrigger: inViewport(box, -40)
              ? undefined
              : { trigger: box, start: "top 80%", once: true },
          });

      /** Resolve the cards to their resting state, whatever happened. */
      const settle = () =>
        cards.forEach((card) =>
          gsap.set(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            z: flat ? 0 : depthOf(card),
          }),
        );

      if (c.reduced) settle();

      /*
       * The watchdog, scoped to the one failure that matters: a grid on
       * screen that never revealed. Below the fold and unrevealed is
       * correct; in the viewport and unrevealed is a trigger that
       * mis-measured against a layout that moved under it.
       */
      const watchdog = window.setTimeout(() => {
        if (!entry || entry.isActive() || entry.progress() > 0) return;
        if (!inViewport(box)) return;
        // Killed, not merely overwritten: a resolved grid with a live trigger
        // still aimed at it replays the whole entrance when that trigger fires.
        entry.scrollTrigger?.kill();
        entry.kill();
        settle();
      }, 3000);

      const stopWatchdog = () => window.clearTimeout(watchdog);

      if (flat || !window.matchMedia("(pointer: fine)").matches) {
        return stopWatchdog;
      }

      /* ---------------- The lean ---------------------------------------
       * `quickTo` rather than a tween per event: this fires on every pointer
       * frame, and creating a tween each time is the case the performance
       * guidance names explicitly. One reusable tween per axis, retargeted.
       */
      gsap.set(grid, { willChange: "transform" });

      const rotX = gsap.quickTo(grid, "rotationX", {
        duration: 0.9,
        ease: "power3.out",
      });
      const rotY = gsap.quickTo(grid, "rotationY", {
        duration: 0.9,
        ease: "power3.out",
      });

      const onMove = (event: PointerEvent) => {
        const b = box.getBoundingClientRect();
        // −0.5 at one edge, +0.5 at the other.
        const x = (event.clientX - b.left) / b.width - 0.5;
        const y = (event.clientY - b.top) / b.height - 0.5;

        // Away from the pointer on X and toward it on Y is what reads as a
        // surface leaning under a hand. Invert either and it feels pushed.
        rotX(-y * TILT * 2);
        rotY(x * TILT * 2);
      };

      const onLeave = () => {
        rotX(0);
        rotY(0);
      };

      /* ---------------- Card focus -------------------------------------
       * The card under the pointer comes forward; the rest fall back a
       * little and dim. It is the same active/inactive grammar the fleet
       * track uses, expressed in depth instead of in width — which is what
       * keeps the two sections from reading as the same device twice.
       *
       * Delegated: one listener for the whole grid rather than one per card,
       * and it keeps working if the card list ever changes.
       */
      const focus = (target: HTMLElement | null) => {
        cards.forEach((card) => {
          const on = card === target;
          gsap.to(card, {
            z: depthOf(card) + (on ? LIFT : target ? -10 : 0),
            opacity: !target || on ? 1 : 0.86,
            duration: DUR.micro + 0.15,
            ease: EASE.out,
            overwrite: "auto",
          });
        });
      };

      const onOver = (event: PointerEvent) =>
        focus(
          (event.target as HTMLElement | null)?.closest<HTMLElement>(
            "[data-card]",
          ) ?? null,
        );

      const onOut = () => focus(null);

      box.addEventListener("pointermove", onMove);
      box.addEventListener("pointerleave", onLeave);
      grid.addEventListener("pointerover", onOver);
      grid.addEventListener("pointerleave", onOut);

      return () => {
        stopWatchdog();
        box.removeEventListener("pointermove", onMove);
        box.removeEventListener("pointerleave", onLeave);
        grid.removeEventListener("pointerover", onOver);
        grid.removeEventListener("pointerleave", onOut);
      };
    });
  }, []);

  return (
    <div ref={stage} style={{ perspective: `${LENS}px` }}>
      {/*
        `preserve-3d` is what lets the children hold their own Z inside the
        plane's rotation. Without it the browser flattens them onto the plane
        and the whole arrangement collapses to a rotated picture of a grid.

        NOTE FOR CALL SITES: an element with `overflow: hidden` flattens its
        own subtree. A card may be clipped, and anything inside a clipped card
        simply has no depth of its own — put layers that need depth beside the
        clipped frame, not within it.
      */}
      <div
        ref={plane}
        className={cn("[transform-style:preserve-3d]", className)}
      >
        {children}
      </div>
    </div>
  );
}
