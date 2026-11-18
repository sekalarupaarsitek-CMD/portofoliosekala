import type { ReactNode } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

/** Kerangka semua halaman publik: tombol loncat konten (aksesibilitas), navbar di atas, footer di bawah. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:uppercase focus:tracking-[0.18em] focus:text-paper"
      >
        Langsung ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama">{children}</main>
      <Footer />
    </>
  );
}
