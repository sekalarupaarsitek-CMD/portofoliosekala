"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/types/project";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { mapRowToProject } from "@/lib/project-mapper";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";

/** Memuat data proyek berdasarkan ID di browser lalu menampilkan Form Edit. */
export function EditProjectClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProject = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (!active) return;

        if (error || !data) {
          setErrorMessage("Proyek tidak ditemukan atau sesi login berakhir.");
        } else {
          setProject(mapRowToProject(data as Record<string, unknown>));
        }
      } catch (err) {
        if (!active) return;
        setErrorMessage(err instanceof Error ? err.message : "Gagal memuat data proyek.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProject();
    return () => {
      active = false;
    };
  }, [projectId]);

  return (
    <AdminShell>
      <div className="mb-8 border-b border-line pb-6">
        <Link
          href="/admin"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
        >
          ← Kembali ke Daftar Proyek
        </Link>
        <h1 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Edit Proyek
        </h1>
      </div>

      {loading ? (
        <div className="border border-line bg-paper p-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-stone">
          Memuat data proyek...
        </div>
      ) : errorMessage || !project ? (
        <div className="border border-red-700/30 bg-red-50 p-6 text-sm text-red-900">
          {errorMessage ?? "Proyek tidak ditemukan."}
        </div>
      ) : (
        <ProjectForm mode="edit" initialData={project} />
      )}
    </AdminShell>
  );
}
