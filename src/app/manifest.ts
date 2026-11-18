import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/** Manifest aplikasi web (/manifest.webmanifest) untuk ikon & tampilan mobile. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.fullName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#121417",
    lang: "id",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
