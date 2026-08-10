import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Sitemap.
 *
 * ONE ENTRY PER ROUTE, and no more. The fleet units and service lines are
 * anchors on `/fleet` and `/services` rather than routes of their own, and
 * listing `#dump-truck` here would submit a URL that resolves to a page
 * already in the sitemap — a duplicate, not a second page.
 *
 * `priority` is a hint search engines have largely stopped acting on, but it
 * costs nothing and it records where this site believes its weight sits:
 * home, then the two commercial pages a buyer converts from.
 *
 * `lastModified` is deployment time. These pages are content-driven and
 * change when the site is redeployed, so build time is the honest answer —
 * a hardcoded date would go stale silently and a per-page date would need a
 * CMS to be true.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/quote", changeFrequency: "yearly", priority: 0.9 },
    { path: "/fleet", changeFrequency: "monthly", priority: 0.8 },
    { path: "/safety", changeFrequency: "yearly", priority: 0.8 },
    { path: "/about", changeFrequency: "yearly", priority: 0.7 },
    { path: "/projects", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  ] as const satisfies readonly {
    path: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  }[];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
