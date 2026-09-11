import { site } from "@/lib/site";
import { plausibleEvent } from "@/lib/analytics";
import contactContent from "@/content/pages/contact.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// Single source of truth for tap-to-call / mailto / sms anchors.
// Every contact-point CTA on the site goes through these so:
//   1. Conversion events fire on every click via Plausible tagged classes.
//   2. The phone/email values stay in sync with lib/site.ts.
//   3. Styling can be retuned in one place.
//
// The default screen-reader labels are copy: content/pages/contact.json →
// links, edited in the admin (/admin → Contact page), with {name} and
// {phone}/{email} filled from Company details.
const labels = fillPlaceholdersDeep(contactContent.links);

type Common = {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export function PhoneLink({ className = "", children, ariaLabel }: Common) {
  return (
    <a
      href={`tel:${site.phone}`}
      aria-label={ariaLabel ?? labels.callLabel}
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
      aria-label={ariaLabel ?? labels.emailLabel}
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
      aria-label={ariaLabel ?? labels.smsLabel}
      className={`${plausibleEvent.sms} ${className}`}
    >
      {children}
    </a>
  );
}
