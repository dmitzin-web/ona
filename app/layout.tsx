import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Analytics, GoogleMeasurement } from "@/components/Analytics";
import { AskOna } from "@/components/assistant/AskOna";
import { EditThisPage } from "@/components/admin/EditThisPage";
import { themeCss } from "@/lib/theme";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { site } from "@/lib/site";
import { chrome } from "@/lib/chrome";
import seoSettings from "@/content/seo.json";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { satoshi } from "./fonts";
import "./globals.css";

// Default title, title pattern, category and the skip link are in
// content/chrome.json (/admin → Header, footer & shared blocks → Every page).
// The description is Company details → Short description.
const t = chrome.everyPage;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: t.defaultTitle,
    template: t.titleTemplate,
  },
  description: site.shortDescription,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, email: true, address: true },
  category: t.category,
  alternates: { canonical: site.url },
  // Search Console / Bing Webmaster verification, pasted in the admin
  // (SEO → Verification codes). Empty means no tag is written.
  ...(seoSettings.verification.google || seoSettings.verification.bing
    ? {
        verification: {
          ...(seoSettings.verification.google ? { google: seoSettings.verification.google } : {}),
          ...(seoSettings.verification.bing ? { other: { "msvalidate.01": seoSettings.verification.bing } } : {}),
        },
      }
    : {}),
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: t.defaultTitle,
    description: site.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: t.defaultTitle,
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
        {/* The site's colours and corner rounding, chosen in the admin
            (/admin → Appearance), as overrides of the defaults in
            globals.css (lib/theme.ts). React hoists this into <head>.
            Nothing is emitted while every colour is the designed default,
            so those pages are byte-for-byte what they were. */}
        {themeCss() ? (
          <style id="ona-theme" href="ona-theme" precedence="high">
            {themeCss()}
          </style>
        ) : null}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-brand focus:px-3 focus:py-2 focus:text-charcoal"
        >
          {t.skipLink}
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
        <EditThisPage />
        <Analytics />
        <GoogleMeasurement />
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
