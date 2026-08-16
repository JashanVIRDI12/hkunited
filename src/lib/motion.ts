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
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

let registered = false;

/**
 * Idempotent plugin registration.
 *
 * EVERY GSAP PLUGIN IS FREE from 3.13 onward, including the ones that were
 * Club-only for years — SplitText, DrawSVG, ScrambleText, MorphSVG. They all
 * ship inside the public `gsap` package, so none of them needs a token, a
 * private registry or a membership. Parts of this codebase were written
 * against the old licensing and worked around it by hand; where that happened
 * the workaround has been removed and the note corrected.
 *
 * Only what the site actually uses is registered. Every plugin named here is
 * bundled into the client, so an unused one is dead weight shipped to every
 * visitor.
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;

  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    CustomEase,
    DrawSVGPlugin,
    ScrambleTextPlugin,
  );

  /*
   * THE STYLESHEET'S CURVE, AVAILABLE TO GSAP.
   *
   * `globals.css` publishes `--ease-brand: cubic-bezier(0.16, 1, 0.3, 1)` and
   * every CSS transition on the site uses it. GSAP had no access to that
   * curve, so hover states and scroll reveals were easing on two similar but
   * non-identical functions — close enough that nobody could name the
   * problem, far enough apart that a card whose shadow is transitioned by CSS
   * and whose position is tweened by GSAP arrived in two stages.
   *
   * Registering it once means both halves of the system can share one curve.
   */
  CustomEase.create("brand", "0.16, 1, 0.3, 1");

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

  /**
   * THE STYLESHEET'S OWN CURVE — `--ease-brand`, registered as a GSAP ease
   * by `registerGsap`.
   *
   * Reach for it whenever a GSAP tween runs ALONGSIDE a CSS transition on the
   * same element or its neighbour, so the two arrive together. Everywhere
   * else the four curves above are the vocabulary; this exists to close the
   * seam between the two halves of the system, not to widen it.
   */
  brand: "brand",
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

/**
 * ONE ENTRANCE PER ELEMENT, EVER.
 *
 * THE BUG THIS FIXES: every entrance on the site played twice in development,
 * on every page. React Strict Mode — on by default in the App Router since
 * Next 13.5 — deliberately runs each effect twice on mount: setup, cleanup,
 * setup. The cleanup reverts GSAP correctly, so nothing leaks; but the first
 * pass has already PAINTED. The reader sees the headline rise, snap back and
 * rise again.
 *
 * It looked like the homepage was exempt and it never was. Home's reveals sit
 * below the fold, so they are scroll-triggered: both setups happen long before
 * anything is scrolled to, and only the surviving trigger ever fires. The
 * interior pages put the same reveals above the fold, where they play on mount
 * — so both passes played, back to back, which is where it was visible.
 *
 * WHY THE LATCH LIVES ON THE DOM NODE. A flag in the effect's closure is
 * useless here: Strict Mode's second pass is a genuinely new closure. React
 * reuses the same DOM elements across that remount, so the element itself is
 * the only thing that persists between the two — and it is also exactly the
 * right lifetime. A route change builds new nodes, so a genuine navigation
 * still gets its entrance.
 *
 * CLAIM IT WHEN THE ANIMATION STARTS, NEVER AT SETUP. Latching at setup time
 * would mean a scroll-triggered reveal marks itself entered, gets torn down by
 * Strict Mode, and the second pass then skips creating the trigger at all —
 * leaving parked content that nothing will ever release. That is the failure
 * this codebase has shipped twice already. `markEntered` belongs in `onStart`.
 *
 * This is not merely a development workaround: an entrance is an event, and an
 * event that fires twice for one arrival is wrong in any build.
 */
const ENTERED = "hkEntered";

/** Has this element already performed its entrance? */
export function hasEntered(el: Element): boolean {
  return (el as HTMLElement).dataset?.[ENTERED] === "1";
}

