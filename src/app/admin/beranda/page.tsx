"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { HeroTextStyle } from "@/types/content";
import { HERO_TEXT_STYLES } from "@/types/content";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  DEFAULT_HERO_CONTENT,
  HERO_TEXT_STYLE_OPTIONS,
  mapRowToHero,
} from "@/lib/content-mapper";
import { slugify } from "@/lib/slug";
import { AdminShell } from "@/components/admin/AdminShell";
import { refreshPublicContent } from "@/app/admin/actions";

const STORAGE_BUCKET = "project-images";
const MAX_RECOMMENDED_MB = 2;

/** Halaman Admin CMS untuk mengatur Beranda Landing Page / Hero (/admin/beranda). */
export default function AdminHeroPage() {
  const [title, setTitle] = useState(DEFAULT_HERO_CONTENT.title);
  const [tagline, setTagline] = useState(DEFAULT_HERO_CONTENT.tagline ?? "");
  const [description, setDescription] = useState(DEFAULT_HERO_CONTENT.description);
  const [textStyle, setTextStyle] = useState<HeroTextStyle>(DEFAULT_HERO_CONTENT.text_style);

  const [existingBgUrl, setExistingBgUrl] = useState(DEFAULT_HERO_CONTENT.background_image_url);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreviewUrl, setBgPreviewUrl] = useState("");

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
          .from("hero_section")
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
          const hero = mapRowToHero(data as Record<string, unknown>);
          setTitle(hero.title);
          setTagline(hero.tagline ?? "");
          setDescription(hero.description);
          setTextStyle(hero.text_style);
          setExistingBgUrl(hero.background_image_url);
        }
      } catch (err) {
        if (!active) return;
        setNotice({
          type: "error",
          text: err instanceof Error ? err.message : "Gagal memuat data Beranda.",
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
      if (bgPreviewUrl) URL.revokeObjectURL(bgPreviewUrl);
    };
  }, [bgPreviewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (bgPreviewUrl) URL.revokeObjectURL(bgPreviewUrl);
    setBgFile(file);
    setBgPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!title.trim() || !description.trim()) {
      setNotice({ type: "error", text: "Judul dan deskripsi Beranda wajib diisi." });
      return;
    }

    if (!bgFile && !existingBgUrl.trim()) {
      setNotice({ type: "error", text: "Gambar background Beranda wajib diisi." });
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      let finalBgUrl = existingBgUrl.trim();

      if (bgFile) {
        const ext = bgFile.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const base = slugify(bgFile.name.replace(/\.[^.]+$/, "")) || "beranda";
        const path = `hero/${Date.now()}-${base}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, bgFile, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          throw new Error(`Gagal upload gambar background: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        finalBgUrl = urlData.publicUrl;
      }

      const payload = {
        id: "main",
        title: title.trim(),
        tagline: tagline.trim() || null,
        description: description.trim(),
        background_image_url: finalBgUrl,
        text_style: textStyle,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("hero_section")
        .upsert(payload, { onConflict: "id" });

      if (error) throw new Error(error.message);

      setExistingBgUrl(finalBgUrl);
      setBgFile(null);
      if (bgPreviewUrl) {
        URL.revokeObjectURL(bgPreviewUrl);
        setBgPreviewUrl("");
      }

      await refreshPublicContent();
      setNotice({
        type: "success",
        text: "Tampilan Beranda berhasil disimpan dan langsung diperbarui di website publik!",
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menyimpan perubahan Beranda.",
      });
    } finally {
      setSaving(false);
    }
  };

  const activePreview = bgPreviewUrl || existingBgUrl;
  const headingStyleClass = HERO_TEXT_STYLE_OPTIONS[textStyle].headingClass;
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
          Kelola Beranda (Hero)
        </h1>
        <p className="mt-1.5 text-xs text-stone sm:text-sm">
          Ubah gambar background layar penuh, judul utama, tagline, deskripsi, dan pilihan type teks di halaman depan.
        </p>
      </div>

      {tableMissing && (
        <div className="mt-6 border border-amber-700/30 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Tabel `hero_section` belum dibuat di Supabase.</p>
          <p className="mt-1 text-xs leading-relaxed">
            Buka Dashboard Supabase → <strong>SQL Editor</strong> → jalankan isi file{" "}
            <code className="font-mono">supabase/schema-hero.sql</code>, lalu refresh halaman ini.
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
          Memuat data Beranda...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Pratinjau Langsung Tampilan Beranda */}
          <div className="border border-line bg-paper p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone">
                Pratinjau Langsung (Live Preview)
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                {HERO_TEXT_STYLE_OPTIONS[textStyle].label}
              </span>
            </div>

            <div className="relative flex min-h-[260px] items-center overflow-hidden bg-ink p-6 text-white sm:min-h-[320px] sm:p-10">
              {activePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activePreview}
                  alt="Pratinjau background Beranda"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25"
              />
              <div className="relative z-10 max-w-lg">
                <p className={`text-2xl leading-[1.15] text-white sm:text-3xl ${headingStyleClass}`}>
                  {title || "Judul Beranda"}
                </p>
                {tagline && (
                  <p className="mt-2 font-serif text-sm italic tracking-[0.25em] text-white/90 sm:text-base">
                    {tagline}
                  </p>
                )}
                <p className="mt-3 text-xs leading-relaxed text-white/85">
                  {description || "Deskripsi singkat Beranda..."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Kolom Kiri: Upload Background & Pilihan Type Teks */}
            <div className="space-y-6 lg:col-span-5">
              <div className="border border-line bg-paper p-6">
                <h2 className="border-b border-line pb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
                  1. Gambar Background
                </h2>

                <div className="mt-5 space-y-3">
                  <label htmlFor="hero-bg-file" className={labelClasses}>
                    Upload Foto Background Baru
                  </label>
                  <input
                    id="hero-bg-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full cursor-pointer border border-line bg-sand/50 px-3 py-2 text-xs text-ink file:mr-3 file:cursor-pointer file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-[11px] file:uppercase file:tracking-[0.15em] file:text-paper"
                  />
                  <p className="text-[11px] text-stone">
                    Disarankan foto lanskap (mendatar, lebar min. 1600px, ukuran &lt; {MAX_RECOMMENDED_MB} MB).
                  </p>

                  {bgFile && bgFile.size > MAX_RECOMMENDED_MB * 1024 * 1024 && (
                    <p className="text-xs text-amber-800">
                      Ukuran file {(bgFile.size / (1024 * 1024)).toFixed(1)} MB (cukup besar). Sebaiknya dikompres
                      agar halaman depan cepat terbuka di HP.
                    </p>
                  )}

                  <div>
                    <label htmlFor="hero-bg-url" className="block text-[11px] text-stone">
                      Atau tempel URL gambar langsung:
                    </label>
                    <input
                      id="hero-bg-url"
                      type="url"
                      value={existingBgUrl}
                      onChange={(e) => setExistingBgUrl(e.target.value)}
                      className={`${inputClasses} text-xs`}
                    />
                  </div>
                </div>
              </div>

              {/* Pilihan Type Teks */}
              <div className="border border-line bg-paper p-6">
                <h2 className="border-b border-line pb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
                  2. Type Teks Judul
                </h2>

                <div className="mt-4 space-y-2.5">
                  {HERO_TEXT_STYLES.map((styleKey) => {
                    const option = HERO_TEXT_STYLE_OPTIONS[styleKey];
                    const isSelected = textStyle === styleKey;
                    return (
                      <label
                        key={styleKey}
                        className={`flex cursor-pointer items-start gap-3 border p-3.5 transition-colors ${
                          isSelected
                            ? "border-ink bg-sand"
                            : "border-line bg-paper hover:border-ink/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="hero-text-style"
                          value={styleKey}
                          checked={isSelected}
                          onChange={() => setTextStyle(styleKey)}
                          className="mt-1 h-4 w-4 accent-ink"
                        />
                        <span>
                          <span className={`block text-sm text-ink ${option.headingClass}`}>
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-stone">{option.hint}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Judul, Tagline, Deskripsi */}
            <div className="border border-line bg-paper p-6 sm:p-8 lg:col-span-7">
              <h2 className="border-b border-line pb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
                3. Judul &amp; Deskripsi Beranda
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label htmlFor="hero-title" className={labelClasses}>
                    Judul Utama Beranda *
                  </label>
                  <input
                    id="hero-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Wujudkan Hunian yang Membawa Kebahagiaan"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="hero-tagline" className={labelClasses}>
                    Tagline / Subjudul Miring (Opsional)
                  </label>
                  <input
                    id="hero-tagline"
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="tatar rupa mawa bagja"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="hero-description" className={labelClasses}>
                    Deskripsi Singkat *
                  </label>
                  <textarea
                    id="hero-description"
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ceritakan secara ringkas fokus desain studio Anda..."
                    className={inputClasses}
                  />
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
          </div>
        </form>
      )}
    </AdminShell>
  );
}
