"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { saveSection } from "@/app/admin/actions";
import type { Schema } from "@/lib/admin/schema";
import { SchemaForm } from "./SchemaForm";
import { btnPrimary, Errors, LegalWarning } from "./ui";

// Editor for any schema-driven section. Same submission rules as the post
// and gallery editors: controlled state, submitted with startTransition (a
// React 19 form action would reset the form on a validation error), and the
// version SHA frozen at mount so a stale form can never overwrite a newer
// save.

type Obj = Record<string, unknown>;

export function SectionEditor({
  sectionId,
  title,
  description,
  schema,
  initial,
  sha,
  item,
  backHref,
  backLabel,
}: {
  sectionId: string;
  title: string;
  description?: string;
  schema: Schema;
  initial: Obj;
  sha: string;
  item?: string;
  backHref: string;
  backLabel: string;
}) {
  const [state, formAction, pending] = useActionState(saveSection, null);
  const [baseSha] = useState(sha);
  const [value, setValue] = useState<Obj>(initial);
  const [ackLegal, setAckLegal] = useState(false);

  const payload = useMemo(() => JSON.stringify(value), [value]);
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

  return (
    <div className="space-y-6">
      <div>
        <Link href={backHref} className="text-[13px] text-teal hover:underline">
          ← {backLabel}
        </Link>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-ivory">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-[14px] text-warm-gray">{description}</p>}
      </div>

      <aside className="rounded-[2px] border border-teal/30 bg-teal/5 p-4 text-[13px] leading-relaxed text-ivory">
        <p className="font-semibold">Before you publish</p>
        <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
          <li>Nothing may say we are licensed, registered or bonded in Oregon — that registration is still pending.</li>
          <li>Never “bonded and insured”; never offer to cover or waive a deductible.</li>
          <li>No promises, numbers or claims we cannot prove.</li>
        </ul>
        <p className="mt-1.5 text-warm-gray">The admin checks for the first two and will stop and ask before publishing.</p>
      </aside>

      <form onSubmit={submit} className="space-y-6">
        <input type="hidden" name="section" value={sectionId} />
        {item && <input type="hidden" name="item" value={item} />}
        <input type="hidden" name="sha" value={baseSha} />
        <input type="hidden" name="payload" value={payload} />
        <input type="hidden" name="ackLegal" value={ackLegal ? "1" : ""} />

        <div className="rounded-[2px] border border-line bg-charcoal p-6">
          <SchemaForm fields={schema} value={value} onChange={setValue} />
        </div>

        <div className="sticky bottom-0 -mx-6 space-y-3 border-t border-line bg-charcoal/95 px-6 py-4 backdrop-blur">
          <Errors errors={state?.errors} />
          <LegalWarning findings={state?.legal} ack={ackLegal} onAck={setAckLegal} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] text-warm-gray">
              {dirty ? "Unpublished changes." : "No changes yet."} Publishing updates the live site in about a minute.
            </p>
            <button type="submit" className={btnPrimary} disabled={pending}>
              {pending ? "Publishing…" : "Publish changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
