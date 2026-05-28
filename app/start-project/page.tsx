"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { site } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// Start a Project — 4-step intake
// ────────────────────────────────────────────────────────────
// Calm, one-question-per-screen flow. The point is: "this
// feels like answering 4 quick questions, not filling out a
// contractor lead form."
//
//   1. What kind of project? (urgent restoration / past damage
//      restoration / remodel / not sure)
//   2. Where? (zip + neighborhood)
//   3. When? (asap / 30d / 90d / planning)
//   4. Contact (name + phone, email optional, note optional)
//
// Submit:
//   - POST to /api/start-project (always 200 — see route)
//   - On non-2xx, open mailto: so the lead never dies
//   - Show a calm confirmation screen with the phone as the
//     immediate next step

type Step = 1 | 2 | 3 | 4;

type FormState = {
  kind:
    | ""
    | "restoration-urgent"
    | "restoration-not-urgent"
    | "remodel"
    | "not-sure";
  zip: string;
  neighborhood: string;
  timing: "" | "asap" | "30-days" | "90-days" | "planning";
  name: string;
  phone: string;
  email: string;
  note: string;
};

const kindOptions: {
  value: Exclude<FormState["kind"], "">;
  label: string;
  hint: string;
}[] = [
  {
    value: "restoration-urgent",
    label: "Something just happened",
    hint: "Water, fire, smoke, mold — happening now or in the last 24 hours.",
  },
  {
    value: "restoration-not-urgent",
    label: "Damage I want fixed",
    hint: "Past damage, insurance claim already open or pending.",
  },
  {
    value: "remodel",
    label: "Planning a remodel",
    hint: "Kitchen, bathroom, or combined. Not urgent.",
  },
  {
    value: "not-sure",
    label: "Not sure yet",
    hint: "I want to talk to a person before deciding what category this is.",
  },
];

const timingOptions: {
  value: Exclude<FormState["timing"], "">;
  label: string;
  hint: string;
}[] = [
  {
    value: "asap",
    label: "As soon as possible",
    hint: "I'd like work to start this week if possible.",
  },
  {
    value: "30-days",
    label: "Within 30 days",
    hint: "No emergency, but I want momentum.",
  },
  {
    value: "90-days",
    label: "Within 90 days",
    hint: "Planning a project for this season.",
  },
  {
    value: "planning",
    label: "Just planning",
    hint: "I'm gathering information for later.",
  },
];

export default function StartProjectPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    kind: "",
    zip: "",
    neighborhood: "",
    timing: "",
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const canAdvance = useMemo(() => {
    if (step === 1) return form.kind !== "";
    if (step === 2) return form.zip.trim().length >= 3;
    if (step === 3) return form.timing !== "";
    if (step === 4)
      return form.name.trim().length > 0 && form.phone.trim().length >= 7;
    return false;
  }, [step, form]);

  const update =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/start-project", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("non-200");
      setSubmitted(true);
    } catch {
      const subject = encodeURIComponent(
        "Start a project — ONA Restoration",
      );
      const body = encodeURIComponent(
        [
          `Kind: ${form.kind}`,
          `Zip / Neighborhood: ${form.zip} ${form.neighborhood}`.trim(),
          `Timing: ${form.timing}`,
          `Name: ${form.name}`,
          `Phone: ${form.phone}`,
          `Email: ${form.email}`,
          `Note: ${form.note}`,
        ].join("\n"),
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-ivory text-charcoal">
        <div className="mx-auto max-w-2xl px-6 py-24 md:py-32 lg:px-10">
          <p className="eyebrow text-warm-gray-deep">We got it</p>
          <h1 className="mt-6 text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-charcoal md:text-[52px]">
            Thanks, {form.name.split(" ")[0] || "there"}.
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-warm-gray-deep">
            Your details are with us. If your project is urgent, call
            now — we answer in person.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[14px] font-medium text-white transition hover:bg-gold-deep"
            >
              Call {site.phoneDisplay}
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-7 py-3.5 text-[14px] font-medium text-charcoal transition hover:bg-charcoal hover:text-ivory"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory text-charcoal">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24 lg:px-10">
        <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.22em] text-warm-gray-deep">
          <span>Step {step} of 4</span>
          <Link
            href="/"
            className="underline-offset-4 hover:text-charcoal hover:underline"
          >
            Cancel
          </Link>
        </div>

        {/* Thin progress rule — the only chrome */}
        <div className="mt-4 h-px w-full bg-line-light">
          <div
            className="h-px bg-gold transition-all"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="mt-12">
          {step === 1 ? (
            <Step1Kind value={form.kind} onChange={update("kind")} />
          ) : null}
          {step === 2 ? (
            <Step2Where
              zip={form.zip}
              neighborhood={form.neighborhood}
              onZip={update("zip")}
              onNeighborhood={update("neighborhood")}
            />
          ) : null}
          {step === 3 ? (
            <Step3When value={form.timing} onChange={update("timing")} />
          ) : null}
          {step === 4 ? (
            <Step4Contact
              name={form.name}
              phone={form.phone}
              email={form.email}
              note={form.note}
              onName={update("name")}
              onPhone={update("phone")}
              onEmail={update("email")}
              onNote={update("note")}
            />
          ) : null}
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-line-light pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
            disabled={step === 1}
            className="text-[14px] text-warm-gray-deep transition hover:text-charcoal disabled:opacity-30"
          >
            ← Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() =>
                canAdvance && setStep((s) => (s + 1) as Step)
              }
              disabled={!canAdvance}
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-3 text-[14px] font-medium text-ivory transition hover:bg-charcoal-soft disabled:opacity-30"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canAdvance || submitting}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-white transition hover:bg-gold-deep disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send it"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step components ────────────────────────────────────────

