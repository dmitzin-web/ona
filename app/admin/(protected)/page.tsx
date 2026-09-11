import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { getStore, StoreError } from "@/lib/admin/store";
import { parsePost, parseWork, POSTS_DIR, WORK_DIR, type Post, type WorkItem } from "@/lib/content-format";
import { btnPrimary } from "@/components/admin/ui";

// The admin home: everything that can be edited, read live from the store
// (GitHub in production), so a save shows up here immediately — the public
// site follows about a minute later, when Vercel finishes the deploy.

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

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold text-ivory">Blog posts</h1>
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

      <section>
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
    </div>
  );
}
