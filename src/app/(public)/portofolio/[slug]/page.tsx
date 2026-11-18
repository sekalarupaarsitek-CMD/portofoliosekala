import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProjectBySlug, getPublishedProjects } from "@/lib/projects";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getWhatsAppLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProjectGallery } from "@/components/sections/ProjectGallery";

/** Buat halaman detail untuk setiap proyek tayang. Next.js 16 membutuhkan minimal 1 param. */
export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  if (projects.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return projects.map((project) => ({ slug: project.slug }));
}

/** Judul & deskripsi tab browser / Google per proyek. */
export async function generateMetadata({ params }: PageProps<"/portofolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyek tidak ditemukan" };

  const description = project.description ?? `Proyek ${project.title} oleh Sekalarupa Studio Arsitek.`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/portofolio/${project.slug}` },
    openGraph: {
      title: `${project.title} | Sekalarupa`,
      description,
      url: `/portofolio/${project.slug}`,
      images: [{ url: project.cover_image_url, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Sekalarupa`,
      description,
      images: [project.cover_image_url],
    },
  };
}

/** Halaman /portofolio/[slug]: detail satu proyek. */
export default async function ProjectDetailPage({ params }: PageProps<"/portofolio/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // Slug salah / proyek tidak tayang -> tampilkan halaman 404
  if (!project) notFound();

  const { previous, next } = await getAdjacentProjects(slug);

  const facts = [
    { label: "Owner", value: project.owner },
    { label: "Kategori", value: CATEGORY_LABELS[project.category] },
    { label: "Lokasi", value: project.location },
    { label: "Tahun", value: project.year?.toString() },
    { label: "Luas", value: project.area_sqm ? `${project.area_sqm} m²` : null },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  const consultMessage = `Halo Sekalarupa, saya melihat proyek "${project.title}" di website dan ingin konsultasi desain serupa.`;

  return (
    <article className="pb-20 pt-28 sm:pb-24 sm:pt-32">
      <Container>
        {/* Navigasi kembali */}
        <Link
          href="/portofolio"
          className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-stone transition-colors hover:text-ink"
        >
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Semua proyek
        </Link>

        {/* Judul + info singkat */}
        <header className="mt-6 grid gap-8 border-b border-line pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {CATEGORY_LABELS[project.category]}
            </p>
            <h1 className="mt-3 font-sans text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-4xl">
              {project.title}
            </h1>
          </div>

          <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-5 lg:col-span-7">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-paper p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">{fact.label}</dt>
                <dd className="mt-1.5 text-xs font-medium text-ink sm:text-sm">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>
      </Container>

      {/* Foto sampul besar */}
      <div className="mt-8">
        <Container>
          <div className="relative aspect-[4/3] overflow-hidden bg-sand sm:aspect-[16/9]">
            <Image
              src={project.cover_image_url}
              alt={`Foto sampul proyek ${project.title}`}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        </Container>
      </div>

      <Container>
        {/* Deskripsi + ajakan konsultasi */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone">Tentang proyek</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink sm:text-base">
              {project.description ?? "Deskripsi proyek belum tersedia."}
            </p>
          </div>
          <div className="border-t border-line pt-6 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs leading-relaxed text-stone">Tertarik dengan desain serupa?</p>
            <ButtonLink href={getWhatsAppLink(consultMessage)} external className="mt-4">
              <WhatsAppIcon />
              Konsultasi
            </ButtonLink>
          </div>
        </div>

        {/* Galeri */}
        {project.gallery.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between border-b border-line pb-4">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone">Galeri</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                {project.gallery.length} foto · klik untuk perbesar
              </span>
            </div>
            <div className="mt-6">
              <ProjectGallery title={project.title} images={project.gallery} />
            </div>
          </section>
        )}

        {/* Navigasi proyek sebelum / sesudah */}
        <nav aria-label="Proyek lainnya" className="mt-20 grid border-y border-line sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/portofolio/${previous.slug}`}
              className="group block py-6 sm:border-r sm:border-line sm:pr-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">← Sebelumnya</span>
              <span className="mt-2 block text-sm font-semibold text-ink group-hover:underline">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block sm:border-r sm:border-line" />
          )}
          {next && (
            <Link
              href={`/portofolio/${next.slug}`}
              className="group block border-t border-line py-6 text-right sm:border-t-0 sm:pl-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Berikutnya →</span>
              <span className="mt-2 block text-sm font-semibold text-ink group-hover:underline">{next.title}</span>
            </Link>
          )}
        </nav>
      </Container>
    </article>
  );
}
