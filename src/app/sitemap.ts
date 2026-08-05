import type { MetadataRoute } from "next";

const SITE = "https://tendaera.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
