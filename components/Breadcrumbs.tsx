import Link from "next/link";

export function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: { name: string; href: string }[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mx-auto max-w-7xl px-6 pt-8 lg:px-10 ${
        dark ? "text-ivory/60" : "text-charcoal/60"
      }`}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 eyebrow">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span
                  aria-current="page"
                  className={dark ? "text-ivory" : "text-charcoal"}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition ${
                    dark ? "hover:text-ivory" : "hover:text-charcoal"
                  }`}
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className="opacity-50">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
