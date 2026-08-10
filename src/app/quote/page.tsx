import { COMPANY } from "@/content/company";
import { FLEET } from "@/content/fleet";
import { SERVICES } from "@/content/services";
import { pageMeta, breadcrumbSchema, jsonLd } from "@/lib/seo";

import { PageMasthead } from "@/components/layout/page-masthead";
import { Request } from "@/features/quote/sections/request";
import { Direct } from "@/features/quote/sections/direct";

export const metadata = pageMeta({
  title: "Request a Quote",
  description: `Send ${COMPANY.shortName} your material, volume, site location and schedule and dispatch will come back with the right configuration and a firm price. Bulk, tank, waste and flatbed haulage across ${COMPANY.serviceArea}.`,
  path: "/quote",
});

/**
 * Quote.
 *
 * ART DIRECTION — THE SHORTEST PATH. Three blocks and no photography at all:
 * masthead, form, direct line. This is the one page on the site where the
 * visitor has already decided, and every section between them and the first
 * field is a section they can abandon in.
 *
 * That is also why the masthead lines are the FORM'S OWN FIELDS — material,
 * volume, site, schedule. The headline tells you what you are about to be
 * asked, so nobody starts filling it in before realising they need to go and
 * look something up.
 *
 * The page does NOT close on `ClosingCta`. Royal Blue is still spent once at
 * the end, but it carries the phone number rather than a button pointing at
 * the form directly above it — see `sections/direct.tsx`.
 *
 * No `noindex`: this is a landing page for commercial search and should rank.
 * The form posts to a Server Action, so there is no query-string state to
 * generate duplicate URLs.
 *
 * Every section is a server component except the form and the motion
 * wrappers.
 */
export default function QuotePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Trusted, locally serialised JSON-LD — `jsonLd` escapes `<`.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Request a Quote", path: "/quote" },
            ]),
          ),
        }}
      />

      <PageMasthead
        eyebrow="Request a quote"
        headingId="quote-heading"
        heading="Material, volume, site, schedule."
        lines={[
          { text: "Material, volume,", drift: 22 },
          { text: "site, schedule.", indent: "lg:pl-[11%]", drift: -30 },
        ]}
        lead="Four things and dispatch can price it. Send them and we will come back with the right configuration and a firm price — including the constraints you have not thought to mention yet, which is usually where the cost is."
        facts={[
          { k: "Service lines", v: String(SERVICES.length) },
          { k: "Configurations", v: String(FLEET.length) },
          { k: "Scale", v: "Single load to sustained" },
          { k: "Dispatch", v: COMPANY.phone },
        ]}
      />
      <Request />
      <Direct />
    </>
  );
}
