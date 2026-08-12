interface PromptFallbackProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Free-form description input that acts as an alternative to the guided
 * flower/mood/color steps. A non-empty value here short-circuits wizard
 * validation, so the user can generate directly from their own words.
 */
export function PromptFallback({ value, onChange }: PromptFallbackProps) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-ink/20 bg-white/30 p-6">
      <h3 className="font-display text-lg text-ink">Or describe it in your own words</h3>
      <p className="mt-1 text-sm text-ink/60">
        Writing a description here replaces the guided selections above.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Create a romantic bouquet with pink peonies and white roses."
        rows={3}
        aria-label="Custom bouquet description"
        className="mt-4 w-full resize-none rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-mauve-dark"
      />
    </div>
  );
}
