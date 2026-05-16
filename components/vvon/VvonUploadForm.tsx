"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  acceptedFileExtensions,
  acceptedFileLabel,
  vvon,
  claimTypes,
  documentCategories,
  MAX_FILE_BYTES,
  MAX_FILES_PER_CLAIM,
  propertyStates,
  userRoles,
  type ClaimType,
  type DocumentCategory,
  type PropertyState,
  type UserRole,
} from "@/lib/vvon/config";
import { VvonDisclaimer } from "./VvonDisclaimer";

// Each file the user attaches carries its own document-category label so
// the API can route it correctly (a policy is read very differently from
// a carrier estimate). The raw File object is held in state and uploaded
// as multipart form-data to /api/vvon/analyze on submit.
type Attachment = {
  id: string;
  file: File;
  category: DocumentCategory;
};

const inputClass =
  "mt-2 block w-full border border-charcoal/20 bg-ivory px-4 py-3 text-base text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none";
const labelClass = "block text-sm font-medium text-charcoal";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function fileMatchesAllowedExtension(name: string) {
  const lower = name.toLowerCase();
  return acceptedFileExtensions.some((ext) => lower.endsWith(ext));
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function VvonUploadForm() {
  const router = useRouter();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [claimType, setClaimType] = useState<ClaimType>("water");
  const [propertyState, setPropertyState] = useState<PropertyState>("WA");
  const [role, setRole] = useState<UserRole>("homeowner");
  const [carrierName, setCarrierName] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setError(null);
    const list = Array.from(incoming);
    setAttachments((prev) => {
      const next = [...prev];
      for (const file of list) {
        if (next.length >= MAX_FILES_PER_CLAIM) {
          setError(`Maximum ${MAX_FILES_PER_CLAIM} files per claim.`);
          break;
        }
        if (!fileMatchesAllowedExtension(file.name)) {
          setError(
            `Unsupported file type: ${file.name}. ${acceptedFileLabel}`,
          );
          continue;
        }
        if (file.size > MAX_FILE_BYTES) {
          setError(`File too large: ${file.name}. Max 25 MB each.`);
          continue;
        }
        next.push({
          id: uid(),
          file,
          category: guessCategoryFromName(file.name),
        });
      }
      return next;
    });
  }, []);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files);
    // reset so the same file can be re-selected if removed
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function updateCategory(id: string, category: DocumentCategory) {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, category } : a)),
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Please review and acknowledge the disclaimer to continue.");
      return;
    }
    if (attachments.length === 0 && notes.trim().length < 20) {
      setError(
        "Add at least one document, or describe the claim in the notes (20+ characters).",
      );
      return;
    }

    setSubmitting(true);
    setProgressLabel(
      attachments.length > 0
        ? `Uploading ${attachments.length} file${attachments.length === 1 ? "" : "s"}…`
        : "Sending to Vvon for review…",
    );

    try {
      // Build multipart form-data: every file as a `file` part, plus a
      // `meta` JSON field for claim context and a `categories` JSON field
      // mapping each filename to its document category. The server reads
      // raw bytes, stores them in Supabase Storage, parses PDFs/text,
      // sends images to Claude vision, and saves the report to the DB.
      const form = new FormData();
      form.append(
        "meta",
        JSON.stringify({
          claimType,
          propertyState,
          role,
          carrierName: carrierName.trim() || null,
          notes: notes.trim(),
        }),
      );
      form.append(
        "categories",
        JSON.stringify(
          attachments.map((a) => ({ name: a.file.name, category: a.category })),
        ),
      );
      for (const a of attachments) {
        form.append("file", a.file, a.file.name);
      }

      setProgressLabel("Sending to Vvon for review…");
      const res = await fetch("/api/vvon/analyze", {
        method: "POST",
        body: form,
      });

      if (res.status === 401) {
        // Session expired between page load and submit — bounce to login.
        router.push("/login?next=/vvon/upload");
        return;
      }

      if (!res.ok) {
        let detail = `Request failed (${res.status})`;
        try {
          const j = (await res.json()) as { error?: string };
          if (j.error) detail = j.error;
        } catch {
          /* non-JSON error body */
        }
        throw new Error(detail);
      }

      const data = (await res.json()) as { claimId: string };
      setProgressLabel("Opening your report…");
      router.push(`/vvon/report/${data.claimId}`);
    } catch (err) {
      setSubmitting(false);
      setProgressLabel(null);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Drop zone */}
      <div>
        <p className="eyebrow text-charcoal/60">Step 1 · Upload</p>
        <h2 className="mt-3 text-2xl font-light tracking-tight">
          Add your claim documents.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          {acceptedFileLabel}
        </p>

        <label
          htmlFor="vvon-files"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mt-6 flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-14 text-center transition ${
            dragOver
              ? "border-gold bg-gold/5"
              : "border-charcoal/25 hover:border-charcoal"
          }`}
        >
          <p className="text-base font-medium tracking-tight text-charcoal">
            Drop files here, or click to browse.
          </p>
          <p className="mt-2 text-xs text-charcoal/60">
            Up to {MAX_FILES_PER_CLAIM} files · 25 MB each
          </p>
          <input
            ref={fileInputRef}
            id="vvon-files"
            type="file"
            multiple
            className="sr-only"
            accept={acceptedFileExtensions.join(",")}
            onChange={handleFileInput}
          />
        </label>

        {attachments.length > 0 && (
          <ul className="mt-6 space-y-px overflow-hidden border border-line-light bg-line-light">
            {attachments.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-ivory p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">
                    {a.file.name}
                  </p>
                  <p className="text-xs text-charcoal/55">
                    {formatBytes(a.file.size)}
                  </p>
                </div>
                <select
                  aria-label={`Category for ${a.file.name}`}
                  value={a.category}
                  onChange={(e) =>
                    updateCategory(a.id, e.target.value as DocumentCategory)
                  }
                  className="border border-charcoal/20 bg-ivory px-3 py-1.5 text-sm text-charcoal focus:border-charcoal focus:outline-none"
                >
                  {documentCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  className="text-xs uppercase tracking-[0.18em] text-charcoal/60 transition hover:text-charcoal"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Claim context */}
      <div>
        <p className="eyebrow text-charcoal/60">Step 2 · Context</p>
        <h2 className="mt-3 text-2xl font-light tracking-tight">
          Tell us about the claim.
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="claimType" className={labelClass}>
              Claim type <span className="text-charcoal/40">*</span>
            </label>
            <select
              id="claimType"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value as ClaimType)}
              className={inputClass}
            >
              {claimTypes.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="propertyState" className={labelClass}>
              Property state
            </label>
            <select
              id="propertyState"
              value={propertyState}
              onChange={(e) =>
                setPropertyState(e.target.value as PropertyState)
              }
              className={inputClass}
            >
              {propertyStates.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="role" className={labelClass}>
              Your role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className={inputClass}
            >
              {userRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="carrier" className={labelClass}>
              Carrier (optional)
            </label>
            <input
              id="carrier"
              type="text"
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              placeholder="e.g. State Farm, Allstate…"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="notes" className={labelClass}>
            What happened? <span className="text-charcoal/40">Optional but helpful</span>
          </label>
          <textarea
            id="notes"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="When did it happen? What rooms or systems are affected? Have you received an estimate or a denial?"
            className={`${inputClass} resize-y`}
            maxLength={4000}
          />
          <p className="mt-2 text-xs text-charcoal/55">
            Up to 4,000 characters. Helps the analysis where documents don&apos;t fill in the picture.
          </p>
        </div>
      </div>

      {/* Disclaimer + consent */}
      <div>
        <p className="eyebrow text-charcoal/60">Step 3 · Acknowledge</p>
        <h2 className="mt-3 text-2xl font-light tracking-tight">
          One last thing.
        </h2>
        <div className="mt-6">
          <VvonDisclaimer tone="light" />
        </div>

        <label className="mt-6 flex items-start gap-3 border-t border-charcoal/15 pt-6">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 flex-none border-charcoal/30"
            aria-required="true"
          />
          <span className="text-sm leading-relaxed text-charcoal/80">
            {vvon.consentLabel}
          </span>
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="border border-red-700/40 bg-red-700/5 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-charcoal/15 pt-8">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-3 border border-charcoal bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? progressLabel ?? "Analyzing…" : "Analyze My Claim"}
        </button>
        <Link
          href="/vvon"
          className="text-sm uppercase tracking-[0.22em] text-charcoal/60 transition hover:text-charcoal"
        >
          ← Back to overview
        </Link>
      </div>
    </form>
  );
}

// Cheap heuristic so the category dropdown defaults are usually right.
// Users can still override per-file. Order matters — first match wins.
function guessCategoryFromName(name: string): DocumentCategory {
  const lower = name.toLowerCase();
  if (/(denial|deny|coverage[\s-]?letter)/.test(lower)) return "denial-letter";
  if (/(policy|declarations|dec[\s-]?page)/.test(lower)) return "policy";
  if (/(mitigation|drying|extraction|equipment)/.test(lower))
    return "mitigation-invoice";
  if (/(xact|carrier|adjuster|insur)/.test(lower)) return "carrier-estimate";
  if (/(contractor|scope|sow|bid)/.test(lower)) return "contractor-estimate";
  if (/\.(jpg|jpeg|png)$/.test(lower)) return "photos";
  return "other";
}

