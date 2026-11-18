import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Font isi & heading bersih (sans-serif)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Font aksen & tagline (serif elegan)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#121417",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Sekalarupa",
    "Sekalarupa Studio Arsitek",
    "jasa arsitek Bandung",
    "jasa arsitek Bandung Barat",
    "jasa desain rumah",
    "desain interior",
    "desain eksterior",
    "custom furniture",
    "desain landscape",
    "arsitek Cililin",
  ],
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.fullName,
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/logo-circle.png",
        width: 512,
        height: 512,
        alt: siteConfig.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/logo-circle.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
