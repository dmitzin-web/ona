"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { requireAdmin } from "@/lib/admin/session";
import { ConflictError, getStore, StoreError, type Commit } from "@/lib/admin/store";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  sniffImage,
  validatePost,
  validateWorkFields,
} from "@/lib/admin/validate";
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

export type ActionState = { errors: string[] } | null;

// The repository is public: commit messages carry the editor's display
// name for the audit trail, never their email address.
const message = (summary: string, who: string) =>
  `${summary}\n\nEdited by ${who} via onarestore.com/admin`;

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

  const file = `${POSTS_DIR}/${post.slug}.json`;
  try {
    await getStore().commit({
      message: message(`${mode === "create" ? "Add" : "Update"} blog post: ${post.title}`, user.name),
      put: [{ path: file, content: serializePost(post) }],
      remove: [],
      expect: { [file]: mode === "edit" ? str(fd, "sha") : null },
    });
  } catch (err) {
    return { errors: [errorText(err)] };
  }
  redirect(`/admin?saved=${encodeURIComponent(post.title)}`);
}

export async function deletePost(fd: FormData) {
  const user = await requireAdmin();
  const slug = str(fd, "slug");
  if (!SLUG_RE.test(slug)) redirect("/admin");
  const file = `${POSTS_DIR}/${slug}.json`;
  try {
    await getStore().commit({
      message: message(`Delete blog post: ${str(fd, "title") || slug}`, user.name),
      put: [],
      remove: [file],
      expect: { [file]: str(fd, "sha") },
    });
  } catch (err) {
    redirect(`/admin/posts/${slug}?error=${encodeURIComponent(errorText(err))}`);
  }
  redirect(`/admin?deleted=${encodeURIComponent(str(fd, "title") || slug)}`);
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

  const slug = mode === "edit" ? str(fd, "slug") : slugify(fields.title);
  if (!SLUG_RE.test(slug)) return { errors: ["The title needs at least one letter or number."] };
  const jsonPath = `${WORK_DIR}/${slug}.json`;

  const store = getStore();
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
      message: message(`${mode === "create" ? "Add" : "Update"} gallery photo: ${fields.title}`, user.name),
      put,
      remove,
      expect: { [jsonPath]: mode === "edit" ? str(fd, "sha") : null },
    });
  } catch (err) {
    return { errors: [errorText(err)] };
  }
  redirect(`/admin?saved=${encodeURIComponent(fields.title)}`);
}

export async function deleteWork(fd: FormData) {
  const user = await requireAdmin();
  const slug = str(fd, "slug");
  if (!SLUG_RE.test(slug)) redirect("/admin");
  const jsonPath = `${WORK_DIR}/${slug}.json`;
  const store = getStore();
  try {
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
  redirect(`/admin?deleted=${encodeURIComponent(str(fd, "title") || slug)}`);
}
