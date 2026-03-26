import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://osteriabellavista.ch";
  const locales = ["it", "de", "en"];

  // Define all routes
  const routes = ["", "/menu", "/esperienze", "/galleria", "/prenota"];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and route
  for (const locale of locales) {
    for (const route of routes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route}`])
          ),
        },
      });
    }
  }

  return sitemap;
}
