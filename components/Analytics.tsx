import Script from "next/script";
import { ga4Id, gtmId } from "@/lib/measurement";

// Plausible Analytics — cookieless, GDPR/CCPA/WA-MHMDA compliant by default.
// Activates only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set in the environment.
// Self-hosted? Set NEXT_PUBLIC_PLAUSIBLE_HOST as well.
//
// Tracked custom events (see PhoneLink / EmailLink in the same file):
//   - "Call click"
//   - "Email click"
//   - "SMS click"
//   - "Quote submit" (from /quote server action redirect)
//
// View metrics at https://plausible.io/<your-domain>.

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const HOST = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? "https://plausible.io";

// Google Analytics 4 / Tag Manager, added in the admin (SEO → Measurement)
// and checked against their ID patterns in lib/measurement.ts before they
// reach a script URL. Unlike Plausible these set cookies — the privacy
// policy has to say so, and the SEO check reminds the editor until it does.
//
// Tag Manager's <noscript> iframe is deliberately not rendered: it would
// need the container's origin in frame-src, and it only reports visitors
// with JavaScript turned off, who cannot be tracked meaningfully anyway.
export function GoogleMeasurement() {
  if (!ga4Id && !gtmId) return null;
  return (
    <>
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}')`}
        </Script>
      )}
      {ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4Id}')`}
          </Script>
        </>
      )}
    </>
  );
}

export function Analytics() {
  if (!DOMAIN) return null;
  return (
    <>
      <Script
        defer
        data-domain={DOMAIN}
        src={`${HOST}/js/script.outbound-links.tagged-events.js`}
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
    </>
  );
}
