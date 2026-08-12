/**
 * @jest-environment node
 */
import { generateBouquetImage, ReplicateError } from "@/lib/replicate";

const ORIGINAL_ENV = process.env;

describe("generateBouquetImage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...ORIGINAL_ENV, REPLICATE_API_TOKEN: "test-token" };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws when REPLICATE_API_TOKEN is missing", async () => {
    process.env.REPLICATE_API_TOKEN = "";
    await expect(generateBouquetImage("a bouquet")).rejects.toThrow(ReplicateError);
  });

  it("returns the image URL on an immediate success", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "abc",
        status: "succeeded",
        output: ["https://replicate.delivery/abc.webp"],
      }),
    }) as unknown as typeof fetch;

    const url = await generateBouquetImage("a bouquet");
    expect(url).toBe("https://replicate.delivery/abc.webp");
  });

  it("polls until the prediction succeeds", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "abc",
          status: "processing",
          urls: { get: "https://api.replicate.com/v1/predictions/abc" },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "abc",
          status: "succeeded",
          output: ["https://replicate.delivery/final.webp"],
        }),
      }) as unknown as typeof fetch;

    const url = await generateBouquetImage("a bouquet");
    expect(url).toBe("https://replicate.delivery/final.webp");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("throws a ReplicateError when the prediction fails", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "abc",
        status: "failed",
        error: "NSFW content detected",
      }),
    }) as unknown as typeof fetch;

    await expect(generateBouquetImage("a bouquet")).rejects.toThrow("NSFW content detected");
  });

  it("throws a ReplicateError when the initial request is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Invalid token" }),
    }) as unknown as typeof fetch;

    await expect(generateBouquetImage("a bouquet")).rejects.toThrow(/Invalid token/);
  });

  it("throws when the response contains no output", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "abc", status: "succeeded", output: null }),
    }) as unknown as typeof fetch;

    await expect(generateBouquetImage("a bouquet")).rejects.toThrow("did not return an image");
  });
});
