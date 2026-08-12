/**
 * Thin wrapper around the Replicate HTTP API for generating an image with a
 * fast FLUX model. Kept separate from the API route so the route stays
 * focused on request handling and this module stays focused on the
 * third-party integration (and is easy to mock in tests).
 */

const REPLICATE_MODEL = "black-forest-labs/flux-schnell";
const REPLICATE_API_URL = `https://api.replicate.com/v1/models/${REPLICATE_MODEL}/predictions`;

export class ReplicateError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ReplicateError";
    this.status = status;
  }
}

interface ReplicatePredictionResponse {
  id: string;
  status: string;
  output?: string[] | string | null;
  error?: string | null;
  urls?: { get?: string; cancel?: string };
}

/**
 * Generates an image from a text prompt using Replicate's hosted FLUX
 * Schnell model and returns a public URL to the resulting image.
 */
export async function generateBouquetImage(prompt: string): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new ReplicateError("REPLICATE_API_TOKEN is not configured on the server.");
  }

  const createResponse = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: "1:1",
        output_format: "webp",
        num_outputs: 1,
      },
    }),
  });

  if (!createResponse.ok) {
    const detail = await safeReadError(createResponse);
    throw new ReplicateError(
      `Replicate request failed: ${detail}`,
      createResponse.status
    );
  }

  const prediction = (await createResponse.json()) as ReplicatePredictionResponse;

  const resolved = await pollUntilComplete(prediction, token);

  const imageUrl = extractImageUrl(resolved);
  if (!imageUrl) {
    throw new ReplicateError("Replicate did not return an image.");
  }

  return imageUrl;
}

async function pollUntilComplete(
  prediction: ReplicatePredictionResponse,
  token: string,
  maxAttempts = 30,
  delayMs = 1000
): Promise<ReplicatePredictionResponse> {
  let current = prediction;
  let attempts = 0;

  while (current.status !== "succeeded" && current.status !== "failed" && current.status !== "canceled") {
    if (attempts >= maxAttempts) {
      throw new ReplicateError("Timed out waiting for image generation to complete.");
    }
    if (!current.urls?.get) {
      throw new ReplicateError("Replicate prediction is missing a status URL.");
    }

    await sleep(delayMs);

    const pollResponse = await fetch(current.urls.get, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!pollResponse.ok) {
      const detail = await safeReadError(pollResponse);
      throw new ReplicateError(`Failed while polling Replicate: ${detail}`, pollResponse.status);
    }

    current = (await pollResponse.json()) as ReplicatePredictionResponse;
    attempts += 1;
  }

  if (current.status === "failed" || current.status === "canceled") {
    throw new ReplicateError(current.error || `Image generation ${current.status}.`);
  }

  return current;
}

function extractImageUrl(prediction: ReplicatePredictionResponse): string | null {
  const { output } = prediction;
  if (!output) return null;
  if (Array.isArray(output)) return output[0] ?? null;
  if (typeof output === "string") return output;
  return null;
}

async function safeReadError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body?.detail || body?.error || response.statusText;
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
