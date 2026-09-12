import "server-only";
import { getStore } from "./store";
import { SECTIONS } from "./sections";
import { DEPLOYED } from "./deployed";
import { leaves } from "@/components/admin/visual/model";
import { getAt } from "./json-path";

// The photo library the admin picks from: every image under public/photos.
// If the store can't be reached (publishing not connected yet), fall back to
// the photos this deployment is already using, so the picker still works.
export async function photoLibrary(): Promise<string[]> {
  try {
    const paths = await (await getStore()).listMedia("public/photos");
    if (paths.length) return paths.map((p) => p.replace(/^public/, ""));
  } catch {}
  const used = new Set<string>();
  for (const s of SECTIONS) {
    const value = DEPLOYED[s.file];
    for (const leaf of leaves(s, value)) {
      if (!leaf.photo) continue;
      const v = getAt(value, leaf.path);
      if (typeof v === "string" && v) used.add(v);
    }
  }
  return [...used].sort();
}
