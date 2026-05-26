/**
 * Runs in <head> before paint — keeps admin UI out of public layout (no flash).
 * Production: session is applied later in app.js after Google sign-in.
 * Admin UI is never enabled from localStorage/query here; app.js turns it on
 * only after Supabase confirms an allowed Google account.
 */
(function () {
  var root = document.documentElement;
  root.classList.remove("tw-admin-mode");
})();
