import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Semua halaman di bawah /admin diberi `noindex, nofollow`
 * agar tidak pernah muncul di hasil pencarian Google (PRD Bagian 6).
 */
export const metadata: Metadata = {
  title: {
    default: "Admin CMS — Sekalarupa",
    template: "%s | Admin Sekalarupa",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-paper text-ink">{children}</div>;
}
