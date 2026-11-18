import Link from "next/link";
import type { CSSProperties } from "react";
import { getFeaturedProjects } from "@/lib/projects";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";

/**
 * Portofolio unggulan di Beranda:
 * - Tampil 1 baris memanjang dengan ukuran kartu lebih besar & presisi.
 * - Bergerak otomatis ke samping secara halus (loop tanpa jeda) dan berhenti sejenak saat kursor diarahkan.
 */
export async function FeaturedProjects() {
  const projects = await getFeaturedProjects(10);

  // Ulangi daftar seperlunya agar satu track selalu penuh di layar lebar (minimal 5 kartu per sisi loop)
  const repeatCount = projects.length > 0 ? Math.max(1, Math.ceil(5 / projects.length)) : 0;
  const trackItems = Array.from({ length: repeatCount }, () => projects).flat();
  const durationSeconds = Math.max(28, trackItems.length * 6.5);

  return (
    <section id="portofolio" className="overflow-hidden border-t border-line bg-sand py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="02"
            eyebrow="Portofolio"
            title="Karya pilihan"
            description="Sebagian proyek yang pernah kami rancang. Arahkan kursor pada foto untuk menjeda dan melihat judul karya."
          />
          <Link
            href="/portofolio"
            className="group inline-flex shrink-0 items-center gap-2 self-start border-b border-ink/50 pb-1 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink md:self-auto"
          >
            Lihat semua proyek
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Container>

      {projects.length > 0 ? (
        <div className="mt-10 w-full overflow-hidden">
          <div
            className="portfolio-marquee-track"
            style={{ "--marquee-duration": `${durationSeconds}s` } as CSSProperties}
          >
            {[0, 1].map((copyIndex) => (
              <div
                key={copyIndex}
                aria-hidden={copyIndex === 1 || undefined}
                className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
              >
                {trackItems.map((project, itemIndex) => (
                  <div
                    key={`${copyIndex}-${itemIndex}-${project.id}`}
                    className="w-[310px] shrink-0 sm:w-[420px] lg:w-[500px]"
                  >
                    <ProjectCard
                      project={project}
                      sizes="(min-width: 1024px) 500px, (min-width: 640px) 420px, 310px"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Container>
          <div className="mt-10 border border-line bg-paper p-10 text-center">
            <p className="text-sm text-stone">
              Belum ada proyek unggulan yang ditayangkan. Tambah dan tandai proyek sebagai{" "}
              <strong className="font-medium text-ink">Tayang</strong> &amp;{" "}
              <strong className="font-medium text-ink">Unggulan</strong> melalui halaman Admin.
            </p>
          </div>
        </Container>
      )}
    </section>
  );
}
