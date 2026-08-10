import { COMPANY } from "@/content/company";
import { pageMeta, breadcrumbSchema, jsonLd } from "@/lib/seo";

import { ClosingCta } from "@/components/layout/closing-cta";
import { ContactHero } from "@/features/contact/sections/hero";
import { Desk } from "@/features/contact/sections/desk";
import { Message } from "@/features/contact/sections/message";
import { Faq } from "@/features/contact/sections/faq";

export const metadata = pageMeta({
  title: "Contact",
  description: `Reach ${COMPANY.shortName} dispatch on ${COMPANY.phone} or at ${COMPANY.email}. Terminal at ${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.regionName}, serving ${COMPANY.serviceArea}.`,
  path: "/contact",
});

/**
 * Contact.
 *
 * ART DIRECTION — THE NUMBER FIRST. Haulage starts on the phone: a
 * superintendent who needs three more trucks this afternoon is not filling
 * in a form, and they are reading this one-handed on a site. So the four
 * channels are ON the hero plate, live — dispatch dials, email composes, the
 * terminal opens in maps — and the page's first screen is the answer rather
 * than an introduction to it.
 *
 * `Desk` then does what the old ranked list did, but louder and without
 * repeating the hero: the number set at the display tier on an ink card,
 * beside a paper card carrying the yard, the address and the maps link. Two
 * cards, deliberately unequal, because they are not two options — one is the
 * action and the other is the evidence there is a real place behind it.
 *
 * THE PLATES ARE ONE PLACE AT TWO DISTANCES. The hero flies over the
 * terminal at dawn — the only clip in `VIDEOS` no other page uses — and
 * `Desk` stands at the gate of the same yard in fog. Same location, two
 * vantages, which reads as somewhere real; two aerials of it would have read
 * as the same photograph twice.
 *
 * The FAQ is here rather than on the homepage's terms: same seven answers
 * from `content/site.ts`, no second `FAQPage` schema. Reasoning in
 * `sections/faq.tsx`.
 *
 * Surface rhythm: plate (hero) → paper (desk, with one ink card) → paper
 * (message) → paper-alt (faq) → brand (close). The ink here is a CARD, not a
 * band — /safety spends the full-width dark surface and this page does not
 * need to compete with it.
 *
 * Every section is a server component except the form and the motion
 * wrappers.
 */
export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ),
        }}
      />

      <ContactHero />
      <Desk />
      <Message />
      <Faq />
      <ClosingCta
        eyebrow="Start"
        headingId="contact-cta-heading"
        heading="Know what needs moving?"
        lines={[
          { text: "Know what", drift: 24 },
          { text: "needs moving?", indent: "lg:pl-[12%]", drift: -30 },
        ]}
        lead="The quote form asks for material, volume, site and schedule — everything dispatch needs to come back with the right configuration and a firm price."
        primary={{ label: "Request a Quote", href: "/quote" }}
        secondary={{ label: "See the services", href: "/services" }}
      />
    </>
  );
}
