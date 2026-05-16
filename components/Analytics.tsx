import Script from "next/script";

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
