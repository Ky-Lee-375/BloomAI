import { FLOWERS } from "@/lib/types";
import { SelectableCard } from "./SelectableCard";

interface FlowerStepProps {
  selected: string[];
  onToggle: (flower: string) => void;
}

export function FlowerStep({ selected, onToggle }: FlowerStepProps) {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Which flowers belong in your bouquet?</h2>
      <p className="mt-1 text-sm text-ink/60">Select as many as you like.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4" role="group" aria-label="Flower selection">
        {FLOWERS.map((flower) => (
          <SelectableCard
            key={flower}
            label={flower}
            selected={selected.includes(flower)}
            onSelect={() => onToggle(flower)}
          />
        ))}
      </div>
    </div>
  );
}
