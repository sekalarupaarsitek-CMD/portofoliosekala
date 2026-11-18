import { siteConfig } from "@/lib/site";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";

/** Data terstruktur JSON-LD agar Google mengenali profil bisnis Sekalarupa dengan baik. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.fullName,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}/images/logo-circle.png`,
  email: siteConfig.email,
  telephone: `+${siteConfig.whatsappNumber}`,
  founder: {
    "@type": "Person",
    name: siteConfig.founder,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cililin",
    addressRegion: "Bandung Barat, Jawa Barat",
    addressCountry: "ID",
  },
  sameAs: siteConfig.socials.map((s) => s.href),
};

/** Landing page: urutan bagian sesuai PRD bagian 5. */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Services />
      <FeaturedProjects />
      <Process />
      <About />
      <Contact />
      <Testimonials />
      <Faq />
    </>
  );
}
