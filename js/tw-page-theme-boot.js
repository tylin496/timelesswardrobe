/**
 * Route-level catalogue theme — runs before paint on collection/item pages.
 * Prevents OS dark-mode tokens from flashing before app.js bootstrap.
 *
 * `?mobile=1` (or `?viewport=mobile`) pins layout viewport to 390px and sets
 * `html.tw-preview-mobile` so narrow-layout CSS matches real phones in IDE previews.
 */
(function twPageThemeBoot() {
  // Account dark mode — apply before paint to prevent FOUC.
  try {
    if (localStorage.getItem("tw:account-theme") === "dark") {
      document.documentElement.classList.add("tw-account-dark");
    }
  } catch (_) {}

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

  if (params.get("measure") === "1") {
    function snapHeader(label) {
      const els = [
        [".site-header-shell",    document.querySelector(".site-header-shell")],
        [".site-header",          document.querySelector(".site-header")],
        [".site-header__inner",   document.querySelector(".site-header__inner")],
        [".site-header__brand-nav", document.querySelector(".site-header__brand-nav")],
      ];
      const row = {};
      for (const [name, el] of els) {
        if (el) {
          const r = el.getBoundingClientRect();
          row[name] = { h: +r.height.toFixed(2), top: +r.top.toFixed(2) };
        }
      }
      console.log("[header-measure]", label, JSON.stringify(row));
    }

    document.addEventListener("DOMContentLoaded", function () {
      snapHeader("LOAD");
      window.addEventListener("scroll", function onScroll() {
        snapHeader("SCROLL");
        window.removeEventListener("scroll", onScroll);
      }, { passive: true });
      window.addEventListener("resize", function onResize() {
        snapHeader("RESIZE");
        window.removeEventListener("resize", onResize);
      }, { passive: true });
    });
  }

})();
