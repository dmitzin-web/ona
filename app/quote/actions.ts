"use server";

import { redirect } from "next/navigation";

export type QuoteFormState = {
  errors?: Record<string, string>;
};

// Server Action that processes the /quote form submission.
//
// TODO (production): wire to an email/CRM provider before launch. Options:
//   - Resend (recommended, simple): https://resend.com — REPLACE the console.log
//     block below with `resend.emails.send(...)` and add RESEND_API_KEY.
//   - SendGrid, Postmark, Mailgun — all work the same way.
//   - Or POST to a CRM webhook (HubSpot, Pipedrive, etc.).
//
// Currently the action validates input, rejects honeypot hits, and logs to the
// server console so you can see the data flow during development without setting
// up email infrastructure.
export async function submitQuote(
  _prev: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  // Honeypot — bots fill every visible field; this one is hidden via CSS.
  if (formData.get("company")) {
    // Pretend success to bots so they stop retrying.
    redirect("/quote/thanks");
  }

  // Server-side length caps. The client has maxLength on some fields, but
  // a crafted request bypasses the DOM entirely, so we cap again here and
  // trim. Values past the cap are sliced rather than rejected so a long
  // paste doesn't lose the lead — we just bound what we store/forward.
  const cap = (v: FormDataEntryValue | null, max: number) =>
    (v ?? "").toString().trim().slice(0, max);

  const name = cap(formData.get("name"), 120);
  const phone = cap(formData.get("phone"), 40);
  const email = cap(formData.get("email"), 200);
  const address = cap(formData.get("address"), 300);
  const damageType = cap(formData.get("damageType"), 40);
  const description = cap(formData.get("description"), 4000);
  const consent = formData.get("consent");

  const allowedDamageTypes = ["water", "fire", "mold", "storm", "other"];

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!phone && !email)
    errors.phone = "Please provide a phone number or email.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "That doesn't look like a valid email address.";
  if (!damageType || !allowedDamageTypes.includes(damageType))
    errors.damageType = "Please select a damage type.";
  if (!description || description.length < 10)
    errors.description =
      "Please tell us what happened (at least a sentence or two).";
  if (!consent) errors.consent = "Please acknowledge our privacy policy.";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // ---- File upload validation -------------------------------------------
  // Photos are user-controlled binary input — validate hard before any
  // future code forwards them to email/storage. We enforce: max count,
  // per-file size, and a MIME allowlist (declared type must be a known
  // raster image — never trust an arbitrary content type). Anything that
  // fails is silently dropped rather than failing the whole submission, so
  // a bad attachment never costs us the lead.
  const MAX_PHOTOS = 8;
  const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB per file
  const ALLOWED_PHOTO_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/gif",
  ];

  const photos = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .filter(
      (f) =>
        f.size <= MAX_PHOTO_BYTES &&
        ALLOWED_PHOTO_TYPES.includes(f.type.toLowerCase()),
    )
    .slice(0, MAX_PHOTOS);

  // ---- TODO: replace this block with real email/CRM dispatch ----
  console.log("[quote] new submission", {
    name,
    phone,
    email,
    address,
    damageType,
    descriptionLength: description.length,
    photoCount: photos.length,
    photoMeta: photos.map((p) => ({
      name: p.name,
      size: p.size,
      type: p.type,
    })),
    receivedAt: new Date().toISOString(),
  });
  // ---------------------------------------------------------------

  redirect("/quote/thanks");
}
