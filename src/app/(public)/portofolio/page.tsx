import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { Container } from "@/components/ui/Container";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";

const DESCRIPTION =
  "Kumpulan karya Sekalarupa Studio Arsitek: rumah tinggal, interior, eksterior, furniture, dan landscape.";

export const metadata: Metadata = {
  title: "Portofolio",
  description: DESCRIPTION,
  alternates: { canonical: "/portofolio" },
  openGraph: {
    title: "Portofolio | Sekalarupa",
    description: DESCRIPTION,
    url: "/portofolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portofolio | Sekalarupa",
    description: DESCRIPTION,
  },
};

/** Halaman /portofolio: semua proyek tayang dari Supabase + filter kategori. */
export default async function PortfolioPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="pb-20 pt-32 sm:pb-24 sm:pt-36">
      <Container>
        {/* Judul halaman (gaya sama dengan judul bagian di Beranda) */}
        <header className="border-b border-line pb-8">
          <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-stone">
            <span className="font-mono text-accent">02</span>
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            <span>Portofolio</span>
          </p>
          <h1 className="mt-3 font-sans text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
            Seluruh karya
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-stone sm:text-sm">
            Pilih kategori untuk menyaring proyek, lalu klik foto untuk melihat detailnya.
          </p>
        </header>

        <div className="mt-8">
          <PortfolioGrid projects={projects} />
        </div>
      </Container>
    </section>
  );
}
