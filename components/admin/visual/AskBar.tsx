"use client";

import { useRef, useState } from "react";
import { askEditor, type Edit } from "@/app/admin/ai-actions";
import { RULES_RU, type Finding } from "@/lib/admin/legal-guard";
import { useLang } from "./i18n";

// The simplest way to change the site: say what you want. The assistant
// finds the fields, the page changes in front of you, and you either keep
// it or put it back. Everything it does is an ordinary draft change —
// undo, the list of changes and Publish all work the same.

export function AskBar({
  busyHint,
  onAsk,
}: {
  busyHint?: string;
  onAsk: (request: string) => Promise<{ reply: string; edits: Edit[]; legal: Finding[] } | { error: string }>;
}) {
  const { t, lang } = useLang();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ reply: string; count: number; legal: Finding[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    const r = await onAsk(q);
    setBusy(false);
    if ("error" in r) return setError(r.error);
    setText("");
    setResult({ reply: r.reply, count: r.edits.length, legal: r.legal });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-3 lg:pr-[416px]">
      <div className="pointer-events-auto w-full max-w-2xl space-y-2">
        {(result || error) && (
          <div className="rounded-[10px] border border-line bg-charcoal p-3 text-[14px] shadow-lg">
            {error ? (
              <p className="text-coral-deep">{error}</p>
            ) : (
              <>
                <p>{result!.reply}</p>
                {result!.count > 0 && (
                  <p className="mt-1 text-[13px] text-warm-gray">
                    {t.aiApplied} {result!.count} · {t.aiUndoHint}
                  </p>
                )}
                {result!.legal.map((f) => (
                  <p key={f.rule} className="mt-2 text-[13px] text-coral-deep">
                    {lang === "ru" ? RULES_RU[f.rule] ?? f.rule : f.rule}
                  </p>
                ))}
              </>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-full border border-line bg-charcoal p-1.5 pl-4 shadow-[0_8px_30px_rgba(0,0,0,.12)]">
          <span aria-hidden className="text-[16px]">✨</span>
          <input
            ref={input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={busy ? (busyHint ?? t.aiThinking) : t.aiPlaceholder}
            disabled={busy}
            className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ivory outline-none placeholder:text-warm-gray"
          />
          <button
            type="button"
            onClick={send}
            disabled={busy || !text.trim()}
            className="rounded-full bg-brand px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-brand-2 disabled:opacity-40"
          >
            {busy ? "…" : t.aiSend}
          </button>
        </div>
      </div>
    </div>
  );
}
