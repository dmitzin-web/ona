"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { suggestedPromptsForPath } from "./suggestedPrompts";
import { askOnaGreeting } from "@/lib/assistant/prompts";

// Ask ONA — the site-wide AI assistant.
//
// Mounted once in app/layout.tsx. Listens for the global event
// `askona:open` so any button anywhere on the page can open the drawer
// without needing React context. The Header's "Ask ONA" nav button
// dispatches that event. A small floating button below also opens it
// (mobile, since the desktop nav is hidden there).
//
// Keyboard: "/" or Cmd/Ctrl+K opens the drawer from anywhere on the
// page (unless the user is typing in a form field).
//
// UX:
//   - Desktop: opens as a side drawer pinned to the right, ~440px.
//   - Mobile (< 1024px): opens as a full-screen sheet from the bottom.
//   - Esc closes. Backdrop click closes. Focus returns to the trigger.

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
type TextBlock = { type: "text"; text: string };
type ImageBlock = {
  type: "image";
  source: { type: "base64"; media_type: ImageMediaType; data: string };
};
type ContentBlock = TextBlock | ImageBlock;

type Attachment = {
  dataUrl: string;
  base64: string;
  mediaType: ImageMediaType;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  images: Attachment[];
  streaming?: boolean;
};

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

async function fileToAttachment(file: File): Promise<Attachment | null> {
  if (file.size > MAX_IMAGE_BYTES) return null;
  const allowed: ImageMediaType[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const mt = file.type as ImageMediaType;
  if (!allowed.includes(mt)) return null;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const comma = dataUrl.indexOf(",");
      resolve({
        dataUrl,
        base64: dataUrl.slice(comma + 1),
        mediaType: mt,
      });
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function buildApiMessages(history: ChatMessage[], pageContext: string | null) {
  return history.map((m, i) => {
    const isLastUser = m.role === "user" && i === history.length - 1;
    const includeContext = isLastUser && pageContext;

    if (m.images.length === 0 && !includeContext) {
      return { role: m.role, content: m.text };
    }
    const blocks: ContentBlock[] = [];
    for (const img of m.images) {
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: img.mediaType,
          data: img.base64,
        },
      });
    }
    const text = includeContext
      ? `${m.text}\n\n<page-context>${pageContext}</page-context>`.trim()
      : m.text;
    if (text.trim()) blocks.push({ type: "text", text });
    return { role: m.role, content: blocks };
  });
}

