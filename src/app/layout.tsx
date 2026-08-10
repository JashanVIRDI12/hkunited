import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

import { COMPANY } from "@/content/company";
import { SITE_URL, organizationSchema, jsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { IntroLoader } from "@/components/layout/intro-loader";

/**
 * Two families, deliberately.
 *
 * Instrument Serif carries display type. It is a high-contrast editorial
 * serif drawn for large sizes — the thin strokes that give it its voice
 * disappear below about 20px — so it is confined to the display tiers and
 * never touches body copy. Inter carries everything small, where its
 * neutral grotesque shapes and tight vertical metrics read far better.
 *
 * INSTRUMENT SERIF SHIPS ONE WEIGHT: 400. That is not a limitation to work
 * around, it is how the face is designed — its presence comes from stroke
 * contrast and scale rather than mass. Two consequences are load-bearing
 * elsewhere in the system:
 *
 *  · Every display tier in `globals.css` is set to `font-weight: 400`.
 *    Asking for 600 would render 400 anyway once the webfont lands, but
 *    the FALLBACK (Georgia, which has a real bold) would paint bold first
 *    and then snap lighter on swap — a visible weight jump on every
 *    headline.
 *  · Tracking across the display tiers was loosened. The old values were
 *    tuned to pull Montserrat's wide geometric forms together; applied to
 *    a serif they jam the serifs into each other.
 *
 * `display: swap` means text paints in a fallback immediately rather than
 * blocking first render, and `adjustFontFallback` (on by default) sizes
 * that fallback to match, so the swap does not reflow the page.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} — Heavy Haul & Bulk Transport, Ontario`,
    template: `%s — ${COMPANY.name}`,
  },
  description: COMPANY.description,
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.name, url: SITE_URL }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  alternates: { canonical: "/" },
  keywords: [
    "heavy haul Ontario",
    "dump truck services GTA",
    "aggregate hauling Toronto",
    "contaminated soil removal Ontario",
    "live bottom trailer",
    "tanker trailer transport",
    "bulk haulage Mississauga",
    "construction material delivery",
  ],
  category: "Transportation & Logistics",
  formatDetection: { telephone: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} — Heavy Haul & Bulk Transport, Ontario`,
    description: COMPANY.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} — Heavy Haul & Bulk Transport, Ontario`,
    description: COMPANY.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Never cap zoom — pinch-zoom is an accessibility requirement.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- trusted, locally serialised JSON-LD
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema()) }}
        />
        {/*
          Reveal animations start at opacity:0 and are cleared by GSAP.
          `MaskLines` additionally parks each line below its mask. Without JS
          both would leave content invisible, so restore them for no-JS
          agents. Crawlers still receive full server-rendered HTML.
        */}
        <noscript>
          <style>{`.opacity-0{opacity:1 !important}.motion-parked{transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <IntroLoader />
        <SmoothScroll>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
