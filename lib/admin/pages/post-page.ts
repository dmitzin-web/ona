import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// /blog/<post> — the fixed wording around every blog post. The posts
// themselves are edited in the admin's blog editor (content/posts). Which
// service and which three cities the "Get help near you" block links to is
// decided in app/blog/[slug]/page.tsx (post category → service), not here.
export const POST_PAGE: SectionDef = {
  id: "post-page",
  label: "Blog post page template",
  file: "content/pages/post-page.json",
  description: `The fixed text around every blog post: breadcrumb, the line above and below the title, the “Get help near you” links and “More from the field”. The posts themselves are written in the blog editor. ${PLACEHOLDERS} Also filled in per post: {category}, {minutes} (reading time), {date}, {author}, {service} (the service the post is about), {serviceLower} (the same in lower case) and {area} (a city).`,
  kind: "single",
  schema: [
    { kind: "object", key: "breadcrumb", label: "Breadcrumb trail", hint: "The last step is the post's title.", fields: [
      { kind: "text", key: "home", label: "First link", required: true },
      { kind: "text", key: "blog", label: "Second link", required: true },
    ] },
    { kind: "object", key: "header", label: "Around the title", fields: [
      { kind: "text", key: "meta", label: "Line above the title", required: true, hint: "Uses {category} and {minutes}." },
      { kind: "text", key: "byline", label: "Line under the introduction", required: true, hint: "Uses {date} and {author}." },
    ] },
    { kind: "object", key: "help", label: "“Get help near you”", hint: "Links to the post's service in three cities, then to the service page.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true, hint: "Uses {service}." },
      { kind: "text", key: "cityTitle", label: "City card — title", required: true, hint: "Uses {service} and {area}." },
      { kind: "text", key: "cityLink", label: "City card — link", required: true },
      { kind: "text", key: "allEyebrow", label: "Last card — label", required: true },
      { kind: "text", key: "allTitle", label: "Last card — title", required: true, hint: "Uses {serviceLower}." },
      { kind: "text", key: "allLink", label: "Last card — link", required: true },
    ] },
    { kind: "text", key: "faqTitle", label: "Heading above a post's questions", required: true, hint: "The questions are part of each post." },
    { kind: "object", key: "more", label: "“More from the field”", hint: "Three other posts, newest first.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "link", label: "Link on each card", required: true },
    ] },
  ],
};
