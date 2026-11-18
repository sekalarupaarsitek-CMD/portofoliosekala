"use client";

import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";

/** Halaman Tambah Proyek Baru (/admin/projects/new). */
export default function NewProjectPage() {
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
          Tambah Proyek Baru
        </h1>
        <p className="mt-1.5 text-xs text-stone sm:text-sm">
          Isi detail proyek dan unggah foto sampul beserta galeri.
        </p>
      </div>

      <ProjectForm mode="create" />
    </AdminShell>
  );
}
