/**
 * Editorial archive priorities — homepage curation.
 * Per-piece overrides; new items can also set on the row or in `metadata`:
 *   featured_rank — 2 hero, 1 notable, 0 normal (homepage selection only)
 */
const WARDROBE_EDITORIAL_PRIORITIES = {
  "beaufort-waxed-jacket":              { featured_rank: 2 },
  "balmacaan-coat":                     { featured_rank: 2 },
  "ventile-harrington-jacket":          { featured_rank: 2 },
  "camel-hair-polo-coat":               { featured_rank: 2 },
  "navy-double-breasted-blazer":        { featured_rank: 2 },
  "linen-safari-jacket":                { featured_rank: 2 },
  "herringbone-tweed-jacket":           { featured_rank: 2 },
  "houndstooth-tweed-jacket":           { featured_rank: 2 },
  "golden-fleece-navy-blazer":          { featured_rank: 2 },
  "glen-check-tweed-jacket":            { featured_rank: 2 },
  "basket-weave-linen-jacket":          { featured_rank: 2 },
  "aran-cable-knit-jumper":             { featured_rank: 2 },
  "polo-bear-jumper":                   { featured_rank: 1 },
  "v-neck-cardigan":                    { featured_rank: 1 },
  "fair-isle-vest":                     { featured_rank: 1 },
  "cable-knit-polo":                    { featured_rank: 1 },
  "structured-knit-polo-shirt":         { featured_rank: 1 },
  "rib-knit-polo-shirt-dark-chocolate": { featured_rank: 1 },
  "rib-knit-polo-shirt-dusty-ice-blue": { featured_rank: 1 },
  "cutwork-knit-polo-shirt":            { featured_rank: 1 },
  "knit-long-sleeve-polo":              { featured_rank: 1 },
  "cricket-cable-knit-jumper-vest":     { featured_rank: 1 },
  "boa-fleece-vest":                    { featured_rank: 1 },
  "washed-rugby-shirt":                 { featured_rank: 1 },
  "breton-sailor-shirt":                { featured_rank: 1 },
  "linen-camp-collar-shirt":            { featured_rank: 1 },
  "linen-loop-collar-shirt":            { featured_rank: 1 },
  "striped-camp-collar-shirt":          { featured_rank: 1 },
  "ocbd-shirt":                         { featured_rank: 1 },
  "fine-knit-t-shirt":                  { featured_rank: 1 },
  "purl-knit-t-shirt":                  { featured_rank: 1 },
  "henley-knit-t-shirt":                { featured_rank: 1 },
  "kataaze-knit-mock-neck-jumper":      { featured_rank: 1 },
  "corduroy-trousers":                  { featured_rank: 1 },
  "wide-straight-trousers":             { featured_rank: 1 },
  "pleated-trousers":                   { featured_rank: 1 },
  "wide-leg-jeans":                     { featured_rank: 1 },
  "jwa-straight-jeans":                 { featured_rank: 1 },
  "linen-pleated-shorts":               { featured_rank: 1 },
  "rib-knit-roll-neck-jumper":          { featured_rank: 1 },
  "tassel-moccasin-loafer":             { featured_rank: 2 },
  "signet-ring":                        { featured_rank: 2 },
  "ligne-2-lighter":                    { featured_rank: 1 },
  "tank-solo":                          { featured_rank: 2 },
  "black-bay-58":                       { featured_rank: 2 },
};

/**
 * Showcase — the collection's most representative pieces, in display order.
 * Showcase items appear before Archive items in the collection grid.
 * List order is the display order within the showcase.
 * Everything not listed here is Archive and sorts automatically.
 *
 * Edit this list to add, remove, or reorder showcase pieces.
 * Use the admin UI (★ toggle + Manage Showcase panel) to generate an updated list.
 */
const SHOWCASE_IDS = [
  "beaufort-waxed-jacket",
  "balmacaan-coat",
  "tank-solo",
  "tassel-moccasin-loafer",
  "camel-hair-polo-coat",
  "golden-fleece-navy-blazer",
  "signet-ring",
  "black-bay-58",
  "pembroke",
  "ventile-harrington-jacket",
  "herringbone-tweed-jacket",
  "aran-cable-knit-jumper",
  "ligne-2-lighter",
  "ruby-gypsy-ring",
  "navy-double-breasted-blazer",
  "polo-bear-jumper",
  "anthony-crossbody-bag",
  "cordovan-l-zip-wallet",
  "chukka",
  "houndstooth-tweed-jacket",
  "v-neck-cardigan",
  "gt1-hardwood-umbrella",
  "prx-quartz",
  "ocbd-shirt",
  "corduroy-trousers",
  "glen-check-tweed-jacket",
  "fair-isle-vest",
  "x100vi-camera",
  "achilles-low",
  "grand-soir-eau-de-parfum",
];
