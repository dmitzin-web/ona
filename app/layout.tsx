import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { AskOna } from "@/components/assistant/AskOna";
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
  // No `icons` entry. This pointed at /favicon.ico, which does not exist
  // and returned 404 in production — the site has been shipping with no
  // tab icon at all. app/icon.svg now supplies it through Next's file
  // convention, which emits the <link> itself; declaring icons here as
  // well would override that and reinstate the broken path.
};

export const viewport: Viewport = {
  // Mobile browser chrome. Was the old charcoal ground; the page now
  // opens with the deep-teal status strip, so this continues it upward
  // instead of putting a black bar above a white site.
  themeColor: "#073b3a",
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
      <body className="min-h-screen bg-charcoal font-sans text-ivory antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-brand focus:px-3 focus:py-2 focus:text-charcoal"
        >
          Skip to content
        </a>
        {/* One sticky unit, not two independent ones. The deep-teal status
            strip is what gives the header an edge; if only the header
            stuck, the strip scrolled away and left a white bar on white
            content. Sticking them together keeps the dark line pinned to
            the top of the viewport at every scroll position — and keeps
            "24/7 crew available" permanently visible, which for a company
            whose entire promise is that someone answers at 3am is worth
            the 32px it costs. */}
        <div className="sticky top-0 z-50">
          <EmergencyBanner />
          <Header />
        </div>
        <main id="main">{children}</main>
        <Footer />
        <AskOna />
        <Analytics />
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
