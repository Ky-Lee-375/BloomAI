import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiErrorBody } from "@/lib/types";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json<ApiErrorBody>({ error: "You must be signed in to delete a bouquet." }, { status: 401 });
  }

  if (!params.id) {
    return NextResponse.json<ApiErrorBody>({ error: "A bouquet id is required." }, { status: 400 });
  }

  // RLS also enforces this, but scoping by user_id here keeps intent explicit
  // and gives us a clean "not found" instead of a silent no-op.
  const { error, count } = await supabase
    .from("bouquets")
    .delete({ count: "exact" })
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json<ApiErrorBody>({ error: "We couldn't delete this bouquet." }, { status: 500 });
  }

  if (!count) {
    return NextResponse.json<ApiErrorBody>({ error: "Bouquet not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
