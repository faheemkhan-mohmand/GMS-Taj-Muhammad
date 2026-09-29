import { afterEach, describe, expect, it, vi } from "vitest";
import { createAdminCreateUserHandler } from "./admin-create-user.js";

function fakeResponse() {
  const response: any = {
    statusCode: 0,
    headers: {},
    body: null,
    setHeader(name: string, value: string) { this.headers[name.toLowerCase()] = value; },
    status(code: number) { this.statusCode = code; return this; },
    json(value: unknown) { this.body = value; return this; },
  };
  return response;
}

function fixture({ role = "admin", profileError = null as any, callerProfileError = null as any } = {}) {
  const targetProfiles = new Map<string, any>();
  const upserts: any[] = [];
  const deleteUser = vi.fn(async () => ({ error: null }));
  const createUser = vi.fn(async (input: any) => ({
    data: { user: { id: "new-admin-1", email: input.email } }, error: null,
  }));
  const callerQuery: any = {};
  callerQuery.select = vi.fn(() => callerQuery);
  callerQuery.eq = vi.fn(() => callerQuery);
  callerQuery.maybeSingle = vi.fn(async () => ({ data: { role }, error: callerProfileError }));
  const authClient: any = {
    auth: { getUser: vi.fn(async () => ({ data: { user: { id: "caller-1" } }, error: null })) },
    from: vi.fn(() => callerQuery),
  };
  const adminClient: any = {
    auth: { admin: { createUser, deleteUser } },
    from: vi.fn(() => {
      let selectedId = "";
      const query: any = {
        select: vi.fn(() => query),
        eq: vi.fn((_column: string, value: string) => { selectedId = value; return query; }),
        maybeSingle: vi.fn(async () => ({ data: targetProfiles.get(selectedId) || null, error: null })),
        upsert: vi.fn(async (row: any) => {
          upserts.push(row);
          if (profileError) return { error: profileError };
          targetProfiles.set(row.id, row);
          return { error: null };
        }),
      };
      return query;
    }),
  };
  const createClient = vi.fn((_url: string, key: string) => key === "anon-key" ? authClient : adminClient);
  const handler = createAdminCreateUserHandler({
    createClient,
    env: { SUPABASE_URL: "https://example.supabase.co", SUPABASE_ANON_KEY: "anon-key", SUPABASE_SERVICE_ROLE_KEY: "service-key" },
  });
  return { handler, createClient, authClient, adminClient, createUser, deleteUser, upserts, callerQuery };
}

function request(body: unknown, authorization = "Bearer test-token") {
  return { method: "POST", headers: { authorization }, body } as any;
}

afterEach(() => vi.restoreAllMocks());

describe("admin-create-user API", () => {
  it("rejects requests without a bearer session", async () => {
    const { handler, createClient } = fixture();
    const res = fakeResponse();
    await handler(request({ action: "create" }, ""), res);
    expect(res.statusCode).toBe(401);
    expect(createClient).not.toHaveBeenCalled();
  });

  it("refuses non-admin callers before creating accounts or using the service client", async () => {
    const { handler, createClient, createUser } = fixture({ role: "student" });
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "new@example.com", password: "secret1" }), res);
    expect(res.statusCode).toBe(403);
    expect(createUser).not.toHaveBeenCalled();
    expect(createClient).toHaveBeenCalledTimes(1);
  });

  it("creates the Auth account and upserts an approved admin profile before returning success", async () => {
    const { handler, createClient, createUser, upserts } = fixture();
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "NEW@example.com", password: "secret1", phone: "0300" }), res);
    expect(res.statusCode).toBe(201);
    expect(createClient.mock.calls[0][2]).toEqual(expect.objectContaining({
      global: { headers: { Authorization: "Bearer test-token" } },
    }));
    expect(createUser).toHaveBeenCalledWith(expect.objectContaining({
      email: "new@example.com", password: "secret1", email_confirm: true,
      user_metadata: { full_name: "New Admin" },
    }));
    expect(upserts).toEqual([expect.objectContaining({
      id: "new-admin-1", full_name: "New Admin", role: "admin", status: "approved", phone: "0300",
    })]);
    expect(res.body.user.role).toBe("admin");
  });

  it("reports a profile lookup failure without attempting privileged account changes", async () => {
    const { handler, createClient, createUser } = fixture({ callerProfileError: { message: "RLS/query error" } });
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "new@example.com", password: "secret1" }), res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Could not verify administrator permissions.");
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createUser).not.toHaveBeenCalled();
  });

  it("does not return success and deletes the new auth user if profile persistence fails", async () => {
    const { handler, deleteUser } = fixture({ profileError: { message: "RLS/schema failure" } });
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "new@example.com", password: "secret1" }), res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/could not be added to the admin list/i);
    expect(deleteUser).toHaveBeenCalledWith("new-admin-1");
  });

  it("blocks self-deletion and only deletes a different account with an admin profile", async () => {
    const { handler, deleteUser } = fixture();
    const selfRes = fakeResponse();
    await handler(request({ action: "delete", id: "caller-1" }), selfRes);
    expect(selfRes.statusCode).toBe(403);
    expect(deleteUser).not.toHaveBeenCalled();

    const targetRes = fakeResponse();
    await handler(request({ action: "delete", id: "other-admin" }), targetRes);
    expect(targetRes.statusCode).toBe(404);
    expect(deleteUser).not.toHaveBeenCalled();
  });
});
