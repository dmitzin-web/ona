import { getAt, type Path } from "./admin/json-path";
import { findSection } from "./admin/sections";
import { companyValues, fillWith, leaves } from "@/components/admin/visual/model";

// Every page the site has, described the way a search engine sees it: the
// title, the line under it, the heading, how many words are this page's own,
// and — for each of those — WHERE in the admin it is written.
//
// This is a mirror of the `generateMetadata` exports in app/**/page.tsx. It
// has to be, because the admin must be able to show and fix a page's search
// result without loading that page: there are 111 of them. `npm run
// check:seo` loads the built HTML of every route and fails if this file and
// the site disagree — run it after touching either.
//
// Pure and isomorphic: it works on draft content in the browser (so the SEO
// screen re-scores as the editor types) and on the files on disk in scripts.

export type At = { sectionId: string; path: Path };
export type Photo = { alt: string; at: At };

export type SitePage = {
  path: string;
  label: string;
  group: string;
  /** Exactly what `<title>` contains, suffix and all. */
  title: string;
  description: string;
  /** The page's main heading (h1), as one line. */
  heading: string;
  titleAt: At | null;
  descriptionAt: At | null;
  headingAt: At | null;
  /** Pages edited outside the visual editor (blog posts) link there instead. */
  editHref: string | null;
  /** What this page should be found for, and where that was written down. */
  target: string;
  targetAt: At | null;
  /** Whether the page asks Google not to index it. */
  noindex: boolean;
  /** The template this page is generated from, when it is one of many. */
  template: { id: string; label: string; siblings: number } | null;
  /** Words that come from this page's own content rather than the template. */
  ownWords: number;
  /** Where to add words of its own — the city's local note, the service's copy. */
  ownAt: At | null;
  faqs: number;
  photos: Photo[];
};

export type PostRef = { slug: string; title: string; description: string; words: number };
export type Content = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const line = (...parts: string[]) => parts.filter(Boolean).join(" ").replace(/\s+/g, " ").replace(/\s+\./g, ".").trim();
const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

/** What `buildMetadata` does to every page title (lib/seo.ts). */
export const finalTitle = (title: string, siteName: string) =>
  !title ? "" : title.includes(siteName) ? title : `${title} | ${siteName}`;

type Source = { sectionId: string; index?: number };

