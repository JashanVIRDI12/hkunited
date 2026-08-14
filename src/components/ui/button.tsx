import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const button = cva(
  /*
   * Pill geometry across every variant. A capsule reads as a single soft
   * object where a square control reads as one more box on the page, and
   * it is the cheapest way to make the whole interface feel less built
   * out of containers.
   *
   * The hover lift is 1px. Anything more turns a calm surface into a
   * bouncy one — and it rides on `transform`, so it costs no layout.
   *
   * 320ms, NOT THE 500ms THIS USED TO RUN AT. A hover is a response to a
   * deliberate act, and a response that takes half a second stops reading as
   * responsiveness and starts reading as lag — the pointer has usually moved
   * on before the state has finished arriving. The site's reveals are slow
   * because they carry mass; a control has none. This sits in the middle of
   * the 0.25–0.45s micro-interaction band, while every scroll reveal on the
   * page stays two to four times longer, and that contrast is deliberate:
   * things you touch answer immediately, things you scroll past take their
   * time.
   */
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-tight transition-[background-color,border-color,color,box-shadow,transform] duration-[320ms] ease-[var(--ease-brand)] hover:-translate-y-px disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-y-0",
  {
    variants: {
      /*
       * Two families. `on-paper` variants assume the light page surface;
       * `onImage` variants assume a photograph with a scrim beneath them.
       * The names are explicit because mixing the two is the easiest way
       * to ship invisible text.
       */
      variant: {
        /** Royal Blue. The primary action. */
        brand: "bg-brand text-white shadow-lift hover:bg-brand-deep hover:shadow-float",
        /** Near-black. Quiet, high contrast. */
        solid: "bg-ink text-paper shadow-lift hover:bg-ink-2 hover:shadow-float",
        /** Hairline outline on paper. Softened to `line` — `line-strong`
            drew the control as a box rather than as a boundary. */
        outline: "border border-line text-ink hover:border-line-strong hover:bg-paper-alt",
        /** Text-only. The one variant that must not lift: there is no
            surface to lift, so the motion would just jitter the label. */
        ghost: "text-ink-2 hover:translate-y-0 hover:text-brand",
        /** Over photography: solid white plate. */
        onImage: "bg-white text-ink shadow-lift hover:bg-paper-alt hover:shadow-float",
        /** Over photography: outlined. */
        onImageOutline:
          "border border-white/45 text-white hover:border-white hover:bg-white/10",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-[3.25rem] px-7 text-[0.9375rem]",
        lg: "h-[3.75rem] px-9 text-base",
      },
    },
    defaultVariants: { variant: "brand", size: "md" },
  },
);

type BaseProps = VariantProps<typeof button> & {
  className?: string;
  children: React.ReactNode;
  /** Appends an arrow that slides on hover. */
  arrow?: boolean;
};

type AsLink = BaseProps & { href: string } & Omit<
    React.ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;
type AsButton = BaseProps & { href?: never } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

export type ButtonProps = AsLink | AsButton;

/**
 * 6px of travel, against the label's 2px in the opposite direction.
 *
 * THE TWO MOVING APART IS THE WHOLE GESTURE. An arrow that slides on its own
 * is a decoration attached to a button; an arrow that pulls away while the
 * label leans back opens a gap, and the gap is what reads as the control
 * pointing somewhere. It is under a pixel of perceived movement on the label
 * — nobody will name it, everybody will feel the button got more responsive.
 */
const Arrow = () => (
  <ArrowRight
    className="size-4 shrink-0 transition-transform duration-[320ms] ease-[var(--ease-brand)] group-hover/btn:translate-x-1.5"
    aria-hidden="true"
  />
);

/**
 * The label moves only when there is an arrow to move away FROM. On a button
 * without one there is nothing for the shift to mean, and a label that drifts
 * on hover for no reason just reads as a rendering fault.
 */
const Label = ({ shift, children }: { shift: boolean; children: React.ReactNode }) =>
  shift ? (
    <span className="transition-transform duration-[320ms] ease-[var(--ease-brand)] group-hover/btn:-translate-x-0.5">
      {children}
    </span>
  ) : (
    <>{children}</>
  );

export function Button(props: ButtonProps) {
  const { className, variant, size, children, arrow, ...rest } = props;
  const classes = cn(button({ variant, size }), className);
  const inner = (
    <>
      <Label shift={Boolean(arrow)}>{children}</Label>
      {arrow && <Arrow />}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as AsButton)}>
      {inner}
    </button>
  );
}

/**
 * Editorial text link with a rule that wipes in from the left.
 * The rule is a transform, so hover costs nothing.
 */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link relative inline-flex items-center gap-2 text-ink transition-colors duration-[320ms] hover:text-brand",
        className,
      )}
    >
      <span className="relative">
        {children}
        {/*
          The rule wipes OUT to the right and IN from the left, which is why
          the origin flips on hover rather than staying put. A rule that
          retracts the way it arrived reads as an undo; one that continues in
          the reading direction reads as a stroke being drawn.
        */}
        <span
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-brand transition-transform duration-[380ms] ease-[var(--ease-brand)] group-hover/link:origin-left group-hover/link:scale-x-100"
          aria-hidden="true"
        />
      </span>
      <ArrowRight
        className="size-4 transition-transform duration-[320ms] ease-[var(--ease-brand)] group-hover/link:translate-x-1.5"
        aria-hidden="true"
      />
    </Link>
  );
}
