"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PRIMARY_NAV } from "@/content/site";
import { COMPANY } from "@/content/company";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import {
  gsap,
  registerGsap,
  prefersReducedMotion,
  onPageEntrance,
  hasEntered,
  markEntered,
  EASE,
  DUR,
  STAGGER,
} from "@/lib/motion";

/**
 * Site header.
 *
 * Transparent while over the hero photograph (white marks), then on scroll
 * it condenses into white glass with ink marks. Both states are driven by
 * one boolean so the colour flip and the height change stay in sync.
 *
 * The scroll listener is passive and only sets React state when the
 * boolean actually changes — not once per scroll frame.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);

  // Only the homepage has a photographic hero behind the header.
  const overHero = pathname === "/" && !scrolled && !open;

  /*
   * The header arrives first, and it arrives by DROPPING IN — which is the
   * one entrance that reads as furniture being set rather than as content
   * appearing. Its marks then settle a beat behind the bar itself, so the
   * nav is legible as a row before it is legible as links.
   *
   * `gsap.from()`, NOT a parked start state. `from()` reads the element's
   * real resting position as its end point and borrows it backwards, so the
   * header's final state is whatever the stylesheet already says it is. If
   * this effect never runs — a failed chunk, a thrown error upstream, a
   * browser that never fires the curtain's completion event — the header is
   * simply where it belongs. Parking a FIXED, z-50 navigation bar off-screen
   * and depending on a tween to bring it back would put the site's primary
   * navigation one bug away from being unreachable.
   *
   * Mounted in the root layout, so this runs once per session rather than
   * once per route change: a header that re-drops on every navigation is a
   * tax on someone reading four pages.
   */
  useEffect(() => {
    const el = bar.current;
    if (!el) return;

    registerGsap();
    // `gsap.from()` makes a repeat harmless to the final state, but a header
    // that drops in twice on every dev reload is still a header dropping in
    // twice. Mounted in the root layout, so this latches for the session.
    if (prefersReducedMotion() || hasEntered(el)) return;

    const marks = el.querySelectorAll<HTMLElement>("[data-mark]");
    const ctx = gsap.context(() => {}, el);

    const play = () =>
      ctx.add(() => {
        gsap
          .timeline({ defaults: { ease: EASE.out } })
          .from(el, {
            yPercent: -100,
            opacity: 0,
            duration: DUR.cinematic,
            ease: EASE.cine,
            onStart: () => markEntered(el),
          })
          .from(
            marks,
            { opacity: 0, y: -10, duration: DUR.reveal, stagger: STAGGER.meta },
            0.25,
          );
      });

    const cancel = onPageEntrance(play);

    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const next = window.scrollY > 32;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header
        ref={bar}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-700 ease-[var(--ease-brand)]",
          /*
            No bottom rule over the hero. The homepage hero is an INSET
            rounded card, so a full-width hairline at the header's baseline
            would cross the card, then continue over the white page frame on
            either side of it — a line to nowhere. The scrolled state keeps
            its rule, where the header is a bar over ordinary content.
          */
          overHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line bg-paper/80 backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "container-edge flex items-center justify-between transition-[height] duration-700 ease-[var(--ease-brand)]",
            scrolled ? "h-16" : "h-20 md:h-24",
          )}
        >
          <Link
            href="/"
            data-mark
            className="relative z-10 -m-2 p-2"
            aria-label={`${COMPANY.name} — home`}
          >
            {/*
              THE MARK ALONE — no lettering beside it. The logotype used to
              sit here spelling "UNITED"; the client’s mark already carries
              the brand, and the link announces the full legal name to
              assistive tech either way, so the words were doing nothing the
              logo and the `aria-label` were not already doing.

              TWO LOGOS, CROSS-FADED, RATHER THAN ONE THAT RECOLOURS. The
              header has two states — transparent over the homepage footage,
              white glass once scrolled — and the mark has to invert between
              them. Transitioning a CSS `filter` would animate a paint
              property on every frame of that 700ms change; stacking the two
              tones and moving OPACITY keeps it on the compositor, which is
              the rule the rest of this site is built on.

              It costs no extra request: both are the same `src`, so the
              browser fetches one file and paints it twice.

              The white copy is the one in flow, so it sizes the box; the
              brand copy is absolutely positioned over it.
            */}
            <span className="relative block h-7 md:h-8">
              <Logo
                priority
                tone="white"
                className={cn(
                  "transition-opacity duration-700 ease-[var(--ease-brand)]",
                  overHero ? "opacity-100" : "opacity-0",
                )}
              />
              <Logo
                priority
                tone="brand"
                className={cn(
                  "absolute left-0 top-0 h-full w-auto transition-opacity duration-700 ease-[var(--ease-brand)]",
                  overHero ? "opacity-0" : "opacity-100",
                )}
              />
            </span>
          </Link>

          <nav aria-label="Primary" data-mark className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {PRIMARY_NAV.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group/nav relative block px-4 py-2 text-sm tracking-tight transition-colors duration-500",
                        overHero
                          ? "text-white/75 hover:text-white"
                          : active
                            ? "text-ink"
                            : "text-ink-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-4 bottom-1.5 h-px origin-left transition-transform duration-500 ease-[var(--ease-brand)]",
                          overHero ? "bg-white" : "bg-brand",
                          active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100",
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div data-mark className="flex items-center gap-3">
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className={cn(
                "hidden tabular-nums text-xs tracking-widest transition-colors duration-500 md:inline-flex",
                overHero ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-ink",
              )}
            >
              {COMPANY.phone}
            </a>
            <Button
              href="/quote"
              size="sm"
              variant={overHero ? "onImage" : "brand"}
              className="hidden sm:inline-flex"
            >
              Request a Quote
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "relative z-10 -m-2 p-2 transition-colors duration-500 lg:hidden",
                overHero ? "text-white" : "text-ink",
              )}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 z-40 bg-paper lg:hidden"
      >
        <div className="container-edge flex h-full flex-col justify-between pb-12 pt-28">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {PRIMARY_NAV.map((item, i) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    className="flex items-baseline gap-5 py-5 text-3xl font-medium tracking-tight text-ink"
                  >
                    <span className="tabular-nums text-[0.625rem] text-ink-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-4">
            <Button href="/quote" variant="brand" size="lg" arrow>
              Request a Quote
            </Button>
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="tabular-nums text-sm tracking-widest text-ink-2"
            >
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
