import { cacheLife, cacheTag } from "next/cache";
import type { AboutContent, FaqItem, HeroContent, Testimonial } from "@/types/content";
import { getSupabaseClient } from "@/lib/supabase";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HERO_CONTENT,
  mapRowToAbout,
  mapRowToFaq,
  mapRowToHero,
  mapRowToTestimonial,
} from "@/lib/content-mapper";

/** Data cadangan jika tabel `testimonials` belum dibuat di Supabase. */
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "default-testimoni-1",
    client_name: "[Nama Klien Contoh 1]",
    project_label: "Desain Rumah Tinggal",
    quote:
      "Contoh ulasan klien: proses diskusi sangat terbuka dan detail. Denah yang dihasilkan benar-benar menyesuaikan kebiasaan keluarga kami sehari-hari.",
    is_published: true,
    sort_order: 1,
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "default-testimoni-2",
    client_name: "[Nama Klien Contoh 2]",
    project_label: "Desain Interior & Furniture",
    quote:
      "Contoh ulasan klien: penataan ruang dalam terasa jauh lebih lega dan hangat. Pemilihan material dan pencahayaannya sangat rapi.",
    is_published: true,
    sort_order: 2,
    created_at: "2025-01-02T00:00:00.000Z",
  },
  {
    id: "default-testimoni-3",
    client_name: "[Nama Klien Contoh 3]",
    project_label: "Arsitektur & Eksterior",
    quote:
      "Contoh ulasan klien: gambar kerja dan detail MEP sangat jelas sehingga memudahkan tim pelaksana di lapangan saat pembangunan.",
    is_published: true,
    sort_order: 3,
    created_at: "2025-01-03T00:00:00.000Z",
  },
];

/** Data cadangan jika tabel `faqs` belum dibuat di Supabase. */
const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "default-faq-1",
    question: "Bagaimana cara memulai konsultasi desain di Sekalarupa?",
    answer:
      "Anda dapat langsung menekan tombol Konsultasi (WhatsApp) atau mengisi Form Konsultasi di halaman ini. Tim kami akan menjadwalkan diskusi awal untuk memahami kebutuhan ruang, lokasi lahan, serta estimasi anggaran Anda.",
    is_published: true,
    sort_order: 1,
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "default-faq-2",
    question: "Apa saja dokumen yang diterima pada tahap Serah Terima?",
    answer:
      "Anda akan menerima paket dokumen lengkap yang mencakup konsep desain, denah tata ruang, visualisasi 3D interior & eksterior, serta Gambar Kerja teknis (skematik arsitektur, struktur dasar, MEP, dan detailing) sebagai acuan pembangunan.",
    is_published: true,
    sort_order: 2,
    created_at: "2025-01-02T00:00:00.000Z",
  },
  {
    id: "default-faq-3",
    question: "Apakah Sekalarupa melayani proyek di luar Bandung Barat?",
    answer:
      "Ya. Studio kami berlokasi di Cililin, Bandung Barat, namun kami melayani perancangan proyek di berbagai kota di Indonesia melalui kombinasi koordinasi daring dan kunjungan survey lokasi sesuai kesepakatan.",
    is_published: true,
    sort_order: 3,
    created_at: "2025-01-03T00:00:00.000Z",
  },
  {
    id: "default-faq-4",
    question: "Apakah bisa memesan salah satu layanan saja, seperti Interior atau Custom Furniture?",
    answer:
      "Tentu bisa. Anda dapat memilih layanan secara menyeluruh maupun spesifik sesuai kebutuhan, mulai dari Rumah Tinggal, Desain Interior, Desain Eksterior, Custom Furniture, hingga Landscape.",
    is_published: true,
    sort_order: 4,
    created_at: "2025-01-04T00:00:00.000Z",
  },
  {
    id: "default-faq-5",
    question: "Bagaimana sistem revisi selama proses perancangan berlangsung?",
    answer:
      "Setiap tahapan—mulai dari denah, konsep 3D, hingga pengembangan desain—dilakukan secara bertahap bersama Anda. Revisi disepakati di setiap tahap sebelum lanjut ke tahap Gambar Kerja agar hasil akhir benar-benar sesuai harapan.",
    is_published: true,
    sort_order: 5,
    created_at: "2025-01-05T00:00:00.000Z",
  },
];

/** Ambil semua testimoni yang tayang dari Supabase (atau data cadangan jika tabel belum dibuat). */
export async function getPublishedTestimonials(): Promise<{ items: Testimonial[]; isFallback: boolean }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("testimonials");

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { items: DEFAULT_TESTIMONIALS, isFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return { items: DEFAULT_TESTIMONIALS, isFallback: true };
    }

    return {
      items: (data ?? []).map((row) => mapRowToTestimonial(row as Record<string, unknown>)),
      isFallback: false,
    };
  } catch {
    return { items: DEFAULT_TESTIMONIALS, isFallback: true };
  }
}

/** Ambil semua FAQ yang tayang dari Supabase (atau data cadangan jika tabel belum dibuat). */
export async function getPublishedFaqs(): Promise<{ items: FaqItem[]; isFallback: boolean }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("faqs");

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { items: DEFAULT_FAQS, isFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      return { items: DEFAULT_FAQS, isFallback: true };
    }

    return {
      items: (data ?? []).map((row) => mapRowToFaq(row as Record<string, unknown>)),
      isFallback: false,
    };
  } catch {
    return { items: DEFAULT_FAQS, isFallback: true };
  }
}

/** Ambil data bagian 04 · Tentang dari Supabase (atau data default jika tabel belum dibuat). */
export async function getAboutContent(): Promise<AboutContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag("about");

  const supabase = getSupabaseClient();
  if (!supabase) {
    return DEFAULT_ABOUT_CONTENT;
  }

  try {
    const { data, error } = await supabase
      .from("about_section")
      .select("*")
      .eq("id", "main")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_ABOUT_CONTENT;
    }

    return mapRowToAbout(data as Record<string, unknown>);
  } catch {
    return DEFAULT_ABOUT_CONTENT;
  }
}

/** Ambil data Beranda (Hero) dari Supabase (atau data default jika tabel belum dibuat). */
export async function getHeroContent(): Promise<HeroContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag("hero");

  const supabase = getSupabaseClient();
  if (!supabase) {
    return DEFAULT_HERO_CONTENT;
  }

  try {
    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .eq("id", "main")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_HERO_CONTENT;
    }

    return mapRowToHero(data as Record<string, unknown>);
  } catch {
    return DEFAULT_HERO_CONTENT;
  }
}
