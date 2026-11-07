import type { MetadataRoute } from "next";
import { getAllGuides } from "@/content/guides";
import { SITE_URL, LEGAL_LAST_UPDATED } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LEGAL_LAST_UPDATED);
  const guides = getAllGuides();

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/play`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/leaderboard`,
      lastModified,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/learn`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/learn/glossary`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/editorial-policy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${SITE_URL}/learn/${guide.slug}`,
    lastModified: new Date(guide.updatedDate),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...coreRoutes, ...guideRoutes];
}
