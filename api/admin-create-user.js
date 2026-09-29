import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const AUTH_OPTIONS = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};

function send(res, status, payload) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(payload);
}

function parseBody(body) {
  if (body && typeof body === "object" && !Buffer.isBuffer(body)) return body;
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Factory is exported so the endpoint's authorization, persistence, and
 * rollback behavior can be tested without a live Supabase project.
 */
export function createAdminCreateUserHandler({ createClient = createSupabaseClient, env = process.env } = {}) {
  return async function adminCreateUserHandler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return send(res, 405, { error: "Method not allowed." });
    }

    const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
    const anonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return send(res, 503, { error: "Admin user management is not configured on the server." });
    }

    const authHeader = String(req.headers?.authorization || "");
    const bearer = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!bearer) return send(res, 401, { error: "Sign in as an administrator to continue." });

    const body = parseBody(req.body);
    if (!body) return send(res, 400, { error: "A valid JSON request body is required." });

    try {
      const authClient = createClient(supabaseUrl, anonKey, {
        ...AUTH_OPTIONS,
        global: { headers: { Authorization: `Bearer ${bearer[1]}` } },
      });
      const { data: authData, error: authError } = await authClient.auth.getUser(bearer[1]);
      if (authError || !authData?.user) {
        return send(res, 401, { error: "Your session is invalid or expired. Please sign in again." });
      }

      // Check the caller's role under their own authenticated JWT. This matches
      // the profile access the signed-in admin UI already uses and avoids using
      // the privileged key for a read that should be governed by caller RLS.
      const { data: callerProfile, error: callerProfileError } = await authClient
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();
      if (callerProfileError) {
        console.error("admin-create-user: caller profile lookup failed:", callerProfileError.message);
        return send(res, 500, { error: "Could not verify administrator permissions." });
      }
      if (callerProfile?.role !== "admin") {
        return send(res, 403, { error: "Only an administrator can manage admin accounts." });
      }

      // Keep the server-only service key exclusively for privileged Auth and
      // profile mutations, after the caller's role has been verified.
      const adminClient = createClient(supabaseUrl, serviceRoleKey, AUTH_OPTIONS);

      if (body.action === "create") {
        const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const phone = typeof body.phone === "string" ? body.phone.trim() : "";
        if (!fullName || !email || !password) {
          return send(res, 400, { error: "Name, email, and password are required." });
        }
        if (password.length < 6) {
          return send(res, 400, { error: "Password must be at least 6 characters." });
        }

        const { data: created, error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName },
        });
        if (createError || !created?.user?.id) {
          const message = createError?.message || "Supabase did not return the new account.";
          const status = /already|registered|invalid email|password/i.test(message) ? 400 : 502;
          return send(res, status, { error: message });
        }

        const profile = {
          id: created.user.id,
          full_name: fullName,
          role: "admin",
          status: "approved",
          ...(phone ? { phone } : {}),
        };
        const { error: profileError } = await adminClient
          .from("profiles")
          .upsert(profile, { onConflict: "id" });

        if (profileError) {
          console.error("admin-create-user: profile persistence failed:", profileError.message);
          const { error: rollbackError } = await adminClient.auth.admin.deleteUser(created.user.id);
          if (rollbackError) {
            console.error("admin-create-user: account rollback failed:", rollbackError.message);
          }
          return send(res, 500, {
            error: "The login could not be added to the admin list. No success was reported; please retry or contact the site owner.",
          });
        }

        return send(res, 201, {
          user: { id: created.user.id, email: created.user.email, full_name: fullName, role: "admin" },
        });
      }

      if (body.action === "delete") {
        const id = typeof body.id === "string" ? body.id.trim() : "";
        if (!id) return send(res, 400, { error: "An admin account ID is required." });
        if (id === authData.user.id) return send(res, 403, { error: "You cannot delete your own admin account." });

        const { data: targetProfile, error: targetProfileError } = await adminClient
          .from("profiles")
          .select("role")
          .eq("id", id)
          .maybeSingle();
        if (targetProfileError) {
          console.error("admin-create-user: target profile lookup failed:", targetProfileError.message);
          return send(res, 500, { error: "Could not verify the selected account." });
        }
        if (targetProfile?.role !== "admin") {
          return send(res, 404, { error: "Admin account not found." });
        }

        const { error: deleteError } = await adminClient.auth.admin.deleteUser(id);
        if (deleteError) {
          console.error("admin-create-user: account deletion failed:", deleteError.message);
          return send(res, 502, { error: "Supabase could not delete this admin account." });
        }
        return send(res, 200, { ok: true });
      }

      return send(res, 400, { error: "Unsupported action. Use create or delete." });
    } catch (error) {
      console.error("admin-create-user: unexpected error:", error?.message || error);
      return send(res, 500, { error: "Unexpected server error while managing the admin account." });
    }
  };
}

export default createAdminCreateUserHandler();
