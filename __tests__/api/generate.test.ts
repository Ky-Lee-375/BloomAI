/**
 * @jest-environment node
 */
import { POST } from "@/app/api/generate/route";
import { generateBouquetImage, ReplicateError } from "@/lib/replicate";

jest.mock("@/lib/replicate", () => {
  const actual = jest.requireActual("@/lib/replicate");
  return {
    ...actual,
    generateBouquetImage: jest.fn(),
  };
});

const mockedGenerate = generateBouquetImage as jest.Mock;

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 400 when the request body is not valid JSON", async () => {
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: "{not json",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 when neither flowers nor a custom prompt are provided", async () => {
    const response = await POST(makeRequest({ flowers: [] }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/select at least one flower/i);
    expect(mockedGenerate).not.toHaveBeenCalled();
  });

  it("calls generateBouquetImage with a constructed prompt and returns the image URL", async () => {
    mockedGenerate.mockResolvedValueOnce("https://replicate.delivery/final.webp");

    const response = await POST(
      makeRequest({ flowers: ["Rose"], mood: "Romantic", colorPalette: "Pastel" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.imageUrl).toBe("https://replicate.delivery/final.webp");
    expect(body.prompt).toContain("rose");
    expect(mockedGenerate).toHaveBeenCalledWith(expect.stringContaining("rose"));
  });

  it("uses the custom prompt when provided", async () => {
    mockedGenerate.mockResolvedValueOnce("https://replicate.delivery/final.webp");

    await POST(makeRequest({ customPrompt: "A whimsical spring bouquet" }));

    expect(mockedGenerate).toHaveBeenCalledWith(
      expect.stringContaining("A whimsical spring bouquet")
    );
  });

  it("returns a 502 when Replicate generation fails unexpectedly", async () => {
    mockedGenerate.mockRejectedValueOnce(new ReplicateError("Prediction failed"));

    const response = await POST(makeRequest({ flowers: ["Rose"] }));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error).toBe("Prediction failed");
  });

  it("passes through the Replicate error status when it is a 4xx", async () => {
    mockedGenerate.mockRejectedValueOnce(new ReplicateError("Invalid token", 401));

    const response = await POST(makeRequest({ flowers: ["Rose"] }));
    expect(response.status).toBe(401);
  });

  it("returns a generic 500 for unexpected non-Replicate errors", async () => {
    mockedGenerate.mockRejectedValueOnce(new Error("boom"));

    const response = await POST(makeRequest({ flowers: ["Rose"] }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toMatch(/couldn't paint your bouquet/i);
  });
});
