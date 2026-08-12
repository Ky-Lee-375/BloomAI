import { COLOR_PALETTES } from "@/lib/types";
import { SelectableCard } from "./SelectableCard";

const PALETTE_SWATCHES: Record<string, string> = {
  Pastel: "#F1DEDA",
  Warm: "#D98B5F",
  Cool: "#7FA6A3",
  Monochrome: "#8C8578",
  Vibrant: "#C9457A",
  Neutral: "#CBBBA3",
};

interface ColorStepProps {
  selected: string;
  onSelect: (palette: string) => void;
}

export function ColorStep({ selected, onSelect }: ColorStepProps) {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Choose a color palette</h2>
      <p className="mt-1 text-sm text-ink/60">Choose one.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Color palette selection">
        {COLOR_PALETTES.map((palette) => (
          <SelectableCard
            key={palette}
            label={palette}
            swatch={PALETTE_SWATCHES[palette]}
            selected={selected === palette}
            onSelect={() => onSelect(palette)}
          />
        ))}
      </div>
    </div>
  );
}
