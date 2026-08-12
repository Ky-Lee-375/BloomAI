"use client";

import { createClient } from "@/lib/supabase/client";

interface AuthButtonProps {
  isAuthenticated: boolean;
  className?: string;
}

export function AuthButton({ isAuthenticated, className = "" }: AuthButtonProps) {
  const supabase = createClient();

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (isAuthenticated) {
    return (
      <button
        type="button"
        onClick={signOut}
        className={`text-sm font-medium text-ink/60 hover:text-mauve-dark ${className}`}
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      className={`rounded-full border border-ink/15 px-5 py-2 text-sm font-medium text-ink/80 transition-colors hover:border-mauve-dark hover:text-mauve-dark ${className}`}
    >
      Sign in with Google
    </button>
  );
}
