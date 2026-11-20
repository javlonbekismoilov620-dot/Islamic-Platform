import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/profil", "/kirish", "/royxatdan-otish", "/sozlamalar", "/zikrlar/tarix"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
