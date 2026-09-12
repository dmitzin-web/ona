"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { requireAdmin } from "@/lib/admin/session";
import { ConflictError, getStore, StoreError, type Commit, type ContentStore } from "@/lib/admin/store";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  sniffImage,
  validatePost,
  validateWorkFields,
} from "@/lib/admin/validate";
import { legalFindings, type Finding } from "@/lib/admin/legal-guard";
import { commitMessage } from "@/lib/admin/commit-message";
import { serializeContent, validateBySchema } from "@/lib/admin/schema";
import { findSection } from "@/lib/admin/sections";
import {
  parseWork,
  POSTS_DIR,
  serializePost,
  serializeWork,
  SLUG_RE,
  slugify,
  WORK_DIR,
  WORK_IMAGE_DIR,
  type WorkItem,
} from "@/lib/content-format";

// Every export here is a POST endpoint reachable without rendering any
// page. So every one starts with requireAdmin(), before it reads a single
// field — the admin layout's check protects pages, not these.

// `legal` carries legal-guard findings (lib/admin/legal-guard.ts). A save
// with findings is not written until the editor resubmits with the
// explicit acknowledgement (`ackLegal=1`), and an acknowledged save records
// the findings in its commit message.
export type ActionState = { errors: string[]; legal?: Finding[] } | null;

const message = commitMessage;

// null = go ahead (no findings, or acknowledged); otherwise the state to
// return so the editor sees the findings and can acknowledge them.
function legalGate(value: unknown, fd: FormData): { stop: ActionState; findings: Finding[] } {
  const findings = legalFindings(value);
  if (findings.length && str(fd, "ackLegal") !== "1") return { stop: { errors: [], legal: findings }, findings };
  return { stop: null, findings };
}

function errorText(err: unknown): string {
  if (err instanceof ConflictError || err instanceof StoreError) return err.message;
  console.error("[admin] save failed", err);
  return "Could not save. Try again in a minute; if it keeps failing, tell the developer.";
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

// ── Sign-in ──────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/admin" });
}

export async function signOutOfAdmin() {
  await signOut({ redirectTo: "/admin/sign-in" });
}

// ── Blog posts ───────────────────────────────────────────────────────────

export async function savePost(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  const mode = str(fd, "mode") === "edit" ? "edit" : "create";

  let raw: unknown;
  try {
    raw = JSON.parse(str(fd, "payload"));
  } catch {
    return { errors: ["The form could not be read. Reload the page and try again."] };
  }
  // On edit the address is fixed — renaming a live post breaks every link
  // to it — so it comes from the page, not from the editable payload.
  const v = validatePost(raw, mode === "edit" ? str(fd, "slug") : undefined);
  if (!v.ok) return { errors: v.errors };
  const post = v.value;
  const gate = legalGate(post, fd);
  if (gate.stop) return gate.stop;

  const file = `${POSTS_DIR}/${post.slug}.json`;
  try {
    await (await getStore()).commit({
      message: message(`${mode === "create" ? "Add" : "Update"} blog post: ${post.title}`, user.name, gate.findings),
      put: [{ path: file, content: serializePost(post) }],
      remove: [],
      expect: { [file]: mode === "edit" ? str(fd, "sha") : null },
    });
  } catch (err) {
    return { errors: [errorText(err)] };
  }
  redirect(`/admin/content?saved=${encodeURIComponent(post.title)}`);
}

export async function deletePost(fd: FormData) {
  const user = await requireAdmin();
  const slug = str(fd, "slug");
  if (!SLUG_RE.test(slug)) redirect("/admin/content");
  const file = `${POSTS_DIR}/${slug}.json`;
  try {
    await (await getStore()).commit({
      message: message(`Delete blog post: ${str(fd, "title") || slug}`, user.name),
      put: [],
      remove: [file],
      expect: { [file]: str(fd, "sha") },
    });
  } catch (err) {
    redirect(`/admin/posts/${slug}?error=${encodeURIComponent(errorText(err))}`);
  }
  redirect(`/admin/content?deleted=${encodeURIComponent(str(fd, "title") || slug)}`);
}

