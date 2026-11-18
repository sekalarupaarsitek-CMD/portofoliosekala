"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Project, ProjectCategory } from "@/types/project";
import { PROJECT_CATEGORIES } from "@/types/project";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { slugify } from "@/lib/slug";
import { refreshPublicPortfolio } from "@/app/admin/actions";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Project;
}

interface PendingGalleryItem {
  file: File;
  previewUrl: string;
}

const STORAGE_BUCKET = "project-images";
const MAX_RECOMMENDED_MB = 2;

/** Buat nama file unik agar upload foto ke Supabase Storage tidak saling menimpa. */
function buildStoragePath(folder: string, file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "foto";
  const random = Math.random().toString(36).slice(2, 8);
  return `${folder}/${Date.now()}-${random}-${base}.${ext}`;
}

/**
 * Form Tambah & Edit Proyek di Admin CMS.
 * Mendukung upload foto sampul & banyak foto galeri ke Supabase Storage dengan pratinjau sebelum simpan.
 */
export function ProjectForm({ mode, initialData }: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [owner, setOwner] = useState(initialData?.owner ?? "");
  const [category, setCategory] = useState<ProjectCategory>(initialData?.category ?? "rumah");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [year, setYear] = useState(initialData?.year ? String(initialData.year) : "");
  const [areaSqm, setAreaSqm] = useState(initialData?.area_sqm ? String(initialData.area_sqm) : "");
  const [sortOrder, setSortOrder] = useState(String(initialData?.sort_order ?? 0));
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);

  // Foto sampul (URL tersimpan + file baru yang belum diunggah)
  const [existingCoverUrl, setExistingCoverUrl] = useState(initialData?.cover_image_url ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>("");

  // Foto galeri (URL tersimpan + daftar file baru yang belum diunggah)
  const [existingGallery, setExistingGallery] = useState<string[]>(initialData?.gallery ?? []);
  const [pendingGallery, setPendingGallery] = useState<PendingGalleryItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Bersihkan URL pratinjau sementara di memori browser saat komponen ditutup
  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      pendingGallery.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [coverPreviewUrl, pendingGallery]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const handleGalleryFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const newItems: PendingGalleryItem[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPendingGallery((prev) => [...prev, ...newItems]);
    // Kosongkan input agar bisa memilih file yang sama lagi jika dibutuhkan
    event.target.value = "";
  };

  const removeExistingGalleryItem = (urlToRemove: string) => {
    setExistingGallery((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const removePendingGalleryItem = (previewUrlToRemove: string) => {
    setPendingGallery((prev) => {
      const target = prev.find((item) => item.previewUrl === previewUrlToRemove);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.previewUrl !== previewUrlToRemove);
    });
  };

  /** Upload satu file ke Supabase Storage bucket `project-images` dan kembalikan URL publiknya. */
  const uploadToStorage = async (file: File, folder: string): Promise<string> => {
    const supabase = getSupabaseBrowserClient();
    const path = buildStoragePath(folder, file);

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error(`Gagal upload foto "${file.name}": ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const cleanTitle = title.trim();
    const cleanSlug = slugify(slug || title);

    if (!cleanTitle) {
      setStatusMessage({ type: "error", text: "Judul proyek wajib diisi." });
      return;
    }

    if (!cleanSlug) {
      setStatusMessage({ type: "error", text: "Slug URL wajib diisi (huruf/angka)." });
      return;
    }

    if (!coverFile && !existingCoverUrl.trim()) {
      setStatusMessage({ type: "error", text: "Foto sampul wajib dipilih sebelum menyimpan." });
      return;
    }

    setSaving(true);

    try {
      const supabase = getSupabaseBrowserClient();

      // 1. Upload foto sampul jika ada file baru
      let finalCoverUrl = existingCoverUrl.trim();
      if (coverFile) {
        finalCoverUrl = await uploadToStorage(coverFile, `${cleanSlug}/cover`);
      }

      // 2. Upload foto galeri baru (jika ada)
      const uploadedGalleryUrls: string[] = [];
      for (const item of pendingGallery) {
        const publicUrl = await uploadToStorage(item.file, `${cleanSlug}/gallery`);
        uploadedGalleryUrls.push(publicUrl);
      }

      const finalGallery = [...existingGallery, ...uploadedGalleryUrls];

      const parsedYear = year.trim() ? Number.parseInt(year.trim(), 10) : null;
      const parsedArea = areaSqm.trim() ? Number.parseInt(areaSqm.trim(), 10) : null;
      const parsedSort = sortOrder.trim() ? Number.parseInt(sortOrder.trim(), 10) : 0;

      const payload = {
        title: cleanTitle,
        slug: cleanSlug,
        owner: owner.trim() || null,
        category,
        description: description.trim() || null,
        location: location.trim() || null,
        year: Number.isNaN(parsedYear) ? null : parsedYear,
        area_sqm: Number.isNaN(parsedArea) ? null : parsedArea,
        cover_image_url: finalCoverUrl,
        gallery: finalGallery,
        is_published: isPublished,
        is_featured: isFeatured,
        sort_order: Number.isNaN(parsedSort) ? 0 : parsedSort,
      };

      if (mode === "create") {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) {
          if (error.code === "23505") {
            throw new Error(`Slug "${cleanSlug}" sudah dipakai proyek lain. Silakan ubah sedikit slug-nya.`);
          }
          throw new Error(error.message);
        }
      } else if (initialData) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", initialData.id);
        if (error) {
          if (error.code === "23505") {
            throw new Error(`Slug "${cleanSlug}" sudah dipakai proyek lain. Silakan ubah sedikit slug-nya.`);
          }
          throw new Error(error.message);
        }
      }

      // 3. Segarkan cache halaman publik agar perubahan langsung tampil
      await refreshPublicPortfolio(cleanSlug);

      setStatusMessage({
        type: "success",
        text:
          mode === "create"
            ? "Proyek berhasil disimpan! Mengalihkan ke daftar proyek..."
            : "Perubahan proyek berhasil disimpan! Mengalihkan ke daftar proyek...",
      });

      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 800);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan proyek.";
      setStatusMessage({ type: "error", text: message });
      setSaving(false);
    }
  };

  const activeCoverPreview = coverPreviewUrl || existingCoverUrl;
  const labelClasses = "block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone";
  const inputClasses =
    "mt-2 w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-stone/50 focus:border-ink focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Pesan Sukses / Gagal */}
      {statusMessage && (
        <div
          role="alert"
          className={`border px-4 py-3 text-sm ${
            statusMessage.type === "success"
              ? "border-emerald-700/30 bg-emerald-50 text-emerald-900"
              : "border-red-700/30 bg-red-50 text-red-900"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Bagian 1: Informasi Utama */}
      <section className="border border-line bg-paper p-6 sm:p-8">
        <h2 className="border-b border-line pb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
          1. Informasi Proyek
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="project-title" className={labelClasses}>
              Judul Proyek *
            </label>
            <input
              id="project-title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Rumah Sekala Cililin"
              className={inputClasses}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="project-slug" className={labelClasses}>
                Slug URL *
              </label>
              <button
                type="button"
                onClick={() => {
                  setSlug(slugify(title));
                  setSlugTouched(false);
                }}
                className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] text-accent hover:underline"
              >
                Buat otomatis
              </button>
            </div>
            <input
              id="project-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="rumah-sekala-cililin"
              className={`${inputClasses} font-mono text-xs`}
            />
            <p className="mt-1.5 text-[11px] text-stone">
              Alamat halaman: <span className="font-mono">/portofolio/{slugify(slug || title) || "..."}</span>
            </p>
          </div>

          <div>
            <label htmlFor="project-owner" className={labelClasses}>
              Pemilik / Owner Proyek
            </label>
            <input
              id="project-owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Contoh: Bpk. Andi"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="project-category" className={labelClasses}>
              Kategori *
            </label>
            <select
              id="project-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className={`${inputClasses} cursor-pointer`}
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project-location" className={labelClasses}>
              Lokasi / Kota
            </label>
            <input
              id="project-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Bandung Barat"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="project-year" className={labelClasses}>
                Tahun
              </label>
              <input
                id="project-year"
                type="number"
                min={1990}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="project-area" className={labelClasses}>
                Luas (m²)
              </label>
              <input
                id="project-area"
                type="number"
                min={0}
                value={areaSqm}
                onChange={(e) => setAreaSqm(e.target.value)}
                placeholder="180"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="project-sort" className={labelClasses}>
                Urutan
              </label>
              <input
                id="project-sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="0"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="project-description" className={labelClasses}>
            Deskripsi Proyek
          </label>
          <textarea
            id="project-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan konsep desain, tantangan lahan, dan karakter ruang proyek ini..."
            className={inputClasses}
          />
        </div>
      </section>

      {/* Bagian 2: Foto Sampul & Galeri */}
      <section className="border border-line bg-paper p-6 sm:p-8">
        <h2 className="border-b border-line pb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
          2. Foto Proyek (Upload ke Supabase Storage)
        </h2>

        {/* Foto Sampul */}
        <div className="mt-6">
          <label htmlFor="project-cover" className={labelClasses}>
            Foto Sampul (Cover) *
          </label>
          <p className="mt-1 text-xs text-stone">
            Disarankan format JPG/WebP di bawah {MAX_RECOMMENDED_MB} MB agar website tetap cepat dibuka di HP.
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-sand sm:w-64 sm:shrink-0">
              {activeCoverPreview ? (
                /* Memakai img standar untuk mendukung pratinjau blob lokal sebelum diupload */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeCoverPreview}
                  alt="Pratinjau foto sampul"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-xs text-stone">
                  Belum ada foto sampul
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <input
                id="project-cover"
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="block w-full cursor-pointer border border-line bg-sand/50 px-3 py-2 text-xs text-ink file:mr-3 file:cursor-pointer file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-[11px] file:uppercase file:tracking-[0.15em] file:text-paper"
              />
              {coverFile && coverFile.size > MAX_RECOMMENDED_MB * 1024 * 1024 && (
                <p className="text-xs text-amber-800">
                  Ukuran file {(coverFile.size / (1024 * 1024)).toFixed(1)} MB (cukup besar). Tetap bisa diupload,
                  namun sebaiknya dikompres di bawah {MAX_RECOMMENDED_MB} MB.
                </p>
              )}
              <div>
                <label htmlFor="project-cover-url" className="block text-[11px] text-stone">
                  Atau tempel URL gambar langsung (opsional jika tidak upload file baru):
                </label>
                <input
                  id="project-cover-url"
                  type="url"
                  value={existingCoverUrl}
                  onChange={(e) => setExistingCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className={`${inputClasses} text-xs`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Foto Galeri */}
        <div className="mt-8 border-t border-line pt-6">
          <label htmlFor="project-gallery" className={labelClasses}>
            Foto Galeri (Bisa pilih beberapa foto sekaligus)
          </label>
          <input
            id="project-gallery"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryFilesChange}
            className="mt-3 block w-full cursor-pointer border border-line bg-sand/50 px-3 py-2 text-xs text-ink file:mr-3 file:cursor-pointer file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-[11px] file:uppercase file:tracking-[0.15em] file:text-paper"
          />

          {(existingGallery.length > 0 || pendingGallery.length > 0) && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {existingGallery.map((url, idx) => (
                <div key={url} className="group relative aspect-[4/3] overflow-hidden border border-line bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Galeri tersimpan ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingGalleryItem(url)}
                    aria-label="Hapus foto ini dari galeri"
                    className="absolute right-2 top-2 cursor-pointer bg-black/75 px-2 py-0.5 text-[11px] text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {pendingGallery.map((item, idx) => (
                <div
                  key={item.previewUrl}
                  className="group relative aspect-[4/3] overflow-hidden border border-accent bg-sand"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={`Pratinjau galeri baru ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
                    Baru
                  </span>
                  <button
                    type="button"
                    onClick={() => removePendingGalleryItem(item.previewUrl)}
                    aria-label="Batalkan foto baru ini"
                    className="absolute right-2 top-2 cursor-pointer bg-black/75 px-2 py-0.5 text-[11px] text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bagian 3: Status Tayang & Unggulan */}
      <section className="border border-line bg-paper p-6 sm:p-8">
        <h2 className="border-b border-line pb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
          3. Pengaturan Tampil
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 border border-line p-4 transition-colors hover:bg-sand/50">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mt-1 h-4 w-4 accent-ink"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">Tayang di Website Publik</span>
              <span className="mt-0.5 block text-xs text-stone">
                Jika dicentang, proyek muncul di halaman /portofolio. Jika tidak, tersimpan sebagai Draft.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 border border-line p-4 transition-colors hover:bg-sand/50">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mt-1 h-4 w-4 accent-ink"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">Proyek Unggulan (Beranda)</span>
              <span className="mt-0.5 block text-xs text-stone">
                Tampilkan di bagian 02 · Portofolio pada halaman depan (maksimal 6 proyek unggulan yang tayang).
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <Link
          href="/admin"
          className="border border-line px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-stone transition-colors hover:border-ink hover:text-ink"
        >
          ← Batal
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer bg-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Menyimpan & mengupload foto..." : mode === "create" ? "Simpan Proyek" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
