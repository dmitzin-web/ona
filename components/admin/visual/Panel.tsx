"use client";

import { useEffect, useMemo } from "react";
import type { Field } from "@/lib/admin/schema";
import type { SectionDef } from "@/lib/admin/sections";
import { diff, getAt, isPrefix, pathKey, type Path } from "@/lib/admin/json-path";
import { legalFindings, RULES_RU } from "@/lib/admin/legal-guard";
import { themeWarnings, type Theme } from "@/lib/theme";
import { SchemaForm } from "../SchemaForm";
import { bindingsForLeaf, type Binding } from "./binder";
import { fieldsAlong, trailOf, type Company } from "./model";
import { useLang } from "./i18n";
import { EVERY_PAGE, SHARED, type Base, type Draft, type Selection } from "./types";

// The right-hand panel (a bottom sheet on phones). With something selected
// it shows that block's whole form — the text clicked on the page, and
// everything around it that can't be clicked: list items, photos, alt
// text. With nothing selected it lists what is on the current page,
// including text that is on the page but not visible.

type Block = { prefix: Path; field: Field; label: string };

function blockOf(section: SectionDef, path: Path): Block | null {
  const collection = section.kind === "collection";
  const key = collection ? path[1] : path[0];
  const field = section.schema.find((f) => f.key === key);
  if (!field) return null;
  return { prefix: collection ? [path[0], key] : [key], field, label: field.label };
}

function fieldId(section: SectionDef, path: Path): string {
  let p = section.kind === "collection" ? path.slice(1) : path;
  const along = fieldsAlong(section, path);
  if (along.at(-1)?.kind === "strings" && typeof p.at(-1) === "number") p = p.slice(0, -1);
  return `f-${p.join("-")}`;
}

export function Panel(props: {
  open: boolean;
  onOpen: (v: boolean) => void;
  sections: SectionDef[];
  section: SectionDef | null;
  selection: Selection;
  draft: Draft;
  base: Base;
  bindings: Binding[];
  bindVersion: number;
  company: Company;
  path: string;
  posts: { slug: string; title: string }[];
  onSelect: (sel: Selection) => void;
  onChangeBlock: (sectionId: string, prefix: Path, value: unknown) => void;
  onNavigate: (path: string) => void;
  onGoToLeaf: (leaf: { sectionId: string; path: Path; field: Field; trail: string[] }) => void;
}) {
  const { t, field: tr, trail: trTrail, lang } = useLang();
  const { section, selection, draft } = props;
  const block = section && selection ? blockOf(section, selection.path) : null;

  // Scroll the panel to the field for what was clicked, and flash it.
  useEffect(() => {
    if (!section || !selection) return;
    const id = fieldId(section, selection.path);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.classList.add("ring-2", "ring-teal");
    const tm = setTimeout(() => el.classList.remove("ring-2", "ring-teal"), 1600);
    return () => clearTimeout(tm);
  }, [section, selection]);

  const body = section && selection && block ? (
    <SelectedBlock {...props} section={section} selection={selection} block={block} />
  ) : (
    <Overview {...props} />
  );

  return (
    <>
      {/* Desktop: a column. Phone/tablet: a sheet over the bottom of the preview. */}
      <aside
        className={`z-20 flex-none flex-col border-line bg-charcoal lg:static lg:flex lg:max-h-none lg:w-[400px] lg:border-l lg:border-t-0 lg:shadow-none ${
          props.open ? "fixed inset-x-0 bottom-0 flex max-h-[62vh] border-t shadow-[0_-8px_24px_rgba(0,0,0,.12)]" : "hidden"
        }`}
        aria-label={lang === "ru" ? "Панель" : "Panel"}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2 lg:hidden">
          <span className="text-[13px] font-medium">{block ? tr(block.label) : t.onThisPage}</span>
          <button type="button" onClick={() => props.onOpen(false)} className="px-2 text-[18px] text-warm-gray" aria-label={t.close}>
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
      </aside>
      {!props.open && (
        <button
          type="button"
          onClick={() => props.onOpen(true)}
          className="fixed bottom-4 right-4 z-20 rounded-full bg-brand px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg lg:hidden"
        >
          {t.onThisPage}
        </button>
      )}
    </>
  );
}

