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
   */
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-tight transition-[background-color,border-color,color,box-shadow,transform] duration-500 ease-[var(--ease-brand)] hover:-translate-y-px disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-y-0",
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

const Arrow = () => (
  <ArrowRight
    className="size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-brand)] group-hover/btn:translate-x-1"
    aria-hidden="true"
  />
);

export function Button(props: ButtonProps) {
  const { className, variant, size, children, arrow, ...rest } = props;
  const classes = cn(button({ variant, size }), className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
        {arrow && <Arrow />}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as AsButton)}>
      {children}
      {arrow && <Arrow />}
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
        "group/link relative inline-flex items-center gap-2 text-ink transition-colors duration-500 hover:text-brand",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-brand transition-transform duration-500 ease-[var(--ease-brand)] group-hover/link:origin-left group-hover/link:scale-x-100"
          aria-hidden="true"
        />
      </span>
      <ArrowRight
        className="size-4 transition-transform duration-500 ease-[var(--ease-brand)] group-hover/link:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
