/** Bentuk data satu item Testimoni di tabel `testimonials` Supabase. */
export interface Testimonial {
  id: string;
  client_name: string;
  project_label: string | null;
  quote: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

/** Bentuk data satu item FAQ di tabel `faqs` Supabase. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

/** Bentuk data bagian 04 · Tentang di tabel `about_section` Supabase. */
export interface AboutContent {
  id: string;
  title: string;
  quote: string | null;
  description: string;
  image_url: string;
  founder_name: string | null;
  founder_role: string | null;
}

/** Pilihan gaya/type teks untuk judul Beranda (Hero). */
export const HERO_TEXT_STYLES = ["sans", "serif", "serif-italic", "uppercase"] as const;
export type HeroTextStyle = (typeof HERO_TEXT_STYLES)[number];

/** Bentuk data bagian Beranda (Hero) di tabel `hero_section` Supabase. */
export interface HeroContent {
  id: string;
  title: string;
  tagline: string | null;
  description: string;
  background_image_url: string;
  text_style: HeroTextStyle;
}
