"use client";

import * as React from "react";
import NextImage from "next/image";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import type { ImageAsset, VideoAsset } from "@/content/imagery";
import { VideoMedia } from "@/components/ui/video-media";
import { cn } from "@/lib/utils";

/**
 * Smooth-scroll hero — a sticky frame whose clip-path opens as you scroll.
 *
 * ADAPTED FROM THE SUPPLIED COMPONENT. The prop API is unchanged, but four
 * things were altered to meet this project's standards:
 *
 * 1. `motion/react` instead of `framer-motion`. Same library — it was
 *    renamed at v11 — and `motion@12` is already a dependency. Adding
 *    `framer-motion` would install a second copy of the same code.
 *
 * 2. `next/image` instead of CSS `background-image`. Background images skip
 *    the whole optimisation pipeline: no AVIF/WebP negotiation, no srcset,
 *    no lazy loading, no blur placeholder, and no reserved box (so they can
 *    shift layout). The originals were also raw Unsplash URLs, which would
 *    add a third-party origin to the critical path.
 *
 * 3. Scroll drives `scale`, not `background-size`. Animating background-size
 *    repaints the element every frame; scale is compositor-only. Identical
 *    visual, ~free instead of costly.
 *
 * 4. Honours `prefers-reduced-motion` by rendering the final, fully-open
 *    state — the content stays visible rather than being animated or hidden.
 *
 * 5. Progress is measured against THIS SECTION, not the document. The
 *    original read raw `scrollY` over `[0, scrollHeight]`, which only works
 *    if the component is the first thing on the page. Anywhere below the
 *    fold the ramp has already run to completion before the section is
 *    reached, leaving a tall sticky block in its final state that does not
 *    respond to scroll — the page reads as frozen. `useScroll({ target })`
 *    with a `start start → end end` offset ties the animation to exactly
 *    the window in which the frame is pinned.
 */

/**
 * Fraction of the pinned runway spent opening the frame. The remainder
 * plays out fully open, which is what gives the band its held final beat;
 * the plate keeps settling across the whole runway so the two do not land
 * on the same frame.
 */
const CLIP_COMPLETE_AT = 0.72;

/**
 * Parallax travel for the plate, in each direction, as a percentage of the
 * frame. The frame is pinned while this runs, so the plate drifting against
 * a stationary window is the whole depth cue.
 */
const PARALLAX = 6;

/**
 * Where the plate's scale settles. NOT 1: the plate has to stay larger than
 * the frame by at least `PARALLAX`% per side or the drift exposes the frame
 * behind it, and a plate scaled by `s` overhangs by `(s-1)/2`. 1.14 clears
 * the 1.12 minimum with a margin for sub-pixel rounding.
 */
const SCALE_END = 1.14;

interface SmoothScrollHeroProps {
  /**
   * Extra scroll added below the frame, in px — the distance it stays
   * pinned, and so the runway the animation is spread across. @default 1500
   */
  scrollHeight?: number;
  /** Desktop plate (md and up). Also the poster when `desktopVideo` is set. */
  desktopImage: ImageAsset;
  /**
   * Optional loop for the desktop plate. `VideoMedia` keeps the still as the
   * painted layer and only fades the clip in once it is genuinely playing, so
   * this never delays the plate — see that component for the full policy.
   * Mobile deliberately stays on the still: a portrait crop is the wrong
   * frame for these landscape clips, and it is the wrong place to spend
   * someone's data.
   */
  desktopVideo?: VideoAsset;
  /** Mobile plate. Falls back to `desktopImage` when omitted. */
  mobileImage?: ImageAsset;
  /** Clip inset at rest, as a percentage. @default 25 */
  initialClipPercentage?: number;
  /** Clip inset when fully open, as a percentage. @default 75 */
  finalClipPercentage?: number;
  /** Overlay content, pinned within the sticky frame. */
  children?: React.ReactNode;
  className?: string;
  /** Set only if this is the LCP element. */
  priority?: boolean;
}

function Background({
  target,
  desktopImage,
  desktopVideo,
  mobileImage,
  initialClipPercentage,
  finalClipPercentage,
  children,
  priority,
}: Required<
  Pick<
    SmoothScrollHeroProps,
    "desktopImage" | "initialClipPercentage" | "finalClipPercentage"
  >
> &
  Pick<
    SmoothScrollHeroProps,
    "desktopVideo" | "mobileImage" | "children" | "priority"
  > & {
    /** The outer spacer. Its scroll range IS the pinned window. */
    target: React.RefObject<HTMLDivElement | null>;
  }) {
  const reduced = useReducedMotion();

  // `start start` = the spacer's top meets the viewport top, the moment the
  // frame pins. `end end` = its bottom meets the viewport bottom, the moment
  // it unpins. Between them the frame is stationary on screen, so this is
  // precisely the scroll the animation has to fill.
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  const clipStart = useTransform(
    scrollYProgress,
    [0, CLIP_COMPLETE_AT],
    [initialClipPercentage, 0],
  );
  const clipEnd = useTransform(
    scrollYProgress,
    [0, CLIP_COMPLETE_AT],
    [finalClipPercentage, 100],
  );
  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  // Compositor-friendly stand-in for the original background-size ramp.
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, SCALE_END]);
  // Depth: the plate drifts down while the frame holds still.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-PARALLAX}%`, `${PARALLAX}%`],
  );

  const plate = reduced ? undefined : { scale, y, willChange: "transform" };

  const mobile = mobileImage ?? desktopImage;

  return (
    <motion.div
      className="sticky top-0 h-svh w-full overflow-hidden bg-scrim"
      style={reduced ? undefined : { clipPath, willChange: "clip-path" }}
    >
      <motion.div
        className="absolute inset-0 md:hidden"
        style={plate}
      >
        <NextImage
          src={mobile.src}
          alt={mobile.alt}
          fill
          sizes="100vw"
          quality={90}
          priority={priority}
          placeholder="blur"
          blurDataURL={mobile.blurDataURL}
          className="object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 hidden md:block"
        style={plate}
      >
        {desktopVideo ? (
          <VideoMedia
            src={desktopVideo.src}
            poster={desktopVideo.poster}
            ratio="auto"
            className="h-full w-full"
            sizes="100vw"
            priority={priority}
          />
        ) : (
          <NextImage
            src={desktopImage.src}
            alt={desktopImage.alt}
            fill
            sizes="100vw"
            quality={90}
            priority={priority}
            placeholder="blur"
            blurDataURL={desktopImage.blurDataURL}
            className="object-cover"
          />
        )}
      </motion.div>

      {children}
    </motion.div>
  );
}

export function SmoothScrollHero({
  scrollHeight = 1500,
  desktopImage,
  desktopVideo,
  mobileImage,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  children,
  className,
  priority = false,
}: SmoothScrollHeroProps) {
  const spacer = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={spacer}
      style={{ height: `calc(${scrollHeight}px + 100svh)` }}
      className={cn("relative w-full", className)}
    >
      <Background
        target={spacer}
        desktopImage={desktopImage}
        desktopVideo={desktopVideo}
        mobileImage={mobileImage}
        initialClipPercentage={initialClipPercentage}
        finalClipPercentage={finalClipPercentage}
        priority={priority}
      >
        {children}
      </Background>
    </div>
  );
}

export default SmoothScrollHero;
