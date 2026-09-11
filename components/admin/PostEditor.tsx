"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { deletePost, savePost } from "@/app/admin/actions";
import {
  isListKind,
  POST_CATEGORIES,
  slugify,
  type Post,
  type SectionKind,
} from "@/lib/content-format";
import { LegalWarning, btnDanger, btnIcon, btnPrimary, btnSecondary, Errors, Field, inputCls, Rules, Section } from "./ui";

// The blog post form. Everything is controlled state and the payload is
// built from it, so nothing typed is ever lost to a form reset. Submission
// goes through startTransition rather than <form action>, because React 19
// resets a form after an action — including one that came back with
// validation errors, which would wipe the editor's work.

const KIND_LABEL: Record<SectionKind, string> = {
  p: "Paragraph",
  h2: "Heading",
  h3: "Subheading",
  list: "Bulleted list",
  ordered: "Numbered list",
  callout: "Callout box",
};

type EBlock = { id: string; kind: SectionKind; value: string };
type EFaq = { id: string; q: string; a: string };
type EStep = { id: string; name: string; text: string };

function move<T>(arr: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function PostEditor({
  mode,
  initial,
  sha,
  deleteError,
}: {
  mode: "create" | "edit";
  initial: Post | null;
  sha: string | null;
  deleteError?: string;
}) {
  const [state, formAction, pending] = useActionState(savePost, null);

  // The version this form was opened from, frozen with the form's content.
  // Taken from props only once: the page's server component can re-render
  // without remounting this one (a dev hot reload did it in testing), and a
  // refreshed `sha` prop paired with stale form state would let this form
  // overwrite someone else's newer save instead of being refused.
  const [baseSha] = useState(sha);
  const [ackLegal, setAckLegal] = useState(false);

  // Deterministic ids for the initial render, so server and client agree.
  const next = useRef(1000);
  const uid = () => `n${next.current++}`;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "Water");
  const [readingMinutes, setReadingMinutes] = useState(String(initial?.readingMinutes ?? 5));
  const [publishedAt, setPublishedAt] = useState(initial?.publishedAt ?? "");
  const [updatedAt, setUpdatedAt] = useState(initial?.updatedAt ?? "");
  const [authorName, setAuthorName] = useState(initial?.author.name ?? "Ona Restoration");
  const [authorTitle, setAuthorTitle] = useState(
    initial?.author.title ?? "Restoration & remodeling — Vancouver, WA",
  );
  const [blocks, setBlocks] = useState<EBlock[]>(() =>
    (initial?.sections ?? [{ kind: "p" as const, text: "" }]).map((s, i) => ({
      id: `b${i}`,
      kind: s.kind,
      value: "items" in s ? s.items.join("\n") : s.text,
    })),
  );
  const [faqs, setFaqs] = useState<EFaq[]>(() =>
    (initial?.faqs ?? []).map((f, i) => ({ id: `f${i}`, ...f })),
  );
  const [howToOn, setHowToOn] = useState(Boolean(initial?.howTo));
  const [howToName, setHowToName] = useState(initial?.howTo?.name ?? "");
  const [howToDesc, setHowToDesc] = useState(initial?.howTo?.description ?? "");
  const [steps, setSteps] = useState<EStep[]>(() =>
    (initial?.howTo?.steps ?? []).map((s, i) => ({ id: `s${i}`, ...s })),
  );

  const effectiveSlug = slugTouched ? slug : slugify(title);

  const payload = useMemo(
    () =>
      JSON.stringify({
        slug: effectiveSlug,
        title,
        description,
        excerpt,
        category,
        readingMinutes: Number(readingMinutes),
        publishedAt,
        updatedAt,
        author: { name: authorName, title: authorTitle },
        sections: blocks.map((b) =>
          isListKind(b.kind)
            ? { kind: b.kind, items: b.value.split("\n").map((s) => s.trim()).filter(Boolean) }
            : { kind: b.kind, text: b.value },
        ),
        faqs: faqs.map(({ q, a }) => ({ q, a })),
        howTo: howToOn
          ? { name: howToName, description: howToDesc, steps: steps.map(({ name, text }) => ({ name, text })) }
          : null,
      }),
    [effectiveSlug, title, description, excerpt, category, readingMinutes, publishedAt, updatedAt, authorName, authorTitle, blocks, faqs, howToOn, howToName, howToDesc, steps],
  );

  // Warn before leaving with unpublished changes.
  const initialPayload = useRef(payload);
  const dirty = payload !== initialPayload.current;
  useEffect(() => {
    if (!dirty || pending) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty, pending]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  }

  const setBlock = (i: number, value: string) =>
    setBlocks((bs) => bs.map((b, k) => (k === i ? { ...b, value } : b)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-[13px] text-teal hover:underline">
            ← All content
          </Link>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-ivory">
            {mode === "create" ? "New blog post" : title || "Untitled post"}
          </h1>
        </div>
        {mode === "edit" && (
          <a
            href={`/blog/${initial?.slug}`}
            target="_blank"
            rel="noopener"
            className="text-[13px] text-teal hover:underline"
          >
            View live post ↗
          </a>
        )}
      </div>

      <Rules kind="post" />

      <form onSubmit={submit} className="space-y-6">
        <input type="hidden" name="mode" value={mode} />
        {mode === "edit" && <input type="hidden" name="slug" value={initial?.slug} />}
        {baseSha && <input type="hidden" name="sha" value={baseSha} />}
        <input type="hidden" name="ackLegal" value={ackLegal ? "1" : ""} />
        <input type="hidden" name="payload" value={payload} />

        <Section title="Basics">
          <Field label="Title" htmlFor="title" required>
            <input id="title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
          </Field>

          <Field
            label="Page address"
            htmlFor="slug"
            hint={
              mode === "edit"
                ? "Fixed once a post is published — changing it would break every link and search result pointing here."
                : "Filled in from the title. Short and descriptive; it can't be changed after publishing."
            }
          >
            <div className="flex items-center gap-1 text-[14px] text-warm-gray">
              <span className="font-mono">/blog/</span>
              <input
                id="slug"
                className={`${inputCls} font-mono`}
                value={effectiveSlug}
                disabled={mode === "edit"}
                onChange={(e) => {
                  setSlugTouched(true);
                  // Light touch while typing (a trailing hyphen has to be
                  // typeable); the server applies the strict rule on save.
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
                }}
              />
            </div>
          </Field>

          <Field
            label="Search description"
            htmlFor="description"
            required
            counter={`${description.length} / ~155`}
            hint="Shown under the title in Google and in link previews. One or two plain sentences."
          >
            <textarea id="description" rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={400} />
          </Field>

          <Field label="Excerpt" htmlFor="excerpt" required hint="The short summary on the /blog list page.">
            <textarea id="excerpt" rows={3} className={inputCls} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required maxLength={800} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Category" htmlFor="category">
              <select id="category" className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                {POST_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Reading time (min)" htmlFor="rt" required>
              <input id="rt" type="number" min={1} max={120} className={inputCls} value={readingMinutes} onChange={(e) => setReadingMinutes(e.target.value)} required />
            </Field>
            <Field label="Published" htmlFor="pub" required>
              <input id="pub" type="date" className={inputCls} value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} required />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Updated" htmlFor="upd" hint="Only if materially revised.">
              <input id="upd" type="date" className={inputCls} value={updatedAt} onChange={(e) => setUpdatedAt(e.target.value)} />
            </Field>
            <Field label="Author" htmlFor="an" required>
              <input id="an" className={inputCls} value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
            </Field>
            <Field label="Author role" htmlFor="at">
              <input id="at" className={inputCls} value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="Body" hint="The post, block by block. Use the arrows to reorder.">
          {blocks.map((b, i) => (
            <div key={b.id} className="rounded-[2px] border border-line bg-charcoal-soft/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="eyebrow text-warm-gray">
                  {i + 1} · {KIND_LABEL[b.kind]}
                </span>
                <div className="flex gap-1">
                  <button type="button" className={btnIcon} aria-label="Move up" disabled={i === 0} onClick={() => setBlocks((bs) => move(bs, i, -1))}>↑</button>
                  <button type="button" className={btnIcon} aria-label="Move down" disabled={i === blocks.length - 1} onClick={() => setBlocks((bs) => move(bs, i, 1))}>↓</button>
                  <button type="button" className={btnIcon} aria-label="Remove block" onClick={() => setBlocks((bs) => bs.filter((_, k) => k !== i))}>✕</button>
                </div>
              </div>
              {b.kind === "h2" || b.kind === "h3" ? (
                <input className={`${inputCls} font-semibold`} value={b.value} onChange={(e) => setBlock(i, e.target.value)} aria-label={KIND_LABEL[b.kind]} />
              ) : (
                <>
                  <textarea
                    rows={isListKind(b.kind) ? Math.max(3, b.value.split("\n").length + 1) : Math.max(3, Math.ceil(b.value.length / 95) + 1)}
                    className={inputCls}
                    value={b.value}
                    onChange={(e) => setBlock(i, e.target.value)}
                    aria-label={KIND_LABEL[b.kind]}
                  />
                  {isListKind(b.kind) && <p className="mt-1 text-[12px] text-warm-gray">One item per line.</p>}
                </>
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <span className="self-center text-[13px] text-warm-gray">Add:</span>
            {(Object.keys(KIND_LABEL) as SectionKind[]).map((k) => (
              <button key={k} type="button" className={btnSecondary} onClick={() => setBlocks((bs) => [...bs, { id: uid(), kind: k, value: "" }])}>
                + {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </Section>

        <Section title="FAQ" hint="Optional. Shown at the end of the post and sent to Google as FAQ data.">
          {faqs.map((f, i) => (
            <div key={f.id} className="space-y-2 rounded-[2px] border border-line bg-charcoal-soft/50 p-3">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-warm-gray">Question {i + 1}</span>
                <button type="button" className={btnIcon} aria-label="Remove question" onClick={() => setFaqs((fs) => fs.filter((_, k) => k !== i))}>✕</button>
              </div>
              <input className={inputCls} placeholder="Question" value={f.q} onChange={(e) => setFaqs((fs) => fs.map((x, k) => (k === i ? { ...x, q: e.target.value } : x)))} />
              <textarea rows={3} className={inputCls} placeholder="Answer" value={f.a} onChange={(e) => setFaqs((fs) => fs.map((x, k) => (k === i ? { ...x, a: e.target.value } : x)))} />
            </div>
          ))}
          <button type="button" className={btnSecondary} onClick={() => setFaqs((fs) => [...fs, { id: uid(), q: "", a: "" }])}>
            + Add question
          </button>
        </Section>

        <Section title="Step-by-step guide" hint="Only for posts that really are a sequence of steps — adds HowTo data for Google.">
          <label className="flex items-center gap-2 text-[14px] text-ivory">
            <input type="checkbox" checked={howToOn} onChange={(e) => setHowToOn(e.target.checked)} />
            This post is a step-by-step guide
          </label>
          {howToOn && (
            <>
              <Field label="Guide name" htmlFor="htn">
                <input id="htn" className={inputCls} value={howToName} onChange={(e) => setHowToName(e.target.value)} />
              </Field>
              <Field label="Guide description" htmlFor="htd">
                <textarea id="htd" rows={2} className={inputCls} value={howToDesc} onChange={(e) => setHowToDesc(e.target.value)} />
              </Field>
              {steps.map((s, i) => (
                <div key={s.id} className="space-y-2 rounded-[2px] border border-line bg-charcoal-soft/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-warm-gray">Step {i + 1}</span>
                    <div className="flex gap-1">
                      <button type="button" className={btnIcon} aria-label="Move step up" disabled={i === 0} onClick={() => setSteps((ss) => move(ss, i, -1))}>↑</button>
                      <button type="button" className={btnIcon} aria-label="Move step down" disabled={i === steps.length - 1} onClick={() => setSteps((ss) => move(ss, i, 1))}>↓</button>
                      <button type="button" className={btnIcon} aria-label="Remove step" onClick={() => setSteps((ss) => ss.filter((_, k) => k !== i))}>✕</button>
                    </div>
                  </div>
                  <input className={inputCls} placeholder="Step" value={s.name} onChange={(e) => setSteps((ss) => ss.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} />
                  <textarea rows={2} className={inputCls} placeholder="Detail" value={s.text} onChange={(e) => setSteps((ss) => ss.map((x, k) => (k === i ? { ...x, text: e.target.value } : x)))} />
                </div>
              ))}
              <button type="button" className={btnSecondary} onClick={() => setSteps((ss) => [...ss, { id: uid(), name: "", text: "" }])}>
                + Add step
              </button>
            </>
          )}
        </Section>

        <div className="sticky bottom-0 -mx-6 space-y-3 border-t border-line bg-charcoal/95 px-6 py-4 backdrop-blur">
          <Errors errors={state?.errors} />
          <LegalWarning findings={state?.legal} ack={ackLegal} onAck={setAckLegal} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] text-warm-gray">
              {dirty ? "Unpublished changes." : "No changes yet."} Publishing updates the live site in about a minute.
            </p>
            <button type="submit" className={btnPrimary} disabled={pending}>
              {pending ? "Publishing…" : mode === "create" ? "Publish post" : "Publish changes"}
            </button>
          </div>
        </div>
      </form>

      {mode === "edit" && initial && baseSha && (
        <form
          action={deletePost}
          onSubmit={(e) => {
            if (!confirm(`Delete “${initial.title}” from the site? This cannot be undone from the admin.`)) e.preventDefault();
          }}
          className="flex items-center justify-between gap-4 rounded-[2px] border border-line bg-charcoal p-4"
        >
          <input type="hidden" name="slug" value={initial.slug} />
          <input type="hidden" name="sha" value={baseSha} />
          <input type="hidden" name="title" value={initial.title} />
          <p className="text-[13px] text-warm-gray">
            {deleteError ? <span className="text-coral-deep">{deleteError}</span> : "Removes the post and its page from the site."}
          </p>
          <button type="submit" className={btnDanger}>
            Delete post
          </button>
        </form>
      )}
    </div>
  );
}
