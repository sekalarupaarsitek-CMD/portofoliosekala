"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { DEFAULT_ABOUT_CONTENT, mapRowToAbout } from "@/lib/content-mapper";
import { slugify } from "@/lib/slug";
import { AdminShell } from "@/components/admin/AdminShell";
import { refreshPublicContent } from "@/app/admin/actions";

const STORAGE_BUCKET = "project-images";
const MAX_RECOMMENDED_MB = 2;

/** Halaman Admin CMS untuk mengatur bagian 04 · Tentang (/admin/tentang). */
export default function AdminAboutPage() {
  const [title, setTitle] = useState(DEFAULT_ABOUT_CONTENT.title);
  const [quote, setQuote] = useState(DEFAULT_ABOUT_CONTENT.quote ?? "");
  const [description, setDescription] = useState(DEFAULT_ABOUT_CONTENT.description);
  const [founderName, setFounderName] = useState(DEFAULT_ABOUT_CONTENT.founder_name ?? "");
  const [founderRole, setFounderRole] = useState(DEFAULT_ABOUT_CONTENT.founder_role ?? "");

  const [existingImageUrl, setExistingImageUrl] = useState(DEFAULT_ABOUT_CONTENT.image_url);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("about_section")
          .select("*")
          .eq("id", "main")
          .maybeSingle();

        if (!active) return;

        if (error) {
          if (error.message.includes("does not exist") || error.code === "42P01" || error.code === "PGRST205") {
            setTableMissing(true);
          } else {
            setNotice({ type: "error", text: error.message });
          }
        } else if (data) {
          const about = mapRowToAbout(data as Record<string, unknown>);
          setTitle(about.title);
          setQuote(about.quote ?? "");
          setDescription(about.description);
          setFounderName(about.founder_name ?? "");
          setFounderRole(about.founder_role ?? "");
          setExistingImageUrl(about.image_url);
        }
      } catch (err) {
        if (!active) return;
        setNotice({
          type: "error",
          text: err instanceof Error ? err.message : "Gagal memuat data bagian Tentang.",
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!title.trim() || !description.trim()) {
      setNotice({ type: "error", text: "Judul dan deskripsi wajib diisi." });
      return;
    }

    if (!imageFile && !existingImageUrl.trim()) {
      setNotice({ type: "error", text: "Foto bagian Tentang wajib diisi." });
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      let finalImageUrl = existingImageUrl.trim();

      if (imageFile) {
        const ext = imageFile.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const base = slugify(imageFile.name.replace(/\.[^.]+$/, "")) || "tentang";
        const path = `about/${Date.now()}-${base}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, imageFile, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          throw new Error(`Gagal upload foto: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        finalImageUrl = urlData.publicUrl;
      }

      const payload = {
        id: "main",
        title: title.trim(),
        quote: quote.trim() || null,
        description: description.trim(),
        image_url: finalImageUrl,
        founder_name: founderName.trim() || null,
        founder_role: founderRole.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("about_section")
        .upsert(payload, { onConflict: "id" });

      if (error) throw new Error(error.message);

      setExistingImageUrl(finalImageUrl);
      setImageFile(null);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl("");
      }

      await refreshPublicContent();
      setNotice({
        type: "success",
        text: "Bagian 04 · Tentang berhasil disimpan dan langsung diperbarui di Beranda!",
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menyimpan perubahan.",
      });
    } finally {
      setSaving(false);
    }
  };

  const activePreview = imagePreviewUrl || existingImageUrl;
  const labelClasses = "block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone";
  const inputClasses =
    "mt-2 w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-stone/50 focus:border-ink focus:outline-none";

  return (
    <AdminShell>
      <div className="border-b border-line pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          Manajemen Konten Beranda
        </p>
        <h1 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Kelola 04 · Tentang
        </h1>
        <p className="mt-1.5 text-xs text-stone sm:text-sm">
          Ubah foto profil/studio, judul, kutipan tagline, deskripsi, dan nama pemilik yang tampil di Beranda.
        </p>
      </div>

      {tableMissing && (
        <div className="mt-6 border border-amber-700/30 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Tabel `about_section` belum dibuat di Supabase.</p>
          <p className="mt-1 text-xs leading-relaxed">
            Buka Dashboard Supabase → <strong>SQL Editor</strong> → jalankan isi file{" "}
            <code className="font-mono">supabase/schema-about.sql</code>, lalu refresh halaman ini.
          </p>
        </div>
      )}

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

      {loading ? (
        <div className="mt-8 border border-line bg-paper p-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-stone">
          Memuat data bagian Tentang...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Kolom Kiri: Upload & Pratinjau Foto */}
          <div className="border border-line bg-paper p-6 lg:col-span-5">
            <h2 className="border-b border-line pb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
              Foto Profil / Studio
            </h2>

            <div className="mt-5 aspect-[4/5] w-full overflow-hidden border border-line bg-sand">
              {activePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activePreview}
                  alt="Pratinjau foto bagian Tentang"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-xs text-stone">
                  Belum ada foto
                </div>
              )}
            </div>

            <div className="mt-5 space-y-3">
              <label htmlFor="about-photo" className={labelClasses}>
                Upload Foto Baru
              </label>
              <input
                id="about-photo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full cursor-pointer border border-line bg-sand/50 px-3 py-2 text-xs text-ink file:mr-3 file:cursor-pointer file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-[11px] file:uppercase file:tracking-[0.15em] file:text-paper"
              />
              {imageFile && imageFile.size > MAX_RECOMMENDED_MB * 1024 * 1024 && (
                <p className="text-xs text-amber-800">
                  Ukuran file {(imageFile.size / (1024 * 1024)).toFixed(1)} MB. Sebaiknya kompres di bawah{" "}
                  {MAX_RECOMMENDED_MB} MB agar cepat dimuat.
                </p>
              )}

              <div>
                <label htmlFor="about-photo-url" className="block text-[11px] text-stone">
                  Atau URL gambar langsung:
                </label>
                <input
                  id="about-photo-url"
                  type="url"
                  value={existingImageUrl}
                  onChange={(e) => setExistingImageUrl(e.target.value)}
                  className={`${inputClasses} text-xs`}
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Judul, Kutipan, Deskripsi, Nama Pemilik */}
          <div className="border border-line bg-paper p-6 sm:p-8 lg:col-span-7">
            <h2 className="border-b border-line pb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
              Teks &amp; Deskripsi
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="about-title" className={labelClasses}>
                  Judul Bagian *
                </label>
                <input
                  id="about-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Di balik Sekalarupa"
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="about-quote" className={labelClasses}>
                  Kutipan / Tagline (Opsional)
                </label>
                <input
                  id="about-quote"
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="“Tatar Rupa Mawa Bagja” — Menata wujud dan ruang yang menghadirkan kebahagiaan."
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="about-description" className={labelClasses}>
                  Deskripsi *
                </label>
                <textarea
                  id="about-description"
                  rows={8}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tulis cerita studio Anda. Tekan Enter dua kali untuk membuat paragraf baru."
                  className={inputClasses}
                />
                <p className="mt-1.5 text-[11px] text-stone">
                  Tips: Beri satu baris kosong (tekan Enter 2x) untuk memisahkan antar paragraf.
                </p>
              </div>

              <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="about-founder" className={labelClasses}>
                    Nama Pemilik / Pendiri
                  </label>
                  <input
                    id="about-founder"
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="M Fahmi Shofiyulloh"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="about-role" className={labelClasses}>
                    Jabatan / Peran
                  </label>
                  <input
                    id="about-role"
                    type="text"
                    value={founderRole}
                    onChange={(e) => setFounderRole(e.target.value)}
                    placeholder="Pendiri & Principal Architect"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-line pt-6">
              <button
                type="submit"
                disabled={saving || tableMissing}
                className="cursor-pointer bg-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
