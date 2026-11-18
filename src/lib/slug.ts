/**
 * Mengubah judul proyek menjadi slug URL yang rapi.
 * Contoh: "Rumah Tropis Modern #2" -> "rumah-tropis-modern-2"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
