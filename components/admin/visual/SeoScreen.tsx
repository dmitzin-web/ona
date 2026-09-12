"use client";

import { useEffect, useMemo, useState } from "react";
import type { Finding, Report, Where } from "@/lib/seo-audit";
import { targetOf, type SitePage } from "@/lib/seo-pages";
import { findSection } from "@/lib/admin/sections";
import { Crawl } from "./Crawl";
import { SchemaForm } from "../SchemaForm";
import { useLang } from "./i18n";

/** What the admin can set for one page: keep it out of Google, or declare it a copy of another. */
export type PageRule = { path: string; hide: boolean; canonical: string };

// The SEO screen: every page of the site measured against what Google can
// actually show, in the words of someone who has never heard of a meta tag —
// and, behind the second tab, the whole list with the numbers a professional
// will ask for.
//
// It is not a report to read and file away. Every line ends in a button that
// opens the exact field on the exact page, or hands the sentence to the
// assistant — and because it scores the draft, the number at the top moves
// while the editor works, before anything is published.

export function SeoScreen({
  report,
  pages,
  path,
  host,
  onClose,
  onOpen,
  onAsk,
  settings,
  onSettings,
  rules,
  onRule,
}: {
  report: Report;
  pages: SitePage[];
  path: string;
  host: string;
  onClose: () => void;
  onOpen: (where: Where) => void;
  onAsk: ((finding: Finding, where: Where) => Promise<{ reply: string; count: number } | { error: string }>) | null;
  /** content/seo.json as it stands in the draft, and the way to change it. */
  settings: Record<string, unknown>;
  onSettings: (value: Record<string, unknown>) => void;
  rules: PageRule[];
  onRule: (path: string, patch: Partial<PageRule>) => void;
}) {
  const { t } = useLang();
  const [tab, setTab] = useState<"fix" | "pages" | "live" | "settings">("fix");
  const [copied, setCopied] = useState(false);
  const here = pages.find((p) => p.path === path) ?? null;
  const mine = report.findings.filter((f) => f.pages.some((w) => w.path === path));
  const toFix = report.findings.filter((f) => f.severity === "fix");
  const toImprove = report.findings.filter((f) => f.severity === "improve");
  const percent = report.total ? Math.round((report.ready / report.total) * 100) : 100;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText(report, pages, host));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const tabClass = (mine: string) =>
    `rounded-full px-3 py-1.5 text-[13px] ${tab === mine ? "bg-charcoal-soft font-semibold" : "text-warm-gray hover:text-ivory"}`;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-charcoal text-ivory">
      <header className="flex flex-none items-center gap-2 border-b border-line px-4 py-3">
        <h2 className="text-[16px] font-semibold">{t.seoTitle}</h2>
        <nav className="ml-2 flex gap-1">
          <button type="button" className={tabClass("fix")} onClick={() => setTab("fix")}>
            {t.seoTabFix}
          </button>
          <button type="button" className={tabClass("pages")} onClick={() => setTab("pages")}>
            {t.seoTabPages} ({pages.length})
          </button>
          <button type="button" className={tabClass("live")} onClick={() => setTab("live")}>
            {t.seoTabLive}
          </button>
          <button type="button" className={tabClass("settings")} onClick={() => setTab("settings")}>
            {t.seoTabSettings}
          </button>
        </nav>
        <button type="button" onClick={copy} className="ml-auto hidden text-[13px] text-warm-gray hover:text-ivory sm:block">
          {copied ? t.seoCopied : t.seoCopy}
        </button>
        <button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-[18px] hover:bg-charcoal-soft" aria-label={t.close}>
          ✕
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-8 p-4 pb-24 sm:p-6">
          {/* How the site stands, in one line and one bar. */}
          <section>
            <p className="text-[28px] font-semibold leading-tight">
              {report.ready} <span className="text-warm-gray">/ {report.total}</span>
            </p>
            <p className="text-[15px]">{t.seoReady}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-charcoal-soft">
              <div className="h-full rounded-full bg-teal transition-[width]" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-[13px] text-warm-gray">
              {toFix.length} {t.seoToFix} · {toImprove.length} {t.seoToImprove}
            </p>
          </section>

          {tab === "settings" ? (
            <Settings settings={settings} onSettings={onSettings} />
          ) : tab === "live" ? (
            <Crawl
              pages={pages}
              onOpen={onOpen}
              render={(findings) => (
                <ul className="space-y-2">
                  {findings.map((f) => (
                    <li key={f.key}>
                      <FindingCard finding={f} path={path} onOpen={onOpen} onAsk={null} />
                    </li>
                  ))}
                </ul>
              )}
            />
          ) : tab === "fix" ? (
            <>
              {/* The page they are looking at. */}
              {here && (
                <section>
                  <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">{t.seoThisPage}</h3>
                  <SearchPreview page={here} host={host} />
                  <p className="mt-2 text-[13px] text-warm-gray">
                    {mine.length === 0 ? t.seoPageClean : `${mine.length} ${t.seoPageIssues}`}
                    {targetOf(here) ? ` · ${t.seoFoundFor} “${targetOf(here)}”` : ""}
                  </p>
                </section>
              )}

              {[
                { label: t.seoFixFirst, list: toFix },
                { label: t.seoWorthDoing, list: toImprove },
              ].map(({ label, list }) =>
                list.length === 0 ? null : (
                  <section key={label}>
                    <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">
                      {label} ({list.length})
                    </h3>
                    <ul className="space-y-2">
                      {list.map((f) => (
                        <li key={f.key}>
                          <FindingCard finding={f} path={path} onOpen={onOpen} onAsk={onAsk} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ),
              )}

              {report.findings.length === 0 && <p className="text-[15px]">{t.seoNothing}</p>}
            </>
          ) : (
            <PagesTable pages={pages} report={report} path={path} host={host} onOpen={onOpen} rules={rules} onRule={onRule} />
          )}
        </div>
      </div>
    </div>
  );
}

function FindingCard({
  finding,
  path,
  onOpen,
  onAsk,
}: {
  finding: Finding;
  path: string;
  onOpen: (where: Where) => void;
  onAsk: ((finding: Finding, where: Where) => Promise<{ reply: string; count: number } | { error: string }>) | null;
}) {
  const { t } = useLang();
  const [all, setAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  // The page being looked at first: fixing what is in front of you is the
  // one case where the preview updates as you watch.
  const ordered = [...finding.pages].sort((a, b) => Number(b.path === path) - Number(a.path === path));
  const shown = all ? ordered : ordered.slice(0, 4);
  const first = ordered[0];

  return (
    <div className={`rounded-[2px] border p-3 ${finding.severity === "fix" ? "border-coral/40 bg-coral/5" : "border-line"}`}>
      <p className="text-[14px] font-semibold">{finding.what}</p>
      <p className="mt-1 text-[13px] leading-snug text-warm-gray">{finding.why}</p>
      <p className="mt-1 text-[13px] leading-snug">{finding.fix}</p>

      <ul className="mt-2 flex flex-wrap gap-1.5">
        {shown.map((w) => (
          <li key={w.path}>
            <button
              type="button"
              onClick={() => onOpen(w)}
              className={`rounded-full border px-2.5 py-1 text-[12px] hover:border-teal ${
                w.path === path ? "border-teal text-teal" : "border-line text-warm-gray"
              }`}
              title={w.path}
            >
              {w.label}
            </button>
          </li>
        ))}
        {!all && ordered.length > shown.length && (
          <li>
            <button type="button" onClick={() => setAll(true)} className="rounded-full px-2.5 py-1 text-[12px] text-teal hover:underline">
              +{ordered.length - shown.length} {t.seoMorePages}
            </button>
          </li>
        )}
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => onOpen(first)} className="text-[13px] font-semibold text-teal hover:underline">
          {t.seoFixIt} →
        </button>
        {finding.ask && onAsk && first.at && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setSaid(null);
              const r = await onAsk(finding, first);
              setBusy(false);
              setSaid("error" in r ? r.error : r.count ? `${r.reply} (${r.count} ${t.edits})` : r.reply);
            }}
            className="text-[13px] text-teal hover:underline disabled:opacity-50"
          >
            {busy ? t.aiThinking : t.seoWriteIt}
          </button>
        )}
      </div>
      {said && <p className="mt-2 text-[13px] text-warm-gray">{said}</p>}
    </div>
  );
}

