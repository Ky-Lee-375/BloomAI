import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the redirect back from Supabase/Google after OAuth sign-in.
 * Exchanges the auth code for a session, then sends the user on to
 * wherever they were headed (defaulting to /create).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/create";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
