/**
 * @jest-environment node
 */
import { DELETE } from "@/app/api/bouquets/[id]/route";
import { createClient } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

const mockedCreateClient = createClient as jest.Mock;

function mockSupabase({
  user = null,
  deleteResult = { error: null, count: 1 },
}: {
  user?: { id: string } | null;
  deleteResult?: { error: unknown; count: number | null };
}) {
  const secondEq = jest.fn().mockResolvedValue(deleteResult);
  const firstEq = jest.fn().mockReturnValue({ eq: secondEq });
  const del = jest.fn().mockReturnValue({ eq: firstEq });
  const from = jest.fn().mockReturnValue({ delete: del });

  mockedCreateClient.mockReturnValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user }, error: null }),
    },
    from,
  });

  return { del, firstEq, secondEq };
}

function makeRequest() {
  return new Request("http://localhost/api/bouquets/bouquet-1", { method: "DELETE" });
}

describe("DELETE /api/bouquets/[id]", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 401 when there is no authenticated user", async () => {
    mockSupabase({ user: null });

    const response = await DELETE(makeRequest(), { params: { id: "bouquet-1" } });
    expect(response.status).toBe(401);
  });

  it("returns 400 when no id is provided", async () => {
    mockSupabase({ user: { id: "user-1" } });

    const response = await DELETE(makeRequest(), { params: { id: "" } });
    expect(response.status).toBe(400);
  });

  it("deletes the bouquet scoped to the current user and returns success", async () => {
    const { firstEq, secondEq } = mockSupabase({
      user: { id: "user-1" },
      deleteResult: { error: null, count: 1 },
    });

    const response = await DELETE(makeRequest(), { params: { id: "bouquet-1" } });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(firstEq).toHaveBeenCalledWith("id", "bouquet-1");
    expect(secondEq).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("returns 404 when no matching row was deleted", async () => {
    mockSupabase({
      user: { id: "user-1" },
      deleteResult: { error: null, count: 0 },
    });

    const response = await DELETE(makeRequest(), { params: { id: "someone-elses-bouquet" } });
    expect(response.status).toBe(404);
  });

  it("returns 500 when the database delete fails", async () => {
    mockSupabase({
      user: { id: "user-1" },
      deleteResult: { error: { message: "db error" }, count: null },
    });

    const response = await DELETE(makeRequest(), { params: { id: "bouquet-1" } });
    expect(response.status).toBe(500);
  });
});
