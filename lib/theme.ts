import themeContent from "../content/theme.json";

// The look of the site — colours and corner radius — chosen in the admin
// (/admin → Appearance) and written into every page as CSS variables that
// override the defaults in globals.css. Nothing else changes: the ~1100
// Tailwind classes keep their token names, and a token is just a variable.
//
// Only the roles a non-developer can reason about are here ("page
// background", "call button"). The shades derived from them (hover, muted
// type on the dark surface) are computed below, so a colour can never be
// changed in one place and left inconsistent in another.

export type Theme = {
  ink: string;
  ground: string;
  band: string;
  well: string;
  line: string;
  accent: string;
  surface: string;
  action: string;
  radius: number;
};

export const theme = themeContent as Theme;

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
};
const hex = ([r, g, b]: [number, number, number]) => `#${[r, g, b].map((x) => clamp(x).toString(16).padStart(2, "0")).join("")}`;
const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  return hex([r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t]);
};
const lighten = (c: string, t: number) => mix(c, "#ffffff", t);
const darken = (c: string, t: number) => mix(c, "#000000", t);

// Relative luminance and contrast, per WCAG 2.1.
const luminance = (c: string) => {
  const [r, g, b] = rgb(c).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// The palette globals.css ships with. A role left at its default emits no
// override at all, so the designed palette — including the hand-picked
// secondary shades — stays exactly as it is. Only a role the admin
// actually changed is recomputed, together with the shades derived from it.
export const DEFAULT_THEME: Theme = {
  ink: "#172124",
  ground: "#ffffff",
  band: "#e9f0ef",
  well: "#d8e5e3",
  line: "#dce7e5",
  accent: "#00776d",
  surface: "#073b3a",
  action: "#d23c29",
  radius: 2,
};

export function themeVariables(t: Theme = theme): Record<string, string> {
  const out: Record<string, string> = {};
  const role = (key: keyof Theme, vars: Record<string, string>) => {
    if (t[key] !== DEFAULT_THEME[key]) Object.assign(out, vars);
  };
  // These are the --ona-* overrides globals.css falls back from, so the
  // transparent variants Tailwind compiles (bg-teal/10, text-ivory/85 …)
  // follow the chosen colour too.
  role("ink", { "--ona-ink": t.ink, "--ona-ink-soft": lighten(t.ink, 0.2) });
  role("ground", { "--ona-ground": t.ground });
  role("band", { "--ona-band": t.band });
  role("well", { "--ona-well": t.well });
  role("line", { "--ona-line": t.line, "--ona-line-soft": lighten(t.line, 0.5) });
  role("accent", {
    "--ona-accent": t.accent,
    "--ona-accent-bright": lighten(t.accent, 0.12),
    "--ona-accent-deep": darken(t.accent, 0.2),
  });
  role("surface", {
    "--ona-surface": t.surface,
    "--ona-surface-2": lighten(t.surface, 0.06),
    "--ona-surface-line": lighten(t.surface, 0.18),
    "--ona-surface-muted": lighten(t.surface, 0.75),
  });
  role("action", { "--ona-action": t.action, "--ona-action-deep": darken(t.action, 0.15) });
  return out;
}

// The stylesheet dropped into every page's <head>. The radius rule
// overrides the `rounded-[2px]` utility the whole site is built on, which
// is how one number restyles every button, card and input at once.
export function themeCss(t: Theme = theme): string {
  const entries = Object.entries(themeVariables(t));
  const vars = entries.length ? `:root{${entries.map(([k, v]) => `${k}:${v}`).join(";")}}` : "";
  const radius = t.radius !== DEFAULT_THEME.radius ? `.rounded-\\[2px\\]{border-radius:${t.radius}px}` : "";
  return vars + radius;
}

// What the admin warns about before publishing a colour that makes the
// site hard to read. Thresholds are WCAG AA for body text (4.5:1).
export function themeWarnings(t: Theme): { key: keyof Theme; message: string }[] {
  const out: { key: keyof Theme; message: string }[] = [];
  const check = (key: keyof Theme, fg: string, bg: string, what: string, min = 4.5) => {
    const c = contrast(fg, bg);
    if (c < min) out.push({ key, message: `${what}: contrast ${c.toFixed(1)}:1 — too low to read comfortably (needs ${min}:1).` });
  };
  check("ink", t.ink, t.ground, "Text on the page background");
  check("band", t.ink, t.band, "Text on the section band");
  check("well", t.ink, t.well, "Text on the deeper band");
  check("accent", t.accent, t.ground, "Links on the page background");
  check("surface", "#ffffff", t.surface, "White text on the dark surface");
  check("action", "#ffffff", t.action, "White text on the call button", 3);
  return out;
}
