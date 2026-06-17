/**
 * Route-level catalogue theme — runs before paint on collection/item pages.
 * Prevents OS dark-mode tokens from flashing before app.js bootstrap.
 *
 * `?mobile=1` (or `?viewport=mobile`) pins layout viewport to 390px and sets
 * `html.tw-preview-mobile` so narrow-layout CSS matches real phones in IDE previews.
 */
(function twPageThemeBoot() {
  const params = new URLSearchParams(String(globalThis.location?.search ?? ""));
  const forceMobilePreview =
    params.get("mobile") === "1" || params.get("viewport") === "mobile";
  if (forceMobilePreview) {
    const root = document.documentElement;
    root.classList.add("tw-preview-mobile");
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "width=390, initial-scale=1, viewport-fit=cover"
    );
  }

  const path = String(globalThis.location?.pathname ?? "");
  const isHome = path === "/" || path === "" || /\/index\.html$/i.test(path);
  if (isHome) return;
  const root = document.documentElement;
  root.classList.add("theme-catalogue");
  root.style.colorScheme = "light";
  const body = document.body;
  if (body) body.classList.add("theme-catalogue");

  if (params.get("debug-insets") === "1") {
    // Sentinel elements: only way to read resolved env() values from JS.
    const satEl = document.createElement("div");
    satEl.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:env(safe-area-inset-top,0px);pointer-events:none;visibility:hidden;";
    const sabEl = document.createElement("div");
    sabEl.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;visibility:hidden;";

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;bottom:80px;left:0;right:0;z-index:999999;pointer-events:none;" +
      "font:11px/1.5 monospace;color:#fff;text-shadow:0 1px 2px #000;padding:6px 10px;";

    document.addEventListener("DOMContentLoaded", function () {
      document.body.appendChild(satEl);
      document.body.appendChild(sabEl);
      document.body.appendChild(overlay);

      function snap(label) {
        const inner = document.querySelector(".site-header__inner");
        const s = inner ? getComputedStyle(inner) : null;
        const line = document.createElement("div");
        line.style.cssText =
          "background:rgba(0,0,0,0.72);border-radius:4px;margin-bottom:3px;padding:3px 6px;";
        line.textContent =
          label +
          " sat=" + satEl.offsetHeight + "px" +
          " sab=" + sabEl.offsetHeight + "px" +
          " pt=" + (s ? s.paddingTop : "?") +
          " pb=" + (s ? s.paddingBottom : "?");
        overlay.appendChild(line);
        // Keep last 6 entries.
        while (overlay.children.length > 6) overlay.removeChild(overlay.firstChild);
      }

      snap("LOAD");
      window.addEventListener("resize", function () { snap("RESIZE"); }, { passive: true });
    });
  }
})();
