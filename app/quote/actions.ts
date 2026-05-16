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

  const name = (formData.get("name") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const address = (formData.get("address") || "").toString().trim();
  const damageType = (formData.get("damageType") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();
  const consent = formData.get("consent");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!phone && !email)
    errors.phone = "Please provide a phone number or email.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "That doesn't look like a valid email address.";
  if (!damageType) errors.damageType = "Please select a damage type.";
  if (!description || description.length < 10)
    errors.description =
      "Please tell us what happened (at least a sentence or two).";
  if (!consent) errors.consent = "Please acknowledge our privacy policy.";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Files arrive as File objects when present.
  const photos = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

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
