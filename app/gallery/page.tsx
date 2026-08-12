import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { GalleryPageClient } from "./GalleryPageClient";
import { createClient } from "@/lib/supabase/server";
import type { Bouquet } from "@/lib/types";

export default async function GalleryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen">
        <SiteHeader activePath="/gallery" />
        <main className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-ink">Sign in to see your gallery</h1>
          <p className="mt-3 text-sm text-ink/60">
            Your saved bouquets live here once you sign in with Google.
          </p>
          <Link
            href="/create"
            className="mt-8 rounded-full bg-forest px-8 py-3 text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02]"
          >
            Go create a bouquet
          </Link>
        </main>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("bouquets")
    .select("*")
    .order("created_at", { ascending: false });

  const bouquets = (data ?? []) as Bouquet[];

  return (
    <div className="min-h-screen">
      <SiteHeader activePath="/gallery" />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-display text-3xl text-ink">Your gallery</h1>
        <p className="mt-2 text-sm text-ink/60">
          {bouquets.length} saved {bouquets.length === 1 ? "bouquet" : "bouquets"}
        </p>

        {error && (
          <p className="mt-6 rounded-xl border border-mauve-dark/30 bg-blush/40 px-4 py-3 text-sm text-mauve-dark">
            We couldn&apos;t load your gallery right now. Please try again shortly.
          </p>
        )}

        <div className="mt-10">
          <GalleryPageClient initialBouquets={bouquets} />
        </div>
      </main>
    </div>
  );
}
