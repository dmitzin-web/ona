import { collection, config, fields } from "@keystatic/core";

// ─────────────────────────────────────────────────────────────
// Keystatic — the content admin at /keystatic.
// ────────────────────────────────────────────────────────────
// Content lives as JSON files in this repository (content/posts,
// content/work). The admin reads and writes those files; every save is a
// git commit, so every edit has an author, a timestamp and a one-click
// revert. No database, and the public site stays fully static: pages are
// built from these files, the admin is only ever used to change them.
//
// WHAT IS DELIBERATELY NOT HERE. Services, city pages, the phone number,
// the licence line and every legal claim stay in code (lib/site.ts,
// lib/services.ts, lib/areas.ts). Those carry statutory constraints —
// RCW 18.27.100, the pending Oregon CCB registration, the ban on
// "bonded and insured" — that an editor with a text box can break in one
// keystroke, and that a code review catches. Content that changes often
// and carries no legal weight is what belongs in an admin.
//
// STORAGE. `local` in development: the admin edits files on disk, no login.
// `github` in production: editors sign in with GitHub, and need write access
// to the repository. If an editor should not need a GitHub account (or
// should not get write access to the code), switch production to Keystatic
// Cloud — `storage: { kind: "cloud" }` plus `cloud: { project: "team/project" }`.
// The schema below does not change either way.

//
// ONE-TIME SETUP needs GitHub mode on localhost: Keystatic's "create GitHub
// App" wizard only runs in development. Start the dev server with
// KEYSTATIC_STORAGE=github to get it (steps in CLAUDE.md).
const useLocal =
  process.env.NODE_ENV === "development" &&
  process.env.KEYSTATIC_STORAGE !== "github";

const storage = useLocal
  ? ({ kind: "local" } as const)
  : ({ kind: "github", repo: { owner: "dmitzin-web", name: "ona" } } as const);

// Same six kinds as `PostSection` in lib/posts.ts. Keystatic stores a block
// as { discriminant, value }; lib/posts.ts maps that back to { kind, text }
// or { kind, items }, so the renderer in app/blog/[slug] is untouched.
const listItems = (label: string) =>
  fields.array(fields.text({ label: "Item", multiline: true }), {
    label,
    itemLabel: (p) => p.value.slice(0, 80) || "Empty item",
  });

export default config({
  storage,
  ui: {
    brand: { name: "Ona Restoration" },
  },
  collections: {
    posts: collection({
      label: "Blog posts",
      slugField: "title",
      path: "content/posts/*",
      format: { data: "json" },
      entryLayout: "content",
      columns: ["category", "publishedAt"],
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { isRequired: true },
          },
          slug: {
            label: "Page address",
            description:
              "The part after /blog/. Changing it on a published post breaks every existing link and search result pointing at the old address — leave it alone once a post is live.",
          },
        }),
        description: fields.text({
          label: "Search description",
          description:
            "Shown under the title in Google results and link previews. One or two plain sentences, roughly 150 characters.",
          multiline: true,
          validation: { isRequired: true },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "The short summary on the /blog list page.",
          multiline: true,
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Water", value: "Water" },
            { label: "Fire", value: "Fire" },
            { label: "Mold", value: "Mold" },
            { label: "Storm", value: "Storm" },
            { label: "Insurance", value: "Insurance" },
            { label: "Remodeling", value: "Remodeling" },
          ],
          defaultValue: "Water",
        }),
        readingMinutes: fields.integer({
          label: "Reading time (minutes)",
          defaultValue: 5,
          validation: { isRequired: true, min: 1 },
        }),
        publishedAt: fields.date({
          label: "Published",
          validation: { isRequired: true },
        }),
        updatedAt: fields.date({
          label: "Updated",
          description: "Leave empty unless the post was materially revised.",
        }),
        author: fields.object(
          {
            name: fields.text({
              label: "Name",
              defaultValue: "Ona Restoration",
              validation: { isRequired: true },
            }),
            title: fields.text({
              label: "Role",
              defaultValue: "Restoration & remodeling — Vancouver, WA",
            }),
          },
          { label: "Author" },
        ),
        sections: fields.blocks(
          {
            p: {
              label: "Paragraph",
              itemLabel: (p) => p.value.slice(0, 90) || "Empty paragraph",
              schema: fields.text({ label: "Text", multiline: true }),
            },
            h2: {
              label: "Heading",
              itemLabel: (p) => `H2 · ${p.value}`,
              schema: fields.text({ label: "Heading" }),
            },
            h3: {
              label: "Subheading",
              itemLabel: (p) => `H3 · ${p.value}`,
              schema: fields.text({ label: "Subheading" }),
            },
            list: {
              label: "Bulleted list",
              itemLabel: (p) => `• ${p.elements.length} items`,
              schema: listItems("Items"),
            },
            ordered: {
              label: "Numbered list",
              itemLabel: (p) => `1. ${p.elements.length} steps`,
              schema: listItems("Steps"),
            },
            callout: {
              label: "Callout box",
              itemLabel: (p) => `▍ ${p.value.slice(0, 80)}`,
              schema: fields.text({ label: "Text", multiline: true }),
            },
          },
          { label: "Body" },
        ),
        faqs: fields.array(
          fields.object({
            q: fields.text({ label: "Question" }),
            a: fields.text({ label: "Answer", multiline: true }),
          }),
          {
            label: "FAQ",
            description:
              "Optional. Rendered at the end of the post and sent to Google as FAQ structured data.",
            itemLabel: (p) => p.fields.q.value || "New question",
          },
        ),
        howTo: fields.conditional(
          fields.checkbox({
            label: "This post is a step-by-step guide",
            description:
              "Adds HowTo structured data for Google. Only tick it if the post really is a sequence of steps.",
            defaultValue: false,
          }),
          {
            true: fields.object({
              name: fields.text({ label: "Guide name" }),
              description: fields.text({
                label: "Guide description",
                multiline: true,
              }),
              steps: fields.array(
                fields.object({
                  name: fields.text({ label: "Step" }),
                  text: fields.text({ label: "Detail", multiline: true }),
                }),
                {
                  label: "Steps",
                  itemLabel: (p) => p.fields.name.value || "New step",
                },
              ),
            }),
            false: fields.empty(),
          },
        ),
      },
    }),

    work: collection({
      label: "Our work — remodeling gallery",
      slugField: "title",
      path: "content/work/*",
      format: { data: "json" },
      columns: ["roomType", "order"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        roomType: fields.text({
          label: "Room",
          description: "Kitchen, Primary bath, Powder room, Laundry …",
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: "Photo",
          description:
            "Landscape, at least 1500px wide. Our own completed work only — never stock, never another contractor's.",
          directory: "public/photos/projects",
          publicPath: "/photos/projects/",
          validation: { isRequired: true },
        }),
        imageAlt: fields.text({
          label: "Photo description (for screen readers and Google)",
          description:
            "Describe what is in the frame, e.g. \"Kitchen with a waterfall-edge island and three globe pendants\".",
          multiline: true,
          validation: { isRequired: true },
        }),
        notes: fields.text({
          label: "Caption",
          description:
            "RULE: only what is visible in this photo — fixtures and forms, like \"Waterfall-edge island · Apron-front sink\". No materials, brands, sizes, timelines, budgets, cities or client names: none of that can be verified from the picture.",
          multiline: true,
          validation: { isRequired: true },
        }),
        order: fields.integer({
          label: "Position",
          description: "Lower numbers show first.",
          defaultValue: 100,
          validation: { isRequired: true },
        }),
      },
    }),
  },
});
