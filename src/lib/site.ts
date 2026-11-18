/**
 * PENGATURAN WEBSITE
 * Semua info bisnis dikumpulkan di sini agar mudah diganti di satu tempat.
 */

const DEFAULT_WHATSAPP = "6287857523074";

/** Ubah format nomor 08xx menjadi 628xx agar tautan wa.me selalu valid. */
function normalizeWhatsApp(raw?: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits || digits === "6281234567890") {
    return DEFAULT_WHATSAPP;
  }
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

export const siteConfig = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://sekalarupa.com").replace(/\/$/, ""),
  name: "Sekalarupa",
  subTitle: "Studio Arsitektur",
  fullName: "Sekalarupa Studio Arsitek",
  tagline: "Tatar Rupa Mawa Bagja",
  founder: "M Fahmi Shofiyulloh",
  description:
    "Sekalarupa Studio Arsitek — Jasa desain arsitektur untuk rumah tinggal, interior, eksterior, furniture, dan landscape. Tatar Rupa Mawa Bagja: Menata wujud ruang yang membawa kebahagiaan.",
  whatsappNumber: normalizeWhatsApp(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  whatsappDisplay: "087857523074",
  email: "sekalarupa.arsitek@gmail.com",
  location: "Cililin, Bandung Barat",
  workingHours: "Senin – Jumat, 09.00 – 17.00 WIB",
  socials: [
    {
      label: "Instagram",
      handle: "@sekalarupa.arsitek",
      href: "https://www.instagram.com/sekalarupa.arsitek/",
    },
    {
      label: "TikTok",
      handle: "@sekalarupa",
      href: "https://www.tiktok.com/@sekalarupa",
    },
    {
      label: "YouTube",
      handle: "@SekalarupaArsitek",
      href: "https://www.youtube.com/@SekalarupaArsitek",
    },
  ],
} as const;

export const navLinks = [
  { label: "Layanan", href: "/#layanan" },
  { label: "Portofolio", href: "/#portofolio" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Kontak", href: "/#kontak" },
] as const;

/** Membuat tautan WhatsApp (wa.me) dengan pesan pembuka otomatis. */
export function getWhatsAppLink(
  message = "Halo Sekalarupa, saya tertarik untuk konsultasi desain. Boleh minta info lebih lanjut?",
): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Membuat tautan pengiriman email via Gmail Web (selalu berfungsi di browser PC/HP). */
export function getGmailLink(
  subject = "Konsultasi Desain Arsitektur — Sekalarupa",
  body = "Halo Sekalarupa Studio Arsitek,\n\nSaya tertarik untuk berkonsultasi mengenai rencana desain saya.",
): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    siteConfig.email,
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Membuat tautan mailto standar untuk aplikasi email bawaan. */
export function getMailtoLink(
  subject = "Konsultasi Desain Arsitektur — Sekalarupa",
  body = "Halo Sekalarupa Studio Arsitek,\n\nSaya tertarik untuk berkonsultasi mengenai rencana desain saya.",
): string {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
