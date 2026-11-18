"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/types/project";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { mapRowToProject } from "@/lib/project-mapper";
import { AdminShell } from "@/components/admin/AdminShell";
import { refreshPublicPortfolio } from "@/app/admin/actions";

/** Halaman Utama Admin (/admin): daftar seluruh proyek + toggle cepat Tayang/Unggulan + hapus. */
export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    const fetchAll = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!active) return;
        if (error) throw new Error(error.message);
        setProjects((data ?? []).map((row) => mapRowToProject(row as Record<string, unknown>)));
      } catch (err) {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Gagal memuat daftar proyek.";
        setNotice({ type: "error", text: msg });
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      active = false;
    };
  }, []);

  /** Toggle cepat status Tayang/Draft atau Unggulan langsung dari tabel. */
  const handleToggle = async (project: Project, field: "is_published" | "is_featured") => {
    setNotice(null);
    setBusyId(project.id);
    const nextValue = !project[field];

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("projects")
        .update({ [field]: nextValue })
        .eq("id", project.id);

      if (error) throw new Error(error.message);

      setProjects((prev) =>
        prev.map((item) => (item.id === project.id ? { ...item, [field]: nextValue } : item)),
      );

      await refreshPublicPortfolio(project.slug);

      const label =
        field === "is_published"
          ? nextValue
            ? `"${project.title}" sekarang TAYANG di website publik.`
            : `"${project.title}" disembunyikan menjadi DRAFT.`
          : nextValue
            ? `"${project.title}" ditandai sebagai UNGGULAN di Beranda.`
            : `"${project.title}" dilepas dari daftar Unggulan.`;

      setNotice({ type: "success", text: label });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengubah status proyek.";
      setNotice({ type: "error", text: msg });
    } finally {
      setBusyId(null);
    }
  };

  /** Hapus proyek setelah admin menekan tombol konfirmasi. */
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const target = confirmDelete;
    setNotice(null);
    setBusyId(target.id);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("projects").delete().eq("id", target.id);
      if (error) throw new Error(error.message);

      setProjects((prev) => prev.filter((item) => item.id !== target.id));
      setConfirmDelete(null);

      await refreshPublicPortfolio(target.slug);
      setNotice({ type: "success", text: `Proyek "${target.title}" berhasil dihapus.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus proyek.";
      setNotice({ type: "error", text: msg });
    } finally {
      setBusyId(null);
    }
  };

  const publishedCount = projects.filter((p) => p.is_published).length;
  const featuredCount = projects.filter((p) => p.is_published && p.is_featured).length;

  return (
    <AdminShell>
      {/* Baris Judul + Tombol Tambah */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Manajemen Portofolio
          </p>
          <h1 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Daftar Proyek
          </h1>
          <p className="mt-1.5 text-xs text-stone sm:text-sm">
            Total {projects.length} proyek · {publishedCount} Tayang · {featuredCount} Unggulan di Beranda
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex shrink-0 items-center justify-center bg-ink px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink/85"
        >
          + Tambah Proyek
        </Link>
      </div>

      {/* Pesan Sukses / Gagal */}
      {notice && (
        <div
          role="status"
          className={`mt-6 flex items-center justify-between gap-4 border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-emerald-700/30 bg-emerald-50 text-emerald-900"
              : "border-red-700/30 bg-red-50 text-red-900"
          }`}
        >
          <span>{notice.text}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Tutup pesan"
            className="cursor-pointer text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Daftar Proyek */}
      <div className="mt-8">
        {loading ? (
          <div className="border border-line bg-paper p-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-stone">
            Memuat data dari Supabase...
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-line bg-paper p-12 text-center">
            <p className="text-sm text-stone">Belum ada proyek di database.</p>
            <Link
              href="/admin/projects/new"
              className="mt-5 inline-flex bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-paper hover:bg-ink/85"
            >
              + Tambah Proyek Pertama
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line border border-line bg-paper">
            {projects.map((project) => {
              const isBusy = busyId === project.id;
              return (
                <div
                  key={project.id}
                  className="flex flex-col gap-5 p-4 transition-colors hover:bg-sand/40 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  {/* Kiri: Foto & Info Proyek */}
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden border border-line bg-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                          {CATEGORY_LABELS[project.category]}
                        </span>
                        <span className="text-line">·</span>
                        <span className="font-mono text-[10px] text-stone">
                          Urutan #{project.sort_order}
                        </span>
                        {project.year && (
                          <>
                            <span className="text-line">·</span>
                            <span className="font-mono text-[10px] text-stone">{project.year}</span>
                          </>
                        )}
                      </div>

                      <h2 className="mt-1 truncate font-sans text-base font-semibold text-ink">
                        {project.title}
                      </h2>

                      <p className="mt-0.5 text-xs text-stone">
                        {project.owner ? `Owner: ${project.owner}` : "Tanpa keterangan owner"}
                        {project.location ? ` · ${project.location}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Kanan: Toggle Status & Tombol Aksi */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4 lg:border-t-0 lg:pt-0">
                    {/* Toggle Tayang / Draft */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggle(project, "is_published")}
                      className={`cursor-pointer border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors disabled:opacity-50 ${
                        project.is_published
                          ? "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800"
                          : "border-line bg-sand text-stone hover:border-ink hover:text-ink"
                      }`}
                    >
                      {project.is_published ? "● Tayang" : "○ Draft"}
                    </button>

                    {/* Toggle Unggulan */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggle(project, "is_featured")}
                      className={`cursor-pointer border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors disabled:opacity-50 ${
                        project.is_featured
                          ? "border-accent bg-accent text-white hover:bg-accent/90"
                          : "border-line bg-paper text-stone hover:border-ink hover:text-ink"
                      }`}
                    >
                      {project.is_featured ? "★ Unggulan" : "☆ Biasa"}
                    </button>

                    <span className="hidden h-5 w-px bg-line sm:inline-block" aria-hidden="true" />

                    {/* Lihat halaman publik (jika tayang) */}
                    {project.is_published && (
                      <Link
                        href={`/portofolio/${project.slug}`}
                        target="_blank"
                        className="border border-line px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-stone transition-colors hover:border-ink hover:text-ink"
                      >
                        Lihat ↗
                      </Link>
                    )}

                    {/* Edit */}
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="border border-ink px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                      Edit
                    </Link>

                    {/* Hapus */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setConfirmDelete(project)}
                      className="cursor-pointer border border-red-700/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-red-700 transition-colors hover:bg-red-700 hover:text-white disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog Konfirmasi Hapus */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-xs"
        >
          <div className="w-full max-w-md border border-line bg-paper p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-700">
              Konfirmasi Hapus
            </p>
            <h2 id="delete-dialog-title" className="mt-2 font-sans text-lg font-semibold text-ink">
              Hapus proyek &ldquo;{confirmDelete.title}&rdquo;?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-stone sm:text-sm">
              Proyek ini akan dihapus permanen dari database dan tidak lagi tampil di website. Tindakan ini
              tidak bisa dibatalkan.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={busyId === confirmDelete.id}
                className="cursor-pointer border border-line px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-stone hover:border-ink hover:text-ink"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={busyId === confirmDelete.id}
                className="cursor-pointer bg-red-700 px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-red-800 disabled:opacity-50"
              >
                {busyId === confirmDelete.id ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
