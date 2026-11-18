/** Kategori proyek (sesuai PRD bagian 7). */
export const PROJECT_CATEGORIES = [
  "rumah",
  "interior",
  "eksterior",
  "furniture",
  "landscape",
  "renovasi",
  "komersial",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** Bentuk data satu proyek. Sama persis dengan kolom tabel `projects` di Supabase nanti. */
export interface Project {
  id: string;
  title: string;
  slug: string;
  owner: string | null;
  category: ProjectCategory;
  description: string | null;
  location: string | null;
  year: number | null;
  area_sqm: number | null;
  cover_image_url: string;
  gallery: string[];
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}
