"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { siteConfig } from "@/lib/site";

/** Halaman Login Admin (/admin/login) menggunakan Supabase Auth (Email + Password). */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Jika admin sudah login, langsung arahkan ke /admin
  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) {
        router.replace("/admin");
      } else {
        setCheckingSession(false);
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage("Email atau password salah. Silakan periksa kembali.");
        } else {
          setErrorMessage(`Gagal masuk: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungi Supabase.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone">Memuat...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand px-5 py-12">
      <div className="w-full max-w-md border border-line bg-paper p-8 sm:p-10">
        <div className="flex flex-col items-center border-b border-line pb-6 text-center">
          <Image
            src="/images/logo-dark.png"
            alt={siteConfig.fullName}
            width={200}
            height={68}
            className="h-10 w-auto"
          />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-stone">
            Admin CMS Login
          </p>
        </div>

        <h1 className="mt-6 text-center font-sans text-lg font-semibold tracking-tight text-ink">
          Masuk ke Pengelolaan Portofolio
        </h1>

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 border border-red-700/30 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-900"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone"
            >
              Email Admin
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sekalarupa.arsitek@gmail.com"
              className="mt-2 w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-stone/50 focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-stone/50 focus:border-ink focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8 border-t border-line pt-5 text-center">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
          >
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </main>
  );
}
