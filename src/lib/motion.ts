/**
 * MOTION FOUNDATION
 *
 * Every animation on this site is built from the tokens in this file. The
 * point is not tidiness — it is that a page whose motion comes from one
 * vocabulary reads as a single continuous piece, and a page whose motion is
 * authored per-component reads as a template with effects bolted on.
 *
 * FOUR RULES, ENFORCED HERE RATHER THAN REMEMBERED AT EACH CALL SITE.
 *
 * 1. MASS DETERMINES SPEED. Large display type is the slowest thing on the
 *    page; supporting copy and controls move faster and arrive after it.
 *    That single relationship is what makes motion read as physical rather
 *    than as a set of simultaneous fades. It is encoded in `DUR` and in the
 *    ordering conventions each timeline follows, not left to taste.
 *
 * 2. ONLY COMPOSITOR PROPERTIES. `transform`, `opacity` and `clip-path`.
 *    Nothing here animates width, height, top, left or box-shadow, so no
 *    timeline can force layout or a full-page repaint mid-scroll.
 *
 * 3. REDUCED MOTION RESOLVES, IT DOES NOT DISABLE. A disabled reveal strands
 *    content at `opacity: 0` — invisible, and a far worse failure than the
 *    motion it was avoiding. Every helper here has an explicit reduced path
 *    that sets the FINAL state synchronously.
 *
 * 4. NOTHING IS PARKED THAT CANNOT BE UNPARKED. Anything hidden before its
 *    animation runs is hidden by JavaScript, at the moment the code that
 *    will reveal it is known to exist — never by a class in the markup. This
 *    codebase has shipped an invisible headline twice by parking in markup
 *    and betting on a trigger; `safeReveal` below exists so that bet is never
 *    made again.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/**
 * Idempotent plugin registration.
 *
 * SplitText ships in the public `gsap` package under the standard licence
 * from 3.13 onward, so it is used directly rather than hand-rolling a
 * splitter. It is the only splitting mechanism on the site.
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  ScrollTrigger.config({ ignoreMobileResize: true });

  // The house default. Individual timelines override where the brief calls
  // for a longer tail, but an un-eased tween should never happen by accident.
  gsap.defaults({ ease: "power3.out", duration: 0.8 });

  registered = true;
}

/* ============================================================
   EASES
   Four curves, each with a job. Adding a fifth requires a
   reason that cannot be met by these.
   ============================================================ */

export const EASE = {
  /**
   * The workhorse. Supporting copy, controls, metadata — anything that
   * arrives AFTER the display type and should feel lighter than it.
   */
  out: "power3.out",

  /**
   * The heavy one. Display typography, cards, anything with visual mass.
   * A longer deceleration reads as weight rather than as slowness.
   */
  deep: "power4.out",

  /**
   * The cinematic tail. Clip wipes and full-section transitions, where the
   * last 15% of the travel should be almost imperceptible — which is what
   * separates an expensive-feeling reveal from a fast one.
   */
  cine: "expo.out",

  /**
   * SCRUBBED TWEENS ONLY, AND ALWAYS. A scroll-linked animation is driven by
   * wheel position; any ease decouples the element from the reader's own
   * hand and the effect immediately reads as lag rather than as depth.
   */
  none: "none",
} as const;

/* ============================================================
   DURATIONS
   The four bands from the motion brief. Values are the middle
   of each band, so a call site can nudge in either direction
   without leaving it.
   ============================================================ */

export const DUR = {
  /** 0.25–0.45 — hovers, arrow nudges, state flips. */
  micro: 0.35,
  /** 0.6–1 — ordinary scroll reveals. The default for content. */
  reveal: 0.85,
  /** 1–1.5 — display typography, image wipes, the hero. */
  cinematic: 1.25,
  /** 1–2 — whole-section transitions and pinned handoffs. */
  section: 1.6,
} as const;

/**
 * Stagger bands. Kept small on purpose: past roughly 0.15s per item the
 * group stops reading as one gesture and becomes a queue.
 */
export const STAGGER = {
  /** Lines of a split headline. Editorial film-title cadence. */
  lines: 0.085,
  /** Cards in a grid or track. */
  cards: 0.1,
  /** Eyebrow, lead, controls — the light stuff trailing a headline. */
  meta: 0.06,
} as const;

