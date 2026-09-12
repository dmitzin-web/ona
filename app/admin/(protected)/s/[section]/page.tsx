import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { PhotoLibrary } from "@/components/admin/ImageField";
import { requireAdmin } from "@/lib/admin/session";
import { findSection } from "@/lib/admin/sections";
import { getStore, StoreError } from "@/lib/admin/store";
import { photoLibrary } from "@/lib/admin/photos";

// A single section opens straight into its editor; a collection lists its
// items (services, cities) and each item opens in the same editor.

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { section: id } = await params;
  const { saved } = await searchParams;
  const section = findSection(id);
  if (!section) notFound();

  let file: { text: string; sha: string } | null;
  try {
    file = await (await getStore()).read(section.file);
  } catch (err) {
    return <p role="alert" className="rounded-[2px] border border-coral/40 bg-coral/5 p-4 text-[14px] text-ivory">{err instanceof StoreError ? err.message : "Could not load this section."}</p>;
  }
  if (!file) notFound();
  const data = JSON.parse(file.text);

  const flash = saved && (
    <p role="status" className="mb-6 rounded-[2px] border border-teal/40 bg-teal/5 p-4 text-[14px] text-ivory">
      Published. The live site updates in about a minute.
    </p>
  );

  if (section.kind === "single") {
    return (
      <>
        {flash}
        <PhotoLibrary photos={await photoLibrary()}>
        <SectionEditor
          key={file.sha}
          sectionId={section.id}
          title={section.label}
          description={section.description}
          schema={section.schema}
          initial={data}
          sha={file.sha}
          backHref="/admin/content"
          backLabel="All content"
        />
        </PhotoLibrary>
      </>
    );
  }

  const items = data as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      {flash}
      <div>
        <Link href="/admin/content" className="text-[13px] text-teal hover:underline">
          ← All content
        </Link>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-ivory">{section.label}</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-warm-gray">{section.description}</p>
      </div>
      <ul className="divide-y divide-line rounded-[2px] border border-line bg-charcoal">
        {items.map((it) => (
          <li key={String(it.slug)}>
            <Link href={`/admin/s/${section.id}/${String(it.slug)}`} className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-charcoal-soft">
              <span className="text-[15px] text-ivory">{String(it[section.titleKey])}</span>
              {section.subtitleKey && (
                <span className="truncate text-[13px] text-warm-gray">{String(it[section.subtitleKey])}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-[13px] text-warm-gray">
        Adding or removing a {section.id === "services" ? "service" : "city"} also needs code changes, so it is done by the developer.
      </p>
    </div>
  );
}
