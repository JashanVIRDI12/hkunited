import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The homepage's card vocabulary.
 *
 * The interior pages are built from RULES — hairlines dividing a continuous
 * editorial column. The homepage is built from CARDS, and the two are not
 * interchangeable: a rule says "this continues", a card says "this is a
 * separate thing you can take in on its own". A homepage is scanned by
 * someone deciding whether to keep reading, so it gets cards.
 *
 * Three tones and no more. Every card on the page is one of these, which is
 * what stops a bento grid — a layout with no inherent order — from turning
 * into a patchwork of one-off treatments.
 *
 *   paper  white, hairline boundary. The default. Sits on `paper-alt`
 *          bands, where the hairline is what separates it from the surface
 *          rather than a shadow; the reference layout is flat, and a
 *          shadow under every card would read as a different design.
 *   sunk   light grey-blue fill, no boundary. For cards that are DATA —
 *          the stat row, the terms block — where a border would draw a box
 *          around a number.
 *   dark   the accent card. Used sparingly and never twice adjacent: on a
 *          grid of six, two dark cards placed diagonally read as emphasis,
 *          three read as a checkerboard.
 */
export type PanelTone = "paper" | "sunk" | "dark";

const TONE: Record<PanelTone, string> = {
  paper: "bg-paper border border-line text-ink",
  sunk: "bg-paper-sunk text-ink",
  dark: "bg-ink-panel text-white",
};

/**
 * `as` exists so a card can be a list item.
 *
 * Where the order of the cards IS the content — the five process steps —
 * the container has to be an `<ol>`, and an `<ol>` may only contain `<li>`.
 * Wrapping each step in a styled `<div>` inside the list is invalid markup
 * and costs the enumeration a screen reader would otherwise announce
 * ("list, 5 items"). Making the tone polymorphic keeps the three-tone
 * vocabulary in one place instead of being re-inlined at that call site.
 */
export function Panel({
  as: Tag = "div",
  tone = "paper",
  id,
  className,
  children,
}: {
  as?: "div" | "li" | "article";
  tone?: PanelTone;
  /** Deep-link target. Pair with `anchor-offset` so it clears the header. */
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag id={id} className={cn("rounded-plate", TONE[tone], className)}>
      {children}
    </Tag>
  );
}

/**
 * Icon chip.
 *
 * A brand glyph on a wash fill (4.75:1) on light cards, and a white glyph
 * on a solid brand fill (5.56:1) on dark ones — brand-on-dark would be the
 * one pairing in the system that fails. Both clear the 3:1 non-text
 * threshold with room, which matters because these glyphs are the only
 * place the brand colour appears at small size.
 *
 * Always `aria-hidden`: the icon restates the card's heading and adds
 * nothing to a screen reader but noise.
 */
export function IconBadge({
  icon: Icon,
  tone = "light",
  className,
}: {
  icon: LucideIcon;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-soft",
        tone === "dark" ? "bg-brand text-white" : "bg-brand-wash text-brand",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

/**
 * Section marker — `/ Services`.
 *
 * The slash is a real character rather than a `::before`, so it survives
 * copy-paste and is announced in reading order. It is inside the same
 * element as the label because a lone punctuation mark in its own node is
 * announced as "slash" by some screen readers and skipped entirely by
 * others — neither is what a sighted reader gets.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("section-label", className)}>/ {children}</p>;
}