// ── Every page, with the numbers ────────────────────────────────────────
function PagesTable({
  pages,
  report,
  path,
  host,
  onOpen,
  rules,
  onRule,
}: {
  pages: SitePage[];
  report: Report;
  path: string;
  host: string;
  onOpen: (where: Where) => void;
  rules: PageRule[];
  onRule: (path: string, patch: Partial<PageRule>) => void;
}) {
  const { t } = useLang();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(path);

  const groups = useMemo(() => [...new Set(pages.map((p) => p.group))], [pages]);
  const worst = useMemo(() => {
    const m = new Map<string, "fix" | "improve">();
    for (const f of report.findings) {
      for (const w of f.pages) {
        if (f.severity === "fix" || !m.has(w.path)) m.set(w.path, f.severity);
      }
    }
    return m;
  }, [report]);

  const shown = pages.filter(
    (p) =>
      (!group || p.group === group) &&
      (!q.trim() ||
        `${p.label} ${p.path} ${p.title} ${p.description} ${targetOf(p)}`.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.seoFilter}
          className="min-w-0 flex-1 rounded-full border border-line bg-charcoal px-3 py-1.5 text-[14px] outline-none focus:border-teal"
        />
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(group === g ? null : g)}
              className={`rounded-full border px-2.5 py-1 text-[12px] ${group === g ? "border-teal text-teal" : "border-line text-warm-gray hover:border-teal"}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-line border-y border-line">
        {shown.map((p) => {
          const state = worst.get(p.path);
          const mine = report.findings.filter((f) => f.pages.some((w) => w.path === p.path));
          const isOpen = open === p.path;
          return (
            <li key={p.path}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.path)}
                className="flex w-full items-center gap-2 py-2 text-left hover:bg-charcoal-soft"
              >
                <span
                  aria-hidden
                  className={`h-2 w-2 flex-none rounded-full ${
                    state === "fix" ? "bg-coral" : state === "improve" ? "bg-gold" : "bg-teal"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px]">{p.label}</span>
                  <span className="block truncate text-[12px] text-warm-gray">{p.path}</span>
                </span>
                <span className="flex-none text-right text-[12px] text-warm-gray">
                  <span className={p.title.length > 60 ? "text-coral-deep" : ""}>{p.title.length}</span>
                  {" · "}
                  <span className={p.description.length > 160 || p.description.length < 70 ? "text-coral-deep" : ""}>
                    {p.description.length}
                  </span>
                </span>
              </button>
              {isOpen && (
                <div className="space-y-2 pb-3 pl-4">
                  <SearchPreview page={p} host={host} />
                  <p className="text-[12px] text-warm-gray">
                    {t.seoFoundFor} “{targetOf(p) || "—"}” · {p.ownWords} {t.seoOwnWords}
                    {p.faqs > 0 ? ` · ${p.faqs} ${t.seoQuestions}` : ""}
                  </p>
                  <p className="flex flex-wrap gap-1">
                    {p.schema.map((s) => (
                      <span key={s} className="rounded-full bg-charcoal-soft px-2 py-0.5 font-mono text-[11px] text-warm-gray">
                        {s}
                      </span>
                    ))}
                  </p>
                  {mine.map((f) => (
                    <p key={f.key} className={`text-[13px] ${f.severity === "fix" ? "text-coral-deep" : "text-warm-gray"}`}>
                      {f.severity === "fix" ? "⚠ " : "· "}
                      {f.what}
                    </p>
                  ))}
                  <IndexingControls page={p} rule={rules.find((r) => r.path === p.path)} onRule={onRule} />
                  <button
                    type="button"
                    className="text-[13px] font-semibold text-teal hover:underline"
                    onClick={() =>
                      onOpen({ path: p.path, label: p.label, at: p.titleAt, href: p.editHref })
                    }
                  >
                    {t.seoOpenPage} →
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p className="text-[13px] text-warm-gray">{t.searchEmpty}</p>}
    </section>
  );
}

// What an SEO decides per page and nobody else needs to see: whether Google
// may index it, and which address should get the credit when two pages are
// nearly the same. Both write into content/seo.json → Per-page indexing,
// and both take effect on the next publish.
function IndexingControls({
  page,
  rule,
  onRule,
}: {
  page: SitePage;
  rule: PageRule | undefined;
  onRule: (path: string, patch: Partial<PageRule>) => void;
}) {
  const { t } = useLang();
  const [canonical, setCanonical] = useState(rule?.canonical ?? "");
  return (
    <div className="space-y-1.5 rounded-[2px] border border-line p-2">
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={!!rule?.hide}
          onChange={(e) => onRule(page.path, { hide: e.target.checked })}
          className="h-4 w-4 accent-[color:var(--color-teal,#00776d)]"
        />
        {t.seoHide}
        {/* Only when the site itself hides the page — not when this very box does. */}
        {page.noindex && !rule?.hide && <span className="text-warm-gray">({t.seoHiddenInCode})</span>}
      </label>
      <label className="block text-[13px]">
        <span className="text-warm-gray">{t.seoCanonical}</span>
        <input
          value={canonical}
          onChange={(e) => setCanonical(e.target.value)}
          onBlur={() => canonical !== (rule?.canonical ?? "") && onRule(page.path, { canonical: canonical.trim() })}
          placeholder={page.path}
          className="mt-0.5 w-full rounded-[2px] border border-line bg-charcoal px-2 py-1 font-mono text-[12px] outline-none focus:border-teal"
        />
      </label>
    </div>
  );
}

// Everything in content/seo.json, in its own form — the same schema the
// rest of the admin is built from, so it validates and publishes like any
// other content.
function Settings({
  settings,
  onSettings,
}: {
  settings: Record<string, unknown>;
  onSettings: (value: Record<string, unknown>) => void;
}) {
  const { t } = useLang();
  const section = findSection("seo");
  if (!section) return null;
  return (
    <section className="space-y-3">
      <p className="text-[13px] leading-snug text-warm-gray">{t.seoSettingsIntro}</p>
      <SchemaForm fields={section.schema} value={settings} onChange={(v) => onSettings(v)} />
    </section>
  );
}

// ── The Google result, cut where Google cuts it ─────────────────────────
// Google gives the blue line about 600px and the grey lines about 920px,
// in its own font — so a title of 60 wide characters is cut and one of 65
// narrow ones is not. Measuring beats counting, and shows the editor
// exactly which words fall off the end.
const TITLE_PX = 600;
const DESC_PX = 920;
let ruler: CanvasRenderingContext2D | null = null;
function widthOf(text: string, font: string): number {
  if (typeof document === "undefined") return text.length * 8;
  if (!ruler) ruler = document.createElement("canvas").getContext("2d");
  if (!ruler) return text.length * 8;
  ruler.font = font;
  return ruler.measureText(text).width;
}
/** Splits a line into the part Google shows and the part it drops. */
export function cutToWidth(text: string, font: string, max: number): [string, string] {
  if (!text || widthOf(text, font) <= max) return [text, ""];
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (widthOf(text.slice(0, mid), font) <= max) lo = mid;
    else hi = mid - 1;
  }
  // Cut on a word, the way Google does, and leave room for the ellipsis.
  const space = text.lastIndexOf(" ", Math.max(0, lo - 2));
  const at = space > text.length / 2 ? space : lo;
  return [text.slice(0, at), text.slice(at)];
}

