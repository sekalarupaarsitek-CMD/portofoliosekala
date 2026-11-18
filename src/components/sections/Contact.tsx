import { siteConfig, getWhatsAppLink, getGmailLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ConsultationForm } from "@/components/sections/ConsultationForm";

/** Bagian 05 · Kontak: ringkas, presisi, tombol Konsultasi & EMAIL, disertai Form Konsultasi di bawahnya. */
export function Contact() {
  return (
    <section id="kontak" className="border-t border-line bg-paper py-20 text-ink sm:py-24">
      <Container>
        {/* Baris Atas: Judul Kiri & Tombol Kanan */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="05" eyebrow="Kontak" title="Hubungi kami" />

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={getWhatsAppLink()} variant="primary" external>
              <WhatsAppIcon />
              Konsultasi
            </ButtonLink>
            <ButtonLink href={getGmailLink()} variant="outline" external>
              EMAIL
            </ButtonLink>
          </div>
        </div>

        {/* Grid Informasi Singkat & Presisi (4 Kotak Sejajar) */}
        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-paper p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">WhatsApp</p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-xs font-medium text-ink underline-offset-4 hover:underline sm:text-sm"
            >
              {siteConfig.whatsappDisplay}
            </a>
          </div>

          <div className="bg-paper p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Email</p>
            <a
              href={getGmailLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate text-xs font-medium text-ink underline-offset-4 hover:underline sm:text-sm"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="bg-paper p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Lokasi</p>
            <p className="mt-2 text-xs font-medium text-ink sm:text-sm">{siteConfig.location}</p>
          </div>

          <div className="bg-paper p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Sosial Media</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink">
              {siteConfig.socials.map((social, idx) => (
                <span key={social.label} className="inline-flex items-center gap-3">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {social.label}
                  </a>
                  {idx < siteConfig.socials.length - 1 && (
                    <span aria-hidden="true" className="text-stone">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form Konsultasi di Bawah */}
        <div className="mt-6">
          <ConsultationForm />
        </div>
      </Container>
    </section>
  );
}
