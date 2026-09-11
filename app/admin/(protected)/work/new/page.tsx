import { WorkEditor } from "@/components/admin/WorkEditor";
import { requireAdmin } from "@/lib/admin/session";
import { getStore } from "@/lib/admin/store";
import { parseWork, WORK_DIR } from "@/lib/content-format";

export default async function NewWork() {
  await requireAdmin();
  const files = await getStore().list(WORK_DIR);
  const rooms = [...new Set(files.map((f) => parseWork("x", f.text).roomType))].sort();
  return <WorkEditor mode="create" initial={null} sha={null} roomTypes={rooms} />;
}
