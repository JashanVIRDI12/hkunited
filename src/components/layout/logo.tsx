import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The HK monogram — the client's actual logo.
 *
 * THE ARTWORK IS BLUE ON TRANSPARENT, which is what makes everything below
 * possible. Measured from the file: the frame and the inner quadrilateral are
 * opaque `#0F3883`; the margin between them and the HK letterforms themselves
 * are fully transparent knockouts. The white you see in the supplied PNG is
 * the page behind it, not ink.
 *
 * SO THE WHITE VARIANT IS A FILTER, NOT A SECOND FILE.
 * `brightness(0)` drives every colour channel to zero and `invert(1)` lifts
 * them to 255, while neither touches alpha — so the blue becomes pure white
 * and the knockouts stay knocked out. Over the homepage footage that reads as
 * a white frame with the HK cut out of it, which is the mark inverted rather
 * than a white square with a logo lost inside it.
 *
 * Keeping it to one asset matters more than saving the filter: a second
 * hand-made white PNG is a file that can drift from the original the first
 * time the client reissues their artwork.
 *
 * IT IS DECORATIVE BY DEFAULT. Everywhere it appears it sits inside a link or
 * block that already carries the company name as its accessible name, so an
 * `alt` here would announce the brand twice. Pass `alt` explicitly on the one
 * day it stands alone.
 *
 * QUALITY 90 IS THE PROJECT CEILING — `next.config.ts` allows only [75, 90],
 * so anything higher is silently clamped and would just be a lie in the
 * source. It is the right end of that range anyway: compression artefacts on
 * a flat two-colour mark are visible in a way they never are on a photograph.
 *
 * `sizes` IS NOT OPTIONAL. Without it Next builds the srcset from the
 * intrinsic width (601), so a mark that paints at 28px is served as a 640px
 * file — and a 1920px one to any retina display. Declaring the real rendered
 * size lets the optimiser pick from its small-image set instead.
 *
 * No blur placeholder: a blur-up on a logo reads as a loading failure.
 */
export function Logo({
  className,
  tone = "brand",
  alt = "",
  priority = false,
  sizes = "(min-width: 768px) 56px, 48px",
}: {
  className?: string;
  /** `white` inverts the mark for dark surfaces. See the note above. */
  tone?: "brand" | "white";
  alt?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src="/logo-hk.png"
      alt={alt}
      width={601}
      height={597}
      quality={90}
      sizes={sizes}
      priority={priority}
      aria-hidden={alt === "" || undefined}
      className={cn(
        "block h-full w-auto",
        tone === "white" && "[filter:brightness(0)_invert(1)]",
        className,
      )}
    />
  );
}