// ── Remodeling gallery ───────────────────────────────────────────────────

// Only ever delete an image that lives in this entry's own folder. The
// original p1–p9 files are shared with the homepage and the Spokane page.
const ownImage = (image: string, slug: string) => image.startsWith(`/photos/projects/${slug}/`);

export async function saveWork(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  const mode = str(fd, "mode") === "edit" ? "edit" : "create";

  const v = validateWorkFields(fd);
  if (!v.ok) return { errors: v.errors };
  const fields = v.value;
  const gate = legalGate(fields, fd);
  if (gate.stop) return gate.stop;

  const slug = mode === "edit" ? str(fd, "slug") : slugify(fields.title);
  if (!SLUG_RE.test(slug)) return { errors: ["The title needs at least one letter or number."] };
  const jsonPath = `${WORK_DIR}/${slug}.json`;

  let store: ContentStore;
  try {
    store = await getStore();
  } catch (err) {
    return { errors: [errorText(err)] };
  }
  let current: WorkItem | null = null;
  if (mode === "edit") {
    try {
      const cur = await store.read(jsonPath);
      if (!cur) return { errors: ["This photo no longer exists — it may have been deleted."] };
      current = parseWork(slug, cur.text);
    } catch (err) {
      return { errors: [errorText(err)] };
    }
  }

  const put: Commit["put"] = [];
  const remove: string[] = [];
  let image = current?.image ?? "";

  const upload = fd.get("image");
  if (upload instanceof File && upload.size > 0) {
    if (upload.size > MAX_IMAGE_BYTES) return { errors: ["The photo is larger than 10 MB."] };
    const buf = Buffer.from(await upload.arrayBuffer());
    const type = sniffImage(buf);
    const ext = type ? IMAGE_TYPES[type] : undefined;
    if (!ext) return { errors: ["The photo must be a JPEG, PNG, WebP or AVIF image."] };
    const publicPath = `/photos/projects/${slug}/image.${ext}`;
    put.push({ path: `${WORK_IMAGE_DIR}/${slug}/image.${ext}`, content: buf });
    // Replacing a .jpg with a .webp would otherwise leave the old file
    // behind forever.
    if (current && current.image !== publicPath && ownImage(current.image, slug)) {
      remove.push(`public${current.image}`);
    }
    image = publicPath;
  } else if (mode === "create") {
    return { errors: ["Choose a photo."] };
  }

  put.push({ path: jsonPath, content: serializeWork({ slug, ...fields, image }) });
  try {
    await store.commit({
      message: message(`${mode === "create" ? "Add" : "Update"} gallery photo: ${fields.title}`, user.name, gate.findings),
      put,
      remove,
      expect: { [jsonPath]: mode === "edit" ? str(fd, "sha") : null },
    });
  } catch (err) {
    return { errors: [errorText(err)] };
  }
  redirect(`/admin/content?saved=${encodeURIComponent(fields.title)}`);
}

export async function deleteWork(fd: FormData) {
  const user = await requireAdmin();
  const slug = str(fd, "slug");
  if (!SLUG_RE.test(slug)) redirect("/admin/content");
  const jsonPath = `${WORK_DIR}/${slug}.json`;
  try {
    const store = await getStore();
    const cur = await store.read(jsonPath);
    if (cur) {
      const item = parseWork(slug, cur.text);
      await store.commit({
        message: message(`Delete gallery photo: ${item.title}`, user.name),
        put: [],
        remove: [jsonPath, ...(ownImage(item.image, slug) ? [`public${item.image}`] : [])],
        expect: { [jsonPath]: str(fd, "sha") },
      });
    }
  } catch (err) {
    redirect(`/admin/work/${slug}?error=${encodeURIComponent(errorText(err))}`);
  }
  redirect(`/admin/content?deleted=${encodeURIComponent(str(fd, "title") || slug)}`);
}

// ── Schema-driven sections (lib/admin/sections.ts) ───────────────────────

