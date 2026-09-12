"use client";

import { createContext, useContext } from "react";

// The pages a `refs` field can point at — the cities, the services — by
// name rather than by address, so choosing which pages link to which is a
// row of tick boxes and not a list of slugs to type correctly.
//
// Provided from the draft in the visual editor (so a city added but not yet
// published is already pickable) and from the store in the forms.

export type Choice = { slug: string; label: string };
export type Choices = Record<string, Choice[]>;

const CollectionsContext = createContext<Choices>({});

export function Collections({ value, children }: { value: Choices; children: React.ReactNode }) {
  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}

export const useChoices = (of: string): Choice[] => useContext(CollectionsContext)[of] ?? [];

export function RefsField({
  id,
  of,
  value,
  max,
  onChange,
}: {
  id: string;
  of: string;
  value: string[];
  max?: number;
  onChange: (next: string[]) => void;
}) {
  const choices = useChoices(of);
  const chosen = value.filter((v) => choices.some((c) => c.slug === v));
  if (!choices.length) {
    return <p className="text-[13px] text-warm-gray">Nothing to choose from yet.</p>;
  }
  return (
    <div id={id} className="flex flex-wrap gap-1.5">
      {choices.map((c) => {
        const on = chosen.includes(c.slug);
        const full = !on && max !== undefined && chosen.length >= max;
        return (
          <button
            key={c.slug}
            type="button"
            disabled={full}
            // The order they are ticked in is the order they appear on the
            // page, so the first choice is the first link.
            onClick={() => onChange(on ? chosen.filter((x) => x !== c.slug) : [...chosen, c.slug])}
            className={`rounded-full border px-3 py-1.5 text-[13px] transition disabled:opacity-40 ${
              on ? "border-teal bg-teal/10 text-teal" : "border-line text-warm-gray hover:border-teal"
            }`}
            title={`/${c.slug}`}
          >
            {on ? `${chosen.indexOf(c.slug) + 1}. ` : ""}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
