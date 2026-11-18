"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/types/project";
import { PROJECT_CATEGORIES } from "@/types/project";
import { CATEGORY_LABELS } from "@/lib/categories";
import { ProjectCard } from "@/components/ui/ProjectCard";

type Filter = "semua" | ProjectCategory;

/**
 * Grid portofolio + tombol filter kategori.
 * Filter berjalan langsung di browser (tanpa memuat ulang halaman).
 */
export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("semua");

  // Hanya tampilkan kategori yang punya minimal 1 proyek, lengkap dengan jumlahnya.
  const filters = useMemo(() => {
    const counts = PROJECT_CATEGORIES.map((category) => ({
      value: category as Filter,
      label: CATEGORY_LABELS[category],
      count: projects.filter((project) => project.category === category).length,
    })).filter((item) => item.count > 0);

    return [{ value: "semua" as Filter, label: "Semua", count: projects.length }, ...counts];
  }, [projects]);

  const visibleProjects =
    activeFilter === "semua" ? projects : projects.filter((project) => project.category === activeFilter);

  return (
    <div>
      {/* Tombol filter */}
      <div
        role="group"
        aria-label="Filter kategori proyek"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters.map((filter) => {
          const isActive = filter.value === activeFilter;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={isActive}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-stone hover:border-ink/50 hover:text-ink"
              }`}
            >
              {filter.label}
              <span className={`font-mono text-[10px] ${isActive ? "text-paper/60" : "text-stone/70"}`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Info jumlah hasil (dibacakan pembaca layar saat filter berubah) */}
      <p aria-live="polite" className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
        Menampilkan {visibleProjects.length} proyek
      </p>

      {/* Grid proyek. `key` memicu animasi fade ulang setiap kali filter berganti. */}
      <div key={activeFilter} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {visibleProjects.map((project, index) => (
          <div
            key={project.id}
            className="animate-[portfolio-fade_0.6s_ease-out_both]"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <ProjectCard project={project} isPlaceholder={project.id.startsWith("sample-")} />
          </div>
        ))}
      </div>

      {visibleProjects.length === 0 && (
        <p className="mt-10 border border-line p-8 text-center text-sm text-stone">
          Belum ada proyek di kategori ini.
        </p>
      )}
    </div>
  );
}
