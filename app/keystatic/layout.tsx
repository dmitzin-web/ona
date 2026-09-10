import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

// The content admin. See keystatic.config.ts for what it edits and why the
// legal copy is deliberately not in it.
//
// It renders inside the root layout — App Router gives every route the same
// <html>/<body>, and moving the whole site into a route group to escape that
// would touch every path. Instead the site chrome steps aside: Header and
// AskOna return null on /keystatic, and the status strip and footer are
// hidden by the `.ona-keystatic` rule in globals.css.

export const metadata: Metadata = {
  title: "Content admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function KeystaticLayout() {
  return (
    <div className="ona-keystatic">
      <KeystaticApp />
    </div>
  );
}
