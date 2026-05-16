import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// DELETE /api/claimlens/claims/[id]
//
// Deletes a single claim — its DB rows (claim, claim_files, claim_reports
// cascade via FK) and every file under its Storage prefix. Auth-required.
// Ownership is enforced two ways:
//   1. We SELECT the claim with the user-scoped client first; RLS ensures
//      the row only returns if it belongs to the signed-in user.
//   2. We use the admin client only AFTER that check, to touch Storage
//      (which doesn't have an FK to claims).
//
// Storage layout: `{user_id}/{claim_id}/{file_name}`. We remove the
// entire {user_id}/{claim_id}/ prefix.

export const runtime = "nodejs";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // UUID sanity check — reject anything that obviously can't be a claim ID.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid claim id." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  // Ownership check: RLS returns null if the claim isn't theirs. We treat
  // not-yours and doesn't-exist the same way (404) so we don't disclose
  // whether the ID exists.
  const { data: claim, error: claimErr } = await supabase
    .from("claims")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (claimErr) {
    console.error("[claims/delete] lookup error", claimErr);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
  if (!claim) {
    return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  }

  const admin = createAdminClient();

  // Storage cleanup — list everything under {user_id}/{claim_id}/ and
  // delete it. The list/remove API is shallow, but our path scheme only
  // has one level of files under the claim folder, so one list call is
  // enough.
  try {
    const prefix = `${user.id}/${id}`;
    const { data: entries, error: listErr } = await admin.storage
      .from("claim-files")
      .list(prefix, { limit: 1000 });
    if (listErr) {
      console.error("[claims/delete] storage list", listErr);
    } else if (entries && entries.length > 0) {
      const paths = entries.filter((e) => e.id).map((e) => `${prefix}/${e.name}`);
      if (paths.length > 0) {
        const { error: rmErr } = await admin.storage
          .from("claim-files")
          .remove(paths);
        if (rmErr) console.error("[claims/delete] storage remove", rmErr);
      }
    }
  } catch (err) {
    console.error("[claims/delete] storage cleanup failed", err);
    // Soft-fail: we'd rather drop the DB rows than refuse the delete
    // because Storage hiccuped. Orphan files in storage are a smaller
    // privacy hit than telling the user "we couldn't delete your claim."
  }

  // DB delete — cascades to claim_files + claim_reports via FK.
  const { error: delErr } = await admin
    .from("claims")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // belt + suspenders alongside the earlier ownership check
  if (delErr) {
    console.error("[claims/delete] db delete", delErr);
    return NextResponse.json(
      { error: "Could not delete the claim. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
