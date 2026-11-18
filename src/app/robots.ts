import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Aturan mesin pencari (/robots.txt):
 * - Mengizinkan Google mengindeks seluruh halaman publik.
 * - Melarang mesin pencari masuk ke halaman /admin.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