/** Standard scroll-in point. Late enough that the reveal is seen starting. */
export const START = "top 85%" as const;

/* ============================================================
   BREAKPOINTS & CONDITIONS
   ============================================================ */

export const MQ = {
  desktop: "(min-width: 64rem)",
  tablet: "(min-width: 48rem) and (max-width: 63.999rem)",
  mobile: "(max-width: 47.999rem)",
  /** Width AND height — pinning needs a viewport tall enough to pin into. */
  pinnable: "(min-width: 64rem) and (min-height: 40rem)",
  fine: "(pointer: fine)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export interface MotionConditions {
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  /** Wide AND tall enough to pin a section without clipping its own foot. */
  canPin: boolean;
  reduced: boolean;
}

/**
 * The standard responsive + accessibility wrapper.
 *
 * `gsap.matchMedia()` is used rather than a bare effect for one reason that
 * matters more than convenience: everything created inside the handler is
 * REVERTED automatically when the query stops matching. A visitor who
 * rotates a tablet or drags a window past a breakpoint gets the other
 * breakpoint's motion cleanly, with no orphaned ScrollTriggers holding pin
 * spacers open — which is the single most common way a scroll page breaks.
 *
 * `scope` makes selector strings inside the handler resolve against that
 * element instead of the document, so two instances of the same component
 * cannot animate each other's children.
 *
 * Returns the teardown. ALWAYS return it from the effect.
 */
export function motionMedia(
  scope: Element | null,
  /**
   * May return a teardown for anything GSAP does not own — timeouts,
   * attributes, React state. Anything GSAP DOES own (tweens, ScrollTriggers)
   * is reverted by matchMedia itself and needs no cleanup here.
   */
  handler: (
    conditions: MotionConditions,
    context: gsap.Context,
  ) => void | (() => void),
): () => void {
  registerGsap();

  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: MQ.desktop,
      isTablet: MQ.tablet,
      isMobile: MQ.mobile,
      canPin: MQ.pinnable,
      reduced: MQ.reduce,
    },
    (context) => {
      const c = context.conditions as unknown as MotionConditions;
      // RETURNED, not called and discarded. matchMedia treats a returned
      // function as the teardown for that branch and runs it when the query
      // stops matching; dropping it here would silently strand every
      // non-GSAP cleanup in every caller.
      return handler(c, context);
    },
    scope ?? undefined,
  );

  return () => mm.revert();
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MQ.reduce).matches;
}

/* ============================================================
   TRIGGER SAFETY
   ============================================================ */

/** Is any part of the element inside the viewport right now? */
export function inViewport(el: Element, slack = 0): boolean {
  const r = el.getBoundingClientRect();
  const h = window.innerHeight || document.documentElement.clientHeight;
  return r.top < h + slack && r.bottom > -slack;
}

/**
 * THE FOLD-SAFE REVEAL, and the reason it exists is written into this
 * codebase's history.
 *
 * A reveal has two halves: hide, then show on a trigger. The failure mode is
 * that the hide always works and the show is conditional — so anything whose
 * trigger does not fire is left permanently invisible. On elements sitting
 * ON the fold that is not a theoretical risk: the trigger's start point is
 * ambiguous at first paint, Lenis has not yet reported a position, and fonts
 * are still swapping the layout underneath it. The stat row on the homepage
 * shipped four empty cards this way, and was stripped of motion entirely as
 * the fix.
 *
 * `safeReveal` closes it from both ends:
 *
 *  · Nothing is parked in the MARKUP. The start state is applied here, in
 *    the same statement that schedules the reveal, so the two cannot become
 *    separated by a build, a bail-out or an early return.
 *  · If the target is ALREADY in view when this runs, it plays immediately
 *    instead of waiting to be scrolled to — which is exactly the case a
 *    fold-straddling trigger gets wrong.
 *  · A watchdog resolves the element to its final state if neither path has
 *    fired by the time the page has certainly settled. Motion is a bonus;
 *    legibility is not.
 */
