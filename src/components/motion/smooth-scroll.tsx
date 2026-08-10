"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scroll, driven by GSAP's ticker so scroll-linked
 * timelines and the scroll position share a single clock. Running
 * Lenis on its own RAF loop causes ScrollTrigger to sample a stale
 * position and produces visible jitter in pinned sections.
 *
 * Disabled entirely under prefers-reduced-motion — hijacked scrolling
 * is itself a vestibular trigger.
 *
 * The instance lives in the root layout, so it survives App Router
 * navigations. Without an explicit reset, Next's `window.scrollTo(0)`
 * is ignored while Lenis still holds the previous page's offset —
 * new pages then open mid-scroll. `stopInertiaOnNavigate` plus a
 * pathname-driven `scrollTo(0)` put every route at the top (or at
 * its hash target when one is present).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsap();

    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      stopInertiaOnNavigate: true,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;

    // Wait a frame so the new route has committed DOM (hash targets included).
    const frame = requestAnimationFrame(() => {
      const lenis = lenisRef.current;

      if (hash) {
        const target = document.querySelector(hash);
        if (target instanceof HTMLElement) {
          if (lenis) {
            lenis.scrollTo(target, { immediate: true, force: true });
          } else {
            target.scrollIntoView();
          }
          ScrollTrigger.refresh();
          return;
        }
      }

      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <>{children}</>;
}