export function AskOna() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const suggested = useMemo(
    () => suggestedPromptsForPath(pathname),
    [pathname],
  );
  const pageContext = useMemo(() => {
    if (typeof window === "undefined") return null;
    return `path: ${pathname}`;
  }, [pathname]);

  // Listen for global open events from triggers anywhere on the page.
  useEffect(() => {
    function onOpen(e: Event) {
      // Remember the trigger so we can restore focus on close.
      if (e.target instanceof HTMLElement) triggerRef.current = e.target;
      else triggerRef.current = null;
      setOpen(true);
    }
    window.addEventListener("askona:open", onOpen);
    return () => window.removeEventListener("askona:open", onOpen);
  }, []);

  // Keyboard shortcuts: "/" or Cmd/Ctrl+K opens the drawer from anywhere
  // on the page. Skipped when the user is typing in a form field — we
  // don't want to hijack "/" inside a search box or note field.
  useEffect(() => {
    function isEditable(el: EventTarget | null): boolean {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return el.isContentEditable;
    }
    function onKey(e: KeyboardEvent) {
      if (open) return;
      const cmdK = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      const slash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey;
      if (!cmdK && !slash) return;
      if (slash && isEditable(e.target)) return;
      e.preventDefault();
      // No focusable trigger — just open. Focus will return to body on close.
      triggerRef.current = null;
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Esc to close + body scroll lock + focus input.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      if (triggerRef.current && document.contains(triggerRef.current)) {
        triggerRef.current.focus();
      }
    };
  }, [open]);

  // Auto-scroll to bottom when messages change.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const onFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const additions: Attachment[] = [];
    for (const f of files) {
      if (attachments.length + additions.length >= MAX_IMAGES) break;
      const att = await fileToAttachment(f);
      if (att) additions.push(att);
    }
    setAttachments((a) => [...a, ...additions]);
  }, [attachments.length]);

  async function send(prompt?: string) {
    const text = (prompt ?? draft).trim();
    if (!text && attachments.length === 0) return;
    if (sending) return;
    setError(null);

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text,
      images: attachments,
    };
    const assistantMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      text: "",
      images: [],
      streaming: true,
    };

    const history = [...messages, userMsg];
    setMessages([...history, assistantMsg]);
    setDraft("");
    setAttachments([]);
    setSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: buildApiMessages(history, pageContext),
        }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, text: buffer } : m,
          ),
        );
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, streaming: false } : m,
        ),
      );
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setMessages([]);
    setDraft("");
    setAttachments([]);
    setError(null);
  }

  return (
    <>
      {/* Mobile-only floating button — desktop uses the header trigger. */}
      <button
        type="button"
        aria-label="Open Ask ONA assistant"
        onClick={() => window.dispatchEvent(new Event("askona:open"))}
        className="fixed bottom-20 right-5 z-30 inline-flex h-12 w-12 items-center justify-center border border-charcoal bg-charcoal text-ivory shadow-lg transition hover:bg-ivory hover:text-charcoal lg:hidden"
      >
        <ChatIcon className="h-5 w-5" />
        <span className="sr-only">Ask ONA</span>
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Ask ONA"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel — bottom sheet on mobile, side drawer on lg+ */}
          <div className="relative ml-auto flex h-full w-full flex-col bg-ivory shadow-2xl lg:w-[440px]">
            {/* Header */}
            <div className="flex flex-none items-center justify-between border-b border-line-light px-5 py-4">
              <div>
                <p className="text-base font-medium tracking-tight text-charcoal">
                  Ask ONA
                </p>
                <p className="text-xs text-charcoal/55">
                  AI assistant · informational only
                </p>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="eyebrow text-charcoal/55 transition hover:text-charcoal"
                  >
                    New chat
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center border border-charcoal/20 text-charcoal transition hover:border-charcoal"
                  aria-label="Close"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Message stream */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-5"
            >
              {messages.length === 0 ? (
                <EmptyState
                  greeting={askOnaGreeting}
                  suggestions={suggested}
                  onPick={(p) => void send(p)}
                />
              ) : (
                <ul className="space-y-5">
                  {messages.map((m) => (
                    <li key={m.id}>
                      <MessageBubble msg={m} />
                    </li>
                  ))}
                </ul>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-4 border-l-2 border-red-700 bg-red-700/5 px-4 py-3 text-sm text-red-800"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="flex-none border-t border-line-light px-5 pt-3">
                <ul className="flex flex-wrap gap-2">
                  {attachments.map((a, i) => (
                    <li key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.dataUrl}
                        alt="attachment"
                        className="h-14 w-14 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setAttachments((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        aria-label="Remove image"
                        className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center bg-charcoal text-ivory"
                      >
                        <CloseIcon className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Input */}
            <form
              className="flex flex-none items-end gap-2 border-t border-line-light px-5 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.length >= MAX_IMAGES}
                aria-label="Attach an image"
                className="inline-flex h-10 w-10 flex-none items-center justify-center border border-charcoal/20 text-charcoal transition hover:border-charcoal disabled:opacity-40"
              >
                <PaperclipIcon className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                multiple
                className="sr-only"
                onChange={onFile}
              />

              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                rows={1}
                placeholder="Ask anything about ONA, services, or your claim…"
                className="block min-h-10 max-h-32 w-full resize-none border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || (!draft.trim() && attachments.length === 0)}
                aria-label="Send"
                className="inline-flex h-10 w-10 flex-none items-center justify-center border border-charcoal bg-charcoal text-ivory transition hover:bg-transparent hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EmptyState({
  greeting,
  suggestions,
  onPick,
}: {
  greeting: string;
  suggestions: readonly string[];
  onPick: (s: string) => void;
}) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-charcoal/80">{greeting}</p>
      {suggestions.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow text-charcoal/55">Try asking</p>
          <ul className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => onPick(s)}
                  className="block w-full border border-charcoal/15 bg-ivory px-4 py-3 text-left text-sm text-charcoal transition hover:border-charcoal hover:bg-ivory-soft"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[88%] ${
          isUser
            ? "border border-charcoal bg-charcoal text-ivory"
            : "border border-charcoal/15 bg-ivory text-charcoal"
        } px-4 py-3 text-sm leading-relaxed`}
      >
        {msg.images.length > 0 && (
          <ul className="mb-2 flex flex-wrap gap-1.5">
            {msg.images.map((a, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <li key={i}>
                <img
                  src={a.dataUrl}
                  alt="attached"
                  className="h-16 w-16 object-cover"
                />
              </li>
            ))}
          </ul>
        )}
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.text}</p>
        ) : (
          <AssistantMarkdown text={msg.text} streaming={!!msg.streaming} />
        )}
      </div>
    </div>
  );
}

function AssistantMarkdown({
  text,
  streaming,
}: {
  text: string;
  streaming: boolean;
}) {
  if (!text && streaming) {
    return (
      <div className="flex items-center gap-1.5 py-1" aria-label="Thinking">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-charcoal/40" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-charcoal/40 [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-charcoal/40 [animation-delay:240ms]" />
      </div>
    );
  }
  return (
    <div className="space-y-3 [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-charcoal/5 [&_code]:px-1 [&_code]:py-0.5 [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:m-0 [&_strong]:font-semibold">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            // Internal links get next/link for client-side nav.
            if (typeof href === "string" && href.startsWith("/")) {
              return (
                <Link
                  href={href}
                  className="text-charcoal underline underline-offset-2 hover:text-charcoal/70"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal underline underline-offset-2 hover:text-charcoal/70"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icons (kept inline; the project's existing ServiceIcons set doesn't have
// chat/close/paperclip variants and these are one-off shapes anyway).
// ---------------------------------------------------------------------------

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 5 H19 a1 1 0 0 1 1 1 V16 a1 1 0 0 1 -1 1 H13 L9 21 V17 H5 a1 1 0 0 1 -1 -1 V6 a1 1 0 0 1 1 -1 Z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6 L18 18 M18 6 L6 18" />
    </svg>
  );
}

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 7 L8 15 a4 4 0 0 0 6 6 L22 13 a6 6 0 0 0 -9 -9 L4 13 a8 8 0 0 0 12 12 L21 20" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19 V5 M6 11 L12 5 L18 11" />
    </svg>
  );
}
