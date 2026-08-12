import type { GenerateRequestBody } from "./types";

const STYLE_SUFFIX =
  "Elegant botanical composition, soft natural lighting, detailed hand-painted watercolor texture, artist signature style, high detail, gallery quality.";

/**
 * Normalizes a list of flower names into natural-language text,
 * e.g. ["Rose", "Peony", "Tulip"] -> "roses, peonies, and tulips"
 */
export function joinFlowers(flowers: string[]): string {
  const cleaned = flowers.map((f) => f.trim()).filter(Boolean);
  if (cleaned.length === 0) return "an assortment of seasonal flowers";
  if (cleaned.length === 1) return cleaned[0].toLowerCase();
  if (cleaned.length === 2) {
    return `${cleaned[0].toLowerCase()} and ${cleaned[1].toLowerCase()}`;
  }
  const head = cleaned.slice(0, -1).map((f) => f.toLowerCase());
  const tail = cleaned[cleaned.length - 1].toLowerCase();
  return `${head.join(", ")}, and ${tail}`;
}

/**
 * Builds the final prompt string sent to the image generation model.
 *
 * If `customPrompt` is present and non-empty, it takes precedence and is
 * wrapped with the same watercolor art-direction suffix so free-form
 * descriptions still produce bouquets consistent with the rest of the app.
 * Otherwise, the prompt is composed from the guided wizard selections.
 */
export function buildBouquetPrompt(input: GenerateRequestBody): string {
  const customPrompt = input.customPrompt?.trim();

  if (customPrompt) {
    return `A beautiful watercolor painting of a flower bouquet. ${customPrompt}. ${STYLE_SUFFIX}`;
  }

  const flowers = joinFlowers(input.flowers ?? []);
  const mood = (input.mood || "graceful").toLowerCase();
  const colorPalette = (input.colorPalette || "soft").toLowerCase();

  return (
    `A beautiful watercolor painting of a flower bouquet featuring ${flowers}, ` +
    `expressing a ${mood} mood, using a ${colorPalette} color palette. ${STYLE_SUFFIX}`
  );
}

/**
 * Validates that a generate request has enough information to build a
 * meaningful prompt: either a custom prompt, or at least one flower.
 */
export function isGenerateRequestValid(input: GenerateRequestBody): boolean {
  const hasCustomPrompt = Boolean(input.customPrompt?.trim());
  const hasFlowers = Array.isArray(input.flowers) && input.flowers.length > 0;
  return hasCustomPrompt || hasFlowers;
}
