import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Robots.
 *
 * Everything is crawlable. There is no authenticated area, no search
 * results page and no faceted URL space to protect — the one dynamic
 * surface on the site is the enquiry form, which posts to a Server Action
 * over POST and therefore has no crawlable URL of its own.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
