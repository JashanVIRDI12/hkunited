"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

/**
 * Count-up numeral.
 *
 * The final value is rendered server-side inside the element, so the
 * number is present for crawlers and screen readers even before (or
 * without) JS. The tween only rewrites textContent on the client.
 */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();
    if (prefersReducedMotion()) return;

    const state = { n: 0 };
    const format = (n: number) =>
      `${prefix}${n.toLocaleString("en-CA", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    el.textContent = format(0);

    const tween = gsap.to(state, {
      n: value,
      duration: 2,
      ease: EASE,
      onUpdate: () => {
        el.textContent = format(state.n);
      },
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = format(value);
    };
  }, [value, suffix, prefix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-CA", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
