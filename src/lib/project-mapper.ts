import type { Project, ProjectCategory } from "@/types/project";
import { PROJECT_CATEGORIES } from "@/types/project";

/** Pastikan nilai kategori dari database selalu valid. */
function normalizeCategory(raw: unknown): ProjectCategory {
  if (typeof raw === "string" && (PROJECT_CATEGORIES as readonly string[]).includes(raw)) {
    return raw as ProjectCategory;
  }
  return "rumah";
}

/** Mengubah satu baris dari tabel Supabase menjadi tipe `Project` yang rapi. */
export function mapRowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? "Tanpa Judul"),
    slug: String(row.slug ?? ""),
    owner: typeof row.owner === "string" && row.owner.trim() ? row.owner.trim() : null,
    category: normalizeCategory(row.category),
    description: typeof row.description === "string" ? row.description : null,
    location: typeof row.location === "string" ? row.location : null,
    year: typeof row.year === "number" ? row.year : null,
    area_sqm: typeof row.area_sqm === "number" ? row.area_sqm : null,
    cover_image_url:
      typeof row.cover_image_url === "string" && row.cover_image_url.trim()
        ? row.cover_image_url.trim()
        : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    gallery: Array.isArray(row.gallery)
      ? row.gallery.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [],
    is_published: Boolean(row.is_published),
    is_featured: Boolean(row.is_featured),
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    created_at: typeof row.created_at === "string" ? row.created_at : "2025-01-01T00:00:00.000Z",
  };
}
