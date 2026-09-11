import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { getStore, StoreError } from "@/lib/admin/store";
import { parsePost, parseWork, POSTS_DIR, WORK_DIR, type Post, type WorkItem } from "@/lib/content-format";
import { btnPrimary } from "@/components/admin/ui";
import { SECTIONS } from "@/lib/admin/sections";

// The admin home: everything that can be edited, read live from the store
// (GitHub in production), so a save shows up here immediately — the public
// site follows about a minute later, when Vercel finishes the deploy.

// How the dashboard groups SECTIONS. Anything not named here still shows,
// under "Other", so a newly registered section can never go missing.
const GROUPS: { title: string; hint?: string; ids: string[] }[] = [
  { title: "Pages", ids: ["home", "about", "contact", "services-index", "areas-index", "blog-index", "start-project", "quote", "spokane-fire", "mold-sections", "misc"] },
  {
    title: "Page templates",
    hint: "The fixed text around each service page, city page, client project page and blog post. One change here updates every page built from it.",
    ids: ["service-page", "area-page", "service-area-page", "work-page", "post-page"],
  },
  { title: "On every page", ids: ["chrome"] },
  { title: "Company & listings", ids: ["site", "services", "areas", "reviews", "legal"] },
];

function groupSections() {
  const named = new Set(GROUPS.flatMap((g) => g.ids));
  const byId = new Map(SECTIONS.map((s) => [s.id, s]));
  const groups = GROUPS.map((g) => ({ ...g, sections: g.ids.flatMap((id) => byId.get(id) ?? []) }));
  groups.push({ title: "Other", ids: [], sections: SECTIONS.filter((s) => !named.has(s.id)) });
  return groups.filter((g) => g.sections.length);
}

// Cards show what a section is; the placeholder lists and rules in the rest
// of the description are for the editor page.
const firstSentence = (s: string) => s.split(/(?<=[.!?])\s/)[0];

const slugOf = (p: string) => p.slice(p.lastIndexOf("/") + 1, -".json".length);

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const { saved, deleted } = await searchParams;

  let posts: Post[] = [];
  let work: WorkItem[] = [];
  let loadError: string | null = null;
  try {
    const store = await getStore();
    const [p, w] = await Promise.all([store.list(POSTS_DIR), store.list(WORK_DIR)]);
    posts = p
      .map((f) => parsePost(slugOf(f.path), f.text))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    work = w.map((f) => parseWork(slugOf(f.path), f.text)).sort((a, b) => a.order - b.order);
  } catch (err) {
    loadError = err instanceof StoreError ? err.message : "Could not load the content.";
    if (!(err instanceof StoreError)) console.error("[admin] load failed", err);
  }

  return (
    <div className="space-y-10">
      {(saved || deleted) && (
        <p role="status" className="rounded-[2px] border border-teal/40 bg-teal/5 p-4 text-[14px] text-ivory">
          {saved ? <>Published “{saved}”.</> : <>Deleted “{deleted}”.</>} The live site updates in about a minute.
        </p>
      )}
      {loadError && (
        <p role="alert" className="rounded-[2px] border border-coral/40 bg-coral/5 p-4 text-[14px] text-ivory">
          {loadError}
        </p>
      )}

      {/* With no connection there is nothing true to list: "0 published"
          and working-looking New buttons would both mislead. */}
      {!loadError && (
      <>
      <div className="space-y-8">
        <h1 className="text-[22px] font-semibold text-ivory">Site content</h1>
        {groupSections().map((g) => (
          <section key={g.title}>
            <h2 className="eyebrow text-warm-gray">{g.title}</h2>
            {g.hint && <p className="mt-1 text-[13px] text-warm-gray">{g.hint}</p>}
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {g.sections.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/s/${s.id}`} className="block h-full rounded-[2px] border border-line bg-charcoal p-4 transition hover:border-ivory/40">
                    <p className="text-[15px] font-medium text-ivory">{s.label}</p>
                    <p className="mt-1 text-[13px] leading-snug text-warm-gray">{firstSentence(s.description)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section id="posts" className="scroll-mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold text-ivory">Blog posts</h2>
            <p className="text-[13px] text-warm-gray">{posts.length} published · newest first</p>
          </div>
          <Link href="/admin/posts/new" className={btnPrimary}>
            + New post
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line rounded-[2px] border border-line bg-charcoal">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/admin/posts/${p.slug}`} className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-charcoal-soft">
                <span className="text-[15px] text-ivory">{p.title}</span>
                <span className="flex-none font-mono text-[12px] text-warm-gray">
                  {p.category} · {p.publishedAt}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="gallery" className="scroll-mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold text-ivory">Remodeling gallery</h2>
            <p className="text-[13px] text-warm-gray">
              {work.length} photos on /services/remodeling · in display order
            </p>
          </div>
          <Link href="/admin/work/new" className={btnPrimary}>
            + New photo
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {work.map((w) => (
            <li key={w.slug}>
              <Link href={`/admin/work/${w.slug}`} className="block overflow-hidden rounded-[2px] border border-line bg-charcoal transition hover:border-ivory/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} alt={w.imageAlt} className="aspect-[3/2] w-full bg-charcoal-soft object-cover" />
                <div className="px-3 py-2">
                  <p className="text-[14px] text-ivory">{w.title}</p>
                  <p className="font-mono text-[11px] text-warm-gray">
                    {w.roomType} · #{w.order}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      </>
      )}
    </div>
  );
}
