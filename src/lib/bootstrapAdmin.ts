/**
 * ────────────────────────────────────────────────────────────────────────────
 *  Bootstrap Administrator Bypass
 * ────────────────────────────────────────────────────────────────────────────
 *  This file is the SINGLE SOURCE OF TRUTH for the bootstrap-admin email
 *  bypass. It is the ONLY place in the entire codebase where the bypass
 *  email is hard-coded.
 *
 *  RULE
 *  ────
 *  The account with the email {@link BOOTSTRAP_ADMIN_EMAIL} can ALWAYS sign
 *  in to the website, EVEN IF its `profiles.status` is still `"pending"`
 *  (or `"rejected"`). All other accounts must follow the normal admin
 *  approval workflow exactly as before.
 *
 *  SCOPE
 *  ─────
 *  This bypass is evaluated against `auth.users.email` (the email the user
 *  typed at sign-in / the email returned by the OAuth provider). It is
 *  intentionally NOT evaluated against `profiles.email`, because that
 *  column may be null or out of sync with `auth.users.email`.
 *
 *  USAGE
 *  ─────
 *  Anywhere the code checks `profile.status === "pending"` or
 *  `profile.status === "rejected"` to block a sign-in, wrap the check with
 *  {@link isBootstrapAdmin} so the bypass email is let through:
 *
 *      if (!isBootstrapAdmin(userEmail) && profile.status === "pending") {
 *        // ...block the user...
 *      }
 *
 *  Do NOT use this helper for anything other than the sign-in / route-guard
 *  approval gates. It is NOT a role escalation — the bootstrap admin still
 *  needs `profiles.role === "admin"` (set manually in the Supabase dashboard
 *  on first run) to actually access admin-only features.
 *
 *  SECURITY NOTES
 *  ──────────────
 *  • The bypass is a string comparison on a single hard-coded email.
 *    Comparison is CASE-INSENSITIVE and TRIMMED to be resilient to typos
 *    in the OAuth provider's returned casing.
 *  • No environment variable, no DB lookup, no remote config — the bypass
 *    is baked into the bundle so it survives redeployments.
 *  • Only ONE email is hard-coded. Adding more would defeat the purpose
 *    of the bootstrap-admin pattern.
 * ────────────────────────────────────────────────────────────────────────────
 */

/**
 * The single email address that is allowed to bypass the admin-approval
 * gate. Change this value (and only this value) if the bootstrap admin
 * changes.
 */
export const BOOTSTRAP_ADMIN_EMAIL = "nadeemk.mohmand@gmail.com";

/**
 * Returns `true` iff the supplied email matches the hard-coded bootstrap
 * admin email (case-insensitive, whitespace-trimmed). Returns `false` for
 * null / undefined / empty / mismatched emails.
 *
 * @param email  the email to test — typically `authData.user.email` from
 *               the Supabase auth response, or `user.email` from the
 *               session.
 */
export function isBootstrapAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === BOOTSTRAP_ADMIN_EMAIL;
}
