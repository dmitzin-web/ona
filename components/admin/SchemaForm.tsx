"use client";

import type { Field } from "@/lib/admin/schema";
import { emptyValue } from "@/lib/admin/schema";
import { btnIcon, btnSecondary, Field as FieldShell, inputCls } from "./ui";
import { useLang } from "./visual/i18n";

// Renders any section described in lib/admin/sections.ts. Fully
// controlled: the caller owns the value and gets a new one on every change.
// Deliberately forgiving while typing — numbers stay strings, string lists
// keep their blank lines — and strict on the server, where validateBySchema
// trims, converts and checks. Editing never fights the keyboard.

type Obj = Record<string, unknown>;

export function SchemaForm({
  fields,
  value,
  onChange,
  idPrefix = "f",
}: {
  fields: Field[];
  value: Obj;
  onChange: (next: Obj) => void;
  idPrefix?: string;
}) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });
  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <FieldView key={f.key} field={f} value={value[f.key]} onChange={(v) => set(f.key, v)} id={`${idPrefix}-${f.key}`} />
      ))}
    </div>
  );
}

function move<T>(arr: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function FieldView({
  field: f,
  value,
  onChange,
  id,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  id: string;
}) {
  // Labels and hints in the editor's language (English when there is no
  // translation, or outside the visual editor); the site copy stays English.
  const { field: tr, lang } = useLang();
  f = { ...f, label: tr(f.label), hint: f.hint && tr(f.hint) } as Field;
  const ru = lang === "ru";
  switch (f.kind) {
    case "text":
      return (
        <FieldShell label={f.label} hint={f.hint} htmlFor={id} required={f.required}>
          <input id={id} lang="en" spellCheck className={`${inputCls} ${f.mono ? "font-mono" : ""}`} value={String(value ?? "")} maxLength={f.max} onChange={(e) => onChange(e.target.value)} />
        </FieldShell>
      );
    case "textarea": {
      const s = String(value ?? "");
      return (
        <FieldShell label={f.label} hint={f.hint} htmlFor={id} required={f.required} counter={f.max ? `${s.length} / ${f.max}` : undefined}>
          <textarea id={id} lang="en" spellCheck rows={Math.max(f.rows ?? 3, Math.ceil(s.length / 95) + 1)} className={inputCls} value={s} maxLength={f.max} onChange={(e) => onChange(e.target.value)} />
        </FieldShell>
      );
    }
    case "number":
      return (
        <FieldShell label={f.label} hint={f.hint} htmlFor={id} required={f.required}>
          <input id={id} type="number" step={f.integer ? 1 : "any"} min={f.min} max={f.max} className={`${inputCls} max-w-[220px]`} value={value === null || value === undefined ? "" : String(value)} onChange={(e) => onChange(e.target.value)} />
        </FieldShell>
      );
    case "checkbox":
      return (
        <label className="flex items-start gap-2 text-[14px] text-ivory">
          <input type="checkbox" className="mt-1" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          <span>
            {f.label}
            {f.hint && <span className="block text-[13px] text-warm-gray">{f.hint}</span>}
          </span>
        </label>
      );
    case "select":
      if (f.thumbs) {
        const thumbs = f.thumbs;
        return (
          <FieldShell label={f.label} hint={f.hint}>
            <div role="radiogroup" aria-label={f.label} className="flex flex-wrap gap-2">
              {f.options.map((o) => {
                const on = value === o;
                return (
                  <button
                    key={o}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={thumbs[o] ? `Photo ${o}` : "No photo"}
                    onClick={() => onChange(o)}
                    className={`relative h-16 w-24 overflow-hidden rounded-[2px] border-2 bg-charcoal-soft text-[12px] text-warm-gray ${on ? "border-teal" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    {thumbs[o] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbs[o]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      "No photo"
                    )}
                  </button>
                );
              })}
            </div>
          </FieldShell>
        );
      }
      return (
        <FieldShell label={f.label} hint={f.hint} htmlFor={id}>
          <select id={id} className={`${inputCls} max-w-[260px]`} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </FieldShell>
      );
    case "strings": {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      const text = arr.join("\n");
      return (
        <FieldShell label={f.label} hint={f.hint} htmlFor={id} required={f.required}>
          <textarea id={id} lang="en" spellCheck rows={Math.max(3, arr.length + 1)} className={inputCls} value={text} onChange={(e) => onChange(e.target.value.split("\n"))} />
        </FieldShell>
      );
    }
    case "object":
      return (
        <fieldset id={id} className="scroll-mt-24 rounded-[2px] border border-line p-4">
          <legend className="px-1 text-[14px] font-medium text-ivory">{f.label}</legend>
          {f.hint && <p className="mb-3 text-[13px] text-warm-gray">{f.hint}</p>}
          <SchemaForm fields={f.fields} value={(value as Obj) ?? {}} onChange={onChange} idPrefix={id} />
        </fieldset>
      );
    case "optional": {
      const on = value !== null && value !== undefined;
      return (
        <fieldset id={id} className="scroll-mt-24 rounded-[2px] border border-line p-4">
          <legend className="px-1 text-[14px] font-medium text-ivory">{f.label}</legend>
          {f.hint && <p className="mb-3 text-[13px] text-warm-gray">{f.hint}</p>}
          <label className="flex items-center gap-2 text-[14px] text-ivory">
            <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked ? emptyValue(f.fields) : null)} />
            {tr(f.toggleLabel)}
          </label>
          {on && (
            <div className="mt-4">
              <SchemaForm fields={f.fields} value={value as Obj} onChange={onChange} idPrefix={id} />
            </div>
          )}
        </fieldset>
      );
    }
    case "list": {
      const arr = Array.isArray(value) ? (value as Obj[]) : [];
      const setAt = (i: number, v: Obj) => onChange(arr.map((x, k) => (k === i ? v : x)));
      return (
        <fieldset id={id} className="scroll-mt-24 rounded-[2px] border border-line p-4">
          <legend className="px-1 text-[14px] font-medium text-ivory">{f.label}</legend>
          {f.hint && <p className="mb-3 text-[13px] text-warm-gray">{f.hint}</p>}
          <div className="space-y-3">
            {arr.map((item, i) => (
              <div key={i} className="rounded-[2px] border border-line bg-charcoal-soft/50 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="eyebrow text-warm-gray">
                    {tr(f.itemTitle ?? "Item")} {i + 1}
                  </span>
                  <div className="flex gap-1">
                    <button type="button" className={btnIcon} aria-label={ru ? "Выше" : "Move up"} disabled={i === 0} onClick={() => onChange(move(arr, i, -1))}>↑</button>
                    <button type="button" className={btnIcon} aria-label={ru ? "Ниже" : "Move down"} disabled={i === arr.length - 1} onClick={() => onChange(move(arr, i, 1))}>↓</button>
                    <button
                      type="button"
                      className={btnIcon}
                      aria-label={ru ? "Удалить" : "Remove"}
                      onClick={() => {
                        if (confirm(ru ? `Удалить: ${tr(f.itemTitle ?? "Item")} ${i + 1}?` : `Remove ${(f.itemTitle ?? "item").toLowerCase()} ${i + 1}?`)) onChange(arr.filter((_, k) => k !== i));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <SchemaForm fields={f.fields} value={item} onChange={(v) => setAt(i, v)} idPrefix={`${id}-${i}`} />
              </div>
            ))}
          </div>
          <button type="button" className={`${btnSecondary} mt-3`} onClick={() => onChange([...arr, emptyValue(f.fields)])}>
            {ru ? `+ Добавить: ${tr(f.itemTitle ?? "Item").toLowerCase()}` : `+ Add ${(f.itemTitle ?? "item").toLowerCase()}`}
          </button>
        </fieldset>
      );
    }
  }
}