/** Latch it. Call from a tween's `onStart` — never at setup time. */
export function markEntered(el: Element): void {
  const node = el as HTMLElement;
  if (node.dataset) node.dataset[ENTERED] = "1";
}

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

  const root = trigger ?? els[0];

  // Already performed on these nodes — a Strict Mode remount, or a parent
  // re-rendering around them. Place them and leave; do not perform again.
  if (prefersReducedMotion() || hasEntered(root)) {
    gsap.set(els, resolved);
    return () => {};
  }

  let done = false;

  const tween = gsap.fromTo(els, from, {
    ...to,
    onStart: () => {
      done = true;
      markEntered(root);
    },
    scrollTrigger: inViewport(root, -40)
      ? undefined
      : { trigger: root, start, once: true },
  });

  /*
   * THE WATCHDOG, AND IT IS SCOPED TO EXACTLY ONE FAILURE.
   *
   * The first build of this fired on a bare timer and did not look at where
   * the element was, which turned it from a safety net into a bug generator.
   * Anything still below the fold at the timeout — the bottom sections of any
   * long page — was resolved to its final state while its scroll trigger was
   * left ARMED. Scrolling down then fired that trigger, which yanked the
   * section back to `opacity: 0` and played the entire reveal again. The
   * reader saw the content, then saw it animate in. On /fleet that was the
   * material matrix and the closing card, every time.
   *
   * Two corrections, and both are needed:
   *
   *  · BELOW THE FOLD AND UNREVEALED IS CORRECT. It has not been reached yet.
   *    Only content sitting ON SCREEN and still hidden indicates a trigger
   *    that mis-measured — against pre-swap font metrics, or a layout that
   *    moved underneath it — and that is the only case worth rescuing.
   *  · RESCUING MEANS KILLING THE TWEEN, not just setting the values. A
   *    resolved element with a live trigger still pointing at it is precisely
   *    the replay described above.
   */
  const watchdog = window.setTimeout(() => {
    if (done || tween.isActive() || tween.progress() > 0) return;
    if (!inViewport(root)) return;
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(els, resolved);
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
 * SPLIT ONCE, THEN TORN DOWN — AND THAT IS THE FIX FOR HEADINGS THAT
 * REVEALED TWICE.
 *
 * The obvious build uses `autoSplit: true`, which re-splits whenever the line
 * boxes could have changed, and animates inside `onSplit`. It has to, because
 * a mask measured against the fallback face is measured wrong once Instrument
 * Serif swaps in. But every re-split calls `onSplit` again, and every one of
 * those triggers is cheaper than it looks: the font swap on every cold load,
 * any window resize, and a scrollbar appearing or disappearing — which the
 * intro curtain causes twice by toggling `body { overflow: hidden }`. Each
 * re-split rebuilt the reveal, so headings performed their entrance a second
 * time, seconds after finishing. Latches inside `onSplit` only ever narrowed
 * the window; the mechanism was still there to fire.
 *
 * So the split is not kept alive at all. The element is split ONCE, after
 * `document.fonts.ready` — which is the only moment worth measuring at, and
 * removes the reason `autoSplit` existed — and `onComplete` REVERTS the split
 * the instant the reveal finishes. What is left on the page afterwards is the
 * original, unsplit heading: plain text that reflows natively at any width,
 * with no wrappers, no observers and nothing left that could animate again.
 *
 * That also means a resize after the reveal needs no handling whatsoever. The
 * split only exists for the second or so it is being animated.
 *
 * `mask: "lines"` has SplitText build the overflow-hidden wrapper per line —
 * fiddly to get right by hand, as `MaskLines`' long note on shaved descenders
 * attests.
 *
 * `aria: "auto"` puts an `aria-label` carrying the original string on the
 * element and hides the generated line spans, so the heading is announced
 * once, intact, for the brief window it is split at all.
 *
 * The element is NEVER parked in markup: it renders as ordinary text and is
 * split by the same code that animates it. If this never runs — or runs after
 * the watchdog has given up — the heading is simply a heading.
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

  if (prefersReducedMotion() || hasEntered(el)) return () => {};

  let split: SplitText | undefined;
  let tween: gsap.core.Tween | undefined;
  let cancelled = false;

  /** Put the element back to plain, unsplit markup. */
  const unsplit = () => {
    split?.revert();
    split = undefined;
  };

  const build = () => {
    // The component can unmount, or the heading can be revealed by the
    // watchdog, while the font promise below is still pending.
    if (cancelled || hasEntered(el)) return;

    split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      aria: "auto",
      autoSplit: false,
      linesClass: "reveal-line",
    });

    tween = gsap.fromTo(
      split.lines,
      { yPercent: 105, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: EASE.deep,
        onStart: () => markEntered(el),
        // THE SPLIT IS TORN DOWN THE MOMENT IT HAS DONE ITS JOB.
        onComplete: unsplit,
        scrollTrigger:
          immediate || inViewport(trigger ?? el, -40)
            ? undefined
            : { trigger: trigger ?? el, start, once: true },
      },
    );
  };

  /*
   * SPLIT ONCE THE DISPLAY FACE HAS LANDED. The masks are measured against
   * real line boxes, and this site loads Instrument Serif with `display:
   * swap` — so every heading's line breaks change once, after first paint.
   * Measuring before that means measuring against Georgia.
   */
  const fonts = typeof document !== "undefined" ? document.fonts : undefined;
  if (!fonts || fonts.status === "loaded") build();
  else fonts.ready.then(build).catch(build);

  return () => {
    cancelled = true;
    tween?.scrollTrigger?.kill();
    tween?.kill();
    unsplit();
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
