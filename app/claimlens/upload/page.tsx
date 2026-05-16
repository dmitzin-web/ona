import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ClaimLensUploadForm } from "@/components/claimlens/ClaimLensUploadForm";
import { ClaimLensWordmark } from "@/components/claimlens/ClaimLensWordmark";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Analyze a Claim — ClaimLens™",
  description:
    "Upload your insurance estimate, contractor estimate, photos, policy, denial letter, or mitigation invoice. ClaimLens™ returns a structured report on possible missing scope and documentation gaps.",
  path: "/claimlens/upload",
  image: "/claimlens/opengraph-image",
});

export default async function ClaimLensUploadPage() {
  // Auth gate — upload + analysis touches Supabase and the Claude API,
  // both of which we run only for authenticated users.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/claimlens/upload");
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "ClaimLens", href: "/claimlens" },
          { name: "Analyze a claim", href: "/claimlens/upload" },
        ]}
      />

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
          <aside className="lg:col-span-4">
            <p className="eyebrow text-charcoal/60">Analyze a claim</p>
            <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              Run it through{" "}
              <span className="font-medium">
                <ClaimLensWordmark tone="dark" />
              </span>
              .
            </h1>
            <p className="mt-8 text-base leading-relaxed text-charcoal/75">
              Upload what you have. The more documents you include, the more
              your report can be tied directly to evidence — and the fewer
              findings will be marked <em>needs verification</em>.
            </p>

            <ul className="mt-10 space-y-3 border-t border-charcoal/15 pt-8 text-sm text-charcoal/80">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Carrier estimates (PDF, XLSX)</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Contractor estimates and scopes of work</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Photos of damaged areas (JPG, PNG)</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Insurance policy and declarations page</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Denial letters and adjuster correspondence</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Mitigation invoices and daily logs</span>
              </li>
            </ul>

            <p className="mt-10 text-xs leading-relaxed text-charcoal/60">
              Privacy: uploaded files are processed to generate your report
              and are not shared with third parties. Treat anything you upload
              as sensitive. Don&apos;t see your file type?{" "}
              <Link href="/claimlens" className="underline">
                See what&apos;s supported.
              </Link>
            </p>
          </aside>

          <div className="lg:col-span-8">
            <div className="border border-charcoal/15 bg-ivory p-8 lg:p-10">
              <ClaimLensUploadForm />
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "ClaimLens", url: "/claimlens" },
          { name: "Analyze a claim", url: "/claimlens/upload" },
        ])}
      />
    </>
  );
}
