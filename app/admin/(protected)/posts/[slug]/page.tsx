import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/session";
import { getStore } from "@/lib/admin/store";
import { parsePost, POSTS_DIR, SLUG_RE } from "@/lib/content-format";

export default async function EditPost({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) notFound();
  const file = await (await getStore()).read(`${POSTS_DIR}/${slug}.json`);
  if (!file) notFound();
  const { error } = await searchParams;
  return <PostEditor mode="edit" initial={parsePost(slug, file.text)} sha={file.sha} deleteError={error} />;
}
