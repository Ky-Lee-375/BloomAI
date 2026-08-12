import { BloomMark } from "@/components/BloomMark";

const STEP_LABELS = ["Flowers", "Mood", "Palette"];

interface WizardNavProps {
  step: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isStepValid: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onGenerate: () => void;
}

export function WizardNav({
  step,
  isFirstStep,
  isLastStep,
  isStepValid,
  isSubmitting = false,
  onBack,
  onNext,
  onGenerate,
}: WizardNavProps) {
  return (
    <div>
      <ol className="flex items-center justify-center gap-6" aria-label="Wizard progress">
        {STEP_LABELS.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <BloomMark
              className={`h-6 w-6 ${index <= step ? "text-mauve-dark" : "text-ink/20"}`}
            />
            <span
              className={`font-mono text-xs uppercase tracking-[0.15em] ${
                index === step ? "text-ink" : "text-ink/40"
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep}
          className="rounded-full border border-ink/15 px-6 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-mauve-dark hover:text-mauve-dark disabled:cursor-not-allowed disabled:opacity-30"
        >
          Back
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={onGenerate}
            disabled={!isStepValid || isSubmitting}
            className="rounded-full bg-forest px-8 py-2.5 text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {isSubmitting ? "Painting your bouquet…" : "Generate bouquet"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!isStepValid}
            className="rounded-full bg-forest px-8 py-2.5 text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