export function safeReveal(
  targets: gsap.DOMTarget,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  options: {
    trigger?: Element | null;
    start?: string;
    /** Milliseconds before the watchdog force-resolves. */
    failsafe?: number;
  } = {},
): () => void {
  registerGsap();

  const els = gsap.utils.toArray<HTMLElement>(targets);
  if (!els.length) return () => {};

  const { trigger, start = START, failsafe = 2600 } = options;
  const resolved: gsap.TweenVars = { ...to };
  delete resolved.duration;
  delete resolved.stagger;
  delete resolved.delay;
  delete resolved.ease;

  if (prefersReducedMotion()) {
    gsap.set(els, resolved);
    return () => {};
  }

  const root = trigger ?? els[0];
  let done = false;

  const tween = gsap.fromTo(els, from, {
    ...to,
    onStart: () => {
      done = true;
    },
    scrollTrigger: inViewport(root, -40)
      ? undefined
      : { trigger: root, start, once: true },
  });

  const watchdog = window.setTimeout(() => {
    if (!done && !tween.isActive()) gsap.set(els, resolved);
  }, failsafe);

  return () => {
    window.clearTimeout(watchdog);
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/* ============================================================
   THE FOUR REVEAL PRIMITIVES
   ============================================================ */

/**
 * Content reveal — the ordinary one, for prose and small blocks.
 * Rises and fades. No scale: a paragraph that grows reads as a zoom.
 */
export function revealOnScroll(
  targets: gsap.DOMTarget,
  options: {
    trigger?: Element | null;
    y?: number;
    stagger?: number;
    start?: string;
    duration?: number;
    delay?: number;
  } = {},
): () => void {
  const {
    trigger,
    y = 28,
    stagger = STAGGER.meta,
    start = START,
    duration = DUR.reveal,
    delay = 0,
  } = options;

  return safeReveal(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, stagger, ease: EASE.out },
    { trigger, start },
  );
}

/**
 * Card reveal — rise, fade AND settle from slightly under size.
 *
 * The 0.97 is the whole difference between a card that appears and a card
 * that ARRIVES. Three percent is far too small to read as a zoom; what it
 * reads as is the card coming to rest, because a real object decelerating
 * toward you resolves its size at the same moment it resolves its position.
 * Larger values break the illusion in the other direction.
 */
export function revealCards(
  targets: gsap.DOMTarget,
  options: {
    trigger?: Element | null;
    y?: number;
    stagger?: number;
    start?: string;
    duration?: number;
    delay?: number;
  } = {},
): () => void {
  const {
    trigger,
    y = 60,
    stagger = STAGGER.cards,
    start = START,
    duration = DUR.reveal + 0.15,
    delay = 0,
  } = options;

  return safeReveal(
    targets,
    { opacity: 0, y, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger,
      ease: EASE.deep,
      // Transforms are cleared so hover states own the element afterwards.
      // A retained `scale(1)` composes with a CSS hover scale and the card
      // ends up at the product of the two.
      clearProps: "scale",
    },
    { trigger, start },
  );
}

/* ============================================================
   SPLIT TYPOGRAPHY
   ============================================================ */

/**
 * Line-split a headline and reveal it line by line, out of a mask.
 *
 * WHY SPLITTEXT RATHER THAN HAND-BROKEN LINES. Where a display headline
 * breaks is genuinely a design decision at the largest tiers — and for those
 * the site still hands the lines in by hand. But for the twenty-odd section
 * headings that reflow between one and three lines depending on viewport,
 * the break is a MEASUREMENT, and measuring it in the browser is the only
 * way the mask lands on the real line box at every width.
 *
 * `mask: "lines"` has SplitText build the overflow-hidden wrapper per line,
 * which is what the effect needs and what is fiddly to get right by hand:
 * the site's own `MaskLines` carries a long comment about descenders being
 * shaved by a too-tight line box, and the plugin's wrapper does not have
 * that problem.
 *
 * `autoSplit: true` re-splits on font load and on resize. That matters here
 * specifically — this site loads Instrument Serif with `display: swap`, so
 * every headline's line breaks change once after first paint. Without it,
 * masks measured against Georgia stay measured against Georgia.
 *
 * `aria: "auto"` puts an `aria-label` carrying the original string on the
 * element and hides the generated line spans, so the headline is announced
 * once, intact, exactly as it reads. This is why no `sr-only` duplicate is
 * needed — the plugin handles the contract that `MaskLines` handled by hand.
 *
 * The element is NOT parked in markup: it renders as ordinary text, and the
 * split plus the start state are applied together in `onSplit`. If this code
 * never runs the headline is simply a headline.
 */
export function revealLines(
  el: HTMLElement,
  options: {
    trigger?: Element | null;
    start?: string;
    duration?: number;
    stagger?: number;
    delay?: number;
    /** Play immediately instead of on scroll — for above-the-fold headings. */
    immediate?: boolean;
  } = {},
): () => void {
  registerGsap();

  const {
    trigger,
    start = START,
    duration = DUR.cinematic,
    stagger = STAGGER.lines,
    delay = 0,
    immediate = false,
  } = options;

  if (prefersReducedMotion()) return () => {};

  let tween: gsap.core.Tween | undefined;

  const split = SplitText.create(el, {
    type: "lines",
    mask: "lines",
    aria: "auto",
    autoSplit: true,
    linesClass: "reveal-line",
    onSplit: (self) => {
      /*
       * The previous pass's ScrollTrigger is killed by hand, and it has to
       * be. SplitText kills the tween it was handed before re-splitting, but
       * a ScrollTrigger is a separate object registered with the global
       * scroll system — it outlives its tween. `autoSplit` re-splits on every
       * resize AND once more when the display webfont swaps, so without this
       * a visitor who drags a window across a few widths accumulates a
       * ScrollTrigger per width, each still measuring against line elements
       * that no longer exist.
       */
      tween?.scrollTrigger?.kill();

      // Returning the tween hands it to SplitText, which kills it before a
      // re-split — without that, the outgoing tween goes on writing
      // transforms to detached line elements.
      tween = gsap.fromTo(
        self.lines,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          stagger,
          delay,
          ease: EASE.deep,
          scrollTrigger:
            immediate || inViewport(trigger ?? el, -40)
              ? undefined
              : { trigger: trigger ?? el, start, once: true },
        },
      );
      return tween;
    },
  });

  return () => {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    split.revert();
  };
}

