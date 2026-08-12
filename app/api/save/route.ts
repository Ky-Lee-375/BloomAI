import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SaveRequestBody, ApiErrorBody, Bouquet } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json<ApiErrorBody>(
      { error: "Sign in with Google to save bouquets to your gallery." },
      { status: 401 }
    );
  }

  let body: SaveRequestBody;
  try {
    body = (await request.json()) as SaveRequestBody;
  } catch {
    return NextResponse.json<ApiErrorBody>({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { imageUrl, prompt, flowers, mood, colorPalette } = body;

  if (!imageUrl || !prompt || !Array.isArray(flowers) || flowers.length === 0 || !mood || !colorPalette) {
    return NextResponse.json<ApiErrorBody>(
      { error: "Missing required bouquet details." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("bouquets")
    .insert({
      user_id: user.id,
      image_url: imageUrl,
      prompt,
      flowers,
      mood,
      color_palette: colorPalette,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json<ApiErrorBody>(
      { error: "We couldn't save this bouquet. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json<Bouquet>(data as Bouquet, { status: 201 });
}
