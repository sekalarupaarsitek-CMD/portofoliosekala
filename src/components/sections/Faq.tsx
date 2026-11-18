import { getPublishedFaqs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

/** Bagian 07 · FAQ: mengambil pertanyaan umum tayang dari Supabase (dikelola lewat Admin CMS). */
export async function Faq() {
  const { items } = await getPublishedFaqs();

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="border-t border-line bg-paper py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              index="07"
              eyebrow="FAQ"
              title="Pertanyaan yang sering diajukan"
              description="Informasi singkat seputar alur konsultasi, cakupan layanan, dan proses perancangan di Sekalarupa."
            />
          </div>

          <div className="lg:col-span-7">
            <FaqAccordion items={items} />
          </div>
        </div>
      </Container>
    </section>
  );
}
