import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const SERVICES = [
  {
    title: "Rumah Tinggal",
    description:
      "Perancangan hunian baru maupun pengembangan ruang yang nyaman, tanggap iklim tropis, dan sesuai karakter penghuninya.",
  },
  {
    title: "Desain Interior",
    description:
      "Penataan ruang dalam yang hangat dan fungsional, memadukan pencahayaan alami serta palet material yang jujur.",
  },
  {
    title: "Desain Eksterior",
    description:
      "Eksplorasi fasad, selubung bangunan, dan gubahan massa yang proporsional, tegas, serta selaras dengan lingkungan.",
  },
  {
    title: "Custom Furniture",
    description:
      "Perancangan perabot khusus yang presisi, ergonomis, dan dirancang menyatu harmonis dengan geometri ruang.",
  },
  {
    title: "Landscape",
    description:
      "Penataan ruang luar dan area hijau yang asri untuk menghadirkan ketenangan serta menyatukan alam dengan bangunan.",
  },
] as const;

/** Bagian layanan: 5 kotak presisi sejajar dengan ukuran dan tipografi yang ringkas. */
export function Services() {
  return (
    <section id="layanan" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="Layanan"
          title="Apa yang kami kerjakan"
          description="Setiap proyek dimulai dari mendengarkan. Berikut cakupan layanan yang kami hadirkan."
        />

        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {SERVICES.map((service, index) => (
            <div key={service.title} className="bg-paper transition-colors duration-300 hover:bg-sand">
              <Reveal delay={index * 70} className="flex h-full flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-accent">0{index + 1}</span>
                    <span aria-hidden="true" className="h-1 w-1 bg-accent/60" />
                  </div>
                  <h3 className="mt-4 font-sans text-sm font-semibold tracking-wide text-ink sm:text-base">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-stone">{service.description}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
