"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { triageGreeting } from "@/lib/triage/prompts";
import { site } from "@/lib/site";

// Floating AI Damage Triage chat.
//
// Composed of a fixed-position toggle button (bottom-right) and a side
// drawer that opens on click. Messages are stored in component state — no
// persistence across reloads, by design (triage requests are situational).

type TextBlock = { type: "text"; text: string };
type ImageBlock = {
  type: "image";
  source: { type: "base64"; media_type: string; data: string };
};
type ContentBlock = TextBlock | ImageBlock;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  // For rendering we keep parallel arrays — `text` for display, `images`
  // for thumbnails. The API payload reconstructs proper ContentBlock arrays.
  text: string;
  images: { dataUrl: string; mediaType: string; base64: string }[];
  streaming?: boolean;
};

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function buildApiMessages(history: ChatMessage[]) {
  return history.map((m) => {
    if (m.images.length === 0) {
      return { role: m.role, content: m.text };
    }
    const content: ContentBlock[] = [];
    for (const img of m.images) {
      content.push({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.base64 },
      });
    }
    if (m.text.trim()) content.push({ type: "text", text: m.text });
    return { role: m.role, content };
  });
}

async function fileToBase64(file: File): Promise<{ base64: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const comma = dataUrl.indexOf(",");
      resolve({ base64: dataUrl.slice(comma + 1), dataUrl });
    };
    reader.readAsDataURL(file);
  });
}

