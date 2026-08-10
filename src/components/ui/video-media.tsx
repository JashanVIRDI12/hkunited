"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import type { ImageAsset } from "@/content/imagery";
import { cn } from "@/lib/utils";

interface VideoMediaProps {
  /** Poster still. Also the LCP candidate — always rendered. */
  poster: ImageAsset;
  /** Path under /public, e.g. "/video/hero-convoy.mp4". */
  src: string;
  className?: string;
  ratio?: string;
  /** Set only for the LCP block. Applies to the POSTER, never the video. */
  priority?: boolean;
  sizes?: string;
  scrim?: "none" | "soft" | "strong" | "bottom";
  /**
   * Corner softness. Defaults to `none` because both call sites are
   * full-bleed — see `Media` for the reasoning.
   */
  radius?: "none" | "soft" | "plate" | "panel";
  children?: React.ReactNode;
}

const SCRIM = {
  none: "",
  soft: "bg-scrim/30",
  strong: "bg-scrim/55",
  bottom: "bg-gradient-to-t from-scrim/85 via-scrim/35 to-transparent",
} as const;

/* Mirrors `Media`'s map, duplicated for the same reason SCRIM is: this is
   a client component, and importing from the server module would drag it
   across the boundary for four strings. */
const RADIUS = {
  none: "",
  soft: "rounded-soft",
  plate: "rounded-plate",
  panel: "rounded-panel",
} as const;

/**
 * Background video with a poster-first strategy.
 *
 * The poster image is ALWAYS rendered and is what the browser measures as
 * the LCP element. The video is never part of the critical path: it is
 * fetched only when the block is near the viewport, and fades in over the
 * poster once it is genuinely playing. A hero that waits on a 1MB video
 * before painting is a slow hero, however good the footage.
 *
 * It stays on the poster entirely when:
 *   · `prefers-reduced-motion` is set — looping footage is exactly the kind
 *     of continuous motion that setting exists to stop;
 *   · the connection reports Save-Data or 2g/3g — background video is
 *     decoration, and decoration should not cost someone their data.
 *
 * Playback is also paused while scrolled away, so an off-screen loop never
 * burns battery decoding frames nobody is looking at.
 */
export function VideoMedia({
  poster,
  src,
  className,
  ratio = "16/9",
  priority = false,
  sizes = "100vw",
  scrim = "none",
  radius = "none",
  children,
}: VideoMediaProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  // Decide once whether video is appropriate at all.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType)) return;

    const el = wrap.current;
    if (!el) return;

    // Only mount the <video> once the block is close to the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drive playback, and pause while off-screen.
  useEffect(() => {
    if (!enabled) return;
    const el = wrap.current;
    const v = video.current;
    if (!el || !v) return;

    /*
     * React sets `muted` as a DOM property and never emits the attribute.
     * The autoplay policy is evaluated against the element at the instant
     * `play()` is called, so asserting it here — rather than trusting the
     * JSX prop to have landed — is the difference between a muted autoplay
     * that is always permitted and a silent `NotAllowedError`.
     */
    v.muted = true;

    /*
     * Any evidence that a frame is on screen reveals the element. `playing`
     * alone is not enough: it can fire before React has attached its
     * handler, and when it does the clip plays underneath the poster at
     * opacity 0 forever — the bandwidth is spent and nothing is shown.
     */
    const show = () => setReady(true);
    if (v.readyState >= 2 && !v.paused) show();
    v.addEventListener("playing", show);
    v.addEventListener("timeupdate", show, { once: true });

    const attempt = () => {
      const started = v.play();
      // Older signatures return undefined rather than a promise.
      if (!started) return;
      started.catch((error: unknown) => {
        // Never swallow this. A rejected play is indistinguishable from a
        // decorative still, which is precisely how it goes unnoticed.
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[VideoMedia] playback rejected for ${src}:`, error);
        }
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) attempt();
        else v.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      v.removeEventListener("playing", show);
      v.removeEventListener("timeupdate", show);
    };
  }, [enabled, src]);

  return (
    <div
      ref={wrap}
      className={cn(
        "relative overflow-hidden bg-paper-sunk",
        RADIUS[radius],
        className,
      )}
      style={ratio === "auto" ? undefined : { aspectRatio: ratio }}
    >
      <NextImage
        src={poster.src}
        alt={poster.alt}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        quality={90}
        placeholder="blur"
        blurDataURL={poster.blurDataURL}
        className="object-cover"
      />

      {enabled && (
        <video
          ref={video}
          // The poster still is already painted underneath, and the video is
          // decorative — describing it twice would just be noise for AT.
          aria-hidden="true"
          /*
           * `muted` + `playsInline` + `autoPlay` is the one combination every
           * browser permits without a gesture. Autoplay costs nothing here
           * because the element does not exist until it is within 400px of
           * the viewport — the laziness lives in that gate, not in `preload`.
           * `preload="none"` only added a load round-trip before the first
           * frame could appear, and made playback depend entirely on the
           * programmatic path below.
           */
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          // A plain `src` rather than a <source> child: there is one encoding,
          // so the resource-selection dance bought nothing.
          src={src}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-[var(--ease-brand)]",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {scrim !== "none" && (
        <div
          className={cn("pointer-events-none absolute inset-0", SCRIM[scrim])}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