function StepHeading({
  label,
  title,
  hint,
}: {
  label: string;
  title: string;
  hint?: string;
}) {
  return (
    <div>
      <p className="eyebrow text-warm-gray-deep">{label}</p>
      <h1 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-charcoal md:text-[40px]">
        {title}
      </h1>
      {hint ? (
        <p className="mt-4 text-[15px] leading-relaxed text-warm-gray-deep">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function RadioCard<T extends string>({
  selected,
  value,
  label,
  hint,
  onSelect,
}: {
  selected: T | "";
  value: T;
  label: string;
  hint: string;
  onSelect: (v: T) => void;
}) {
  const isOn = selected === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={[
        "block w-full rounded-xl border p-5 text-left transition",
        isOn
          ? "border-charcoal bg-ivory-soft"
          : "border-line-light bg-ivory-soft hover:border-charcoal/40",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-medium text-charcoal">{label}</div>
        <span
          className={[
            "h-3 w-3 rounded-full border",
            isOn ? "border-gold bg-gold" : "border-line-light",
          ].join(" ")}
        />
      </div>
      <div className="mt-2 text-[13px] leading-relaxed text-warm-gray-deep">
        {hint}
      </div>
    </button>
  );
}

function Step1Kind({
  value,
  onChange,
}: {
  value: FormState["kind"];
  onChange: (v: FormState["kind"]) => void;
}) {
  return (
    <>
      <StepHeading
        label="What's going on"
        title="What kind of project?"
        hint="Pick the closest match. We'll figure out the details together."
      />
      <div className="mt-10 grid gap-3">
        {kindOptions.map((o) => (
          <RadioCard
            key={o.value}
            selected={value}
            value={o.value}
            label={o.label}
            hint={o.hint}
            onSelect={onChange}
          />
        ))}
      </div>
    </>
  );
}

function Step2Where({
  zip,
  neighborhood,
  onZip,
  onNeighborhood,
}: {
  zip: string;
  neighborhood: string;
  onZip: (v: string) => void;
  onNeighborhood: (v: string) => void;
}) {
  return (
    <>
      <StepHeading
        label="Where"
        title="Where's the property?"
        hint="Zip is all we need. Neighborhood helps us route faster."
      />
      <div className="mt-10 space-y-5">
        <Field label="Zip code" required>
          <input
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={(e) => onZip(e.target.value)}
            placeholder="e.g. 98661"
            className="w-full border-b border-line-light bg-transparent py-2 text-[18px] text-charcoal outline-none transition focus:border-charcoal"
          />
        </Field>
        <Field label="Neighborhood (optional)">
          <input
            type="text"
            value={neighborhood}
            onChange={(e) => onNeighborhood(e.target.value)}
            placeholder="e.g. Hazel Dell, Camas, Salmon Creek…"
            className="w-full border-b border-line-light bg-transparent py-2 text-[18px] text-charcoal outline-none transition focus:border-charcoal"
          />
        </Field>
      </div>
    </>
  );
}

function Step3When({
  value,
  onChange,
}: {
  value: FormState["timing"];
  onChange: (v: FormState["timing"]) => void;
}) {
  return (
    <>
      <StepHeading
        label="When"
        title="When would you like to start?"
        hint="Pick the closest. We'll talk about real dates on the call."
      />
      <div className="mt-10 grid gap-3">
        {timingOptions.map((o) => (
          <RadioCard
            key={o.value}
            selected={value}
            value={o.value}
            label={o.label}
            hint={o.hint}
            onSelect={onChange}
          />
        ))}
      </div>
    </>
  );
}

function Step4Contact({
  name,
  phone,
  email,
  note,
  onName,
  onPhone,
  onEmail,
  onNote,
}: {
  name: string;
  phone: string;
  email: string;
  note: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onEmail: (v: string) => void;
  onNote: (v: string) => void;
}) {
  return (
    <>
      <StepHeading
        label="Contact"
        title="How can we reach you?"
        hint="We'll call within the hour during business hours. Phone is the fastest way."
      />
      <div className="mt-10 space-y-6">
        <Field label="Your name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="First and last"
            className="w-full border-b border-line-light bg-transparent py-2 text-[18px] text-charcoal outline-none transition focus:border-charcoal"
          />
        </Field>
        <Field label="Phone" required>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhone(e.target.value)}
            placeholder="(360) 555-1212"
            className="w-full border-b border-line-light bg-transparent py-2 text-[18px] text-charcoal outline-none transition focus:border-charcoal"
          />
        </Field>
        <Field label="Email (optional)">
          <input
            type="email"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border-b border-line-light bg-transparent py-2 text-[18px] text-charcoal outline-none transition focus:border-charcoal"
          />
        </Field>
        <Field label="Anything we should know? (optional)">
          <textarea
            value={note}
            onChange={(e) => onNote(e.target.value)}
            rows={3}
            placeholder="A sentence is plenty."
            className="w-full resize-none border-b border-line-light bg-transparent py-2 text-[16px] leading-relaxed text-charcoal outline-none transition focus:border-charcoal"
          />
        </Field>
      </div>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-warm-gray-deep">
        {label} {required ? <span className="text-gold">·</span> : null}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
