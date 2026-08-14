"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, motionMedia, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionTransitionProps {
  children: React.ReactNode;
  /** Surface classes for the band itself — e.g. `bg-ink`. */
  className?: string;
  /**
   * The colour of the page on either side of this band, as a Tailwind class.
   * The veil is painted in it, so the dissolve resolves to exactly the
   * surface above and below rather than to an approximation of it.
   */
  veilClassName?: string;
  id?: string;
  labelledBy?: string;
}

/**
 * A DARK BAND THAT DISSOLVES IN AND OUT INSTEAD OF BEING CUT TO.
 *
 * The homepage runs one dark full-bleed section between two white ones. Left
 * alone that is two hard horizontal cuts, and a hard cut is the single thing
 * that most reliably breaks the illusion that a page is one continuous piece
 * — it announces "new section" the way a slide change does.
 *
 * WHAT ACTUALLY HAPPENS, in scroll order:
 *
 *     band enters    a paper-coloured veil over the band fades out, so the
 *                    surface darkens INTO the dark rather than switching
 *     content in     the copy resolves once the surface is dark enough to
 *                    hold white type
 *     band leaves    the copy exits UPWARD and fades — the large typography
 *                    leaves before the surface does
 *     veil returns   the band lightens back to paper as it clears the top,
 *                    so the section that follows is already arriving on a
 *                    white surface before this one has finished leaving
 *
 * The content leads the surface on the way out and trails it on the way in.
 * That ordering is the whole effect: white type on a lightening background
 * would be illegible for the length of the transition, and the two crossing
 * in the wrong order is exactly how this reads as a bug rather than a
 * dissolve.
 *
 * IT IS A VEIL, NOT AN ANIMATED `background-color`. Interpolating the
 * background of a full-bleed band means repainting a full viewport of pixels
 * on every scroll frame. An opacity crossfade between two stacked surfaces
 * composites, so the whole transition runs on the compositor and costs
 * nothing per frame. This is the same reason the site's word-by-word text
 * effect animates opacity rather than colour.
 *
 * SCRUBBED TRIGGERS ARE SELF-CORRECTING, and that is why this pattern is
 * safe on a site that has twice shipped invisible content. A `once: true`
 * reveal that fails to fire leaves its target hidden forever. A scrubbed
 * tween is evaluated against scroll POSITION on every refresh, so a section
 * sitting in the middle of the viewport is at the progress that implies —
 * fully resolved — whether or not anything fired on the way there. Land on
 * this section from a deep link and it is simply correct.
 *
 * MOBILE GETS THE BAND AND NOT THE DISSOLVE. On a phone the whole transition
 * happens in a few hundred milliseconds of thumb-scroll, where a section
 * that briefly holds no copy reads as a loading failure rather than as
 * cinema. The exit drift stays, at half distance, because that one still
 * reads at speed.
 */
export function SectionTransition({
  children,
  className,
  veilClassName = "bg-paper",
  id,
  labelledBy,
}: SectionTransitionProps) {
  const root = useRef<HTMLElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const sheet = veil.current;
    const body = content.current;
    if (!section || !sheet || !body) return;

    registerGsap();

    return motionMedia(section, (c) => {
      if (c.reduced) {
        gsap.set(sheet, { opacity: 0 });
        gsap.set(body, { opacity: 1, y: 0 });
        return;
      }

      /*
       * THE EXIT DRIFT RUNS EVERYWHERE. Large typography leaving upward as
       * its section clears is the part of this that reads at any speed and
       * on any device — it is the section handing off rather than vanishing.
       */
      gsap.fromTo(
        body,
        { y: 0 },
        {
          y: c.isMobile ? -40 : -90,
          ease: EASE.none,
          scrollTrigger: {
            trigger: section,
            start: "bottom 75%",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      if (c.isMobile) {
        gsap.set(sheet, { opacity: 0 });
        gsap.set(body, { opacity: 1 });
        return;
      }

      // --- Entering: surface darkens first, copy resolves after ----------
      gsap.fromTo(
        sheet,
        { opacity: 1 },
        {
          opacity: 0,
          ease: EASE.none,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 45%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        body,
        { opacity: 0 },
        {
          opacity: 1,
          ease: EASE.none,
          scrollTrigger: {
            trigger: section,
            // Deliberately behind the veil's range: the copy only starts
            // resolving once the surface is most of the way to dark.
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          },
        },
      );

      // --- Leaving: copy goes first, surface follows ---------------------
      gsap.fromTo(
        body,
        { opacity: 1 },
        {
          opacity: 0,
          immediateRender: false,
          ease: EASE.none,
          scrollTrigger: {
            trigger: section,
            start: "bottom 70%",
            end: "bottom 25%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        sheet,
        { opacity: 0 },
        {
          opacity: 1,
          immediateRender: false,
          ease: EASE.none,
          scrollTrigger: {
            trigger: section,
            start: "bottom 55%",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  }, []);

  return (
    <section
      ref={root}
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative isolate", className)}
    >
      {/*
        `isolate` on the section and explicit z-indices here: the veil has to
        sit above the band's own background and below its copy, and without a
        stacking context of its own it would compete with whatever the page
        around it happens to be doing.
      */}
      <div
        ref={veil}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-0", veilClassName)}
      />
      <div ref={content} className="relative z-10">
        {children}
      </div>
    </section>
  );
}