export function sitePages(values: Content, opts: { siteName: string; siteUrl: string; posts: PostRef[] }): SitePage[] {
  const { siteName, siteUrl, posts } = opts;
  const company = companyValues((values.site ?? {}) as Record<string, unknown>, siteUrl);
  const get = (sectionId: string, path: Path) => getAt(values[sectionId], path);
  const text = (sectionId: string, path: Path, vars: Record<string, string> = {}) =>
    fillWith(fillWith(str(get(sectionId, path)), company), vars).replace(/\s+/g, " ").trim();

  const services = (values.services ?? []) as Record<string, unknown>[];
  const areas = (values.areas ?? []) as Record<string, unknown>[];

  // Stored targets (content/seo.json → SEO in the admin).
  const targetList = ((values.seo as Record<string, unknown>)?.targets ?? []) as Record<string, string>[];
  const targetFor = (path: string): { target: string; at: At | null } => {
    const i = targetList.findIndex((t) => t?.path === path);
    return i < 0
      ? { target: "", at: null }
      : { target: str(targetList[i].query), at: { sectionId: "seo", path: ["targets", i, "query"] } };
  };

  // Words and photos are read from the schema, so a field added to a page is
  // counted without touching this file. The leaves of a section are worked
  // out once: the fifty city × service pages all read the same two.
  const leafCache = new Map<string, ReturnType<typeof leaves>>();
  const leavesOf = (sectionId: string) => {
    const hit = leafCache.get(sectionId);
    if (hit) return hit;
    const section = findSection(sectionId);
    const out = section && values[sectionId] !== undefined ? leaves(section, values[sectionId]) : [];
    leafCache.set(sectionId, out);
    return out;
  };
  const contentOf = (sources: Source[]) => {
    let words = 0;
    const photos: Photo[] = [];
    for (const s of sources) {
      const value = values[s.sectionId];
      if (value === undefined) continue;
      for (const leaf of leavesOf(s.sectionId)) {
        if (s.index !== undefined && leaf.path[0] !== s.index) continue;
        const raw = getAt(value, leaf.path);
        if (leaf.photo) {
          const altPath = [...leaf.path.slice(0, -1), "imageAlt"];
          photos.push({ alt: str(getAt(value, altPath)), at: { sectionId: s.sectionId, path: altPath } });
        } else if (typeof raw === "string") {
          words += countWords(raw);
        }
      }
    }
    return { words, photos };
  };

  const countFaqs = (sectionId: string, path: Path) => {
    const v = get(sectionId, path);
    return Array.isArray(v) ? v.length : 0;
  };

  const make = (p: {
    path: string;
    label: string;
    group: string;
    title: string;
    description: string;
    heading: string;
    titleAt: At | null;
    descriptionAt: At | null;
    headingAt: At | null;
    noindex?: boolean;
    editHref?: string;
    template?: { id: string; label: string; siblings: number } | null;
    own: Source[];
    all: Source[];
    ownAt?: At | null;
    faqs?: number;
  }): SitePage => {
    const { words } = contentOf(p.own);
    const { photos } = contentOf(p.all);
    const t = targetFor(p.path);
    return {
      path: p.path,
      label: p.label,
      group: p.group,
      title: finalTitle(p.title, siteName),
      description: p.description,
      heading: p.heading,
      titleAt: p.titleAt,
      descriptionAt: p.descriptionAt,
      headingAt: p.headingAt,
      editHref: p.editHref ?? null,
      target: t.target,
      targetAt: t.at,
      noindex: p.noindex ?? false,
      template: p.template ?? null,
      ownWords: words,
      ownAt: p.ownAt ?? null,
      faqs: p.faqs ?? 0,
      photos,
    };
  };

  const out: SitePage[] = [];

  // ── The pages that are one of a kind ────────────────────────────────────
  const single = (
    path: string,
    label: string,
    sectionId: string,
    seoAt: Path,
    headingAt: Path | Path[],
    o: { noindex?: boolean; faqsAt?: Path; vars?: Record<string, string> } = {},
  ) => {
    const heads = (Array.isArray(headingAt[0]) ? headingAt : [headingAt]) as Path[];
    out.push(
      make({
        path,
        label,
        group: "Main",
        title: text(sectionId, [...seoAt, "title"], o.vars),
        description: text(sectionId, [...seoAt, "description"], o.vars),
        heading: line(...heads.map((h) => text(sectionId, h, o.vars))),
        titleAt: { sectionId, path: [...seoAt, "title"] },
        descriptionAt: { sectionId, path: [...seoAt, "description"] },
        headingAt: { sectionId, path: heads[0] },
        noindex: o.noindex,
        own: [{ sectionId }],
        all: [{ sectionId }],
        faqs: o.faqsAt ? countFaqs(sectionId, o.faqsAt) : 0,
      }),
    );
  };

  single("/", "Homepage", "home", ["seo"], [["hero", "titleLead"], ["hero", "titleRest"]], { faqsAt: ["faqs"] });
  single("/about", "About", "about", ["seo"], ["hero", "title"], {
    faqsAt: ["faq", "faqs"],
    vars: { founded: str((values.site as Record<string, unknown>)?.founded) },
  });
  single("/contact", "Contact", "contact", ["seo"], ["hero", "title"]);
  single("/services", "Services", "services-index", ["seo"], ["hero", "title"]);
  single("/areas", "Service areas", "areas-index", ["seo"], ["hero", "title"]);
  single("/blog", "Blog", "blog-index", ["seo"], ["hero", "title"]);
  single("/quote", "Quote request", "quote", ["seo"], ["intro", "title"], { faqsAt: ["faqs"] });
  single("/start-project", "Start a project", "start-project", ["seo"], ["kind", "title"]);
  single("/quote/thanks", "Thank you (after a quote request)", "misc", ["thanks", "seo"], ["thanks", "title"], {
    noindex: true,
  });

  for (const [path, label, key] of [
    ["/privacy", "Privacy policy", "privacyPage"],
    ["/terms", "Terms of service", "termsPage"],
  ] as const) {
    out.push(
      make({
        path,
        label,
        group: "Main",
        title: text("legal", [key, "seoTitle"]),
        description: text("legal", [key, "seoDescription"]),
        heading: text("legal", [key, "heading"]),
        titleAt: { sectionId: "legal", path: [key, "seoTitle"] },
        descriptionAt: { sectionId: "legal", path: [key, "seoDescription"] },
        headingAt: { sectionId: "legal", path: [key, "heading"] },
        own: [{ sectionId: "legal" }],
        all: [{ sectionId: "legal" }],
      }),
    );
  }

  // ── The five service pages ──────────────────────────────────────────────
  services.forEach((s, i) => {
    const vars = {
      service: str(s.name),
      serviceShort: str(s.shortName),
      serviceShortLower: str(s.shortName).toLowerCase(),
    };
    // Mold is a business line of its own and replaces the shared hero with
    // its own block (components/services/MoldSections.tsx).
    const mold = str(s.slug) === "mold-removal";
    out.push(
      make({
        path: `/services/${str(s.slug)}`,
        label: str(s.name),
        group: "Services",
        title: fillWith(str(s.title), company),
        description: fillWith(str(s.description), company),
        heading: mold
          ? line(text("mold-sections", ["hero", "titleLead"]), text("mold-sections", ["hero", "titleRest"]))
          : line(text("service-page", ["hero", "title"], vars), text("service-page", ["hero", "titleSub"], vars)),
        titleAt: { sectionId: "services", path: [i, "title"] },
        descriptionAt: { sectionId: "services", path: [i, "description"] },
        headingAt: mold
          ? { sectionId: "mold-sections", path: ["hero", "titleLead"] }
          : { sectionId: "service-page", path: ["hero", "title"] },
        template: { id: "service-page", label: "Service page template", siblings: services.length },
        own: [{ sectionId: "services", index: i }],
        all: [
          { sectionId: "services", index: i },
          { sectionId: mold ? "mold-sections" : "service-page" },
        ],
        ownAt: { sectionId: "services", path: [i, "intro"] },
        faqs: Array.isArray(s.faqs) ? s.faqs.length : 0,
      }),
    );
  });

  // ── The ten city pages ──────────────────────────────────────────────────
  const areaVars = (a: Record<string, unknown>) => ({
    area: str(a.name),
    areaState: str(a.region),
    areaStateName: str(a.regionName),
    county: str(a.county),
    population: str(a.population),
    drive: String(a.driveMinutesFromHQ ?? ""),
    zipCount: String((a.zips as string[] | undefined)?.length ?? ""),
    zips: ((a.zips as string[] | undefined) ?? []).join(", "),
    topLosses: ((a.commonLosses as string[] | undefined) ?? []).slice(0, 3).join("; "),
    weather: str(a.weatherPattern),
  });

  areas.forEach((a, i) => {
    const vars = areaVars(a);
    out.push(
      make({
        path: `/areas/${str(a.slug)}`,
        label: `${str(a.name)}, ${str(a.region)}`,
        group: "Cities",
        title: text("area-page", ["seo", "title"], vars),
        description: text("area-page", ["seo", "description"], vars),
        heading: line(text("area-page", ["hero", "titleLead"], vars), text("area-page", ["hero", "titleRest"], vars)),
        titleAt: { sectionId: "area-page", path: ["seo", "title"] },
        descriptionAt: { sectionId: "area-page", path: ["seo", "description"] },
        headingAt: { sectionId: "area-page", path: ["hero", "titleLead"] },
        template: { id: "area-page", label: "City page template", siblings: areas.length },
        own: [{ sectionId: "areas", index: i }],
        all: [{ sectionId: "areas", index: i }, { sectionId: "area-page" }],
        ownAt: { sectionId: "areas", path: [i, "localNote"] },
      }),
    );
  });

  // ── The fifty city × service pages ──────────────────────────────────────
  const SPOKANE = "/services/fire-damage/spokane-wa";
  services.forEach((s, si) => {
    areas.forEach((a, ai) => {
      const vars = { ...areaVars(a), service: str(s.name), serviceShort: str(s.shortName) };
      const home = Number(a.driveMinutesFromHQ) === 0;
      out.push(
        make({
          path: `/services/${str(s.slug)}/${str(a.slug)}`,
          label: `${str(s.shortName)} — ${str(a.name)}`,
          group: "City × service",
          title: text("service-area-page", ["seo", "title"], vars),
          description: text("service-area-page", ["seo", home ? "descriptionHome" : "description"], vars),
          heading: line(
            text("service-area-page", ["hero", "titleLead"], vars),
            text("service-area-page", ["hero", "titleCity"], vars),
            text("service-area-page", ["hero", "titleEnd"], vars),
          ),
          titleAt: { sectionId: "service-area-page", path: ["seo", "title"] },
          descriptionAt: { sectionId: "service-area-page", path: ["seo", home ? "descriptionHome" : "description"] },
          headingAt: { sectionId: "service-area-page", path: ["hero", "titleLead"] },
          template: {
            id: "service-area-page",
            label: "City × service template",
            siblings: services.length * areas.length,
          },
          own: [{ sectionId: "areas", index: ai }],
          all: [{ sectionId: "areas", index: ai }, { sectionId: "services", index: si }, { sectionId: "service-area-page" }],
          ownAt: { sectionId: "areas", path: [ai, "localNote"] },
        }),
      );
    });
  });

  // Spokane is its own page on the same route (a mobile deployment, not a
  // local branch) — see components/services/SpokaneFireDeployment.tsx.
  out.push(
    make({
      path: SPOKANE,
      label: "Spokane wildfire",
      group: "Services",
      title: text("spokane-fire", ["seo", "title"]),
      description: text("spokane-fire", ["seo", "description"]),
      heading: line(text("spokane-fire", ["hero", "titleLead"]), text("spokane-fire", ["hero", "titleRest"])),
      titleAt: { sectionId: "spokane-fire", path: ["seo", "title"] },
      descriptionAt: { sectionId: "spokane-fire", path: ["seo", "description"] },
      headingAt: { sectionId: "spokane-fire", path: ["hero", "titleLead"] },
      own: [{ sectionId: "spokane-fire" }],
      all: [{ sectionId: "spokane-fire" }],
      faqs: countFaqs("spokane-fire", ["faq", "faqs"]),
    }),
  );

  // ── Blog posts (their own editor) ───────────────────────────────────────
  for (const p of posts) {
    out.push({
      path: `/blog/${p.slug}`,
      label: p.title,
      group: "Blog posts",
      title: finalTitle(p.title, siteName),
      description: p.description,
      heading: p.title,
      titleAt: null,
      descriptionAt: null,
      headingAt: null,
      editHref: `/admin/posts/${p.slug}`,
      target: targetFor(`/blog/${p.slug}`).target,
      targetAt: targetFor(`/blog/${p.slug}`).at,
      noindex: false,
      template: null,
      ownWords: p.words,
      ownAt: null,
      faqs: 0,
      photos: [],
    });
  }

  return out;
}

/**
 * The target a page is measured against: what the admin wrote down, or — for
 * the city and city × service pages, of which there are sixty — what the city
 * and the service say the page is about.
 */
export function targetOf(page: SitePage): string {
  if (page.target) return page.target;
  const city = /^\/areas\/([a-z-]+)$/.exec(page.path);
  if (city) return `restoration ${page.label.replace(", ", " ")}`;
  if (page.group === "City × service") return page.label.replace(" — ", " ");
  return "";
}
