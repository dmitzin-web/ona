import fs from "node:fs";
import path from "node:path";

// The remodeling gallery ("Our work") on /services/remodeling.
//
// One JSON file per photo in content/work/, edited through the admin at
// /keystatic. The component that renders it is components/RemodelingGallery.
// Read at build time — the page is statically generated.
//
// The caption rule lives in the admin's field description, and it is the
// reason this gallery was rebuilt: every word of `notes` must be visible in
// its photo. No materials, brands, sizes, timelines, budgets or places.

export type WorkItem = {
  slug: string;
  title: string;
  roomType: string;
  image: string;
  imageAlt: string;
  notes: string;
  order: number;
};

const DIR = path.join(process.cwd(), "content/work");

export const workItems: WorkItem[] = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({
    slug: f.slice(0, -".json".length),
    ...(JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Omit<WorkItem, "slug">),
  }))
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
