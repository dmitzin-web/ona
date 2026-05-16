import { NextResponse, type NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/account/delete
//
// Deletes the signed-in user's auth record, which cascades through the
// foreign-key chain (profiles → claims → claim_files / claim_reports)
// because every public.* table FK references auth.users(id) with
// ON DELETE CASCADE. Storage objects under the user's folder are
// removed explicitly because storage.objects rows aren't FK'd to users.
//
// Requires SUPABASE_SERVICE_ROLE_KEY (admin operation — anon clients
// cannot delete auth.users). The body must include a confirmation
// string matching the user's email to make accidental deletion harder.

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const confirm =
    typeof body === "object" && body !== null && "confirm" in body
      ? (body as Record<string, unknown>).confirm
      : null;
  if (typeof confirm !== "string" || confirm.trim().toLowerCase() !== (user.email ?? "").toLowerCase()) {
    return NextResponse.json(
      { error: "Confirmation does not match your account email." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // 1. Delete every file under the user's storage folder.
  //
  // Supabase Storage doesn't support recursive prefix deletes in a single
  // call — we list the user's folder and pass the names to remove(). We
  // page through in chunks because list() returns max 100 by default.
  try {
    const folder = `${user.id}/`;
    let cursor: string | undefined;
    // Loop until the listing returns fewer than the limit (i.e. last page).
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data: entries, error: listErr } = await admin.storage
        .from("claim-files")
        .list(user.id, { limit: 1000, offset: 0, search: cursor });
      if (listErr) {
        console.error("[account/delete] storage list", listErr);
        break;
      }
      if (!entries || entries.length === 0) break;

      // The list() API only returns immediate children of the folder we
      // passed in. For our path scheme `{user_id}/{claim_id}/{filename}`
      // those immediate children are claim_id subfolders, so we need to
      // recurse one more level.
      const paths: string[] = [];
      for (const e of entries) {
        // Folders have no `id`; files do.
        if (!e.id) {
          const { data: inner } = await admin.storage
            .from("claim-files")
            .list(`${folder}${e.name}`, { limit: 1000 });
          for (const f of inner ?? []) {
            if (f.id) paths.push(`${folder}${e.name}/${f.name}`);
          }
        } else {
          paths.push(`${folder}${e.name}`);
        }
      }

      if (paths.length === 0) break;
      const { error: rmErr } = await admin.storage
        .from("claim-files")
        .remove(paths);
      if (rmErr) {
        console.error("[account/delete] storage remove", rmErr);
        // Continue — we'd rather delete the auth user even if some
        // files linger than leave the user unable to delete their account.
      }
      if (entries.length < 1000) break;
      cursor = entries[entries.length - 1].name;
    }
  } catch (err) {
    console.error("[account/delete] storage cleanup failed", err);
    // Soft-fail: continue to delete the auth user.
  }

  // 2. Delete the auth user. FK cascade removes profile + claims +
  // claim_files + claim_reports automatically.
  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) {
    console.error("[account/delete] auth delete", delErr);
    Sentry.captureException(delErr, {
      tags: { route: "account.delete" },
    });
    return NextResponse.json(
      { error: "Could not delete the account. Try again or email us." },
      { status: 500 },
    );
  }

  // 3. Sign the (now-deleted) user out so their session cookie is cleared.
  await supabase.auth.signOut().catch(() => {});

  return NextResponse.json({ ok: true });
}
