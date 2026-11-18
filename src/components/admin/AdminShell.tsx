"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";

/**
 * Pelindung rute Admin + Header navigasi Admin CMS.
 * Mengecek sesi login ke Supabase Auth. Jika belum login, otomatis diarahkan ke /admin/login.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;

      if (error || !data.user) {
        router.replace("/admin/login");
        return;
      }

      setAdminEmail(data.user.email ?? "Admin");
      setChecking(false);
    };

    verifyUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/admin/login");
      } else {
        setAdminEmail(session.user.email ?? "Admin");
        setChecking(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone">
          Memeriksa sesi admin...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="inline-flex items-center">
              <Image
                src="/images/logo-dark.png"
                alt={siteConfig.fullName}
                width={180}
                height={61}
                className="h-8 w-auto sm:h-9"
              />
            </Link>
            <span className="hidden border border-line bg-sand px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-stone sm:inline-block">
              Admin CMS
            </span>
          </div>

          <nav aria-label="Menu admin" className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/admin"
              className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                pathname === "/admin" || pathname.startsWith("/admin/projects")
                  ? "text-ink underline underline-offset-4"
                  : "text-stone hover:text-ink"
              }`}
            >
              Proyek
            </Link>
            <Link
              href="/admin/beranda"
              className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                pathname.startsWith("/admin/beranda")
                  ? "text-ink underline underline-offset-4"
                  : "text-stone hover:text-ink"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/admin/tentang"
              className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                pathname.startsWith("/admin/tentang")
                  ? "text-ink underline underline-offset-4"
                  : "text-stone hover:text-ink"
              }`}
            >
              Tentang
            </Link>
            <Link
              href="/admin/testimoni"
              className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                pathname.startsWith("/admin/testimoni")
                  ? "text-ink underline underline-offset-4"
                  : "text-stone hover:text-ink"
              }`}
            >
              Testimoni
            </Link>
            <Link
              href="/admin/faq"
              className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                pathname.startsWith("/admin/faq")
                  ? "text-ink underline underline-offset-4"
                  : "text-stone hover:text-ink"
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hidden text-xs font-medium uppercase tracking-[0.16em] text-stone transition-colors hover:text-ink md:inline-block"
            >
              Website ↗
            </Link>
            <span className="hidden h-4 w-px bg-line md:inline-block" aria-hidden="true" />
            <span className="hidden max-w-[180px] truncate text-xs text-stone md:inline-block">
              {adminEmail}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="cursor-pointer border border-line px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-50"
            >
              {loggingOut ? "Keluar..." : "Keluar"}
            </button>
          </nav>
        </Container>
      </header>

      <main className="py-10 sm:py-12">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
