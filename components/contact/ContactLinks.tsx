import { site } from "@/lib/site";
import { plausibleEvent } from "@/lib/analytics";

// Single source of truth for tap-to-call / mailto / sms anchors.
// Every contact-point CTA on the site goes through these so:
//   1. Conversion events fire on every click via Plausible tagged classes.
//   2. The phone/email values stay in sync with lib/site.ts.
//   3. Styling can be retuned in one place.

type Common = {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export function PhoneLink({ className = "", children, ariaLabel }: Common) {
  return (
    <a
      href={`tel:${site.phone}`}
      aria-label={ariaLabel ?? `Call ${site.name} 24/7 at ${site.phoneDisplay}`}
      className={`${plausibleEvent.call} ${className}`}
    >
      {children}
    </a>
  );
}

export function EmailLink({ className = "", children, ariaLabel }: Common) {
  return (
    <a
      href={`mailto:${site.email}`}
      aria-label={ariaLabel ?? `Email ${site.name} at ${site.email}`}
      className={`${plausibleEvent.email} ${className}`}
    >
      {children}
    </a>
  );
}

export function SmsLink({ className = "", children, ariaLabel }: Common) {
  return (
    <a
      href={`sms:${site.phone}`}
      aria-label={ariaLabel ?? `Text ${site.name} at ${site.phoneDisplay}`}
      className={`${plausibleEvent.sms} ${className}`}
    >
      {children}
    </a>
  );
}
