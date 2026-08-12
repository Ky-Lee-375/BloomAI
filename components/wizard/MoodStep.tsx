import { MOODS } from "@/lib/types";
import { SelectableCard } from "./SelectableCard";

const MOOD_DESCRIPTIONS: Record<string, string> = {
  Romantic: "Soft, tender, and full of feeling",
  Cheerful: "Bright, playful, and full of light",
  Elegant: "Refined, composed, and timeless",
  Calm: "Quiet, gentle, and unhurried",
  Rustic: "Wild, textured, and earthy",
  Whimsical: "Fanciful, dreamy, and unexpected",
};

interface MoodStepProps {
  selected: string;
  onSelect: (mood: string) => void;
}

export function MoodStep({ selected, onSelect }: MoodStepProps) {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">What mood should it express?</h2>
      <p className="mt-1 text-sm text-ink/60">Choose one.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Mood selection">
        {MOODS.map((mood) => (
          <SelectableCard
            key={mood}
            label={mood}
            description={MOOD_DESCRIPTIONS[mood]}
            selected={selected === mood}
            onSelect={() => onSelect(mood)}
          />
        ))}
      </div>
    </div>
  );
}
