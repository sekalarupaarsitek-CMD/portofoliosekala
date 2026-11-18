import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getPublishedProjects } from "@/lib/projects";

/**
 * Sitemap XML otomatis (/sitemap.xml) untuk membantu Google mengindeks
 * halaman Beranda, Portofolio, dan setiap halaman detail proyek yang tayang.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/portofolio`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.siteUrl}/portofolio/${project.slug}`,
    lastModified: new Date(project.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
