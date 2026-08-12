interface SelectableCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  swatch?: string;
}

/**
 * A reusable, keyboard-accessible selectable card used for flowers, moods,
 * and color palettes. `swatch` (a CSS color) renders a small color chip,
 * used by the palette step.
 */
export function SelectableCard({
  label,
  description,
  selected,
  onSelect,
  swatch,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
        selected
          ? "border-mauve-dark bg-blush/60 shadow-card"
          : "border-ink/10 bg-white/40 hover:border-mauve/60 hover:bg-blush/20"
      }`}
    >
      {swatch && (
        <span
          className="h-8 w-8 rounded-full border border-ink/10"
          style={{ backgroundColor: swatch }}
          aria-hidden="true"
        />
      )}
      <span className="font-display text-lg text-ink">{label}</span>
      {description && <span className="text-sm text-ink/60">{description}</span>}
      <span
        className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
          selected ? "border-mauve-dark bg-mauve-dark text-paper" : "border-ink/20 text-transparent"
        }`}
        aria-hidden="true"
      >
        ✓
      </span>
    </button>
  );
}