function SelectedBlock(
  props: Parameters<typeof Panel>[0] & { section: SectionDef; selection: NonNullable<Selection>; block: Block },
) {
  const { t, field: tr, trail: trTrail, lang } = useLang();
  const { section, selection, block, draft, base, company, bindings } = props;
  const value = draft[section.id];
  const leafValue = getAt(value, selection.path);
  const bs = bindingsForLeaf(bindings, section.id, selection.path);
  const trail = trailOf(section, value, selection.path).map(trTrail);

  const placeholders = typeof leafValue === "string" ? [...new Set([...leafValue.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))] : [];
  const vars = bs[0]?.vars ?? {};
  const link = bs.map((b) => b.el.closest?.("a[href]")?.getAttribute("href")).find((h) => h?.startsWith("/"));
  const findings = typeof leafValue === "string" ? legalFindings(leafValue) : [];

  const blockValue = getAt(value, block.prefix);
  const structural = diff(getAt(base[section.id]?.value, block.prefix), blockValue).some(
    (c) => Array.isArray(c.before) || Array.isArray(c.after),
  );
  const formHref = section.kind === "collection"
    ? `/admin/s/${section.id}/${String((value as Record<string, unknown>[])[selection.path[0] as number]?.slug ?? "")}`
    : `/admin/s/${section.id}`;

  // A field inside a block shows that block; a plain field at the top of a
  // section (a colour, the phone number) shows the whole section, because
  // one lonely input with no neighbours is disorienting.
  const grouped = block.field.kind === "object" || block.field.kind === "list" || block.field.kind === "optional";
  const formFields = grouped ? [block.field] : section.schema;
  const formPrefix: Path = grouped ? block.prefix : section.kind === "collection" ? [selection.path[0]] : [];
  const formValue = grouped ? { [block.field.key]: blockValue } : (getAt(value, formPrefix) as Record<string, unknown>);

  return (
    <div className="space-y-4 p-4">
      <div>
        <button type="button" onClick={() => props.onSelect(null)} className="text-[13px] text-teal hover:underline">
          ← {t.onThisPage}
        </button>
        <p className="mt-1.5 text-[12px] leading-snug text-warm-gray">{trail.join(" › ")}</p>
      </div>

      {SHARED.has(section.id) && <Note>{t.shared}</Note>}
      {placeholders.length > 0 && (
        <Note>
          {t.template}
          <span className="mt-1.5 flex flex-wrap gap-1.5">
            {placeholders.map((p) => (
              <span key={p} className="rounded-[2px] bg-charcoal-soft px-1.5 py-0.5 font-mono text-[12px]">
                {`{${p}}`} → {vars[p] ?? company[p] ?? "…"}
                {!vars[p] && company[p] ? ` (${t.fromCompany})` : ""}
              </span>
            ))}
          </span>
        </Note>
      )}
      {link && (
        <Note>
          {t.isLink} <span className="font-mono">{link}</span> —{" "}
          <button type="button" className="font-semibold text-teal hover:underline" onClick={() => props.onNavigate(link)}>
            {t.goToPage}
          </button>
        </Note>
      )}
      {findings.length > 0 && (
        <div role="alert" className="rounded-[2px] border border-coral/50 bg-coral/5 p-3 text-[13px]">
          <p className="font-semibold text-coral-deep">{t.legalTitle}</p>
          {findings.map((f) => (
            <p key={f.rule} className="mt-1.5">
              {lang === "ru" ? RULES_RU[f.rule] ?? f.rule : f.rule}
            </p>
          ))}
        </div>
      )}
      {structural && <Note>{t.structural}</Note>}
      {section.id === "theme" && themeWarnings(draft.theme as Theme).length > 0 && (
        <div role="alert" className="rounded-[2px] border border-coral/50 bg-coral/5 p-3 text-[13px]">
          <p className="font-semibold text-coral-deep">{t.contrastTitle}</p>
          {themeWarnings(draft.theme as Theme).map((w) => (
            <p key={w.key} className="mt-1">
              {w.message}
            </p>
          ))}
        </div>
      )}

      <div>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">{grouped ? t.fieldsOf : tr(section.label)}</p>
        <SchemaForm
          fields={formFields}
          value={formValue}
          onChange={(v) =>
            grouped
              ? props.onChangeBlock(section.id, formPrefix, v[block.field.key])
              : props.onChangeBlock(section.id, formPrefix, v)
          }
        />
      </div>

      <a href={formHref} className="block text-[13px] text-teal hover:underline">
        {t.openForm} →
      </a>
    </div>
  );
}

