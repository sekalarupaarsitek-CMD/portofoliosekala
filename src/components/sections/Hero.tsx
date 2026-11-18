import Image from "next/image";
import Link from "next/link";
import { getHeroContent } from "@/lib/content";
import { HERO_TEXT_STYLE_OPTIONS } from "@/lib/content-mapper";
import { getWhatsAppLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * Bagian Hero (Beranda):
 * - Gambar background, judul, tagline, deskripsi, dan type teks dikelola lewat Admin CMS (/admin/beranda).
 * - Seluruh teks di Beranda berwarna putih bersih di atas gambar background.
 * - Tombol "Lihat Portofolio" -> #portofolio, "Jelajahi ->" -> #layanan.
 */
export async function Hero() {
  const hero = await getHeroContent();
  const headingStyleClass = HERO_TEXT_STYLE_OPTIONS[hero.text_style].headingClass;

  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-ink text-white">
      {/* Gambar Background Full-Screen */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.background_image_url}
          alt={hero.title}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-center"
        />
        {/* Lapisan gelap halus agar teks putih terbaca tajam */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/45"
        />
      </div>

      {/* Ruang atas untuk mengimbangi Navbar */}
      <div aria-hidden="true" className="h-20" />

      {/* Konten Utama (Tengah Kiri) — Semua Teks Putih */}
      <Container className="relative z-10 my-auto py-16 sm:py-24">
        <div className="max-w-xl">
          <h1 className={`text-3xl leading-[1.15] text-white sm:text-5xl ${headingStyleClass}`}>
            {hero.title}
          </h1>

          {hero.tagline && (
            <p className="mt-3 font-serif text-base italic tracking-[0.28em] text-white/90 sm:text-xl">
              {hero.tagline}
            </p>
          )}

          <p className="mt-5 max-w-md whitespace-pre-line text-xs leading-relaxed text-white/85 sm:text-sm">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/#portofolio" variant="light">
              Lihat Portofolio
            </ButtonLink>
            <ButtonLink href={getWhatsAppLink()} variant="outline-light" external>
              Konsultasi
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Baris Bawah Hero (Cakupan Layanan di Kiri, Tombol Jelajahi -> ke 01-Layanan di Kanan Bawah) */}
      <Container className="relative z-10 pb-8 pt-4 sm:pb-10">
        <div className="flex flex-col gap-6 border-t border-white/20 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-white/80">
            <span>Rumah Tinggal</span>
            <span aria-hidden="true">·</span>
            <span>Interior</span>
            <span aria-hidden="true">·</span>
            <span>Eksterior</span>
            <span aria-hidden="true">·</span>
            <span>Furniture</span>
            <span aria-hidden="true">·</span>
            <span>Landscape</span>
          </div>

          <Link
            href="/#layanan"
            className="group inline-flex items-center gap-3 self-end font-serif text-lg tracking-wide text-white transition-colors hover:text-white/80 sm:text-xl"
          >
            <span>Jelajahi</span>
            <span
              aria-hidden="true"
              className="font-sans text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
