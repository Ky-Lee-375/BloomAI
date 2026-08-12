"use client";

import { useCallback, useMemo, useState } from "react";
import { WIZARD_STEP_COUNT, type WizardState, type WizardStep } from "@/lib/types";

const INITIAL_STATE: WizardState = {
  flowers: [],
  mood: "",
  colorPalette: "",
  customPrompt: "",
};

export interface UseWizardResult {
  step: WizardStep;
  state: WizardState;
  isFirstStep: boolean;
  isLastStep: boolean;
  isStepValid: boolean;
  isComplete: boolean;
  toggleFlower: (flower: string) => void;
  setMood: (mood: string) => void;
  setColorPalette: (palette: string) => void;
  setCustomPrompt: (prompt: string) => void;
  next: () => void;
  back: () => void;
  goToStep: (step: WizardStep) => void;
  reset: () => void;
}

/**
 * Drives the 3-step bouquet wizard (flowers -> mood -> color palette).
 * A non-empty `customPrompt` is treated as an alternative path that
 * satisfies validation on every step, since it fully describes the bouquet
 * on its own.
 */
export function useWizard(): UseWizardResult {
  const [step, setStep] = useState<WizardStep>(0);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);

  const hasCustomPrompt = Boolean(state.customPrompt?.trim());

  const toggleFlower = useCallback((flower: string) => {
    setState((prev) => {
      const alreadySelected = prev.flowers.includes(flower);
      return {
        ...prev,
        flowers: alreadySelected
          ? prev.flowers.filter((f) => f !== flower)
          : [...prev.flowers, flower],
      };
    });
  }, []);

  const setMood = useCallback((mood: string) => {
    setState((prev) => ({ ...prev, mood }));
  }, []);

  const setColorPalette = useCallback((colorPalette: string) => {
    setState((prev) => ({ ...prev, colorPalette }));
  }, []);

  const setCustomPrompt = useCallback((customPrompt: string) => {
    setState((prev) => ({ ...prev, customPrompt }));
  }, []);

  const isStepValid = useMemo(() => {
    if (hasCustomPrompt) return true;
    if (step === 0) return state.flowers.length > 0;
    if (step === 1) return state.mood.length > 0;
    if (step === 2) return state.colorPalette.length > 0;
    return false;
  }, [hasCustomPrompt, state, step]);

  const isComplete = useMemo(() => {
    if (hasCustomPrompt) return true;
    return state.flowers.length > 0 && state.mood.length > 0 && state.colorPalette.length > 0;
  }, [hasCustomPrompt, state]);

  const next = useCallback(() => {
    setStep((prev) => {
      if (!isStepValid) return prev;
      const nextStep = prev + 1;
      return nextStep > WIZARD_STEP_COUNT - 1 ? prev : (nextStep as WizardStep);
    });
  }, [isStepValid]);

  const back = useCallback(() => {
    setStep((prev) => (prev - 1 < 0 ? prev : ((prev - 1) as WizardStep)));
  }, []);

  const goToStep = useCallback((target: WizardStep) => {
    setStep(target);
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setStep(0);
  }, []);

  return {
    step,
    state,
    isFirstStep: step === 0,
    isLastStep: step === WIZARD_STEP_COUNT - 1,
    isStepValid,
    isComplete,
    toggleFlower,
    setMood,
    setColorPalette,
    setCustomPrompt,
    next,
    back,
    goToStep,
    reset,
  };
}
