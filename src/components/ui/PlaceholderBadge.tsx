/** Label kecil penanda bahwa foto/teks masih contoh. Hapus saat konten asli sudah ada. */
export function PlaceholderBadge({ label = "Foto contoh" }: { label?: string }) {
  return (
    <span className="pointer-events-none absolute left-3 top-3 z-10 border border-white/10 bg-black/60 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/75 backdrop-blur-sm">
      {label}
    </span>
  );
}
