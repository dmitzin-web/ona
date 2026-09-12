"use client";

import { deleteSectionItem } from "@/app/admin/actions";

// Removing a city takes six pages off the site. That is not something to
// do by accident, so it sits at the bottom of the page, says what will
// happen, and asks once before it goes.

export function RemoveItem({ sectionId, item, label }: { sectionId: string; item: string; label: string }) {
  return (
    <form
      action={deleteSectionItem}
      className="mt-8 rounded-[2px] border border-coral/40 bg-coral/5 p-4"
      onSubmit={(e) => {
        if (!confirm(`Remove ${label}? Its pages come off the site at the next publish. Anyone who has the addresses — or Google — will get "page not found" until you redirect them.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="section" value={sectionId} />
      <input type="hidden" name="item" value={item} />
      <p className="text-[14px] font-semibold text-ivory">Remove {label}</p>
      <p className="mt-1 text-[13px] leading-snug text-warm-gray">
        Its own page and the five service pages for it come off the site. Everything that links to them is built from the same
        list, so the links go too. The addresses start returning “page not found” — send them somewhere in SEO → Redirects if
        they have been up for a while.
      </p>
      <button type="submit" className="mt-3 rounded-[2px] border border-coral px-4 py-2 text-[14px] font-semibold text-coral-deep transition hover:bg-coral/10">
        Remove {label}
      </button>
    </form>
  );
}
