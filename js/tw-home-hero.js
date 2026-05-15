/**
 * Early homepage hero pick + preload (runs in <head> before paint).
 * Keeps sessionStorage in sync with app.js `pickHomeHeroImagePath`.
 */
(function () {
  const HOME_HERO_IMAGES = [
    "images/heroes/hero-country-classics.png",
    "images/heroes/hero-editorial-01.png",
    "images/heroes/hero-editorial-02.png",
  ];
  const HOME_HERO_STORAGE_KEY = "heroImage";

  function pickHomeHeroImagePath() {
    try {
      const cached = sessionStorage.getItem(HOME_HERO_STORAGE_KEY);
      if (cached && HOME_HERO_IMAGES.indexOf(cached) !== -1) return cached;
    } catch (_) {
      /* ignore */
    }
    const hero = HOME_HERO_IMAGES[Math.floor(Math.random() * HOME_HERO_IMAGES.length)];
    try {
      sessionStorage.setItem(HOME_HERO_STORAGE_KEY, hero);
    } catch (_) {
      /* ignore */
    }
    return hero;
  }

  const hero = pickHomeHeroImagePath();
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = hero;
  link.setAttribute("fetchpriority", "high");
  link.setAttribute("data-tw-hero-preload", hero);
  document.head.appendChild(link);

  /* Other carousel slides are warmed after mount via app.js `preloadHomeHeroImage`
     (link preload for unused slides triggers "preloaded but not used" warnings). */
})();
