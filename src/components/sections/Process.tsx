import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  { title: "Konsultasi", description: "Mengenal kebutuhan, kebiasaan, dan anggaran Anda." },
  { title: "Survey Lokasi", description: "Mapping area: mengukur dan mempelajari kondisi lahan atau bangunan." },
  { title: "Proposal Desain", description: "Menyusun arah desain, lingkup pekerjaan, dan penawaran." },
  { title: "Desain", description: "Denah, desain interior, dan desain eksterior." },
  { title: "Gambar Kerja", description: "Skematik desain, MEP, dan detailing sebagai panduan pembangunan." },
  { title: "Serah Terima", description: "Seluruh dokumen desain diserahkan kepada Anda." },
] as const;

/** Proses kerja: 6 langkah berurutan. */
export function Process() {
  return (
    <section className="border-t border-line py-20 sm:py-24">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Proses Kerja"
          title="Langkah demi langkah, jelas dan terarah"
          description="Alur kerja terstruktur dari diskusi awal hingga dokumen siap bangun."
        />

        <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="bg-paper transition-colors duration-300 hover:bg-sand">
              <Reveal delay={index * 80} className="h-full p-6">
                <span className="font-mono text-xs tracking-[0.2em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-sans text-sm font-semibold tracking-wide text-ink sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-stone">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
