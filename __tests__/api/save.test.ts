/**
 * @jest-environment node
 */
import { POST } from "@/app/api/save/route";
import { createClient } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

const mockedCreateClient = createClient as jest.Mock;

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockSupabase({
  user = null,
  insertResult = { data: null, error: null },
}: {
  user?: { id: string } | null;
  insertResult?: { data: unknown; error: unknown };
}) {
  const single = jest.fn().mockResolvedValue(insertResult);
  const select = jest.fn().mockReturnValue({ single });
  const insert = jest.fn().mockReturnValue({ select });
  const from = jest.fn().mockReturnValue({ insert });

  mockedCreateClient.mockReturnValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user }, error: user ? null : null }),
    },
    from,
  });

  return { from, insert };
}

const validBody = {
  imageUrl: "https://replicate.delivery/final.webp",
  prompt: "A romantic bouquet",
  flowers: ["Rose"],
  mood: "Romantic",
  colorPalette: "Pastel",
};

describe("POST /api/save", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 401 when there is no authenticated user", async () => {
    mockSupabase({ user: null });

    const response = await POST(makeRequest(validBody));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toMatch(/sign in/i);
  });

  it("returns 400 when the request body is not valid JSON", async () => {
    mockSupabase({ user: { id: "user-1" } });

    const request = new Request("http://localhost/api/save", { method: "POST", body: "{bad" });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 400 when required bouquet fields are missing", async () => {
    mockSupabase({ user: { id: "user-1" } });

    const response = await POST(makeRequest({ imageUrl: "https://x", prompt: "", flowers: [], mood: "", colorPalette: "" }));
    expect(response.status).toBe(400);
  });

  it("saves the bouquet and returns 201 for an authenticated user with a valid body", async () => {
    const savedRow = { id: "bouquet-1", user_id: "user-1", ...validBody };
    const { insert } = mockSupabase({
      user: { id: "user-1" },
      insertResult: { data: savedRow, error: null },
    });

    const response = await POST(makeRequest(validBody));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(savedRow);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-1", image_url: validBody.imageUrl })
    );
  });

  it("returns 500 when the database insert fails", async () => {
    mockSupabase({
      user: { id: "user-1" },
      insertResult: { data: null, error: { message: "db error" } },
    });

    const response = await POST(makeRequest(validBody));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toMatch(/couldn't save/i);
  });
});
