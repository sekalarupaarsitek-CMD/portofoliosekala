"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { FaqItem } from "@/types/content";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { mapRowToFaq } from "@/lib/content-mapper";
import { AdminShell } from "@/components/admin/AdminShell";
import { refreshPublicContent } from "@/app/admin/actions";

/** Halaman Admin CMS untuk mengelola FAQ (/admin/faq). */
export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableMissing, setTableMissing] = useState(false);

  // State form tambah / edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FaqItem | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("faqs")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!active) return;
        if (error) {
          if (error.message.includes("does not exist") || error.code === "42P01" || error.code === "PGRST205") {
            setTableMissing(true);
          } else {
            setNotice({ type: "error", text: error.message });
          }
        } else {
          setItems((data ?? []).map((row) => mapRowToFaq(row as Record<string, unknown>)));
        }
      } catch (err) {
        if (!active) return;
        setNotice({
          type: "error",
          text: err instanceof Error ? err.message : "Gagal memuat data FAQ.",
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

  const resetForm = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setSortOrder("0");
    setIsPublished(true);
  };

  const startEdit = (item: FaqItem) => {
    setNotice(null);
    setEditingId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setSortOrder(String(item.sort_order));
    setIsPublished(item.is_published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!question.trim() || !answer.trim()) {
      setNotice({ type: "error", text: "Pertanyaan dan jawaban wajib diisi." });
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const parsedSort = Number.parseInt(sortOrder.trim(), 10);
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        sort_order: Number.isNaN(parsedSort) ? 0 : parsedSort,
        is_published: isPublished,
      };

      if (editingId) {
        const { data, error } = await supabase
          .from("faqs")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single();

        if (error) throw new Error(error.message);
        const updated = mapRowToFaq(data as Record<string, unknown>);
        setItems((prev) =>
          prev
            .map((item) => (item.id === editingId ? updated : item))
            .sort((a, b) => a.sort_order - b.sort_order),
        );
        setNotice({ type: "success", text: "FAQ berhasil diperbarui." });
      } else {
        const { data, error } = await supabase
          .from("faqs")
          .insert(payload)
          .select()
          .single();

        if (error) throw new Error(error.message);
        const created = mapRowToFaq(data as Record<string, unknown>);
        setItems((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
        setNotice({ type: "success", text: "FAQ baru berhasil ditambahkan." });
      }

      resetForm();
      await refreshPublicContent();
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menyimpan FAQ.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (item: FaqItem) => {
    setNotice(null);
    setBusyId(item.id);
    const nextValue = !item.is_published;

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("faqs")
        .update({ is_published: nextValue })
        .eq("id", item.id);

      if (error) throw new Error(error.message);
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, is_published: nextValue } : row)),
      );
      await refreshPublicContent();
      setNotice({
        type: "success",
        text: nextValue ? "FAQ sekarang TAYANG di Beranda." : "FAQ disembunyikan menjadi DRAFT.",
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal mengubah status FAQ.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const target = confirmDelete;
    setNotice(null);
    setBusyId(target.id);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("faqs").delete().eq("id", target.id);
      if (error) throw new Error(error.message);

      setItems((prev) => prev.filter((row) => row.id !== target.id));
      if (editingId === target.id) resetForm();
      setConfirmDelete(null);

      await refreshPublicContent();
      setNotice({ type: "success", text: "FAQ berhasil dihapus." });
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menghapus FAQ.",
      });
    } finally {
      setBusyId(null);
    }
  };

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
          Kelola FAQ
        </h1>
        <p className="mt-1.5 text-xs text-stone sm:text-sm">
          Tambah, ubah, atur urutan, atau sembunyikan pertanyaan umum yang tampil di bagian 07 · FAQ.
        </p>
      </div>

      {tableMissing && (
        <div className="mt-6 border border-amber-700/30 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Tabel `faqs` belum dibuat di Supabase.</p>
          <p className="mt-1 text-xs leading-relaxed">
            Buka Dashboard Supabase → <strong>SQL Editor</strong> → jalankan isi file{" "}
            <code className="font-mono">supabase/schema-content.sql</code>, lalu refresh halaman ini.
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

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="mt-8 border border-line bg-paper p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink">
            {editingId ? "Edit Pertanyaan FAQ" : "+ Tambah FAQ Baru"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] text-stone hover:text-ink"
            >
              Batalkan Edit
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-4">
          <div className="sm:col-span-3">
            <label htmlFor="faq-question" className={labelClasses}>
              Pertanyaan *
            </label>
            <input
              id="faq-question"
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Berapa lama waktu pengerjaan desain rumah?"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="faq-sort" className={labelClasses}>
              Urutan Tampil
            </label>
            <input
              id="faq-sort"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="faq-answer" className={labelClasses}>
            Jawaban *
          </label>
          <textarea
            id="faq-answer"
            rows={4}
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tulis jawaban yang jelas dan ringkas..."
            className={inputClasses}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            Tayangkan langsung di Beranda
          </label>

          <button
            type="submit"
            disabled={saving || tableMissing}
            className="cursor-pointer bg-ink px-7 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan FAQ"}
          </button>
        </div>
      </form>

      {/* Daftar FAQ */}
      <div className="mt-8">
        {loading ? (
          <div className="border border-line bg-paper p-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-stone">
            Memuat data FAQ...
          </div>
        ) : items.length === 0 ? (
          <div className="border border-line bg-paper p-10 text-center text-sm text-stone">
            Belum ada FAQ di database. Tambahkan FAQ pertama melalui form di atas.
          </div>
        ) : (
          <div className="divide-y divide-line border border-line bg-paper">
            {items.map((item) => {
              const isBusy = busyId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-sand/40 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="max-w-2xl">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Urutan #{item.sort_order}
                    </span>
                    <h3 className="mt-1 font-sans text-sm font-semibold text-ink sm:text-base">
                      {item.question}
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-stone sm:text-sm">
                      {item.answer}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleTogglePublished(item)}
                      className={`cursor-pointer border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors disabled:opacity-50 ${
                        item.is_published
                          ? "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800"
                          : "border-line bg-sand text-stone hover:border-ink hover:text-ink"
                      }`}
                    >
                      {item.is_published ? "● Tayang" : "○ Draft"}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="cursor-pointer border border-ink px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setConfirmDelete(item)}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-xs"
        >
          <div className="w-full max-w-md border border-line bg-paper p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-700">Konfirmasi Hapus</p>
            <h2 className="mt-2 font-sans text-lg font-semibold text-ink">
              Hapus pertanyaan FAQ ini?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-stone">
              &ldquo;{confirmDelete.question}&rdquo; akan dihapus permanen dari database.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
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
