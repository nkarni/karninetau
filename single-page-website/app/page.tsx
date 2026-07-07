const options = [
  {
    name: "Refined Editorial",
    file: "/refined.html",
    tagline: "Your paper/ink minimalism, elevated",
    details:
      "Newsreader serif display headings, scroll-reveal fade-ins, animated section labels, and refined hover interactions on the work list.",
  },
  {
    name: "Kinetic Minimal",
    file: "/kinetic.html",
    tagline: "Same restraint, more crafted motion",
    details:
      "Word-by-word hero reveal, a magnetic CTA, mono-typeset labels, sticky scroll markers, and a live Suffolk Park clock.",
  },
  {
    name: "Warm Editorial",
    file: "/warm.html",
    tagline: "More human, a single warm accent",
    details:
      "Warm paper tone with a terracotta accent, Fraunces serif display, large index numerals, and an asymmetric layout.",
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 font-sans">
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Design directions</p>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          Three takes on the Nitzan Karni site
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600 leading-relaxed">
          Same copy and structure, three different personalities — each professional and minimal, with a bit of motion
          and creativity. Preview each below, or open it full screen to feel the interactions.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-8 lg:grid-cols-3">
        {options.map((opt, i) => (
          <article
            key={opt.file}
            className="flex flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-3 px-5 pt-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Option {i + 1}</p>
                <h2 className="mt-1 text-lg font-semibold">{opt.name}</h2>
                <p className="text-sm text-neutral-500">{opt.tagline}</p>
              </div>
            </div>

            <div className="mt-4 mx-5 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50">
              <div className="relative w-full" style={{ aspectRatio: "16 / 11" }}>
                {/* Scaled live preview of the actual static page */}
                <iframe
                  src={opt.file}
                  title={`${opt.name} preview`}
                  loading="lazy"
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ width: "200%", height: "200%", transform: "scale(0.5)", border: "0" }}
                />
              </div>
            </div>

            <p className="px-5 py-4 text-sm text-neutral-600 leading-relaxed flex-1">{opt.details}</p>

            <div className="px-5 pb-5">
              <a
                href={opt.file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              >
                Open full screen
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
