import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { PhotoLibrary } from "@/components/admin/ImageField";
import { photoLibrary } from "@/lib/admin/photos";
import { requireAdmin } from "@/lib/admin/session";
import { findSection } from "@/lib/admin/sections";
import { getStore } from "@/lib/admin/store";
import { SLUG_RE } from "@/lib/content-format";

export default async function SectionItemPage({
  params,
}: {
  params: Promise<{ section: string; item: string }>;
}) {
  await requireAdmin();
  const { section: id, item } = await params;
  const section = findSection(id);
  if (!section || section.kind !== "collection" || !SLUG_RE.test(item)) notFound();

  const file = await (await getStore()).read(section.file);
  if (!file) notFound();
  const items = JSON.parse(file.text) as Record<string, unknown>[];
  const found = items.find((x) => x.slug === item);
  if (!found) notFound();
  // The slug is the page address and is not part of the editable value.
  const { slug: _slug, ...value } = found;

  return (
    <PhotoLibrary photos={await photoLibrary()}>
    <SectionEditor
      sectionId={section.id}
      title={String(found[section.titleKey])}
      description={`${section.label} · /${section.id === "services" ? "services" : "areas"}/${item}`}
      schema={section.schema}
      initial={value}
      sha={file.sha}
      item={item}
      backHref={`/admin/s/${section.id}`}
      backLabel={section.label}
    />
    </PhotoLibrary>
  );
}