/* ============================================================
   PAGE ENTRANCE ORCHESTRATION
   ============================================================ */

/** Mirrors `IntroLoader`'s own key. One session, one curtain. */
const INTRO_KEY = "hk-intro-seen";

export const INTRO_DONE = "hk:intro-complete";

/** Will the intro curtain cover this particular load? */
export function introWillRun(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    // Private-mode Safari throws on sessionStorage. No curtain, no wait.
    return false;
  }
}

/**
 * Run a page-entrance timeline at the moment the page is actually SEEN.
 *
 * Without this the hero opens underneath the intro curtain and is already
 * finished by the time the curtain lifts — the most expensive animation on
 * the site, played to nobody, followed by a static page. The visitor's first
 * impression is a still image that they have to scroll to make move.
 *
 * The failsafe is the important half: if the curtain's timeline throws, or
 * its completion event is missed because this component mounted a frame
 * late, the entrance still runs. Motion waiting on an event that never
 * arrives is how a page ends up permanently blank.
 */
export function onPageEntrance(run: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (!introWillRun()) {
    run();
    return () => {};
  }

  let fired = false;
  const once = () => {
    if (fired) return;
    fired = true;
    run();
  };

  window.addEventListener(INTRO_DONE, once, { once: true });
  const failsafe = window.setTimeout(once, 5200);

  return () => {
    window.removeEventListener(INTRO_DONE, once);
    window.clearTimeout(failsafe);
  };
}

/* ============================================================
   HOUSEKEEPING
   ============================================================ */

/**
 * Refresh once fonts settle, so pinned and clipped sections never measure
 * against pre-swap layout. Both display faces on this site swap after first
 * paint and both change line counts when they do.
 */
export function refreshWhenReady() {
  if (typeof window === "undefined") return;
  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts?.status === "loaded") refresh();
  else document.fonts?.ready.then(refresh).catch(() => refresh());
}

export { gsap, ScrollTrigger, SplitText };
