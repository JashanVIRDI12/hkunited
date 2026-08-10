import NextImage from "next/image";
import type { ImageAsset } from "@/content/imagery";
import { cn } from "@/lib/utils";

interface MediaProps {
  asset: ImageAsset;
  className?: string;
  /** CSS aspect-ratio for the wrapper. `auto` lets the parent size it. */
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  /** Darkening overlay, for white type over the image. Always dark. */
  scrim?: "none" | "soft" | "strong" | "bottom";
  /**
   * Corner softness. Set `none` for full-bleed plates and for images whose
   * parent already clips them — a radius that meets the viewport edge, or
   * that sits inside another rounded container, reads as a defect.
   */
  radius?: "none" | "soft" | "plate" | "panel";
  /** Slow zoom on hover of the nearest `.group` ancestor. */
  zoomOnHover?: boolean;
  children?: React.ReactNode;
}

const RADIUS: Record<NonNullable<MediaProps["radius"]>, string> = {
  none: "",
  soft: "rounded-soft",
  plate: "rounded-plate",
  panel: "rounded-panel",
};

/**
 * Scrims are ALWAYS dark even though the site is light: their only job is
 * to hold white type legible over a photograph. A light scrim would wash
 * the image out and strand the type.
 */
const SCRIM: Record<NonNullable<MediaProps["scrim"]>, string> = {
  none: "",
  soft: "bg-scrim/30",
  strong: "bg-scrim/55",
  bottom: "bg-gradient-to-t from-scrim/85 via-scrim/35 to-transparent",
};

/**
 * Photographic block.
 *
 * The fixed-ratio wrapper reserves layout space before the image decodes,
 * which is what holds CLS at zero. `blurDataURL` is derived from the real
 * pixels, so the placeholder resolves into the photograph rather than
 * flashing grey.
 */
export function Media({
  asset,
  className,
  ratio = "16/9",
  priority = false,
  sizes = "100vw",
  scrim = "none",
  radius = "plate",
  zoomOnHover = false,
  children,
}: MediaProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper-sunk",
        RADIUS[radius],
        className,
      )}
      style={ratio === "auto" ? undefined : { aspectRatio: ratio }}
    >
      <NextImage
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        quality={90}
        placeholder="blur"
        blurDataURL={asset.blurDataURL}
        className={cn(
          "object-cover",
          zoomOnHover &&
            "transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.04]",
        )}
      />
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
