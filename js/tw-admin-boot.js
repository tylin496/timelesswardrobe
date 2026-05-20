/**
 * Runs in <head> before paint — keeps admin UI out of public layout (no flash).
 * Production: session is applied later in app.js after Google sign-in.
 */
(function () {
  var admin = false;
  try {
    var h = location.hostname;
    var localDev = h === "localhost" || h === "127.0.0.1" || h === "[::1]";
    if (localDev) {
      admin =
        /(?:^|[?&])admin=true(?:&|$)/.test(location.search) ||
        localStorage.getItem("adminMode") === "true";
      if (admin && /(?:^|[?&])admin=true(?:&|$)/.test(location.search)) {
        localStorage.setItem("adminMode", "true");
      }
    }
  } catch (e) {
    /* private mode */
  }
  var root = document.documentElement;
  if (admin) root.classList.add("tw-admin-mode");
  else root.classList.remove("tw-admin-mode");
})();
