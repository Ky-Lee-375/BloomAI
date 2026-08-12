import { NextResponse } from "next/server";
import { buildBouquetPrompt, isGenerateRequestValid } from "@/lib/promptBuilder";
import { generateBouquetImage, ReplicateError } from "@/lib/replicate";
import type { GenerateRequestBody, GenerateResponseBody, ApiErrorBody } from "@/lib/types";

export async function POST(request: Request) {
  let body: GenerateRequestBody;

  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json<ApiErrorBody>({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isGenerateRequestValid(body)) {
    return NextResponse.json<ApiErrorBody>(
      { error: "Select at least one flower, or describe the bouquet you want." },
      { status: 400 }
    );
  }

  const prompt = buildBouquetPrompt(body);

  try {
    const imageUrl = await generateBouquetImage(prompt);
    return NextResponse.json<GenerateResponseBody>({ imageUrl, prompt });
  } catch (err) {
    if (err instanceof ReplicateError) {
      return NextResponse.json<ApiErrorBody>(
        { error: err.message },
        { status: err.status && err.status >= 400 && err.status < 500 ? err.status : 502 }
      );
    }
    return NextResponse.json<ApiErrorBody>(
      { error: "We couldn't paint your bouquet right now. Please try again." },
      { status: 500 }
    );
  }
}
