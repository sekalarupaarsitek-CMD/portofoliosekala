import { cacheLife, cacheTag } from "next/cache";
import type { Project } from "@/types/project";
import { getSupabaseClient } from "@/lib/supabase";
import { mapRowToProject } from "@/lib/project-mapper";

/**
 * Ambil semua proyek yang tayang (`is_published = true`) langsung dari database Supabase.
 * Cache diperbarui otomatis setiap kali Admin menyimpan perubahan lewat `updateTag("projects")`.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("projects");

  const supabase = getSupabaseClient();
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((row) => mapRowToProject(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

/**
 * Ambil maksimal 6 proyek unggulan (`is_featured = true` & `is_published = true`)
 * untuk ditampilkan di Beranda (`02 · Portofolio`).
 */
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const allPublished = await getPublishedProjects();
  return allPublished.filter((project) => project.is_featured).slice(0, limit);
}

/** Cari satu proyek tayang berdasarkan slug dari database Supabase. */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const allPublished = await getPublishedProjects();
  return allPublished.find((project) => project.slug === slug);
}

/** Proyek sebelum & sesudahnya untuk navigasi di halaman detail. */
export async function getAdjacentProjects(
  slug: string,
): Promise<{ previous?: Project; next?: Project }> {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return {};
  return { previous: projects[index - 1], next: projects[index + 1] };
}
