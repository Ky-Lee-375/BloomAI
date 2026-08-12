"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { AuthButton } from "@/components/AuthButton";
import { BouquetResult } from "@/components/BouquetResult";
import { FlowerStep } from "@/components/wizard/FlowerStep";
import { MoodStep } from "@/components/wizard/MoodStep";
import { ColorStep } from "@/components/wizard/ColorStep";
import { PromptFallback } from "@/components/wizard/PromptFallback";
import { WizardNav } from "@/components/wizard/WizardNav";
import { useWizard } from "@/hooks/useWizard";
import { createClient } from "@/lib/supabase/client";
import type { GenerateResponseBody } from "@/lib/types";

export default function CreatePage() {
  const wizard = useWizard();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponseBody | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(Boolean(data.user));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleGenerate() {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wizard.state),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body?.error || "Something went wrong while painting your bouquet.");
      }

      setResult(body as GenerateResponseBody);
      setIsSaved(false);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Unable to generate bouquet.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          prompt: result.prompt,
          flowers: wizard.state.flowers,
          mood: wizard.state.mood,
          colorPalette: wizard.state.colorPalette,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || "Unable to save this bouquet.");
      }

      setIsSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unable to save this bouquet.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleStartOver() {
    setResult(null);
    setIsSaved(false);
    setSaveError(null);
    setGenerateError(null);
    wizard.reset();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader activePath="/create" />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-display text-3xl text-ink">Create your bouquet</h1>
          <AuthButton isAuthenticated={isAuthenticated} />
        </div>

        {result ? (
          <BouquetResult
            imageUrl={result.imageUrl}
            prompt={result.prompt}
            onSave={handleSave}
            onStartOver={handleStartOver}
            isSaving={isSaving}
            isSaved={isSaved}
            isAuthenticated={isAuthenticated}
            saveError={saveError}
          />
        ) : (
          <>
            {wizard.step === 0 && (
              <FlowerStep selected={wizard.state.flowers} onToggle={wizard.toggleFlower} />
            )}
            {wizard.step === 1 && (
              <MoodStep selected={wizard.state.mood} onSelect={wizard.setMood} />
            )}
            {wizard.step === 2 && (
              <ColorStep selected={wizard.state.colorPalette} onSelect={wizard.setColorPalette} />
            )}

            <PromptFallback value={wizard.state.customPrompt ?? ""} onChange={wizard.setCustomPrompt} />

            {generateError && (
              <p className="mt-6 text-center text-sm text-mauve-dark">{generateError}</p>
            )}

            <div className="mt-10">
              <WizardNav
                step={wizard.step}
                isFirstStep={wizard.isFirstStep}
                isLastStep={wizard.isLastStep}
                isStepValid={wizard.isStepValid}
                isSubmitting={isGenerating}
                onBack={wizard.back}
                onNext={wizard.next}
                onGenerate={handleGenerate}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
