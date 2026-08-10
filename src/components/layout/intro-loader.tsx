"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";
import { Wordmark } from "@/components/layout/wordmark";

const SEEN_KEY = "hk-intro-seen";

/**
 * Intro sequence: a load line draws across, the counter runs to 100,
 * the wordmark clears its mask, then the curtain lifts.
 *
 * Constraints that shape this component:
 *  - Shown ONCE per session (sessionStorage). An intro on every navigation
 *    is a tax on returning visitors, not a delight.
 *  - Skipped entirely under reduced motion, and skipped for anyone who has
 *    already seen it — in both cases it never mounts, so it cannot delay
 *    the hero paint.
 *  - `aria-hidden` + `inert`: the underlying page is the real content and
 *    keyboard/AT users should never be trapped behind a decorative curtain.
 *  - Fixed overlay only — it never occupies layout, so it cannot shift CLS.
 */
export function IntroLoader() {
  const [active, setActive] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  // Decide on mount, before paint, whether the intro runs at all.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    registerGsap();

    const el = root.current;
    if (!el) return;

    document.body.style.overflow = "hidden";
    const counter = { n: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SEEN_KEY, "1");
        document.body.style.overflow = "";
        setActive(false);
        window.dispatchEvent(new CustomEvent("hk:intro-complete"));
      },
    });

    tl.set(markRef.current, { yPercent: 110 })
      .to(lineRef.current, {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.inOut",
      })
      .to(
        counter,
        {
          n: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(Math.round(counter.n)).padStart(3, "0");
            }
          },
        },
        "<",
      )
      .to(markRef.current, { yPercent: 0, duration: 1, ease: EASE }, "-=0.35")
      .to({}, { duration: 0.35 })
      .to(el, {
        yPercent: -100,
        duration: 1.1,
        ease: EASE,
      });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      inert
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-paper px-[var(--spacing-gutter)] py-10"
    >
      <div className="flex justify-between">
        <span className="eyebrow">HK United Trucks</span>
        <span className="eyebrow">Mississauga · Ontario</span>
      </div>

      <div className="flex items-end justify-between gap-8">
        <div className="overflow-hidden">
          <div ref={markRef}>
            <Wordmark className="h-6 w-auto text-ink md:h-9" />
          </div>
        </div>
        <span
          ref={countRef}
          className="tabular-nums text-4xl leading-none tracking-tighter text-brand md:text-6xl"
        >
          000
        </span>
      </div>

      <span className="relative block h-px w-full bg-line">
        <span
          ref={lineRef}
          className="absolute inset-0 origin-left scale-x-0 bg-brand"
        />
      </span>
    </div>
  );
}
