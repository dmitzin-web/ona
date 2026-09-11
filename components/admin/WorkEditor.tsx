"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { deleteWork, saveWork } from "@/app/admin/actions";
import { slugify, type WorkItem } from "@/lib/content-format";
import { LegalWarning, btnDanger, btnPrimary, Errors, Field, inputCls, Rules, Section } from "./ui";

// One photo in the remodeling gallery. Submitted with startTransition, not
// <form action>: React 19 resets a form after an action, and the file input
// cannot be restored — a validation error would make the editor pick the
// photo again.

export function WorkEditor({
  mode,
  initial,
  sha,
  roomTypes,
  deleteError,
}: {
  mode: "create" | "edit";
  initial: WorkItem | null;
  sha: string | null;
  roomTypes: string[];
  deleteError?: string;
}) {
  const [state, formAction, pending] = useActionState(saveWork, null);

  // The version this form was opened from, frozen with the form's content.
  // Taken from props only once: the page's server component can re-render
  // without remounting this one (a dev hot reload did it in testing), and a
  // refreshed `sha` prop paired with stale form state would let this form
  // overwrite someone else's newer save instead of being refused.
  const [baseSha] = useState(sha);
  const [ackLegal, setAckLegal] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [roomType, setRoomType] = useState(initial?.roomType ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [order, setOrder] = useState(String(initial?.order ?? 100));
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  }

  const shown = preview ?? initial?.image ?? null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-[13px] text-teal hover:underline">
          ← All content
        </Link>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-ivory">
          {mode === "create" ? "New gallery photo" : title || "Untitled photo"}
        </h1>
      </div>

      <Rules kind="work" />

      <form onSubmit={submit} className="space-y-6">
        <input type="hidden" name="mode" value={mode} />
        {mode === "edit" && <input type="hidden" name="slug" value={initial?.slug} />}
        {baseSha && <input type="hidden" name="sha" value={baseSha} />}
        <input type="hidden" name="ackLegal" value={ackLegal ? "1" : ""} />

        <Section title="Photo">
          <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
            <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-[2px] border border-line bg-charcoal-soft">
              {shown ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shown} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[12px] text-warm-gray">No photo yet</span>
              )}
            </div>
            <Field
              label={mode === "create" ? "Photo" : "Replace photo"}
              htmlFor="image"
              required={mode === "create"}
              hint="Landscape, at least 1500 px wide. JPEG, PNG, WebP or AVIF, up to 10 MB."
            >
              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required={mode === "create"}
                className="block w-full text-[14px] text-ivory file:mr-3 file:rounded-[2px] file:border file:border-line file:bg-charcoal file:px-3 file:py-2 file:text-[13px] file:font-medium"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setPreview(f ? URL.createObjectURL(f) : null);
                }}
              />
            </Field>
          </div>
        </Section>

        <Section title="Details">
          <Field label="Title" htmlFor="title" required hint="For your own reference in this list, e.g. “Full kitchen”.">
            <input id="title" name="title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
          </Field>
          {mode === "create" && title && (
            <p className="-mt-3 font-mono text-[12px] text-warm-gray">Saved as /photos/projects/{slugify(title) || "…"}/</p>
          )}

          <Field label="Room" htmlFor="roomType" required>
            <input id="roomType" name="roomType" list="room-types" className={inputCls} value={roomType} onChange={(e) => setRoomType(e.target.value)} required />
            <datalist id="room-types">
              {roomTypes.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </Field>

          <Field
            label="Photo description"
            htmlFor="imageAlt"
            required
            hint="What is in the frame, for screen readers and Google — e.g. “Kitchen with a waterfall-edge island and three globe pendants”."
          >
            <textarea id="imageAlt" name="imageAlt" rows={2} className={inputCls} value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} required />
          </Field>

          <Field
            label="Caption"
            htmlFor="notes"
            required
            counter={`${notes.length} / 300`}
            hint="Only what is visible — fixtures and forms, separated by “ · ”. For example: Waterfall-edge island · Apron-front sink · Chimney hood."
          >
            <textarea id="notes" name="notes" rows={2} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} required maxLength={300} />
          </Field>

          <Field label="Position" htmlFor="order" hint="Lower numbers show first. The current photos are numbered 10, 20, 30 …">
            <input id="order" name="order" type="number" min={0} className={`${inputCls} max-w-[160px]`} value={order} onChange={(e) => setOrder(e.target.value)} />
          </Field>
        </Section>

        <div className="sticky bottom-0 -mx-6 space-y-3 border-t border-line bg-charcoal/95 px-6 py-4 backdrop-blur">
          <Errors errors={state?.errors} />
          <LegalWarning findings={state?.legal} ack={ackLegal} onAck={setAckLegal} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] text-warm-gray">Publishing updates the live site in about a minute.</p>
            <button type="submit" className={btnPrimary} disabled={pending}>
              {pending ? "Publishing…" : mode === "create" ? "Publish photo" : "Publish changes"}
            </button>
          </div>
        </div>
      </form>

      {mode === "edit" && initial && baseSha && (
        <form
          action={deleteWork}
          onSubmit={(e) => {
            if (!confirm(`Remove “${initial.title}” from the gallery?`)) e.preventDefault();
          }}
          className="flex items-center justify-between gap-4 rounded-[2px] border border-line bg-charcoal p-4"
        >
          <input type="hidden" name="slug" value={initial.slug} />
          <input type="hidden" name="sha" value={baseSha} />
          <input type="hidden" name="title" value={initial.title} />
          <p className="text-[13px] text-warm-gray">
            {deleteError ? <span className="text-coral-deep">{deleteError}</span> : "Removes the photo from the gallery."}
          </p>
          <button type="submit" className={btnDanger}>
            Delete photo
          </button>
        </form>
      )}
    </div>
  );
}
