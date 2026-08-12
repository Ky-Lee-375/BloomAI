import { act, renderHook } from "@testing-library/react";
import { useWizard } from "@/hooks/useWizard";

describe("useWizard", () => {
  it("initializes with empty state on step 0", () => {
    const { result } = renderHook(() => useWizard());

    expect(result.current.step).toBe(0);
    expect(result.current.state).toEqual({
      flowers: [],
      mood: "",
      colorPalette: "",
      customPrompt: "",
    });
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
  });

  it("selects a single flower", () => {
    const { result } = renderHook(() => useWizard());

    act(() => result.current.toggleFlower("Rose"));

    expect(result.current.state.flowers).toEqual(["Rose"]);
  });

  it("selects multiple flowers", () => {
    const { result } = renderHook(() => useWizard());

    act(() => {
      result.current.toggleFlower("Rose");
      result.current.toggleFlower("Peony");
      result.current.toggleFlower("Tulip");
    });

    expect(result.current.state.flowers).toEqual(["Rose", "Peony", "Tulip"]);
  });

  it("deselects a flower when toggled again", () => {
    const { result } = renderHook(() => useWizard());

    act(() => result.current.toggleFlower("Rose"));
    act(() => result.current.toggleFlower("Rose"));

    expect(result.current.state.flowers).toEqual([]);
  });

  it("sets the mood", () => {
    const { result } = renderHook(() => useWizard());

    act(() => result.current.setMood("Romantic"));

    expect(result.current.state.mood).toBe("Romantic");
  });

  it("sets the color palette", () => {
    const { result } = renderHook(() => useWizard());

    act(() => result.current.setColorPalette("Pastel"));

    expect(result.current.state.colorPalette).toBe("Pastel");
  });

  it("is not valid on step 0 with no flowers selected", () => {
    const { result } = renderHook(() => useWizard());
    expect(result.current.isStepValid).toBe(false);
  });

  it("becomes valid on step 0 once a flower is selected", () => {
    const { result } = renderHook(() => useWizard());
    act(() => result.current.toggleFlower("Rose"));
    expect(result.current.isStepValid).toBe(true);
  });

  it("does not advance past a step when validation fails", () => {
    const { result } = renderHook(() => useWizard());
    act(() => result.current.next());
    expect(result.current.step).toBe(0);
  });

  it("advances to the next step once validation passes", () => {
    const { result } = renderHook(() => useWizard());
    act(() => result.current.toggleFlower("Rose"));
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
  });

  it("does not advance past the final step", () => {
    const { result } = renderHook(() => useWizard());
    act(() => {
      result.current.toggleFlower("Rose");
      result.current.next();
      result.current.setMood("Calm");
      result.current.next();
      result.current.setColorPalette("Pastel");
      result.current.next();
    });
    expect(result.current.step).toBe(2);
    expect(result.current.isLastStep).toBe(true);
  });

  it("navigates back a step", () => {
    const { result } = renderHook(() => useWizard());
    act(() => {
      result.current.toggleFlower("Rose");
      result.current.next();
    });
    act(() => result.current.back());
    expect(result.current.step).toBe(0);
  });

  it("does not go back before the first step", () => {
    const { result } = renderHook(() => useWizard());
    act(() => result.current.back());
    expect(result.current.step).toBe(0);
  });

  it("is complete once flowers, mood, and palette are all set", () => {
    const { result } = renderHook(() => useWizard());
    act(() => {
      result.current.toggleFlower("Rose");
      result.current.setMood("Calm");
      result.current.setColorPalette("Pastel");
    });
    expect(result.current.isComplete).toBe(true);
  });

  it("is not complete when any guided field is missing", () => {
    const { result } = renderHook(() => useWizard());
    act(() => {
      result.current.toggleFlower("Rose");
      result.current.setMood("Calm");
    });
    expect(result.current.isComplete).toBe(false);
  });

  it("treats a non-empty custom prompt as satisfying validation on any step", () => {
    const { result } = renderHook(() => useWizard());
    act(() => result.current.setCustomPrompt("A whimsical spring bouquet"));
    expect(result.current.isStepValid).toBe(true);
    expect(result.current.isComplete).toBe(true);
  });

  it("resets state and step back to the beginning", () => {
    const { result } = renderHook(() => useWizard());
    act(() => {
      result.current.toggleFlower("Rose");
      result.current.setMood("Calm");
      result.current.next();
    });
    act(() => result.current.reset());

    expect(result.current.step).toBe(0);
    expect(result.current.state.flowers).toEqual([]);
    expect(result.current.state.mood).toBe("");
  });

  it("allows jumping directly to a given step", () => {
    const { result } = renderHook(() => useWizard());
    act(() => result.current.goToStep(2));
    expect(result.current.step).toBe(2);
  });
});
