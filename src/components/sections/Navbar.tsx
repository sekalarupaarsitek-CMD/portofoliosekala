"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig, getWhatsAppLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Navbar dengan animasi perubahan warna halus:
 * - Saat mentok di atas (Beranda): latar transparan, teks putih, logo putih.
 * - Saat di-scroll ke bawah: latar putih krem, teks hitam, logo hitam.
 */
export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Warna putih hanya di Beranda (di atas foto gelap), saat belum di-scroll, dan menu HP tertutup.
  // Halaman lain (misal /portofolio) berlatar terang, jadi langsung pakai teks & logo hitam.
  const isHome = pathname === "/";
  const isAtTop = isHome && !isScrolled && !isOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out ${
        isAtTop
          ? "border-b border-white/15 bg-transparent text-white"
          : "border-b border-line bg-paper/95 text-ink shadow-xs backdrop-blur-md"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        {/* Logo Resmi Sekalarupa (Transisi halus antara Logo Putih & Logo Hitam) */}
        <Link href="/" onClick={closeMenu} className="relative inline-flex items-center">
          <Image
            src="/images/logo-light.png"
            alt={siteConfig.fullName}
            width={220}
            height={75}
            loading="eager"
            className={`h-9 w-auto transition-opacity duration-500 ease-in-out sm:h-11 ${
              isAtTop ? "opacity-100" : "opacity-0"
            }`}
          />
          <Image
            src="/images/logo-dark.png"
            alt=""
            aria-hidden="true"
            width={220}
            height={75}
            loading="eager"
            className={`absolute inset-0 h-9 w-auto transition-opacity duration-500 ease-in-out sm:h-11 ${
              isAtTop ? "opacity-0" : "opacity-100"
            }`}
          />
        </Link>

        {/* Navigasi Desktop */}
        <nav aria-label="Menu utama" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${
                isAtTop ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-500 ${
              isAtTop
                ? "border-white/60 text-white hover:bg-white hover:text-ink"
                : "border-ink bg-ink text-paper hover:bg-ink/85"
            }`}
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </nav>

        {/* Tombol Garis Tiga (Mobile) */}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="menu-mobile"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          className={`relative -mr-2 flex h-10 w-10 flex-col items-center justify-center gap-1.5 transition-colors duration-500 md:hidden ${
            isAtTop ? "text-white" : "text-ink"
          }`}
        >
          <span
            className={`h-0.5 w-6 bg-current transition-transform duration-300 ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-current transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-current transition-transform duration-300 ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </Container>

      {/* Menu Mobile */}
      <nav
        id="menu-mobile"
        aria-label="Menu utama"
        className={`overflow-hidden border-line bg-paper text-ink transition-[max-height] duration-500 md:hidden ${
          isOpen ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <Container className="flex flex-col py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="border-b border-line py-3.5 font-sans text-sm font-medium uppercase tracking-[0.2em] text-ink/80 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mt-5 inline-flex items-center justify-center gap-2 bg-ink px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-paper"
          >
            <WhatsAppIcon />
            Chat via WhatsApp
          </a>
        </Container>
      </nav>
    </header>
  );
}
