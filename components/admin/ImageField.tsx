"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { uploadPhoto } from "@/app/admin/editor-actions";
import { useLang } from "./visual/i18n";
import { btnSecondary } from "./ui";

// Choosing a photo: the library of photos already on the site, plus adding
// one from this computer or phone.
//
// The file is resized and re-encoded in the browser before it is sent —
// a 12 MP phone photo becomes a few hundred KB, and re-encoding drops the
// camera's metadata with it, including the GPS coordinates of the house it
// was taken at. The preview shows the photo cropped exactly the way the
// page will crop it.

const MAX_EDGE = 2400;
const previews = new Map<string, string>(); // path → local blob URL, until deployed

export const photoPreviewUrl = (path: string) => previews.get(path);

// The right-click menu asks the field that is open in the panel to do one
// of its two things, without the editor having to know how it works.
export const PHOTO_ACTION_EVENT = "ona:photo-action";
export const askPhotoField = (id: string, action: "upload" | "library") =>
  window.dispatchEvent(new CustomEvent(PHOTO_ACTION_EVENT, { detail: { id, action } }));

type Library = { photos: string[]; add: (path: string) => void };
const LibraryContext = createContext<Library>({ photos: [], add: () => {} });

export function PhotoLibrary({ photos, children }: { photos: string[]; children: React.ReactNode }) {
  const [all, setAll] = useState(photos);
  return (
    <LibraryContext.Provider value={{ photos: all, add: (p) => setAll((x) => (x.includes(p) ? x : [p, ...x])) }}>
      {children}
    </LibraryContext.Provider>
  );
}

async function shrink(file: File): Promise<{ blob: Blob; url: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", 0.85));
  if (!blob) throw new Error("encode");
  return { blob, url: URL.createObjectURL(blob) };
}

export function ImageField({
  id,
  value,
  aspect = "3 / 2",
  allowNone,
  onChange,
}: {
  id: string;
  value: string;
  aspect?: string;
  allowNone?: boolean;
  onChange: (v: string) => void;
}) {
  const { t, lang } = useLang();
  const { photos, add } = useContext(LibraryContext);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const src = (p: string) => photoPreviewUrl(p) ?? p;

  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; action: "upload" | "library" }>).detail;
      if (d.id !== id) return;
      if (d.action === "upload") input.current?.click();
      else setOpen(true);
    };
    window.addEventListener(PHOTO_ACTION_EVENT, h);
    return () => window.removeEventListener(PHOTO_ACTION_EVENT, h);
  }, [id]);

  async function pickFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const { blob, url } = await shrink(file);
      const fd = new FormData();
      fd.append("file", new File([blob], "photo.webp", { type: "image/webp" }));
      fd.append("name", file.name);
      const res = await uploadPhoto(fd);
      if (!res.ok) setError(res.message);
      else {
        previews.set(res.path, url);
        add(res.path);
        onChange(res.path);
        setOpen(false);
      }
    } catch {
      setError(t.photoUnsupported);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-40 flex-none overflow-hidden rounded-[2px] border border-line bg-charcoal-soft" style={{ aspectRatio: aspect }}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[12px] text-warm-gray">{t.noPhoto}</span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-[12px] text-warm-gray">{t.photoCropNote}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" id={id} className={btnSecondary} onClick={() => setOpen((o) => !o)}>
              {t.choosePhoto}
            </button>
            <button type="button" className={btnSecondary} disabled={busy} onClick={() => input.current?.click()}>
              {busy ? t.uploading : t.uploadPhoto}
            </button>
            {allowNone && value && (
              <button type="button" className={btnSecondary} onClick={() => onChange("")}>
                {t.removePhoto}
              </button>
            )}
          </div>
          {error && <p className="text-[13px] text-coral-deep">{error}</p>}
          {value.startsWith("/photos/library/") && photoPreviewUrl(value) && (
            <p className="text-[12px] text-warm-gray">{t.photoAfterPublish}</p>
          )}
        </div>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void pickFile(f);
        }}
      />

      {open && (
        <div className="rounded-[2px] border border-line p-2">
          <p className="px-1 pb-2 text-[12px] text-warm-gray">
            {photos.length} {lang === "ru" ? "фото на сайте" : "photos on the site"}
          </p>
          <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {photos.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  onChange(p);
                  setOpen(false);
                }}
                className={`overflow-hidden rounded-[2px] border-2 ${p === value ? "border-teal" : "border-transparent opacity-80 hover:opacity-100"}`}
                style={{ aspectRatio: aspect }}
                title={p}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src(p)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
