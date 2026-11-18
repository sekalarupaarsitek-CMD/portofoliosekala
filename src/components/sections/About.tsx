import Image from "next/image";
import { getAboutContent } from "@/lib/content";
import { DEFAULT_ABOUT_IMAGE } from "@/lib/content-mapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Bagian 04 · Tentang: foto tampil sebagai background penuh dengan lapisan gelap halus,
 * teks bersih dan tajam di atasnya (dikelola langsung lewat Admin CMS /admin/tentang).
 */
export async function About() {
  const about = await getAboutContent();
  const isDefaultPhoto = about.image_url === DEFAULT_ABOUT_IMAGE;
  const paragraphs = about.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id="tentang"
      className="relative overflow-hidden border-t border-line bg-ink py-24 text-white sm:py-32"
    >
      {/* Foto Background Penuh */}
      <div className="absolute inset-0 z-0">
        <Image
          src={about.image_url}
          alt={about.title}
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover object-center"
        />
        {/* Gradasi gelap halus agar teks putih tetap terbaca tajam dan rapi */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35"
        />
      </div>

      {isDefaultPhoto && <PlaceholderBadge label="Foto profil contoh" />}

      {/* Konten Teks di Atas Background */}
      <Container className="relative z-10">
        <Reveal className="max-w-2xl">
          <SectionHeading index="04" eyebrow="Tentang" tone="light" title={about.title} />

          <div className="mt-6 space-y-4 text-xs leading-relaxed text-white/85 sm:text-sm">
            {about.quote && (
              <p className="border-l-2 border-accent pl-4 font-serif text-base italic text-white sm:text-lg">
                {about.quote}
              </p>
            )}

            {paragraphs.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {(about.founder_name || about.founder_role) && (
            <div className="mt-8 border-t border-white/20 pt-5">
              {about.founder_name && (
                <p className="font-sans text-base font-semibold tracking-wide text-white">
                  {about.founder_name}
                </p>
              )}
              {about.founder_role && (
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                  {about.founder_role}
                </p>
              )}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
