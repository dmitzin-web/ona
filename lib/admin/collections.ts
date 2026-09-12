import "server-only";
import { getStore } from "./store";
import { SECTIONS } from "./sections";
import { DEPLOYED } from "./deployed";
import type { Choices } from "@/components/admin/Collections";

// The pages a `refs` field can point at, by name: the cities, the services.
// Read from the store so a city added a minute ago is already pickable, and
// falling back to what this deployment was built with when the store cannot
// be reached — the same rule the photo library follows.
export async function collectionChoices(): Promise<Choices> {
  const collections = SECTIONS.filter((s) => s.kind === "collection");
  const fromValue = (value: unknown, titleKey: string) =>
    (Array.isArray(value) ? (value as Record<string, unknown>[]) : []).map((it) => ({
      slug: String(it.slug ?? ""),
      label: String(it[titleKey] ?? it.slug ?? ""),
    }));

  let files: ({ text: string } | null)[] = [];
  try {
    files = await (await getStore()).readMany(collections.map((s) => s.file));
  } catch {}

  const out: Choices = {};
  collections.forEach((s, i) => {
    const text = files[i]?.text;
    let value: unknown = DEPLOYED[s.file];
    if (text) {
      try {
        value = JSON.parse(text);
      } catch {}
    }
    out[s.id] = fromValue(value, s.kind === "collection" ? s.titleKey : "slug");
  });
  return out;
}