/** A page the way it appears in Google's results. */
export function SearchPreview({ page, host }: { page: SitePage; host: string }) {
  const { t } = useLang();
  // Measuring needs a canvas, which the server has not got: render the
  // whole line first and cut it once the browser has taken over, so the
  // markup React hydrates is the markup it rendered.
  const [measured, setMeasured] = useState(false);
  useEffect(() => setMeasured(true), []);
  const [title, titleCut] = measured ? cutToWidth(page.title, "20px Arial, sans-serif", TITLE_PX) : [page.title, ""];
  const [desc, descCut] = measured ? cutToWidth(page.description, "14px Arial, sans-serif", DESC_PX) : [page.description, ""];
  return (
    <div className="rounded-[2px] border border-line bg-white p-3">
      <p className="truncate text-[12px] text-[#006621]">
        {host}
        {page.path}
      </p>
      <p className="text-[16px] leading-snug text-[#1a0dab]">
        {title || t.seoNoTitle}
        {titleCut && <span className="text-[#1a0dab]/30">…{titleCut}</span>}
      </p>
      <p className="text-[13px] text-[#4d5156]">
        {desc || t.seoNoDescription}
        {descCut && <span className="text-[#4d5156]/30">…{descCut}</span>}
      </p>
      {(titleCut || descCut) && <p className="mt-1 text-[11px] text-[#767676]">{t.seoGreyedOut}</p>}
    </div>
  );
}

// The same report as plain text, for sending to whoever asked for it.
function asText(report: Report, pages: SitePage[], host: string): string {
  const lines = [
    `SEO — ${host}`,
    `${report.ready} of ${report.total} pages have nothing that needs fixing.`,
    "",
  ];
  for (const f of report.findings) {
    lines.push(`[${f.severity === "fix" ? "FIX" : "IMPROVE"}] ${f.what}`);
    lines.push(`  Why: ${f.why}`);
    lines.push(`  Do:  ${f.fix}`);
    lines.push(`  Pages (${f.pages.length}): ${f.pages.map((w) => w.path).join(", ")}`);
    lines.push("");
  }
  lines.push("Every page", "");
  for (const p of pages) {
    lines.push(`${p.path}  [title ${p.title.length}, description ${p.description.length}, own words ${p.ownWords}]`);
    lines.push(`  ${p.title}`);
    lines.push(`  ${p.description}`);
  }
  return lines.join("\n");
}
