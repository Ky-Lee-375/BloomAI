"use client";

import Image from "next/image";

interface BouquetResultProps {
  imageUrl: string;
  prompt: string;
  onSave: () => void;
  onStartOver: () => void;
  isSaving: boolean;
  isSaved: boolean;
  isAuthenticated: boolean;
  saveError?: string | null;
}

export function BouquetResult({
  imageUrl,
  prompt,
  onSave,
  onStartOver,
  isSaving,
  isSaved,
  isAuthenticated,
  saveError,
}: BouquetResultProps) {
  return (
    <div className="mx-auto max-w-2xl animate-bloom text-center">
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt={prompt}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-lg text-sm italic text-ink/60">&ldquo;{prompt}&rdquo;</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || isSaved}
          className="rounded-full bg-mauve-dark px-8 py-3 text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSaved ? "Saved to gallery" : isSaving ? "Saving…" : "Save to gallery"}
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-full border border-ink/15 px-8 py-3 text-sm font-medium text-ink/70 transition-colors hover:border-mauve-dark hover:text-mauve-dark"
        >
          Create another
        </button>
      </div>

      {!isAuthenticated && !isSaved && (
        <p className="mt-4 text-xs text-ink/50">
          Sign in with Google to save this bouquet to your personal gallery.
        </p>
      )}
      {saveError && <p className="mt-4 text-xs text-mauve-dark">{saveError}</p>}
    </div>
  );
}
