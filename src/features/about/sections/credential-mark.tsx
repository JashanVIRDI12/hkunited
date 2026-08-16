"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsap,
  prefersReducedMotion,
  inViewport,
  hasEntered,
  markEntered,
} from "@/lib/motion";

/**
 * A credential abbreviation that RESOLVES rather than appears.
 *
 * "ODTA" arrives as noise and settles into letters over about a second. It is
 * the only scrambled text on the site and it is spent here on purpose: these
 * three marks are the page's one piece of third-party verification — an
 * outside body with standards the company agreed to be held to — and a
 * credential that resolves reads as something being CHECKED, which is exactly
 * what the section claims is happening.
 *
 * IT WORKS BECAUSE THE STRINGS ARE SHORT AND THE FONT IS BIG. Scrambled text
 * is unreadable while it runs, so it is only ever legitimate on something the
 * reader is not yet trying to read. A four-letter mark at 4rem qualifies; a
 * sentence would not, and a navigation label would be sabotage. There is
 * exactly one instance of this effect on the site and there should stay that
 * way — a second one turns a signature into a tic.
 *
 * THE FAILURE MODE IS THE SAFE ONE, and it is the same trick `Counter` uses.
 * The final text is server-rendered inside the element, and
 * `immediateRender: false` keeps the plugin from touching the DOM until its
 * trigger actually fires. If the trigger never fires — or JavaScript never
 * runs — the mark is simply correct. Nothing is ever scrambled that is not
 * already certain to be unscrambled.
 *
 * `chars: "upperCase"` keeps the noise in the same alphabet as the answer, so
 * the resolve reads as a signal locking rather than as a glyph soup.
 */
export function CredentialMark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();
    if (prefersReducedMotion() || hasEntered(el)) return;

    const tween = gsap.to(el, {
      duration: 1.1,
      onStart: () => markEntered(el),
      scrambleText: {
        text,
        chars: "upperCase",
        speed: 0.5,
        // Hold the real characters back until the tail of the tween, so the
        // mark spends most of its time resolving rather than already resolved.
        revealDelay: 0.35,
      },
      immediateRender: false,
      scrollTrigger: inViewport(el, -24)
        ? undefined
        : { trigger: el, start: "top 88%", once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      // Whatever happened, the mark ends up reading correctly.
      el.textContent = text;
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
