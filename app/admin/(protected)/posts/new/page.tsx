import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/session";

export default async function NewPost() {
  await requireAdmin();
  return <PostEditor mode="create" initial={null} sha={null} />;
}