export function TriageWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draftText, setDraftText] = useState("");
  const [draftImages, setDraftImages] = useState<
    { dataUrl: string; mediaType: string; base64: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom as the assistant streams.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // ESC closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const addFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      setError(null);
      const remaining = MAX_IMAGES - draftImages.length;
      const accepted = Array.from(files).slice(0, remaining);
      const tooBig = accepted.find((f) => f.size > MAX_IMAGE_BYTES);
      if (tooBig) {
        setError(`Photo "${tooBig.name}" is over 4 MB. Resize and try again.`);
        return;
      }
      const next: typeof draftImages = [];
      for (const file of accepted) {
        if (!file.type.startsWith("image/")) {
          setError(`"${file.name}" is not an image.`);
          continue;
        }
        const { base64, dataUrl } = await fileToBase64(file);
        next.push({
          base64,
          dataUrl,
          mediaType: file.type,
          name: file.name,
        });
      }
      setDraftImages((prev) => [...prev, ...next]);
    },
    [draftImages.length],
  );

  const removeImage = useCallback((idx: number) => {
    setDraftImages((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const send = useCallback(async () => {
    const text = draftText.trim();
    if (!text && draftImages.length === 0) return;
    if (sending) return;

    setError(null);
    setSending(true);

    const userMessage: ChatMessage = {
      id: uid(),
      role: "user",
      text,
      images: draftImages.map(({ dataUrl, mediaType, base64 }) => ({
        dataUrl,
        mediaType,
        base64,
      })),
    };
    const assistantPlaceholder: ChatMessage = {
      id: uid(),
      role: "assistant",
      text: "",
      images: [],
      streaming: true,
    };

    const nextHistory = [...messages, userMessage];
    setMessages([...nextHistory, assistantPlaceholder]);
    setDraftText("");
    setDraftImages([]);

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: buildApiMessages(nextHistory) }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Triage request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last.role === "assistant") {
            copy[copy.length - 1] = { ...last, text: acc };
          }
          return copy;
        });
      }

      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last.role === "assistant") {
          copy[copy.length - 1] = { ...last, streaming: false };
        }
        return copy;
      });
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last.role === "assistant") {
          copy[copy.length - 1] = {
            ...last,
            streaming: false,
            text:
              last.text ||
              `I couldn't reach the triage assistant. Call ${site.phoneDisplay} for live dispatch.`,
          };
        }
        return copy;
      });
      setError(
        err instanceof Error
          ? err.message
          : "Triage assistant is unavailable.",
      );
    } finally {
      setSending(false);
    }
  }, [draftText, draftImages, messages, sending]);

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI damage triage assistant"
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 border border-ivory/30 bg-charcoal px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-ivory shadow-2xl shadow-black/30 transition hover:border-ivory lg:bottom-8 lg:right-8"
      >
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center border border-ivory/40"
        >
          <svg
            viewBox="0 0 24 18"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            className="h-4 w-4"
          >
            <path d="M2 16 L12 2 L22 16" />
          </svg>
        </span>
        Damage triage
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="AI damage triage"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
          />

          <div className="relative flex h-full w-full max-w-xl flex-col bg-ivory text-charcoal shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-charcoal/15 px-6 py-5">
              <div>
                <p className="eyebrow text-charcoal/60">
                  AI triage · live assist · 24/7
                </p>
                <h2 className="mt-2 text-2xl font-light tracking-tight">
                  Damage triage
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close triage"
                className="text-2xl leading-none text-charcoal/60 hover:text-charcoal"
              >
                ×
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-5 overflow-y-auto px-6 py-6"
            >
              {/* Greeting */}
              <div className="space-y-3">
                <p className="eyebrow text-charcoal/50">Assistant</p>
                <p className="whitespace-pre-line text-base leading-relaxed text-charcoal/85">
                  {triageGreeting}
                </p>
              </div>

              {messages.map((m) => (
                <article
                  key={m.id}
                  aria-label={
                    m.role === "user" ? "Your message" : "Assistant reply"
                  }
                  className={`space-y-3 ${m.role === "user" ? "pl-8" : ""}`}
                >
                  <p className="eyebrow text-charcoal/50">
                    {m.role === "user" ? "You" : "Assistant"}
                  </p>
                  {m.images.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {m.images.map((img, i) => (
                        <li key={i}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.dataUrl}
                            alt={`Attached photo ${i + 1}`}
                            className="h-20 w-20 border border-charcoal/15 object-cover"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.text && (
                    <p className="whitespace-pre-line text-base leading-relaxed text-charcoal/85">
                      {m.text}
                      {m.streaming && (
                        <span
                          aria-hidden="true"
                          className="ml-0.5 inline-block h-4 w-2 -translate-y-0.5 animate-pulse bg-charcoal/60 align-middle"
                        />
                      )}
                    </p>
                  )}
                </article>
              ))}
            </div>

            <div className="border-t border-charcoal/15 bg-ivory-soft px-6 py-5">
              {/* Photo thumbnails (draft) */}
              {draftImages.length > 0 && (
                <ul className="mb-4 flex flex-wrap gap-2">
                  {draftImages.map((img, i) => (
                    <li key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="h-16 w-16 border border-charcoal/20 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label={`Remove ${img.name}`}
                        className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center border border-charcoal bg-ivory text-xs leading-none text-charcoal hover:bg-charcoal hover:text-ivory"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={3}
                placeholder="Describe what happened. ⌘/Ctrl+Enter to send."
                disabled={sending}
                className="w-full resize-y border border-charcoal/20 bg-ivory px-3 py-2 text-base text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none"
                aria-label="Describe the damage"
              />

              {error && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={draftImages.length >= MAX_IMAGES}
                    className="border border-charcoal/30 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-charcoal transition hover:border-charcoal disabled:opacity-40"
                  >
                    + Photo
                    <span className="ml-2 text-charcoal/50">
                      {draftImages.length}/{MAX_IMAGES}
                    </span>
                  </button>
                  <a
                    href={`tel:${site.phone}`}
                    className="plausible-event-name=Call+click text-xs font-medium uppercase tracking-[0.18em] text-charcoal underline-offset-2 hover:underline"
                  >
                    Or call {site.phoneDisplay}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={send}
                  disabled={
                    sending ||
                    (draftText.trim() === "" && draftImages.length === 0)
                  }
                  className="inline-flex items-center gap-3 border border-charcoal bg-charcoal px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Send to triage"}
                </button>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-charcoal/55">
                AI-assisted triage. A live specialist follows up on every
                request — this is general guidance, not a contract or claim
                determination.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
