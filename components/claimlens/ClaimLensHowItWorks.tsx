import { howItWorks } from "@/lib/claimlens/config";

export function ClaimLensHowItWorks() {
  return (
    <section id="how-it-works" className="bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-charcoal/60">How it works</p>
            <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              Four steps. No guesswork.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/75">
              You upload what you have. ClaimLens™ reads it, organizes it,
              and gives you a structured report you can use to ask better
              questions.
            </p>
          </div>

          <ol className="grid gap-12 sm:grid-cols-2 lg:col-span-8">
            {howItWorks.map((step) => (
              <li key={step.n} className="border-t border-charcoal/20 pt-6">
                <p className="eyebrow text-gold-deep">{step.n}</p>
                <p className="mt-4 text-2xl font-light tracking-tight">
                  {step.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
