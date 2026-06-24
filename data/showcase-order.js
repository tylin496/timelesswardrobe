/* TEMPORARY — bake disabled to fairly test the no-animation skeleton path on a real device (Jun 2026).
 * Restore with: npm run db:bake-showcase  (and re-enable build-showcase-order.mjs in the build script).
 * Empty map = no static showcase order → cold deep-link exercises the skeleton branch. */
window.TW_SHOWCASE_ORDER = {};
