"use client";

import { useEffect, useRef } from "react";

// Right-click (or long-press) anything on the page and see everything that
// can be done to it — change the words, replace the photo, move it up,
// delete it, add another one like it. No hunting through a panel for the
// action you want: the actions come to the thing you pointed at.

export type MenuItem = { label: string; hint?: string; danger?: boolean; run: () => void };

export function ContextMenu({
  x,
  y,
  title,
  items,
  onClose,
}: {
  x: number;
  y: number;
  title: string;
  items: MenuItem[];
  onClose: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // Keep it on screen.
    const r = el.getBoundingClientRect();
    el.style.left = `${Math.min(x, window.innerWidth - r.width - 8)}px`;
    el.style.top = `${Math.min(y, window.innerHeight - r.height - 8)}px`;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [x, y, onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" onMouseDown={onClose} onContextMenu={(e) => (e.preventDefault(), onClose())} />
      <div
        ref={box}
        role="menu"
        className="fixed z-50 w-64 overflow-hidden rounded-[10px] border border-line bg-charcoal py-1 shadow-2xl"
        style={{ left: x, top: y }}
      >
        <p className="truncate px-3 py-1.5 text-[12px] text-warm-gray">{title}</p>
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            onClick={() => {
              onClose();
              item.run();
            }}
            className={`block w-full px-3 py-2.5 text-left text-[14px] hover:bg-charcoal-soft ${item.danger ? "text-coral-deep" : ""}`}
          >
            {item.label}
            {item.hint && <span className="block text-[12px] text-warm-gray">{item.hint}</span>}
          </button>
        ))}
      </div>
    </>
  );
}
