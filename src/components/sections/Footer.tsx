import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { siteConfig, navLinks } from "@/lib/site";
import { Container } from "@/components/ui/Container";

// Tahun berjalan untuk hak cipta. Disimpan di cache (diperbarui harian)
// karena Next.js versi ini tidak mengizinkan `new Date()` langsung saat render statis.
async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Footer: logo resmi hitam di atas latar terang, menu, sosial media, hak cipta. */
export async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-line bg-paper">
      <Container className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-dark.png"
                alt={siteConfig.fullName}
                width={200}
                height={68}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-2.5 font-serif text-xs italic tracking-[0.2em] text-stone">
              “{siteConfig.tagline}”
            </p>
          </div>

          <nav aria-label="Menu footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ul className="flex gap-6">
            {siteConfig.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-xs text-stone">
          © {year} {siteConfig.fullName}. Hak cipta dilindungi.
        </p>
      </Container>
    </footer>
  );
}