function Overview(props: Parameters<typeof Panel>[0]) {
  const { t, field: tr, trail: trTrail } = useLang();
  const { sections, bindings, draft, path, posts } = props;

  // Which sections this page shows, and which of their blocks are visible.
  const groups = useMemo(() => {
    const bySection = new Map<string, Binding[]>();
    for (const b of bindings) {
      if (b.kind === "title" || b.kind === "description") continue;
      if (!bySection.has(b.leaf.sectionId)) bySection.set(b.leaf.sectionId, []);
      bySection.get(b.leaf.sectionId)!.push(b);
    }
    return sections
      .filter((s) => bySection.has(s.id))
      .flatMap((s) => {
        const bs = bySection.get(s.id)!;
        const items = s.kind === "collection" ? [...new Set(bs.map((b) => b.leaf.path[0] as number))] : [null];
        return items.map((idx) => {
          const mine = idx === null ? bs : bs.filter((b) => b.leaf.path[0] === idx);
          const blocks = s.schema.map((f) => {
            const prefix: Path = idx === null ? [f.key] : [idx, f.key];
            return { prefix, field: f, visible: mine.filter((b) => isPrefix(prefix, b.leaf.path)) };
          });
          const item = idx === null ? null : (draft[s.id] as Record<string, unknown>[] | undefined)?.[idx];
          const title = item && s.kind === "collection" ? String(item[s.titleKey] ?? item.slug ?? "") : "";
          return { key: `${s.id}:${idx ?? ""}`, section: s, title, count: mine.length, blocks };
        });
      })
      .sort((a, b) => Number(EVERY_PAGE.has(a.section.id)) - Number(EVERY_PAGE.has(b.section.id)) || b.count - a.count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, bindings, props.bindVersion]);

  const title = bindings.find((b) => b.kind === "title");
  const desc = bindings.find((b) => b.kind === "description");
  const post = path.startsWith("/blog/") ? posts.find((p) => `/blog/${p.slug}` === path.replace(/\/$/, "")) : null;
  const pageGroups = groups.filter((g) => !EVERY_PAGE.has(g.section.id));
  const everyGroups = groups.filter((g) => EVERY_PAGE.has(g.section.id));

  const pick = (sectionId: string, p: Path, visible: Binding[]) =>
    props.onSelect({ sectionId, path: visible[0]?.leaf.path ?? p });

  return (
    <div className="space-y-6 p-4">
      <p className="text-[14px]">{t.clickToEdit}</p>

      {post && (
        <Card title={t.article}>
          <p className="text-[14px]">{post.title}</p>
          <a className="mt-1 inline-block text-[13px] font-semibold text-teal hover:underline" href={`/admin/posts/${post.slug}`}>
            {t.editArticle} →
          </a>
        </Card>
      )}
      {path.startsWith("/services/remodeling") && (
        <Card title={t.galleryPhotos}>
          <a className="text-[13px] font-semibold text-teal hover:underline" href="/admin/content#gallery">
            {t.manageGallery} →
          </a>
        </Card>
      )}
      {path === "/blog" && (
        <Card title={t.blog}>
          <a className="text-[13px] font-semibold text-teal hover:underline" href="/admin/posts/new">
            + {t.newPost}
          </a>
        </Card>
      )}

      {(title || desc) && (
        <button
          type="button"
          className="block w-full rounded-[2px] border border-line p-3 text-left transition hover:border-teal"
          onClick={() => {
            const b = title ?? desc!;
            props.onSelect({ sectionId: b.leaf.sectionId, path: b.leaf.path });
          }}
        >
          <p className="text-[12px] font-medium uppercase tracking-wide text-warm-gray">{t.searchResult}</p>
          <p className="mt-1.5 truncate text-[16px] leading-snug text-[#1a0dab]">{title ? `${title.el.ownerDocument.title}` : ""}</p>
          <p className="truncate text-[12px] text-[#006621]">onarestore.com{path}</p>
          <p className="line-clamp-2 text-[13px] text-[#4d5156]">{desc?.el.getAttribute("content")}</p>
          {title && title.el.ownerDocument.title.length > 60 && <p className="mt-1 text-[12px] text-coral-deep">{t.titleLabel}: {t.tooLong}</p>}
          {desc && (desc.el.getAttribute("content") ?? "").length > 160 && (
            <p className="mt-1 text-[12px] text-coral-deep">{t.descriptionLabel}: {t.tooLong}</p>
          )}
        </button>
      )}

      {pageGroups.length === 0 && !post && <p className="text-[13px] text-warm-gray">{t.unmatched}</p>}

      {[
        { label: t.onThisPage, list: pageGroups },
        { label: t.onEveryPage, list: everyGroups },
      ].map(
        ({ label, list }) =>
          list.length > 0 && (
            <section key={label}>
              <h3 className="text-[12px] font-medium uppercase tracking-wide text-warm-gray">{label}</h3>
              {list.map((g) => {
                const shown = g.blocks.filter((b) => b.visible.length);
                const hidden = g.blocks.filter((b) => !b.visible.length);
                return (
                  <div key={g.key} className="mt-2">
                    <p className="text-[14px] font-semibold">
                      {tr(g.section.label)}
                      {g.title && ` — ${g.title}`}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {shown.map((b) => (
                        <li key={pathKey(b.prefix)}>
                          <button
                            type="button"
                            className="w-full rounded-[2px] px-2 py-1 text-left text-[13px] hover:bg-charcoal-soft"
                            onClick={() => pick(g.section.id, b.prefix, b.visible)}
                          >
                            {tr(b.field.label)}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {hidden.length > 0 && !EVERY_PAGE.has(g.section.id) && (
                      <details className="mt-1">
                        <summary className="cursor-pointer px-2 py-1 text-[12px] text-warm-gray" title={t.notVisibleHint}>
                          {t.notVisible} ({hidden.length})
                        </summary>
                        <ul className="space-y-0.5">
                          {hidden.map((b) => (
                            <li key={pathKey(b.prefix)}>
                              <button
                                type="button"
                                className="w-full rounded-[2px] px-2 py-1 text-left text-[13px] text-warm-gray hover:bg-charcoal-soft"
                                onClick={() => pick(g.section.id, b.prefix, [])}
                              >
                                {tr(b.field.label)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                );
              })}
            </section>
          ),
      )}

      <section>
        <h3 className="text-[12px] font-medium uppercase tracking-wide text-warm-gray">{t.quickTasks}</h3>
        <ul className="mt-1 space-y-0.5 text-[13px]">
          <li>
            <button type="button" className="w-full rounded-[2px] px-2 py-1 text-left hover:bg-charcoal-soft" onClick={() => props.onSelect({ sectionId: "site", path: ["phoneDisplay"] })}>
              {t.taskPhone}
            </button>
          </li>
          <li>
            <button type="button" className="w-full rounded-[2px] px-2 py-1 text-left hover:bg-charcoal-soft" onClick={() => props.onSelect({ sectionId: "theme", path: ["ground"] })}>
              {t.taskColors}
            </button>
          </li>
          <li>
            <a className="block rounded-[2px] px-2 py-1 hover:bg-charcoal-soft" href="/admin/posts/new">
              {t.taskPost}
            </a>
          </li>
          <li>
            <a className="block rounded-[2px] px-2 py-1 hover:bg-charcoal-soft" href="/admin/work/new">
              {t.taskPhoto}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[2px] border border-teal/30 bg-teal/5 p-3 text-[13px] leading-snug">{children}</div>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2px] border border-line p-3">
      <p className="text-[12px] font-medium uppercase tracking-wide text-warm-gray">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