// Removing a city removes its six pages from the site. Nothing else is
// touched: whatever pointed at them (the footer's city list, the links
// between city pages) is built from this same file and follows along. The
// addresses themselves start returning "not found", so the admin says to
// add a redirect — SEO → Redirects.
export async function deleteSectionItem(fd: FormData) {
  const user = await requireAdmin();
  const section = findSection(str(fd, "section"));
  if (!section || section.kind !== "collection" || !section.create) return;
  const slug = str(fd, "item");
  if (!SLUG_RE.test(slug)) return;

  const store = await getStore();
  const cur = await store.read(section.file);
  if (!cur) return;
  const items = JSON.parse(cur.text) as Record<string, unknown>[];
  const gone = items.find((x) => x.slug === slug);
  if (!gone) redirect(`/admin/s/${section.id}`);
  // Never leave a collection empty: every page that maps over it would
  // render a blank section.
  if (items.length <= 1) redirect(`/admin/s/${section.id}?error=last`);

  // Anything in this file that pointed at it stops pointing: a link to a
  // page that no longer exists is a 404 waiting to be clicked.
  const refKeys = section.schema.filter((f) => f.kind === "refs" && f.of === section.id).map((f) => f.key);
  const left = items
    .filter((x) => x.slug !== slug)
    .map((x) => {
      const copy = { ...x };
      for (const key of refKeys) {
        if (Array.isArray(copy[key])) copy[key] = (copy[key] as string[]).filter((v) => v !== slug);
      }
      return copy;
    });

  await store.commit({
    message: message(`Remove ${section.label}: ${String(gone![section.titleKey])}`, user.name, []),
    put: [{ path: section.file, content: serializeContent(left) }],
    remove: [],
    expect: { [section.file]: cur.sha },
  });
  redirect(`/admin/s/${section.id}?removed=${encodeURIComponent(String(gone![section.titleKey]))}`);
}

export async function saveSection(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  const section = findSection(str(fd, "section"));
  if (!section) return { errors: ["Unknown section — reload the page."] };

  let raw: unknown;
  try {
    raw = JSON.parse(str(fd, "payload"));
  } catch {
    return { errors: ["The form could not be read. Reload the page and try again."] };
  }
  const v = validateBySchema(section.schema, raw);
  if (!v.ok) return { errors: v.errors };
  const gate = legalGate(v.value, fd);
  if (gate.stop) return gate.stop;

  const expected = str(fd, "sha");
  let content: string;
  let summary: string;
  try {
    const store = await getStore();
    if (section.kind === "single") {
      content = serializeContent(v.value);
      summary = `Update ${section.label}`;
    } else {
      // A collection is one file; the slug is the item's URL. On an update
      // it comes from the page and is not editable. On a new item it is
      // typed once, and must be a slug nobody is using — it is about to
      // become six page addresses.
      const slug = str(fd, "item");
      const isNew = str(fd, "mode") === "new";
      const cur = await store.read(section.file);
      if (!cur) return { errors: ["This section's file is missing — tell the developer."] };
      const items = JSON.parse(cur.text) as Record<string, unknown>[];
      const i = items.findIndex((x) => x.slug === slug);
      if (isNew) {
        if (!section.create) return { errors: ["Items cannot be added here."] };
        if (!SLUG_RE.test(slug)) {
          return { errors: ["The address must be lowercase letters, numbers and dashes — for example beaverton-or."] };
        }
        if (i >= 0) return { errors: [`There is already one at /${slug}. Pick another address.`] };
        items.push({ slug, ...v.value });
        summary = `Add ${section.label}: ${String(v.value[section.titleKey])}`;
      } else {
        if (i < 0) return { errors: ["This item no longer exists — it may have been removed."] };
        items[i] = { slug, ...v.value };
        summary = `Update ${section.label}: ${String(items[i][section.titleKey])}`;
      }
      content = serializeContent(items);
    }
    await store.commit({
      message: message(summary, user.name, gate.findings),
      put: [{ path: section.file, content }],
      remove: [],
      expect: { [section.file]: expected },
    });
  } catch (err) {
    return { errors: [errorText(err)] };
  }
  redirect(`/admin/s/${section.id}?saved=1`);
}
