import { FAQ } from "@/content/site";
import { faqSchema, jsonLd } from "@/lib/seo";

import { Hero } from "@/features/home/sections/hero";
import { Stats } from "@/features/home/sections/stats";
import { Why } from "@/features/home/sections/why";
import { Services } from "@/features/home/sections/services";
import { Fleet } from "@/features/home/sections/fleet";
import { Coverage } from "@/features/home/sections/coverage";
import { Safety } from "@/features/home/sections/safety";
import { Faq } from "@/features/home/sections/faq";
import { ClosingCard } from "@/components/layout/closing-card";

/**
 * Homepage.
 *
 * ART DIRECTION — THE CARD STACK. The page is built from rounded cards
 * inset inside a page frame, opening and closing on the same shape. That is
 * a different instrument from the interior pages, which are editorial
 * columns divided by hairlines, and the difference is deliberate: a
 * homepage is SCANNED by someone deciding whether to keep reading, and a
 * card is a unit you can take in and skip; a rule says "this continues".
 *
 * The vocabulary is three card tones — white, grey, dark — over a white
 * page, with Royal Blue reserved for marks until the closing card, where it
 * fills a surface for the only time. `components/ui/panel.tsx` holds the
 * tones and the rules for placing them.
 *
 * TYPE IS DELIBERATELY SMALLER THAN THE INTERIOR PAGES. Nothing here uses
 * `type-colossal`, `type-mega` or `type-display` — those tiers belong to
 * /about's masthead and to the display lines on the interior pages, where
 * one idea has a whole screen to itself. Twelve card sections at that scale
 * would be a page of shouting.
 *
 * Rhythm: hero → credentials → argument → services → equipment → terms →
 * the one dark interruption → objections → ask. Surfaces alternate
 * white / paper-alt so no two adjacent bands merge.
 *
 * TWO SECTIONS WERE CUT, both for the same reason: they published content
 * that already had a better home. The process steps are rendered in full
 * beside the quote form on /quote, where someone is actually about to
 * trigger that sequence; the sector index is on /services, where it routes
 * between service lines instead of repeating the sector names a third time
 * after the stat row and the bento. Neither said anything here that the
 * page did not already say — they only made it longer, and length is the
 * one thing a homepage cannot spend freely.
 *
 * The `FAQPage` schema lives here and only here — /contact renders the same
 * seven answers without it, so the two never compete for one rich result.
 *
 * Only Hero is a client component; everything else renders on the server
 * and ships no JavaScript of its own beyond the shared motion wrappers.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(FAQ)) }}
      />
      <Hero />
      <Stats />
      <Why />
      <Services />
      <Fleet />
      <Coverage />
      <Safety />
      <Faq />
      <ClosingCard
        label="Start"
        headingId="home-cta-heading"
        heading="Tell us what needs moving"
        lead="Send your material, volume, site location and schedule. Dispatch will come back with the right configuration and a firm price."
        primary={{ label: "Request a quote", href: "/quote" }}
        secondary={{ label: "See the fleet", href: "/fleet" }}
      />
    </>
  );
}
