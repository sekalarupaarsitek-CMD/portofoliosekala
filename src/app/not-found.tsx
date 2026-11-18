import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** Halaman 404 kustom bergaya arsitektural Sekalarupa. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-paper text-ink">
      <header className="border-b border-line">
        <Container className="flex h-20 items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/logo-dark.png"
              alt={siteConfig.fullName}
              width={200}
              height={68}
              className="h-9 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-ink"
          >
            Beranda
          </Link>
        </Container>
      </header>

      <section className="py-24">
        <Container>
          <div className="max-w-xl">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-stone">
              <span className="text-accent">404</span>
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              <span>Halaman Tidak Ditemukan</span>
            </p>
            <h1 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Ruang yang Anda cari tidak tersedia.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-stone">
              Halaman ini mungkin telah dipindahkan, dihapus, atau alamat URL yang dimasukkan kurang tepat.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/" variant="primary">
                Kembali ke Beranda
              </ButtonLink>
              <ButtonLink href="/portofolio" variant="outline">
                Lihat Portofolio
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-line py-6">
        <Container>
          <p className="text-xs text-stone">
            {siteConfig.fullName} — <span className="font-serif italic">“{siteConfig.tagline}”</span>
          </p>
        </Container>
      </footer>
    </main>
  );
}
