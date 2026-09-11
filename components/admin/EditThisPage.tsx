"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// A small "Edit this page" button on the public site, for whoever uses the
// admin: seeing a typo on the live site and having to go find that text in
// an admin is the single most common complaint about every CMS.
//
// It is only a link. The flag is set by the admin in this browser
// (localStorage, no cookie, nothing server-side), so it says nothing about
// anyone else's visit, and /admin still requires signing in.

export const ADMIN_FLAG = "ona-admin-editor";

export function EditThisPage() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(localStorage.getItem(ADMIN_FLAG) === "1" && window.self === window.top);
    } catch {}
  }, []);

  if (!show || pathname.startsWith("/admin")) return null;
  return (
    <a
      href={`/admin?page=${encodeURIComponent(pathname)}`}
      className="fixed bottom-4 left-4 z-40 rounded-[2px] border border-line bg-charcoal px-3 py-2 text-[13px] font-medium text-ivory shadow-lg transition hover:border-teal hover:text-teal print:hidden"
    >
      ✎ Edit this page
    </a>
  );
}
