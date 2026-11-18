import { getPublishedTestimonials } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Bagian 06 · Testimoni: mengambil ulasan klien tayang dari Supabase (dikelola lewat Admin CMS). */
export async function Testimonials() {
  const { items, isFallback } = await getPublishedTestimonials();

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="testimoni" className="border-t border-line bg-sand py-20 sm:py-24">
      <Container>
        <SectionHeading
          index="06"
          eyebrow="Testimoni"
          title="Kesan klien"
          description={
            isFallback
              ? "Cerita pengalaman merancang ruang bersama Sekalarupa. (Saat ini masih berisi teks contoh/placeholder.)"
              : "Cerita pengalaman merancang ruang bersama Sekalarupa."
          }
        />

        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={item.id} className="bg-paper transition-colors duration-300 hover:bg-sand/50">
              <Reveal delay={(index % 3) * 80} className="flex h-full flex-col justify-between p-6 sm:p-7">
                <div>
                  <span aria-hidden="true" className="font-serif text-3xl leading-none text-accent">
                    “
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-ink sm:text-sm">{item.quote}</p>
                </div>

                <div className="mt-6 border-t border-line pt-4">
                  <p className="font-sans text-xs font-semibold tracking-wide text-ink">
                    {item.client_name}
                  </p>
                  {item.project_label && (
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                      {item.project_label}
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
