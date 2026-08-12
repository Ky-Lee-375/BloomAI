import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components (browser context).
 * Reads the public URL/anon key, which are safe to expose to the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
