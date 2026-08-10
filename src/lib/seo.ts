import type { Metadata } from "next";
import { COMPANY, AFFILIATIONS } from "@/content/company";
import { SERVICES } from "@/content/services";
import { INDUSTRIES } from "@/content/industries";

export const SITE_URL = COMPANY.url;

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Defaults to the site OG image. */
  image?: string;
}

/**
 * Build per-page metadata with canonical, OG and Twitter tags.
 * `title` is passed WITHOUT the brand suffix — the template in the
 * root layout appends it, so it stays consistent everywhere.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/opengraph-image",
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${COMPANY.name}`,
      description,
      url,
      siteName: COMPANY.name,
      locale: "en_CA",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: COMPANY.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${COMPANY.name}`,
      description,
      images: [image],
    },
  };
}

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: COMPANY.address.street,
  addressLocality: COMPANY.address.city,
  addressRegion: COMPANY.address.region,
  postalCode: COMPANY.address.postalCode,
  addressCountry: COMPANY.address.country,
} as const;

/**
 * Organization + LocalBusiness graph.
 *
 * Only verified facts are emitted here. Structured data that overstates
 * (invented ratings, fake review counts, unowned awards) is a manual-action
 * risk in Google Search and a legal one for a real carrier — so there is
 * deliberately no `aggregateRating` or `review` node.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "MovingCompany"],
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    description: COMPANY.description,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    foundingDate: String(COMPANY.founded),
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: COMPANY.geo.lat,
      longitude: COMPANY.geo.lng,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
      { "@type": "AdministrativeArea", name: "Ontario, Canada" },
    ],
    memberOf: AFFILIATIONS.map((a) => ({
      "@type": "Organization",
      name: a.name,
      alternateName: a.abbr,
    })),
    knowsAbout: INDUSTRIES.map((i) => i.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Transport & Haulage Services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.summary,
          url: `${SITE_URL}/services#${s.slug}`,
        },
      })),
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqSchema(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Serialise JSON-LD safely for inline injection. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
