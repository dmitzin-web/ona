import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon } from "@/components/icons/ServiceIcons";
import { PhoneLink } from "@/components/contact/ContactLinks";
import miscContent from "@/content/pages/misc.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// Copy lives in content/pages/misc.json → notFound, edited through the admin
// (/admin → Thank-you & not-found pages). The phone number is Company details.
const t = fillPlaceholdersDeep(miscContent.notFound);

export default function NotFound() {
  return (
    <section className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-3xl px-6 py-32 text-center lg:px-10">
        <p className="eyebrow text-warm-gray-soft">{t.eyebrow}</p>
        <h1 className="text-ivory mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
          {t.title}
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-ivory/85">{t.body}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <PhoneLink className="inline-flex items-center gap-3 border border-ivory bg-brand px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-transparent hover:text-ivory">
            <PhoneIcon className="h-4 w-4 stroke-current" />
            {site.phoneDisplay}
          </PhoneLink>
          <Link
            href="/"
            className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
          >
            {t.backHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
