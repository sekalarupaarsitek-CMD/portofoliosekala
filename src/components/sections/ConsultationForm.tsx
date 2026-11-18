"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site";

const DESIGN_TYPES = ["Arsitektur", "Interior", "Eksterior", "Furniture"] as const;

/**
 * Form Konsultasi bersih & presisi.
 * Saat dikirim, data langsung disusun rapi dan diteruskan ke WhatsApp resmi Sekalarupa.
 */
export function ConsultationForm() {
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [luasLahan, setLuasLahan] = useState("");
  const [jenisDesain, setJenisDesain] = useState<string>("Arsitektur");
  const [kontak, setKontak] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = [
      "Halo Sekalarupa Studio Arsitek, saya ingin berkonsultasi:",
      "",
      `• Nama: ${nama}`,
      `• Lokasi Proyek: ${lokasi}`,
      `• Luas Lahan: ${luasLahan}`,
      `• Jenis Desain: ${jenisDesain}`,
      `• Kontak/WA: ${kontak}`,
      `• Email: ${email}`,
    ].join("\n");

    const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const inputClasses =
    "mt-2 w-full border-b border-line bg-transparent pb-2.5 text-sm text-ink placeholder:text-stone/50 focus:border-ink focus:outline-none transition-colors";
  const labelClasses = "block font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-stone";

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-paper p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ink">
          Form Konsultasi
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
          Respon via WhatsApp
        </span>
      </div>

      <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Nama */}
        <div>
          <label htmlFor="form-nama" className={labelClasses}>
            Nama Lengkap
          </label>
          <input
            id="form-nama"
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Anda"
            className={inputClasses}
          />
        </div>

        {/* 2. Lokasi */}
        <div>
          <label htmlFor="form-lokasi" className={labelClasses}>
            Lokasi
          </label>
          <input
            id="form-lokasi"
            type="text"
            required
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            placeholder="Kota / Kabupaten"
            className={inputClasses}
          />
        </div>

        {/* 3. Luas Lahan */}
        <div>
          <label htmlFor="form-luas" className={labelClasses}>
            Luas Lahan (m²)
          </label>
          <input
            id="form-luas"
            type="text"
            required
            value={luasLahan}
            onChange={(e) => setLuasLahan(e.target.value)}
            placeholder="Contoh: 150 m²"
            className={inputClasses}
          />
        </div>

        {/* 4. Jenis Desain */}
        <div>
          <label htmlFor="form-jenis" className={labelClasses}>
            Jenis Desain
          </label>
          <select
            id="form-jenis"
            value={jenisDesain}
            onChange={(e) => setJenisDesain(e.target.value)}
            className={`${inputClasses} cursor-pointer bg-paper`}
          >
            {DESIGN_TYPES.map((type) => (
              <option key={type} value={type} className="bg-paper text-ink">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Kontak */}
        <div>
          <label htmlFor="form-kontak" className={labelClasses}>
            Kontak (WhatsApp / Telp)
          </label>
          <input
            id="form-kontak"
            type="tel"
            required
            value={kontak}
            onChange={(e) => setKontak(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={inputClasses}
          />
        </div>

        {/* 6. Email */}
        <div>
          <label htmlFor="form-email" className={labelClasses}>
            Email
          </label>
          <input
            id="form-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {submitted ? (
          <p className="text-xs text-stone">
            Data konsultasi telah disiapkan di tab WhatsApp Anda.
          </p>
        ) : (
          <p className="text-xs text-stone">
            Lengkapi data di atas untuk memulai diskusi rencana desain Anda.
          </p>
        )}

        <button
          type="submit"
          className="inline-flex cursor-pointer items-center justify-center gap-2 bg-ink px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Kirim Konsultasi →
        </button>
      </div>
    </form>
  );
}
