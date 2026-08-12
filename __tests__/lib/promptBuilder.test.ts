import { buildBouquetPrompt, isGenerateRequestValid, joinFlowers } from "@/lib/promptBuilder";

describe("joinFlowers", () => {
  it("returns a fallback phrase for an empty list", () => {
    expect(joinFlowers([])).toBe("an assortment of seasonal flowers");
  });

  it("lowercases a single flower", () => {
    expect(joinFlowers(["Rose"])).toBe("rose");
  });

  it("joins two flowers with 'and'", () => {
    expect(joinFlowers(["Rose", "Peony"])).toBe("rose and peony");
  });

  it("joins three or more flowers with an oxford comma", () => {
    expect(joinFlowers(["Rose", "Peony", "Tulip"])).toBe("rose, peony, and tulip");
  });

  it("ignores blank entries", () => {
    expect(joinFlowers(["Rose", "  ", "Tulip"])).toBe("rose and tulip");
  });
});

describe("buildBouquetPrompt", () => {
  it("builds a prompt from guided selections", () => {
    const prompt = buildBouquetPrompt({
      flowers: ["Rose", "Peony"],
      mood: "Romantic",
      colorPalette: "Pastel",
    });

    expect(prompt).toContain("rose and peony");
    expect(prompt).toContain("romantic mood");
    expect(prompt).toContain("pastel color palette");
    expect(prompt).toContain("watercolor painting");
  });

  it("prefers a custom prompt over guided selections when both are present", () => {
    const prompt = buildBouquetPrompt({
      flowers: ["Rose"],
      mood: "Calm",
      colorPalette: "Neutral",
      customPrompt: "A whimsical spring bouquet with pastel colors",
    });

    expect(prompt).toContain("A whimsical spring bouquet with pastel colors");
    expect(prompt).not.toContain("expressing a");
  });

  it("always appends the watercolor art-direction suffix", () => {
    const prompt = buildBouquetPrompt({ customPrompt: "Something wild" });
    expect(prompt).toContain("hand-painted watercolor texture");
  });

  it("falls back gracefully when mood or palette are missing", () => {
    const prompt = buildBouquetPrompt({ flowers: ["Daisy"] });
    expect(prompt).toContain("daisy");
    expect(prompt).toContain("graceful mood");
    expect(prompt).toContain("soft color palette");
  });
});

describe("isGenerateRequestValid", () => {
  it("is valid with at least one flower", () => {
    expect(isGenerateRequestValid({ flowers: ["Rose"] })).toBe(true);
  });

  it("is valid with only a custom prompt", () => {
    expect(isGenerateRequestValid({ customPrompt: "A lovely bouquet" })).toBe(true);
  });

  it("is invalid with no flowers and no custom prompt", () => {
    expect(isGenerateRequestValid({ flowers: [] })).toBe(false);
  });

  it("is invalid when custom prompt is only whitespace", () => {
    expect(isGenerateRequestValid({ customPrompt: "   " })).toBe(false);
  });

  it("is invalid for a completely empty request", () => {
    expect(isGenerateRequestValid({})).toBe(false);
  });
});
