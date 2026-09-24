"use client";

// ──────────────────────────────────────────────────────────────
// Before / after wipe
// ──────────────────────────────────────────────────────────────
// Two frames of the same room, one on top of the other, with the
// "before" clipped to whatever fraction of the width the reader
// has dragged to. The gesture is the argument: in one second the
// visitor repairs the room themselves, which no amount of copy
// about "documented restoration" achieves.
//
// Why clip-path and not two absolutely-positioned crops: the
// after image is never re-laid-out, so there is no seam wobble
// while dragging and no second layout pass on a phone.
//
// Interaction model, in the order people actually try it:
//   - mouse: hovering wipes. No click needed — the whole panel is
//     the control, and a visitor who does not realise it is
//     interactive discovers it by accident, which is the point.
//   - touch / pen: drag, but only once the finger has moved more
//     horizontally than vertically. The panel is most of a phone
//     screen, and a page you cannot scroll with a thumb because
//     the hero swallowed the gesture is a dead page — for this
//     visitor especially. `touch-action: pan-y` hands every
//     vertical swipe straight to the browser; this threshold
//     stops the first few pixels of one from nudging the wipe
//     before the browser takes the gesture over.
//   - keyboard: the grip is a real slider. ← → step 4%, shift 10%,
//     Home / End jump to either frame.
//
// The caller decides whether there is anything to show: this
// renders whatever pair it is handed. The homepage section that
// uses it stays out of the page entirely until both photos exist,
// so nothing here has to invent a placeholder.

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export type BeforeAfterProps = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  labels: { before: string; after: string; drag: string };
  /** Aspect ratio of the frame, e.g. "3 / 2". Both photos are cropped to it. */
  aspect?: string;
  sizes?: string;
  className?: string;
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function BeforeAfter({
  before,
  after,
  labels,
  aspect = "3 / 2",
  sizes = "(max-width: 768px) 100vw, 60vw",
  className = "",
}: BeforeAfterProps) {
  const [pct, setPct] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  // Where a touch started, until it commits to being a wipe or a scroll.
  const pending = useRef<{ x: number; y: number; id: number } | null>(null);
  const SLOP = 8;

  const fromClientX = useCallback((clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box || box.width === 0) return;
    setPct(clamp(((clientX - box.left) / box.width) * 100));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") setPct((p) => clamp(p - step));
    else if (e.key === "ArrowRight") setPct((p) => clamp(p + step));
    else if (e.key === "Home") setPct(0);
    else if (e.key === "End") setPct(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={frame}
      className={`relative select-none overflow-hidden rounded-[2px] bg-charcoal-soft ${className}`}
      style={{ aspectRatio: aspect, touchAction: "pan-y" }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromClientX(e.clientX);
          return;
        }
        // Touch and pen: wait and see whether this is a wipe or a scroll.
        pending.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      }}
      onPointerMove={(e) => {
        if (dragging.current || e.pointerType === "mouse") {
          fromClientX(e.clientX);
          return;
        }
        const start = pending.current;
        if (!start) return;
        const dx = Math.abs(e.clientX - start.x);
        const dy = Math.abs(e.clientY - start.y);
        if (dy > SLOP && dy >= dx) {
          pending.current = null; // a scroll — the page keeps it
        } else if (dx > SLOP) {
          pending.current = null;
          dragging.current = true;
          e.currentTarget.setPointerCapture(start.id);
          fromClientX(e.clientX);
        }
      }}
      onPointerUp={() => {
        dragging.current = false;
        pending.current = null;
      }}
      onPointerCancel={() => {
        dragging.current = false;
        pending.current = null;
      }}
    >
      <Image
        src={after.src}
        alt={after.alt}
        fill
        sizes={sizes}
        className="pointer-events-none object-cover"
      />

      {/* The before frame sits on top, revealed from the left edge. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${(100 - pct).toFixed(2)}% 0 0)` }}
      >
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes={sizes}
          className="pointer-events-none object-cover"
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-[2px] bg-charcoal/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-warm-gray">
        {labels.before}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-[2px] bg-charcoal/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-teal">
        {labels.after}
      </span>

      {/* Teal, not coral: this is UI, and coral on this site means
          "call us now" and nothing else. */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-teal"
        style={{ left: `${pct.toFixed(2)}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label={labels.drag}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${Math.round(pct)}% ${labels.before}`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-teal text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] transition hover:bg-gold-deep"
        >
          <span aria-hidden className="text-[13px] leading-none tracking-[-0.1em]">
            ←→
          </span>
        </button>
      </div>
    </div>
  );
}
