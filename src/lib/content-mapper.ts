import type { AboutContent, FaqItem, HeroContent, HeroTextStyle, Testimonial } from "@/types/content";
import { HERO_TEXT_STYLES } from "@/types/content";

/** Foto default background Beranda (Hero). */
export const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85";

/** Konten default Beranda (Hero) sebelum diubah di Admin CMS. */
export const DEFAULT_HERO_CONTENT: HeroContent = {
  id: "main",
  title: "Wujudkan Hunian yang Membawa Kebahagiaan",
  tagline: "tatar rupa mawa bagja",
  description:
    "Merancang rumah tinggal, interior, eksterior, furniture, dan landscape dengan proporsi yang tenang, fungsional, serta berkarakter.",
  background_image_url: DEFAULT_HERO_IMAGE,
  text_style: "sans",
};

/** Daftar label Type Teks untuk dropdown di Admin CMS dan kelas CSS untuk Hero. */
export const HERO_TEXT_STYLE_OPTIONS: Record<
  HeroTextStyle,
  { label: string; hint: string; headingClass: string }
> = {
  sans: {
    label: "Modern Sans (Bersih & Tegas)",
    hint: "Sama seperti gaya huruf bar atas & referensi utama.",
    headingClass: "font-sans font-semibold tracking-tight",
  },
  serif: {
    label: "Arsitektural Serif (Elegan)",
    hint: "Bergaya majalah arsitektur klasik dengan huruf serif.",
    headingClass: "font-serif font-normal tracking-tight",
  },
  "serif-italic": {
    label: "Editorial Serif Miring (Puitis)",
    hint: "Tampilan huruf serif miring yang lembut dan artistik.",
    headingClass: "font-serif italic font-normal tracking-normal",
  },
  uppercase: {
    label: "Tegas Kapital (Minimalis Modern)",
    hint: "Huruf kapital renggang untuk kesan studio kontemporer.",
    headingClass: "font-sans font-semibold uppercase tracking-[0.08em]",
  },
};

function normalizeHeroTextStyle(raw: unknown): HeroTextStyle {
  if (typeof raw === "string" && (HERO_TEXT_STYLES as readonly string[]).includes(raw)) {
    return raw as HeroTextStyle;
  }
  return "sans";
}

/** Foto default placeholder untuk bagian 04 · Tentang. */
export const DEFAULT_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80";

/** Konten default bagian 04 · Tentang sebelum diubah di Admin CMS. */
export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  id: "main",
  title: "Di balik Sekalarupa",
  quote: "“Tatar Rupa Mawa Bagja” — Menata wujud dan ruang yang menghadirkan kebahagiaan.",
  description:
    "Nama Sekalarupa lahir dari pertemuan dua esensi mendasar: Sekala, dimensi nyata yang terukur, fungsional, dan berpijak pada ketelitian skala arsitektur; serta Rupa, wujud visual, keindahan bentuk, dan rasa yang menghidupkan setiap sudut ruang.\n\nBagi kami, arsitektur bukan sekadar mendirikan bidang dan material, melainkan menyelaraskan kebutuhan hidup, iklim sekitar, dan kebiasaan manusia di dalamnya. Baik dalam perancangan rumah tinggal, interior, eksterior, lanskap, hingga detail furnitur kustom, kami merancang ruang yang tenang, jujur, dan berkesinambungan.",
  image_url: DEFAULT_ABOUT_IMAGE,
  founder_name: "M Fahmi Shofiyulloh",
  founder_role: "Pendiri & Principal Architect",
};

/** Mengubah baris tabel `testimonials` Supabase menjadi tipe `Testimonial`. */
export function mapRowToTestimonial(row: Record<string, unknown>): Testimonial {
  return {
    id: String(row.id ?? ""),
    client_name: String(row.client_name ?? ""),
    project_label:
      typeof row.project_label === "string" && row.project_label.trim()
        ? row.project_label.trim()
        : null,
    quote: String(row.quote ?? ""),
    is_published: Boolean(row.is_published),
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    created_at: typeof row.created_at === "string" ? row.created_at : "2025-01-01T00:00:00.000Z",
  };
}

/** Mengubah baris tabel `faqs` Supabase menjadi tipe `FaqItem`. */
export function mapRowToFaq(row: Record<string, unknown>): FaqItem {
  return {
    id: String(row.id ?? ""),
    question: String(row.question ?? ""),
    answer: String(row.answer ?? ""),
    is_published: Boolean(row.is_published),
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    created_at: typeof row.created_at === "string" ? row.created_at : "2025-01-01T00:00:00.000Z",
  };
}

/** Mengubah baris tabel `about_section` Supabase menjadi tipe `AboutContent`. */
export function mapRowToAbout(row: Record<string, unknown>): AboutContent {
  return {
    id: String(row.id ?? "main"),
    title:
      typeof row.title === "string" && row.title.trim()
        ? row.title.trim()
        : DEFAULT_ABOUT_CONTENT.title,
    quote: typeof row.quote === "string" && row.quote.trim() ? row.quote.trim() : null,
    description:
      typeof row.description === "string" && row.description.trim()
        ? row.description.trim()
        : DEFAULT_ABOUT_CONTENT.description,
    image_url:
      typeof row.image_url === "string" && row.image_url.trim()
        ? row.image_url.trim()
        : DEFAULT_ABOUT_IMAGE,
    founder_name:
      typeof row.founder_name === "string" && row.founder_name.trim()
        ? row.founder_name.trim()
        : null,
    founder_role:
      typeof row.founder_role === "string" && row.founder_role.trim()
        ? row.founder_role.trim()
        : null,
  };
}

/** Mengubah baris tabel `hero_section` Supabase menjadi tipe `HeroContent`. */
export function mapRowToHero(row: Record<string, unknown>): HeroContent {
  return {
    id: String(row.id ?? "main"),
    title:
      typeof row.title === "string" && row.title.trim()
        ? row.title.trim()
        : DEFAULT_HERO_CONTENT.title,
    tagline: typeof row.tagline === "string" && row.tagline.trim() ? row.tagline.trim() : null,
    description:
      typeof row.description === "string" && row.description.trim()
        ? row.description.trim()
        : DEFAULT_HERO_CONTENT.description,
    background_image_url:
      typeof row.background_image_url === "string" && row.background_image_url.trim()
        ? row.background_image_url.trim()
        : DEFAULT_HERO_IMAGE,
    text_style: normalizeHeroTextStyle(row.text_style),
  };
}
