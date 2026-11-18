import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import { CATEGORY_LABELS } from "@/lib/categories";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";

/**
 * Kartu satu proyek: hanya menampilkan gambar penuh.
 * Judul, kategori, dan tahun muncul dengan animasi halus saat kursor diarahkan (hover) ke gambar.
 */
export function ProjectCard({
  project,
  isPlaceholder = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  project: Project;
  isPlaceholder?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={`/portofolio/${project.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden bg-sand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {isPlaceholder && <PlaceholderBadge />}

      <Image
        src={project.cover_image_url}
        alt={`Foto proyek ${project.title}`}
        fill
        sizes={sizes}
        loading="lazy"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Lapisan gelap + teks judul yang muncul saat kursor diarahkan ke gambar.
          Di HP/tablet (tanpa kursor) teks selalu tampil agar judul tetap terbaca. */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-6 [@media(hover:none)]:opacity-100">
        <div className="translate-y-3 transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 [@media(hover:none)]:translate-y-0">
          <div className="flex items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
            <span>{CATEGORY_LABELS[project.category]}</span>
            {project.year && <span className="text-white/70">{project.year}</span>}
          </div>
          <h3 className="mt-1.5 font-sans text-base font-semibold leading-snug tracking-tight text-white sm:text-lg">
            {project.title}
          </h3>
          {project.owner && (
            <p className="mt-1 text-xs text-white/75">Owner: {project.owner}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
