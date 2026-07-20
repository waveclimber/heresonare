import type { MetadataRoute } from "next";

import { getAbsoluteSiteUrl, siteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: getAbsoluteSiteUrl("/sitemap.xml"),
    host: siteUrl.origin,
  };
}
