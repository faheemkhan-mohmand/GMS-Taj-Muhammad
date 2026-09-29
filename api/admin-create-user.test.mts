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

function fixture({ role = "admin", profileError = null as any, callerProfileError = null as any, serviceKey = "service-key", serviceKeyEnv = "SUPABASE_SERVICE_ROLE_KEY", createError = null as any, existingUsers = [] as any[], initialProfiles = [] as any[] } = {}) {
  const targetProfiles = new Map<string, any>();
  for (const profile of initialProfiles) targetProfiles.set(profile.id, profile);
  const upserts: any[] = [];
  const deleteUser = vi.fn(async () => ({ error: null }));
  const createUser = vi.fn(async (input: any) => createError
    ? { data: { user: null }, error: createError }
    : { data: { user: { id: "new-admin-1", email: input.email } }, error: null });
  const listUsers = vi.fn(async ({ page = 1, perPage = 1000 }: any = {}) => ({
    data: { users: existingUsers.slice((page - 1) * perPage, page * perPage) }, error: null,
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
    auth: { admin: { createUser, deleteUser, listUsers } },
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
    env: { SUPABASE_URL: "https://example.supabase.co", SUPABASE_ANON_KEY: "anon-key", [serviceKeyEnv]: serviceKey },
  });
  return { handler, createClient, authClient, adminClient, createUser, deleteUser, listUsers, upserts, callerQuery };
}

function request(body: unknown, authorization = "Bearer test-token") {
  return { method: "POST", headers: { authorization }, body } as any;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

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

  it("repairs a missing profile when an admin retries an existing Auth email", async () => {
    const existingUser = { id: "orphan-1", email: "new@example.com" };
    const { handler, listUsers, upserts } = fixture({
      createError: { message: "A user with this email address has already been registered" },
      existingUsers: [existingUser],
    });
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "NEW@example.com", password: "secret1" }), res);
    expect(res.statusCode).toBe(200);
    expect(listUsers).toHaveBeenCalledWith({ page: 1, perPage: 1000 });
    expect(upserts).toEqual([expect.objectContaining({
      id: "orphan-1", full_name: "New Admin", role: "admin", status: "approved",
    })]);
    expect(res.body.recovered_profile).toBe(true);
  });

  it("treats an already-admin Auth account as success without changing it", async () => {
    const existingUser = { id: "existing-admin", email: "new@example.com" };
    const { handler, upserts } = fixture({
      createError: { message: "A user with this email address has already been registered" },
      existingUsers: [existingUser],
      initialProfiles: [{ id: "existing-admin", role: "admin", full_name: "Existing Admin" }],
    });
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "new@example.com", password: "secret1" }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.already_admin).toBe(true);
    expect(upserts).toHaveLength(0);
  });

  it("refuses to promote an existing non-admin profile after a duplicate email", async () => {
    const existingUser = { id: "existing-student", email: "new@example.com" };
    const { handler, upserts } = fixture({
      createError: { message: "A user with this email address has already been registered" },
      existingUsers: [existingUser],
      initialProfiles: [{ id: "existing-student", role: "student", full_name: "Existing Student" }],
    });
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "new@example.com", password: "secret1" }), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/non-admin account/i);
    expect(upserts).toHaveLength(0);
  });

  it("sends modern Supabase secret keys via apikey only, not as a Bearer JWT", async () => {
    const { handler, createClient } = fixture({ serviceKey: "sb_secret_example", serviceKeyEnv: "SUPABASE_SECRET_KEY" });
    const res = fakeResponse();
    await handler(request({ action: "create", full_name: "New Admin", email: "new@example.com", password: "secret1" }), res);
    expect(res.statusCode).toBe(201);

    const serviceOptions = createClient.mock.calls[1][2];
    expect(serviceOptions.global.fetch).toBeTypeOf("function");
    const upstreamFetch = vi.fn(async (_input: any, _init: any) => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", upstreamFetch);
    await serviceOptions.global.fetch("https://example.supabase.co/auth/v1/admin/users", {
      method: "POST",
      headers: { apikey: "sb_secret_example", Authorization: "Bearer sb_secret_example" },
    });

    const forwardedHeaders = new Headers(upstreamFetch.mock.calls[0][1].headers);
    expect(forwardedHeaders.get("apikey")).toBe("sb_secret_example");
    expect(forwardedHeaders.get("Authorization")).toBeNull();
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
