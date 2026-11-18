"use server";

import { revalidatePath, updateTag } from "next/cache";

/**
 * Menyegarkan cache halaman publik segera setelah Admin menambah, mengubah,
 * menayangkan, atau menghapus proyek di Supabase.
 */
export async function refreshPublicPortfolio(slug?: string): Promise<void> {
  updateTag("projects");
  revalidatePath("/");
  revalidatePath("/portofolio");
  if (slug) {
    revalidatePath(`/portofolio/${slug}`);
  }
}

/**
 * Menyegarkan cache Beranda segera setelah Admin mengubah Beranda, Tentang, Testimoni, atau FAQ.
 */
export async function refreshPublicContent(): Promise<void> {
  updateTag("hero");
  updateTag("about");
  updateTag("testimonials");
  updateTag("faqs");
  revalidatePath("/");
}
