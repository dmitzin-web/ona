import fs from "node:fs";
import path from "node:path";
import { parseWork, WORK_DIR, type WorkItem } from "./content-format";

// The remodeling gallery ("Our work") on /services/remodeling.
//
// One JSON file per photo in content/work/, edited through the admin at
// /admin. The component that renders it is components/RemodelingGallery.
// Read at build time — the page is statically generated. The file format
// lives in lib/content-format.ts, shared with the admin.
//
// The caption rule is enforced in the admin's copy, and it is the reason
// this gallery was rebuilt: every word of `notes` must be visible in its
// photo. No materials, brands, sizes, timelines, budgets or places.

export type { WorkItem } from "./content-format";

const DIR = path.join(process.cwd(), WORK_DIR);

export const workItems: WorkItem[] = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => parseWork(f.slice(0, -".json".length), fs.readFileSync(path.join(DIR, f), "utf8")))
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
