"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Inline click-to-confirm delete for a single claim. First click expands
// to "Yes, delete" + "Cancel". Second click hits the API. On success we
// either navigate (when used on /vvon/report/[id]) or refresh the
// router (when used on /account, where we want the list to re-render).

export function DeleteClaimButton({
  claimId,
  size = "sm",
  onDeletedHref,
}: {
  claimId: string;
  // sm = compact, fits in a row alongside "Open report →" links
  // md = full button, fits in the bottom action row on the report page
  size?: "sm" | "md";
  // If set, router.push() to this URL after delete. Otherwise router.refresh().
  onDeletedHref?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/vvon/claims/${claimId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }
      if (onDeletedHref) {
        router.push(onDeletedHref);
      } else {
        router.refresh();
      }
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (size === "sm") {
    if (!confirming) {
      return (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="eyebrow text-charcoal/55 transition hover:text-red-800"
          aria-label="Delete this claim"
        >
          Delete
        </button>
      );
    }
    return (
      <span className="flex items-center gap-3 eyebrow">
        <button
          type="button"
          disabled={submitting}
          onClick={handleDelete}
          className="text-red-800 transition hover:text-red-900 disabled:opacity-50"
        >
          {submitting ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          className="text-charcoal/55 transition hover:text-charcoal disabled:opacity-50"
        >
          Cancel
        </button>
        {error && (
          <span role="alert" className="text-red-700">
            {error}
          </span>
        )}
      </span>
    );
  }

  // md
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 border border-red-700/60 px-6 py-3 text-sm font-medium uppercase tracking-[0.22em] text-red-800 transition hover:bg-red-700 hover:text-ivory"
      >
        Delete this claim
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={submitting}
        onClick={handleDelete}
        className="inline-flex items-center gap-2 border border-red-700 bg-red-700 px-6 py-3 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-red-800 disabled:opacity-50"
      >
        {submitting ? "Deleting…" : "Yes, delete permanently"}
      </button>
      <button
        type="button"
        disabled={submitting}
        onClick={() => {
          setConfirming(false);
          setError(null);
        }}
        className="inline-flex items-center gap-2 border border-charcoal/30 px-6 py-3 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:border-charcoal disabled:opacity-50"
      >
        Cancel
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
