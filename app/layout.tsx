import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { AskOna } from "@/components/assistant/AskOna";
import { MobileStickyBar } from "@/components/MobileStickyBar";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { site } from "@/lib/site";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { satoshi } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.shortDescription,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, email: true, address: true },
  category: "Home Services",
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US" className={satoshi.variable}>
      <body className="min-h-screen bg-ivory pb-16 font-sans text-charcoal antialiased lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-charcoal focus:px-3 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        <EmergencyBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileStickyBar />
        <AskOna />
        <Analytics />
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
