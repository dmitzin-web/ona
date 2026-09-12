import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { PhotoLibrary } from "@/components/admin/ImageField";
import { photoLibrary } from "@/lib/admin/photos";
import { requireAdmin } from "@/lib/admin/session";
import { findSection } from "@/lib/admin/sections";
import { emptyValue } from "@/lib/admin/schema";
import { getStore } from "@/lib/admin/store";

// A new item in a collection that allows them — today, a city. The form is
// the same one that edits an existing city, plus the address, which is
// typed once and then belongs to the page.
//
// The file's SHA is read here and travels with the form, so two people
// adding a city at the same moment cannot overwrite each other: the second
// save is refused and reloads.

export default async function NewSectionItemPage({ params }: { params: Promise<{ section: string }> }) {
  await requireAdmin();
  const { section: id } = await params;
  const section = findSection(id);
  if (!section || section.kind !== "collection" || !section.create) notFound();

  const file = await (await getStore()).read(section.file);
  if (!file) notFound();

  return (
    <PhotoLibrary photos={await photoLibrary()}>
      <SectionEditor
        sectionId={section.id}
        title={section.create.label}
        description={section.description}
        schema={section.schema}
        initial={emptyValue(section.schema)}
        sha={file.sha}
        create={section.create}
        backHref={`/admin/s/${section.id}`}
        backLabel={section.label}
      />
    </PhotoLibrary>
  );
}
