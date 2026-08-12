export const FLOWERS = [
  "Rose",
  "Peony",
  "Tulip",
  "Sunflower",
  "Hydrangea",
  "Daisy",
  "Lily",
  "Lavender",
] as const;

export const MOODS = [
  "Romantic",
  "Cheerful",
  "Elegant",
  "Calm",
  "Rustic",
  "Whimsical",
] as const;

export const COLOR_PALETTES = [
  "Pastel",
  "Warm",
  "Cool",
  "Monochrome",
  "Vibrant",
  "Neutral",
] as const;

export type Flower = (typeof FLOWERS)[number];
export type Mood = (typeof MOODS)[number];
export type ColorPalette = (typeof COLOR_PALETTES)[number];

/**
 * The full state tracked by the bouquet creation wizard.
 */
export interface WizardState {
  flowers: string[];
  mood: string;
  colorPalette: string;
  customPrompt?: string;
}

export const WIZARD_STEP_COUNT = 3;

export type WizardStep = 0 | 1 | 2;

/** Request body accepted by POST /api/generate */
export interface GenerateRequestBody {
  flowers?: string[];
  mood?: string;
  colorPalette?: string;
  customPrompt?: string;
}

/** Response returned by POST /api/generate on success */
export interface GenerateResponseBody {
  imageUrl: string;
  prompt: string;
}

/** Request body accepted by POST /api/save */
export interface SaveRequestBody {
  imageUrl: string;
  prompt: string;
  flowers: string[];
  mood: string;
  colorPalette: string;
}

/** A bouquet row as stored in / read from Supabase */
export interface Bouquet {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  flowers: string[];
  mood: string;
  color_palette: string;
  created_at: string;
}

/** Generic API error shape returned by our route handlers */
export interface ApiErrorBody {
  error: string;
}
