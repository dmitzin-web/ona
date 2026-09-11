import { notFound } from "next/navigation";
import { WorkEditor } from "@/components/admin/WorkEditor";
import { requireAdmin } from "@/lib/admin/session";
import { getStore } from "@/lib/admin/store";
import { parseWork, SLUG_RE, WORK_DIR } from "@/lib/content-format";

export default async function EditWork({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) notFound();
  const store = getStore();
  const [file, all] = await Promise.all([store.read(`${WORK_DIR}/${slug}.json`), store.list(WORK_DIR)]);
  if (!file) notFound();
  const rooms = [...new Set(all.map((f) => parseWork("x", f.text).roomType))].sort();
  const { error } = await searchParams;
  return (
    <WorkEditor mode="edit" initial={parseWork(slug, file.text)} sha={file.sha} roomTypes={rooms} deleteError={error} />
  );
}
