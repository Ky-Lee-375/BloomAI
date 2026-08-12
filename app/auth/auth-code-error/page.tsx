import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Sign-in didn&apos;t go through</h1>
        <p className="mt-3 text-sm text-ink/60">
          Something interrupted the Google sign-in process. Please try again.
        </p>
        <Link
          href="/create"
          className="mt-8 rounded-full bg-forest px-8 py-3 text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02]"
        >
          Back to Bouquet Creator
        </Link>
      </main>
    </div>
  );
}
