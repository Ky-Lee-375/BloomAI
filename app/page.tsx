import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { BloomMark } from "@/components/BloomMark";
import { FLOWERS, MOODS, COLOR_PALETTES } from "@/lib/types";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader activePath="/" />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-24 -top-24 text-mauve/20">
            <BloomMark className="h-96 w-96 animate-drift" />
          </div>
          <div className="pointer-events-none absolute -left-16 bottom-0 text-forest/10">
            <BloomMark className="h-72 w-72" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 pb-20 pt-20 text-center sm:pt-28">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-mauve-dark">
              Watercolor bouquets, painted by AI
            </p>
            <h1 className="mt-6 text-balance font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
              Every bouquet begins with a{" "}
              <span className="italic text-forest">feeling</span>, not a florist.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-ink/70">
              Choose your flowers, set a mood, and pick a palette — Bouquet Creator paints
              a one-of-a-kind watercolor arrangement in moments, ready to keep in your
              personal gallery.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/create"
                className="rounded-full bg-forest px-8 py-3 font-body text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02] hover:bg-forest-dark"
              >
                Start creating
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-ink/15 px-8 py-3 font-body text-sm font-medium text-ink/80 transition-colors hover:border-mauve-dark hover:text-mauve-dark"
              >
                View gallery
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-ink/10 bg-forest text-paper">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-display text-3xl">Three choices, one painting</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              <HowItWorksCard
                title="Flowers"
                description="Pick as many blooms as you like — roses, peonies, tulips, and more."
                sample={FLOWERS.slice(0, 4)}
              />
              <HowItWorksCard
                title="Mood"
                description="Set the emotional tone the arrangement should express."
                sample={MOODS.slice(0, 4)}
              />
              <HowItWorksCard
                title="Palette"
                description="Choose the color story that ties the whole piece together."
                sample={COLOR_PALETTES.slice(0, 4)}
              />
            </div>
          </div>
        </section>

        {/* Prefer to describe it */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl text-ink">Prefer to describe it yourself?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Skip the guided steps entirely and write your own description — something like
            “a romantic bouquet with pink peonies and white roses” — and let the painting
            follow your words.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-block rounded-full bg-mauve-dark px-8 py-3 font-body text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02]"
          >
            Describe your bouquet
          </Link>
        </section>
      </main>

      <footer className="border-t border-ink/10 py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
        Bouquet Creator — painted with AI, kept in your gallery
      </footer>
    </div>
  );
}

function HowItWorksCard({
  title,
  description,
  sample,
}: {
  title: string;
  description: string;
  sample: readonly string[];
}) {
  return (
    <div className="rounded-2xl border border-paper/15 bg-paper/5 p-6">
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm text-paper/70">{description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {sample.map((item) => (
          <li
            key={item}
            className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-paper/80"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
