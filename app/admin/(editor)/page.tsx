import { requireAdmin } from "@/lib/admin/session";
import { getStore, StoreError } from "@/lib/admin/store";
import { SECTIONS } from "@/lib/admin/sections";
import { DEPLOYED } from "@/lib/admin/deployed";
import { PREVIEW_PATHS } from "@/lib/admin/preview-paths";
import { photoLibrary } from "@/lib/admin/photos";
import { FIELDS_RU } from "@/lib/admin/i18n/fields-ru";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { areaProfiles } from "@/lib/areas";
import { posts } from "@/lib/posts";
import { VisualEditor } from "@/components/admin/visual/VisualEditor";
import type { Base, PageRef } from "@/components/admin/visual/types";

// /admin — the visual editor. The forms (/admin/content) remain for
// everything a page doesn't show and as a fallback.

const pages = (): PageRef[] => [
  { path: "/", label: "Homepage", group: "Main" },
  { path: "/about", label: "About", group: "Main" },
  { path: "/contact", label: "Contact", group: "Main" },
  { path: "/services", label: "Services", group: "Main" },
  { path: "/areas", label: "Service areas", group: "Main" },
  { path: "/blog", label: "Blog", group: "Main" },
  { path: "/quote", label: "Quote request", group: "Main" },
  { path: "/start-project", label: "Start a project", group: "Main" },
  { path: "/quote/thanks", label: "Thank you (after a quote request)", group: "Main" },
  { path: "/privacy", label: "Privacy policy", group: "Main" },
  { path: "/terms", label: "Terms of service", group: "Main" },
  { path: "/work/sample", label: "Client project page (sample)", group: "Main" },
  ...services.map((s) => ({ path: `/services/${s.slug}`, label: s.name, group: "Services" })),
  { path: "/services/fire-damage/spokane-wa", label: "Spokane wildfire", group: "Services" },
  ...areaProfiles.map((a) => ({ path: `/areas/${a.slug}`, label: `${a.name}, ${a.region}`, group: "Cities" })),
  ...services.flatMap((s) =>
    areaProfiles.map((a) => ({ path: `/services/${s.slug}/${a.slug}`, label: `${s.shortName} — ${a.name}`, group: "City × service" })),
  ),
  ...posts.map((p) => ({ path: `/blog/${p.slug}`, label: p.title, group: "Blog posts" })),
];

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireAdmin();
  const { page } = await searchParams;
  // Only a path on this site, never a URL.
  const initialPath = page && page.startsWith("/") && !page.startsWith("//") && !page.startsWith("/admin") ? page : "/";

  const deployed: Record<string, unknown> = Object.fromEntries(SECTIONS.map((s) => [s.id, DEPLOYED[s.file]]));
  let latest: Base = Object.fromEntries(SECTIONS.map((s) => [s.id, { sha: null, value: DEPLOYED[s.file] }]));
  let connected = false;
  let storeKind: "local" | "github" | "unconfigured" = "unconfigured";
  let connectError: string | undefined;
  try {
    const store = await getStore();
    storeKind = store.kind;
    const files = await store.readMany(SECTIONS.map((s) => s.file));
    latest = Object.fromEntries(
      SECTIONS.map((s, i) => [s.id, files[i] ? { sha: files[i]!.sha, value: JSON.parse(files[i]!.text) } : { sha: null, value: DEPLOYED[s.file] }]),
    );
    connected = true;
  } catch (err) {
    connectError = err instanceof StoreError ? undefined : "Could not load the latest content.";
    if (!(err instanceof StoreError)) console.error("[admin] editor load failed", err);
  }

  return (
    <VisualEditor
      sections={SECTIONS}
      latest={latest}
      deployed={deployed}
      connected={connected}
      storeKind={storeKind}
      connectError={connectError}
      pages={pages()}
      previewPaths={PREVIEW_PATHS}
      posts={posts.map((p) => ({ slug: p.slug, title: p.title }))}
      photos={await photoLibrary()}
      user={user.name}
      devBypass={user.email === "dev@localhost"}
      siteUrl={site.url}
      initialPath={initialPath}
      fieldsRu={FIELDS_RU}
    />
  );
}
