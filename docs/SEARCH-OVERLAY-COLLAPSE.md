# Search Overlay — Popular Categories collapse during iOS keyboard rise

Single source of truth for this investigation. Stop scattering hypotheses across
threads — record results here.

## Symptom (confirmed on device)

Mobile search overlay. On open, focus raises the iOS soft keyboard. During the
keyboard slide-up (~0.7s–1.0s window in recordings), the **Popular Categories
section is pulled upward / clipped to blank**, then snaps back once the keyboard
settles. It is a *layout / scroll-position recompute*, not image loading — the
whole content block is yanked up, not individual cards fading in.

Desktop: accepted, not affected.

## Verified conclusions

| # | Claim | Status |
|---|-------|--------|
| C1 | Root cause is **not** image lazy-loading. The block collapses as a unit. | ✅ Confirmed (visual) |
| C2 | The visualViewport subsystem *participates* (keyboard-driven). | ✅ Confirmed |
| C3 | `wrap.style.height` rewrite is **not the sole trigger**. | ✅ See E1 |
| C4 | `scrollCompactHeaderSearchFieldIntoView` (scroll-pin) is **not the sole trigger**. | ✅ See E2 |

## Experiment log

### E1 — `efa107d` — full `syncCompactHeaderSearchVisualViewport` no-op
- **Change:** early-return the whole sync fn → height/top/left/width writes all OFF.
- **Flaw:** `scrollCompactHeaderSearchFieldIntoView` is called *independently* from
  the bind handler + focus handler, so scroll-pin **stayed ON**. Not a clean isolation.
- **Result:** Bug still reproduced on device.
- **Reading:** geometry writes (incl. height) OFF + scroll-pin ON → still bug.

### E2 — `cebe6f2` — scroll-pin only OFF
- **Change:** restored full sync (height/top/left/width ON); early-return only
  `scrollCompactHeaderSearchFieldIntoView`.
- **Result:** Bug still reproduced on device (03:07 recording, Popular Categories
  blank at 1.33–1.48s).
- **Reading:** geometry writes ON + scroll-pin OFF → still bug.

### Logic from E1 + E2 (the key deduction)

- If `height` rewrite were the **sole** cause → E1 (height OFF) would have fixed it. It didn't.
- If scroll-pin were the **sole** cause → E2 (scroll-pin OFF) would have fixed it. It didn't.

➡️ **Neither JS write is independently the trigger.** The cause is either their
*interaction*, or — more likely — something **active in BOTH builds**, i.e.
**outside the JS sync chain entirely**.

## Current prime suspect (not yet tested)

**CSS layout reflow, independent of the JS sync.** The compact sheet
(`.site-header__search-megamenu-inner`) is **bottom-anchored**:
`position: absolute; bottom: 0; top: auto` (main.css:5770) inside a wrap that
fills the viewport. When the iOS keyboard rises, the *layout viewport itself*
shrinks; a bottom-anchored, `overflow:hidden` sheet reflows its bottom-most
section (Popular Categories) up/out — **with no JS involved**. This survives both
E1 and E2, which matches the data.

## Next experiments (one variable each, deploy separately)

- **E3 (recommended):** Pure CSS. Change the sheet from bottom-anchored
  (`bottom:0; top:auto`) to **top-anchored** (`top:0; bottom:auto`) during open,
  JS sync untouched. If the pull stops → bottom-anchoring + keyboard viewport
  reflow is the cause.
- **E4:** Give the wrap a **stable height that does not track the keyboard**
  (e.g. lock to `100svh` / the pre-keyboard layout height) and disable JS height
  writes together. Tests the "height should never follow the keyboard" thesis.
- **E5 (only if E3/E4 fail):** Check for an async **content rebuild** —
  `syncHeaderSearchFeaturedSubcategoryCards` (app.js) re-running on Supabase data
  arrival during the open window, which `replaceChildren()`-wipes the grid.

## Excluded / parked

- Image lazy-loading theory — excluded (C1).
- Font / centering / spacing micro-tuning — out of scope for this bug.

## Build hygiene

- Production must hold **one** experimental variable at a time.
- Diagnostic builds (`efa107d`, `cebe6f2`) are **NOT** shippable fixes — revert
  to baseline or roll forward to the next single-variable test; never leave a
  diagnostic build as the final state.
