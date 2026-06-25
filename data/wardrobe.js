/**
 * Timeless Wardrobe — frozen catalogue seed (offline fallback + dev).
 *
 * Frozen from Supabase wardrobe_items on 2026-06-25T13:05:30.077Z.
 * Regenerate: npm run db:freeze-catalogue
 *
 * Collection thesis is described in the site header. Each row uses `category` (and optional
 * `season`) for browsing; `section` / `pillar` are legacy fields and not shown in the UI.
 *
 * Images: full `https://…` public URLs (Supabase `wardrobe-images` bucket).
 * Optional `gallery`: string[] of extra image URLs; `image` is always the cover.
 * Optional `colourVariants`: same product in multiple colours — one collection row.
 * Optional `size`, `measuredDimensions`, and `purchaseDate`.
 */

const WARDROBE_ITEMS = [
  {
    "id": "rolo-chain-necklace",
    "category": "Jewellery",
    "brand": "Bespoke",
    "name": "Rolo Chain Necklace",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "fabric": "18ct yellow gold",
    "weight": "9.29 g",
    "size": "2.5 mm",
    "measuredDimensions": "Lentgh: 50 cm",
    "purchaseDate": "2024-08-20",
    "notes": "Inspired in part by Mediterranean dress, the necklace represents a departure from the traditionally British character of the collection. Worn discreetly beneath an open collar, it introduces a touch of warmth and informality without compromising restraint.\n\nGold price: 514 CNY/g (base: 431, +25% vs 2020)\nMaking: 83 CNY/g",
    "metadata": {
      "price": 4778,
      "basicColour": "gold",
      "priceCurrency": "CNY",
      "showcase_rank": 17,
      "measurementRows": [
        {
          "label": "Lentgh",
          "value": "50 cm"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rolo-chain-necklace/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rolo-chain-necklace/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rolo-chain-necklace/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rolo-chain-necklace/main/4.webp"
    ]
  },

  {
    "id": "ruby-gypsy-ring",
    "category": "Jewellery",
    "brand": "Bespoke",
    "name": "Ruby Gypsy Ring",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "fabric": "18ct yellow gold with Diamonds",
    "weight": "8.20 g (total, including stones), 6.8 mm face, 3 mm shank",
    "size": "HK 22",
    "measuredDimensions": "Ruby (~0.2 ct): 3 × 4 mm\nDiamonds x 2 (total ~0.1 ct): 2.3 mm",
    "purchaseDate": "2024-08-04",
    "notes": "Popular among Victorian gentlemen, the gypsy ring remains one of the few historically established gemstone ring styles associated with traditional gentlemen’s dress. For someone drawn to that aesthetic, it represented a surprisingly rare opportunity to wear a gemstone ring without departing from tradition. Ruby felt like the natural choice, not despite its intensity, but because of it.\n\nGold price: 604 CNY/g (base 450, +47% vs 2020)\nMaking: 154 CNY/g\n\nInscription: Ad Meliora · 2024\n\nReference: A gold ring inset with a single turquoise, inscribed “Rumpenheim 1843.”",
    "metadata": {
      "price": 5057,
      "basicColour": "gold",
      "priceCurrency": "CNY",
      "showcase_rank": 8,
      "measurementRows": [
        {
          "label": "Ruby (~0.2 ct)",
          "value": "3 × 4 mm"
        },
        {
          "label": "Diamonds x 2 (total ~0.1 ct)",
          "value": "2.3 mm"
        }
      ],
      "secondaryColour": "Pigeon's Blood Ruby",
      "secondaryColourCode": "#b7172a"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ruby-gypsy-ring/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ruby-gypsy-ring/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ruby-gypsy-ring/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ruby-gypsy-ring/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ruby-gypsy-ring/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ruby-gypsy-ring/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ruby-gypsy-ring/main/7.webp"
    ]
  },

  {
    "id": "signet-ring",
    "category": "Jewellery",
    "brand": "Bespoke",
    "name": "Signet Ring",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "fabric": "18ct yellow gold",
    "weight": "9.6 g",
    "size": "HK 14",
    "measuredDimensions": "Face Size: 12 × 14 mm",
    "purchaseDate": "2020-11-01",
    "notes": "Of all forms of jewellery, the signet ring felt the most natural addition to a traditionally minded wardrobe. The Victorian interlaced monogram was chosen not as a family emblem, but as a representation of personal identity.\n\nGold price: 411 CNY/g (base: 385 CNY/g)\nMaking: 78 CNY/g\n\nEngraving: Victorian interlaced monogram (TYL)",
    "metadata": {
      "price": 4698,
      "priceCurrency": "CNY",
      "showcase_rank": 3,
      "measurementRows": [
        {
          "unit": "mm",
          "label": "Face Size",
          "value": "12 × 14"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/7.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/8.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/signet-ring/main/9.webp"
    ]
  },

  {
    "id": "tank-solo",
    "category": "Dress",
    "brand": "Cartier",
    "name": "Tank Solo",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#DCC98A",
    "fabric": "18ct yellow gold",
    "weight": "W5200004",
    "size": "Large Model",
    "measuredDimensions": "Case: 34.8 × 27.4 mm\nThickness: 5.55 mm\nLugs: 20 mm",
    "purchaseDate": "2024-11-03",
    "notes": "Designed by Louis Cartier in 1917, the Tank remains one of the canonical forms of 20th-century design. As the only solid-gold watch in the collection, it serves as its aesthetic anchor.\n\nMovement: Cartier Cal. 690 quartz\nCrown: Beaded crown set with blue synthetic spinel cabochon\nDial: Clear silvered opaline dial, Roman numerals\nHands: Blued-steel sword-shaped hands\nCrystal: Square sapphire crystal\nStrap: Brown square-scale alligator leather\nBuckle: 18ct yellow gold ardillon buckle\nWater Resistance: 3 bar (30 m)",
    "metadata": {
      "price": 100000,
      "basicColour": "gold",
      "priceCurrency": "TWD",
      "showcase_rank": 0,
      "measurementRows": [
        {
          "label": "Case",
          "value": "34.8 × 27.4 mm"
        },
        {
          "label": "Thickness",
          "value": "5.55 mm"
        },
        {
          "label": "Lugs",
          "value": "20 mm"
        }
      ],
      "secondaryColour": "Brown Aligator Strap",
      "secondaryColourCode": "#9A4B17"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/tank-solo/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/tank-solo/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/tank-solo/main/3.webp"
    ]
  },

  {
    "id": "achilles-low",
    "category": "Footwear",
    "brand": "Common Projects",
    "name": "Achilles Low",
    "season": "All-season",
    "colour": "White",
    "colourCode": "#f1f1ee",
    "fabric": "Nappa",
    "size": "EU 45",
    "purchaseDate": "2025-11-28",
    "notes": "Introduced in 2009, the Achilles Low became one of the defining luxury sneakers of the 2010s. Despite countless imitators, few have matched the simplicity and balance of the original design.",
    "metadata": {
      "price": 374.85,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/achilles-low/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/achilles-low/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/achilles-low/main/3.webp"
    ]
  },

  {
    "id": "chukka",
    "category": "Footwear",
    "brand": "Crockett & Jones",
    "name": "Chukka",
    "season": "All-season",
    "colour": "Snuff",
    "colourCode": "#743E1C",
    "fabric": "Repello suede",
    "size": "UK 10 D",
    "purchaseDate": "2023-01-29",
    "notes": "Named after the periods of play in polo matches, the Chukka boot emerged during the 1920s and 1930s before becoming one of the defining forms of British casual footwear.\n\nUnlined ankle boot; Scotch-guard treated\nSole: single leather\nLast: 200",
    "metadata": {
      "price": 161.44,
      "basicColour": "brown",
      "priceCurrency": "USD"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/1.webp?v=ecf79390",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/7.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/chukka/main/8.webp"
    ]
  },

  {
    "id": "pembroke",
    "category": "Footwear",
    "brand": "Crockett & Jones",
    "name": "Pembroke",
    "season": "All-season",
    "colour": "Tan",
    "colourCode": "#B56738",
    "fabric": "Scotch grain calf",
    "size": "UK 10 E",
    "purchaseDate": "2020-10-26",
    "notes": "Full-brogue country shoes had appealed to me for many years, particularly through makers such as Tricker’s. In the end, it was the Crockett & Jones Pembroke—with its Scotch grain leather and restrained proportions—that became the collection’s representative of the tradition.\n\nType: Full brogue country derby, wing-tip with full punching\nSole: Dainite rubber\nLast: 325",
    "metadata": {
      "price": 201.75,
      "basicColour": "brown",
      "priceCurrency": "USD",
      "showcase_rank": 6
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pembroke/main/1.webp?v=1db2dc4d",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pembroke/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pembroke/main/3.webp"
    ]
  },

  {
    "id": "navy-double-breasted-blazer",
    "category": "Tailoring",
    "brand": "Cultum",
    "name": "Navy Double-Breasted Blazer",
    "season": "A/W",
    "colour": "Navy",
    "colourCode": "#20232D",
    "fabric": "Super 120s Wool",
    "weight": "265 gsm",
    "size": "56C",
    "purchaseDate": "2024-11-06",
    "notes": "The navy double-breasted blazer occupies a unique position between uniform and civilian dress. Its naval origins, combined with its long association with officers, club members, and public figures, made it one of the most enduring garments in the collection.",
    "metadata": {
      "price": 1284.65,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/navy-double-breasted-blazer/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/navy-double-breasted-blazer/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/navy-double-breasted-blazer/main/3.webp"
    ]
  },

  {
    "id": "kingsman-0847-sunglasses",
    "category": "Eyewear",
    "brand": "Cutler and Gross",
    "name": "Kingsman 0847 Sunglasses",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "measuredDimensions": "Lens Width: 54 mm\nLens Height: 39.5 mm\nBridge Width: 19 mm\nTemple Length: 145 mm\nFrame Width: 142 mm\nFrame Height: 43 mm",
    "purchaseDate": "2023-11-27",
    "notes": "Acquired through the Kingsman collaboration with Cutler and Gross, these sunglasses reflect an aspect of British style that has long appealed to me. While the connection to the films first attracted my attention, the frame itself proved timeless enough to outlast the association.",
    "metadata": {
      "price": 177.99,
      "basicColour": "black",
      "priceCurrency": "CNY",
      "measurementRows": [
        {
          "label": "Lens Width",
          "value": "54"
        },
        {
          "label": "Lens Height",
          "value": "39.5"
        },
        {
          "label": "Bridge Width",
          "value": "19"
        },
        {
          "label": "Temple Length",
          "value": "145"
        },
        {
          "label": "Frame Width",
          "value": "142"
        },
        {
          "label": "Frame Height",
          "value": "43"
        }
      ],
      "measurementUnit": "mm",
      "secondaryColour": "Brown Lenses",
      "secondaryBasicColour": "__omit__"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kingsman-0847-sunglasses/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kingsman-0847-sunglasses/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kingsman-0847-sunglasses/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kingsman-0847-sunglasses/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kingsman-0847-sunglasses/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kingsman-0847-sunglasses/main/6.webp"
    ]
  },

  {
    "id": "gt1-hardwood-umbrella",
    "category": "Objects",
    "brand": "Fox Umbrellas",
    "name": "GT1 Umbrella",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "measuredDimensions": "Canopy diameter: 104.5 cm\nFull length: 91 cm",
    "purchaseDate": "2025-01-11",
    "notes": "Founded in London in 1868, Fox Umbrellas is widely regarded as one of the defining names in British umbrella making. Since watching Kingsman (2014), I had wanted a traditional gentleman’s umbrella. The slim Fox models, with their walking-stick proportions, best captured that ideal. Living in Japan eventually gave me a reason to acquire one.\n\nFrame: 25” Classic Fox brown steel tube frame with black ribs\nCanopy: 100% Best Polyester, water-repellent and UV-treated\nHandle: Light-grained Chinese ash wood\nMade in Britain",
    "metadata": {
      "price": 20730,
      "priceCurrency": "JPY",
      "showcase_rank": 11,
      "measurementRows": [
        {
          "label": "Canopy diameter",
          "value": "104.5 cm"
        },
        {
          "label": "Full length",
          "value": "91 cm"
        }
      ],
      "secondaryColour": "Light-grained Chinese ash wood",
      "secondaryColourCode": "#b58659",
      "secondaryBasicColour": "__omit__"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/gt1-hardwood-umbrella/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/gt1-hardwood-umbrella/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/gt1-hardwood-umbrella/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/gt1-hardwood-umbrella/main/4.webp"
    ]
  },

  {
    "id": "wedding-bands",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Wedding Bands",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "fabric": "Pt950 1.8 mm (bride) / 18ct YG 2 mm size 13 (groom)",
    "notes": "Inscription: spouse name · date (e.g. Edward · 29 Mai). \nTraditionally worn closest to the hand when stacked. \n\nInspired by surviving Georgian and Regency-era wedding bands, including those of Prince Edward, Duke of Kent (1767–1820) and Princess Victoria, Duchess of Kent (1786–1861).",
    "metadata": {
      "basicColour": "gold"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wedding-bands/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wedding-bands/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wedding-bands/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wedding-bands/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wedding-bands/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wedding-bands/main/6.webp"
    ]
  },

  {
    "id": "wide-straight-trousers",
    "pillar": "Collections",
    "category": "Trousers",
    "brand": "GU",
    "name": "Wide-Straight Trousers",
    "season": "All-season",
    "colour": "Tan",
    "colourCode": "#8A7C6F",
    "fabric": "Poly blend",
    "weight": "Crease front",
    "size": "XL",
    "purchaseDate": "2025-08-11",
    "notes": "ワイドスラックス+EC(丈長め78.5cm)",
    "metadata": {
      "price": 2990,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wide-straight-trousers/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wide-straight-trousers/main/2.webp"
    ]
  },

  {
    "id": "smoke-olive-acetate-optical",
    "category": "Eyewear",
    "brand": "Klassic.",
    "name": "Smoke Olive Acetate Optical",
    "season": "All-season",
    "colour": "Smoke Olive",
    "colourCode": "#555425",
    "weight": "M141",
    "purchaseDate": "2024-08-15",
    "notes": "Chosen primarily for its smoke olive acetate, one of the most versatile colours in the collection.",
    "metadata": {
      "price": 990,
      "basicColour": "green",
      "priceCurrency": "TWD",
      "secondaryColour": "Clear",
      "secondaryColourCode": "#ffffff",
      "secondaryBasicColour": "__omit__"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/smoke-olive-acetate-optical/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/smoke-olive-acetate-optical/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/smoke-olive-acetate-optical/main/3.webp"
    ]
  },

  {
    "id": "corduroy-trousers",
    "category": "Trousers",
    "brand": "L.L.Bean",
    "name": "Corduroy Trousers",
    "season": "A/W",
    "colour": "Dark Khaki",
    "colourCode": "#c6ac88",
    "fabric": "Corduroy",
    "size": "38 x 30 inch",
    "purchaseDate": "2025-01-01",
    "notes": "Corduroy trousers originate from 18th–19th-century British rural and outdoor workwear, later absorbed into Ivy League and American casual country dressing.",
    "metadata": {
      "price": 11000,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/corduroy-trousers/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/corduroy-trousers/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/corduroy-trousers/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/corduroy-trousers/main/4.webp"
    ]
  },

  {
    "id": "passport-cover",
    "category": "Objects",
    "brand": "Louis Vuitton",
    "name": "Passport Cover",
    "season": "All-season",
    "colour": "Monogram Canvas",
    "colourCode": "#442b2b",
    "purchaseDate": "2024-10-26",
    "notes": "For many years I had admired Louis Vuitton’s Monogram canvas through period luggage seen in films and television, particularly Downton Abbey and Titanic. Acquired shortly before moving to Japan in 2024, this passport cover became my first piece in the classic Monogram and an appropriate companion for a new chapter of travel.",
    "metadata": {
      "price": 271.1,
      "basicColour": "brown",
      "priceCurrency": "CNY",
      "showcase_rank": 13
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/passport-cover/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/passport-cover/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/passport-cover/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/passport-cover/main/4.webp"
    ]
  },

  {
    "id": "meisterstuck-classique-rollerball",
    "category": "Objects",
    "brand": "Montblanc",
    "name": "Meisterstück Classique Rollerball Pen",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "weight": "163",
    "purchaseDate": "2022-02-20",
    "notes": "Introduced in 1924, the Meisterstück became the defining writing instrument of the 20th century. Purchased in 2022 as a practical everyday pen, this rollerball deliberately retained the same black-and-gold aesthetic as my father’s Meisterstück, preserving a familiar design that had accompanied me for years.",
    "metadata": {
      "price": 600,
      "priceCurrency": "USD",
      "secondaryColour": "Gold",
      "secondaryColourCode": "#C9A84C"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-classique-rollerball/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-classique-rollerball/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-classique-rollerball/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-classique-rollerball/main/4.webp"
    ]
  },

  {
    "id": "meisterstuck-legrand-ballpoint-pen",
    "category": "Objects",
    "brand": "Montblanc",
    "name": "Meisterstück LeGrand Ballpoint Pen",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "weight": "161",
    "purchaseDate": "2014-03-10",
    "notes": "Originally owned by my father. By 2014, it had become my everyday pen and accompanied my first attempts at English cursive handwriting. As a result, it remains one of the longest-serving objects in the collection and my earliest connection to the Montblanc Meisterstück.",
    "metadata": {
      "price": 570,
      "priceCurrency": "USD",
      "secondaryColour": "Gold",
      "secondaryColourCode": "#C9A84C"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-legrand-ballpoint-pen/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-legrand-ballpoint-pen/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-legrand-ballpoint-pen/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-legrand-ballpoint-pen/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/meisterstuck-legrand-ballpoint-pen/main/5.webp"
    ]
  },

  {
    "id": "wide-leg-jeans",
    "pillar": "Collections",
    "category": "Trousers",
    "brand": "Muji",
    "name": "Wide-Leg Jeans",
    "season": "All-season",
    "colour": "Cream",
    "colourCode": "#ebe6d5",
    "fabric": "Kapok, Cotton",
    "size": "XL",
    "purchaseDate": "2025-04-21",
    "notes": "木の実から作ったカポック混キャンバスワイドパンツ\nカラー：生成\nサイズ：紳士ＸＬ\n商品番号：84218460",
    "metadata": {
      "price": 4990,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wide-leg-jeans/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wide-leg-jeans/main/2.webp"
    ]
  },

  {
    "id": "polo-bear-jumper",
    "category": "Layering",
    "brand": "Polo Ralph Lauren",
    "name": "Polo Bear Jumper",
    "season": "A/W",
    "colour": "Wine",
    "colourCode": "#49131e",
    "fabric": "Wool-cashmere",
    "size": "XL",
    "purchaseDate": "2025-01-07",
    "notes": "Introduced in 1991, the Polo Bear began as a private gift from Ralph Lauren’s brother and evolved into an emblem of Ralph Lauren’s constructed Ivy League and American preppy mythology.",
    "metadata": {
      "price": 28000,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-bear-jumper/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-bear-jumper/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-bear-jumper/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-bear-jumper/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-bear-jumper/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-bear-jumper/main/6.webp"
    ]
  },

  {
    "id": "prx-quartz",
    "category": "Everyday",
    "brand": "Tissot",
    "name": "PRX Quartz",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#ffe691",
    "fabric": "Stainless Steel, Gold PVD",
    "weight": "T137.210.33.021.00",
    "size": "35 mm",
    "measuredDimensions": "Case: 35 mm\nThckness: 9.6 mm\nLug Width: 20 mm",
    "purchaseDate": "2024-08-08",
    "notes": "The PRX reflects the design language of 1970s integrated-bracelet sports watches, a tradition exemplified by the Vacheron Constantin 222. Informally nicknamed the “PRX 111”, it captures some of that character in a more approachable form. The gold-tone finish gives it a presence that belies its modest price, while remaining practical enough for everyday wear.\n\nMovement: ETA F06.115 quartz\nDial: Champagne sunburst\nBracelet: Integrated gold PVD coating",
    "metadata": {
      "price": 11309,
      "basicColour": "gold",
      "priceCurrency": "TWD",
      "measurementRows": [
        {
          "unit": "cm",
          "label": "Case",
          "value": "35 mm"
        },
        {
          "unit": "cm",
          "label": "Thckness",
          "value": "9.6 mm"
        },
        {
          "unit": "cm",
          "label": "Lug Width",
          "value": "20 mm"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/prx-quartz/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/prx-quartz/main/2.webp"
    ]
  },

  {
    "id": "black-bay-58",
    "category": "Dive",
    "brand": "Tudor",
    "name": "Black Bay 58",
    "season": "All-season",
    "colour": "Steel",
    "colourCode": "#E8E8E8",
    "weight": "M79030N",
    "size": "39 mm",
    "measuredDimensions": "Case: 39 mm\nThickness: 11.9 mm\nLugs: 20 mm",
    "purchaseDate": "2024-10-17",
    "notes": "The Black Bay 58 draws heavily from the design language of 1950s Tudor and Rolex dive watches. The red triangle at 12 o’clock and gilt dial are particularly evocative of the Rolex Submariner 6538 ‘Big Crown’, a longstanding favourite of mine. The gilt accents also complement the gold jewellery found throughout the collection.\n\nMovement: MT5402\nDial: Black domed\nBracelet: Riveted steel bracelet",
    "metadata": {
      "price": 82000,
      "basicColour": "silver",
      "priceCurrency": "TWD",
      "showcase_rank": 5,
      "measurementRows": [
        {
          "label": "Case",
          "value": "39 mm"
        },
        {
          "label": "Thickness",
          "value": "11.9 mm"
        },
        {
          "label": "Lugs",
          "value": "20 mm"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/black-bay-58/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/black-bay-58/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/black-bay-58/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/black-bay-58/main/4.webp"
    ]
  },

  {
    "id": "boston-metal-frames",
    "category": "Eyewear",
    "brand": "Zoff",
    "name": "Boston Metal Frames",
    "season": "All-season",
    "colour": "Dark Havana",
    "colourCode": "#3b2425",
    "fabric": "Green Photochromic Lenses",
    "weight": "ZF192014",
    "measuredDimensions": "Lens width: 52 mm\nBridge width: 20 mm\nTemple length: 145 mm",
    "purchaseDate": "2025-02-28",
    "notes": "Purchased shortly after moving to Japan in 2025, these became my primary everyday spectacles. The dark Havana and gold colour combination integrates naturally with the wider palette of the collection.",
    "metadata": {
      "price": 9800,
      "basicColour": "gold",
      "priceCurrency": "JPY",
      "measurementRows": [
        {
          "unit": "mm",
          "label": "Lens width",
          "value": "52"
        },
        {
          "unit": "mm",
          "label": "Bridge width",
          "value": "20"
        },
        {
          "unit": "mm",
          "label": "Temple length",
          "value": "145"
        }
      ],
      "secondaryColour": "Gold",
      "secondaryColourCode": "#C9A84C",
      "secondaryBasicColour": "__omit__"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boston-metal-frames/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boston-metal-frames/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boston-metal-frames/main/3.webp"
    ]
  },

  // ——— A/W – Country Classics ———,

  {
    "id": "glen-check-tweed-jacket",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Tailoring",
    "brand": "Cultum",
    "name": "Glen Check Tweed Jacket",
    "season": "A/W",
    "colour": "Brown",
    "colourCode": "#7B5A43",
    "fabric": "Tweed",
    "weight": "620 gsm",
    "size": "58B",
    "purchaseDate": "2025-11-22",
    "notes": "Originating in Scottish weaving traditions of the 1800s, Glen Check later became associated with aristocratic country tailoring and remains one of the few patterns equally comfortable in town and country dress.",
    "metadata": {
      "price": 867,
      "basicColour": "brown",
      "priceCurrency": "CNY",
      "showcase_rank": 22
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/glen-check-tweed-jacket/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/glen-check-tweed-jacket/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/glen-check-tweed-jacket/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/glen-check-tweed-jacket/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/glen-check-tweed-jacket/main/5.webp"
    ]
  },

  {
    "id": "rib-knit-roll-neck-jumper",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Tops",
    "brand": "Muji",
    "name": "Rib Knit Roll-Neck Jumper",
    "season": "A/W",
    "colour": "Black",
    "colourCode": "#000000",
    "fabric": "Wool",
    "weight": "Lightweight",
    "size": "XL",
    "purchaseDate": "2024-12-17",
    "notes": "紳士 洗えるウールリブタートルネックセーター",
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-roll-neck-jumper/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-roll-neck-jumper/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-roll-neck-jumper/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-roll-neck-jumper/main/4.webp"
    ]
  },

  {
    "id": "polo-coat",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Outerwear",
    "brand": "Spier & Mackay",
    "name": "Polo Coat",
    "season": "A/W",
    "colour": "Golden Camel",
    "colourCode": "#C89C7B",
    "fabric": "Camel hair",
    "weight": "760 gsm",
    "size": "46",
    "purchaseDate": "2025-02-16",
    "notes": "The polo coat originated in the 1910s–1930s within British polo and equestrian circles as a lightweight overcoat for spectators and players, later entering American Ivy League dressing in the 1950s as part of a relaxed overcoat vocabulary. \n\nAmong traditional overcoats, the polo coat uniquely bridges British sporting origins and Ivy League dress, making it one of the most versatile outer garments in the collection.",
    "metadata": {
      "price": 718.2,
      "basicColour": "brown",
      "priceCurrency": "USD",
      "showcase_rank": 2
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/7.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/polo-coat/main/8.webp"
    ]
  },

  {
    "id": "cricket-cable-knit-jumper-vest",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Layering",
    "brand": "Uniqlo",
    "name": "Cricket Cable-Knit Jumper Vest",
    "season": "A/W",
    "colour": "Ecru",
    "colourCode": "#fffcf5",
    "fabric": "Cotton-acrylic",
    "size": "XL",
    "purchaseDate": "2022-08-08",
    "notes": "Emerging from British sporting dress in the late 19th and early 20th centuries, the cable-knit became a staple of school and collegiate uniforms before later entering Ivy League style. Its appearance in The Last Emperor remains one of my favourite depictions of the garment.",
    "metadata": {
      "price": 790,
      "basicColour": "__omit__",
      "priceCurrency": "TWD",
      "secondaryColour": "Navy / Yellow Trim",
      "secondaryColourCode": "#f0c04d",
      "secondaryBasicColour": "white"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cricket-cable-knit-jumper-vest/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cricket-cable-knit-jumper-vest/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cricket-cable-knit-jumper-vest/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cricket-cable-knit-jumper-vest/main/4.webp"
    ]
  },

  {
    "id": "pleated-trousers",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Trousers",
    "brand": "Uniqlo",
    "name": "Pleated Trousers",
    "season": "All-season",
    "colour": "Grey",
    "colourCode": "#5F5F62",
    "size": "XL",
    "purchaseDate": "2023-11-20",
    "notes": "Fabric details\nBody: 62% Polyester - Recycled Fiber, 29% Viscose, 5% Polyester, 4% Elastane/ Pocket Lining: 65% Polyester, 35% Cotton\nWashing instructions\nMachine wash up to 40 degrees, gentle cycle, Dry Clean, Not suitable for tumble-drying.",
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY"
    },
    "colourVariants": [
      {
        "key": "grey",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pleated-trousers/variants/grey/1.webp",
        "label": "Grey",
        "notes": "",
        "colour": "Grey",
        "gallery": [
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pleated-trousers/variants/grey/2.webp"
        ],
        "colourCode": "#5F5F62",
        "basicColour": "grey",
        "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pleated-trousers/variants/grey/preview.webp"
      },
      {
        "key": "beige",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pleated-trousers/variants/beige/1.webp",
        "label": "Beige",
        "notes": "",
        "colour": "Beige",
        "gallery": [
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pleated-trousers/variants/beige/2.webp"
        ],
        "colourCode": "#CEBEA6",
        "basicColour": "beige",
        "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/pleated-trousers/variants/beige/preview.webp"
      }
    ]
  },

  // ——— Accessories ———,

  {
    "id": "panama-hat",
    "pillar": "Accessories",
    "section": "Accessories",
    "category": "Hats",
    "brand": "Eloy Bernal",
    "name": "Panama Hat",
    "season": "All-season",
    "colour": "Bleached White",
    "colourCode": "#fffced",
    "fabric": "Toquilla Straw",
    "size": "XL:61cm-1cm",
    "measuredDimensions": "Head Circumference: 61 cm\nBrim Width: 7 cm\nFront Crown Height: 9.7 cm\nCenter Crown Height: 10.7 cm\nOverall Length: 31.5 cm",
    "purchaseDate": "2025-05-11",
    "notes": "For many years, I considered hats beyond the baseball cap difficult to wear without appearing theatrical. Time spent in Japan changed that perception. Seeing men incorporate Panama hats and fedoras into everyday dress made them feel natural rather than performative, and encouraged a more confident approach to classic menswear.\n\nLooking back, it also marked the beginning of a broader shift in how I approached summer dressing.\n\n* Weave: Llano (classic basket/plain weave)\n* Grade: Standard",
    "metadata": {
      "price": 9600,
      "priceCurrency": "JPY",
      "showcase_rank": 15,
      "measurementRows": [
        {
          "label": "Head Circumference",
          "value": "61"
        },
        {
          "label": "Brim Width",
          "value": "7"
        },
        {
          "label": "Front Crown Height",
          "value": "9.7"
        },
        {
          "label": "Center Crown Height",
          "value": "10.7"
        },
        {
          "label": "Overall Length",
          "value": "31.5"
        }
      ],
      "secondaryColour": "Black Grosgrain Ribbon"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/7.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/panama-hat/main/8.webp"
    ]
  },

  {
    "id": "boat-and-tote",
    "pillar": "Accessories",
    "section": "Accessories",
    "category": "Bags",
    "brand": "L.L.Bean",
    "name": "Boat and Tote",
    "season": "All-season",
    "colour": "Cream",
    "colourCode": "#e2d8d0",
    "size": "Medium",
    "purchaseDate": "2025-01-01",
    "notes": "Originally introduced by L.L.Bean in 1944 as the Ice Carrier, the Boat and Tote remains one of the most recognisable icons of American casual style. Personalised with my initials in the traditional monogram style, it serves as a small tribute to a longstanding interest in American trad and prep.\n\nCustomisation\n* Embroidered Monogram: TLY\n* Letter Style: Flare\n* Thread Colour: Coastal Gold",
    "metadata": {
      "price": 11880,
      "basicColour": "white",
      "priceCurrency": "JPY",
      "showcase_rank": 19,
      "secondaryColour": "Navy trim",
      "secondaryColourCode": "#303c73"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boat-and-tote/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boat-and-tote/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boat-and-tote/main/3.webp"
    ]
  },

  {
    "id": "antony-crossbody-bag",
    "pillar": "Accessories",
    "section": "Accessories",
    "category": "Bags",
    "brand": "Mulberry",
    "name": "Antony Crossbody Bag",
    "season": "All-season",
    "colour": "Oak",
    "colourCode": "#A95B32",
    "measuredDimensions": "Height: 25 cm\nWidth: 21 cm\nThickness: 7 cm\nStrap Width: 4 cm",
    "purchaseDate": "2025-07-27",
    "notes": "Purchased in near-excellent condition, with only one previous use. No visible stains, scratches, or notable signs of wear. Compact everyday messenger proportions with a broad adjustable shoulder strap, consistent with the classic Antony design.",
    "metadata": {
      "price": 45000,
      "priceCurrency": "JPY",
      "measurementRows": [
        {
          "label": "Height",
          "value": "25"
        },
        {
          "label": "Width",
          "value": "21"
        },
        {
          "label": "Thickness",
          "value": "7"
        },
        {
          "label": "Strap Width",
          "value": "4"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/antony-crossbody-bag/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/antony-crossbody-bag/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/antony-crossbody-bag/main/3.webp"
    ]
  },

  {
    "id": "american-flag-cap",
    "pillar": "Accessories",
    "section": "Accessories",
    "category": "Hats",
    "brand": "Smathers & Branson",
    "name": "American Flag Cap",
    "season": "All-season",
    "colour": "Steel Blue",
    "colourCode": "#5E829A",
    "measuredDimensions": "Circumference: 22.45 cm\nTop to Side: : 6.65 cm\nBrim: 2.9 cm",
    "purchaseDate": "2026-05-11",
    "notes": "The influence of Ralph Lauren and American prep can be found throughout the collection. The embroidered flag cap serves as a small tribute to that tradition.",
    "metadata": {
      "price": 1710,
      "priceCurrency": "TWD",
      "measurementRows": [
        {
          "label": "Circumference",
          "value": "22.45"
        },
        {
          "label": "Top to Side",
          "value": "6.65"
        },
        {
          "label": "Brim",
          "value": "2.9"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/american-flag-cap/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/american-flag-cap/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/american-flag-cap/main/3.webp"
    ]
  },

  {
    "id": "three-point-gloves",
    "section": "Accessories",
    "category": "Objects",
    "brand": "Unbranded",
    "name": "Three-Point Gloves",
    "season": "A/W",
    "colour": "Dark Brown",
    "colourCode": "#3a241d",
    "fabric": "Lambskin / Cashmere lining",
    "size": "M",
    "measuredDimensions": "Hand circumference: 21.4 cm\nMiddle finger length: 8.6 cm\nTotal length: 24 cm",
    "purchaseDate": "2025-02-17",
    "notes": "Named after the three stitched lines traditionally found across the back of the glove, three-point gloves remain one of the enduring details of classic gentleman’s dress. \n\nBrown lambskin gloves with traditional three-point stitching, cashmere lining, and touchscreen-compatible fingertips.",
    "metadata": {
      "price": 225,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/three-point-gloves/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/three-point-gloves/main/2.webp"
    ]
  },

  {
    "id": "helmet-bag",
    "pillar": "Accessories",
    "section": "Accessories",
    "category": "Bags",
    "brand": "Uniqlo",
    "name": "Helmet Bag",
    "season": "All-season",
    "colour": "Grey Green",
    "colourCode": "#59686D",
    "measuredDimensions": "Width: 34 cm\nHeight: 38 cm\nDepth: 16 cm\nShoulder Strap Length: 61～114 cm",
    "purchaseDate": "2025-08-12",
    "notes": "Familiar to me since my early interest in Americana around 2013, the helmet bag originated with U.S. Air Force pilots during the 1950s Jet Age. More than a decade later, I finally acquired one as an everyday gym bag.\n\nBag Capacity: 26Liters\nProduct ID: 479880",
    "metadata": {
      "price": 2990,
      "colourCode": "#556469",
      "basicColour": "green",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/helmet-bag/main/1.webp?v=aaa0d065",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/helmet-bag/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/helmet-bag/main/3.webp"
    ]
  },

  // ——— Bottoms ———,

  {
    "id": "fluid-boot-cut-trousers",
    "section": "Bottoms",
    "category": "Trousers",
    "brand": "Cultum",
    "name": "Fluid Boot-Cut Trousers",
    "season": "All-season",
    "colour": "Walnut Brown",
    "colourCode": "#322722",
    "fabric": "Fabric: 64.2% Polyester / 19.2% Viscose / 16.6% Wool Lining: 55% Polyester / 45%",
    "weight": "345 gsm",
    "size": "W36",
    "measuredDimensions": "Waist: 94 cm\nHip: 124 cm\nFront Rise: 35.3 cm\nBack Rise: 47.9 cm\nThigh Width: 77.6 cm\nLeg Opening: 58 cm\nOutseam Length: 114 cm",
    "purchaseDate": "2026-05-25",
    "notes": "Boot-cut trousers evolved from 1960s–1970s American western and workwear silhouettes designed to accommodate riding boots, later refined in the 1990s into a cleaner tailored form within contemporary menswear.",
    "metadata": {
      "price": 211.88,
      "priceCurrency": "CNY",
      "measurementRows": [
        {
          "label": "Waist",
          "value": "94"
        },
        {
          "label": "Hip",
          "value": "124"
        },
        {
          "label": "Front Rise",
          "value": "35.3"
        },
        {
          "label": "Back Rise",
          "value": "47.9"
        },
        {
          "label": "Thigh Width",
          "value": "77.6"
        },
        {
          "label": "Leg Opening",
          "value": "58"
        },
        {
          "label": "Outseam Length",
          "value": "114"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fluid-boot-cut-trousers/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fluid-boot-cut-trousers/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fluid-boot-cut-trousers/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fluid-boot-cut-trousers/main/4.webp"
    ]
  },

  {
    "id": "wide-leg-white-jeans",
    "section": "Bottoms",
    "category": "Trousers",
    "brand": "Cultum",
    "name": "Wide-Leg White Jeans",
    "season": "All-season",
    "colour": "White",
    "fabric": "Cotton",
    "weight": "470 gsm",
    "size": "W36",
    "measuredDimensions": "Waist: 94 cm\nHip: 115 cm\nFront Rise: 34.5 cm\nBack Rise: 47 cm\nThigh: 73 cm\nKnee: 58 cm\nLeg Opening: 53 cm\nOutseam: 110 cm",
    "purchaseDate": "2026-05-25",
    "notes": "White denim trousers emerged in American leisure culture between the 1920s and 1950s, where Ivy League and country club dressing redefined denim as clean summer leisurewear for yacht and resort settings.",
    "metadata": {
      "price": 151.08,
      "priceCurrency": "CNY",
      "measurementRows": [
        {
          "label": "Waist",
          "value": "94"
        },
        {
          "label": "Hip",
          "value": "115"
        },
        {
          "label": "Front Rise",
          "value": "34.5"
        },
        {
          "label": "Back Rise",
          "value": "47"
        },
        {
          "label": "Thigh",
          "value": "73"
        },
        {
          "label": "Knee",
          "value": "58"
        },
        {
          "label": "Leg Opening",
          "value": "53"
        },
        {
          "label": "Outseam",
          "value": "110"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wide-leg-white-jeans/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wide-leg-white-jeans/main/2.webp"
    ]
  },

  {
    "id": "linen-pleated-shorts",
    "pillar": "Collections",
    "section": "Bottoms",
    "category": "Trousers",
    "brand": "H&M",
    "name": "Linen Pleated Shorts",
    "season": "S/S",
    "colour": "Ecru",
    "colourCode": "#E2DDD1",
    "fabric": "Linen",
    "size": "XL",
    "purchaseDate": "2025-07-29",
    "metadata": {
      "price": 3600,
      "basicColour": "white",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/linen-pleated-shorts/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/linen-pleated-shorts/main/2.webp"
    ]
  },

  {
    "id": "jwa-straight-jeans",
    "pillar": "Collections",
    "section": "Bottoms",
    "category": "Trousers",
    "brand": "Uniqlo",
    "name": "JWA Straight Jeans",
    "season": "All-season",
    "colour": "Light Wash Blue",
    "colourCode": "#98B0C7",
    "fabric": "Denim",
    "size": "35inch",
    "purchaseDate": "2026-03-24",
    "metadata": {
      "price": 1290,
      "basicColour": "blue",
      "priceCurrency": "TWD"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/jwa-straight-jeans/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/jwa-straight-jeans/main/2.webp"
    ]
  },

  // ——— Eyewear ———,

  {
    "id": "wayfarer-sunglasses",
    "section": "Eyewear",
    "category": "Eyewear",
    "brand": "Ray-Ban",
    "name": "Wayfarer Sunglasses",
    "season": "All-season",
    "colour": "Tortoise, G-15 Green",
    "colourCode": "#332720",
    "purchaseDate": "2025-08-08",
    "notes": "Originally introduced in 1952, the Ray-Ban Wayfarer remains one of the defining eyewear designs of the 20th century. Having worn a pair during my early Americana years around 2013, I returned to the model in 2025, more than a decade later.",
    "metadata": {
      "price": 6490,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/7.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/wayfarer-sunglasses/main/8.webp"
    ]
  },

  // ——— Footwear ———,

  {
    "id": "tassel-moccasin-loafer",
    "section": "Footwear",
    "category": "Footwear",
    "brand": "Alden",
    "name": "Tassel Moccasin Loafer",
    "season": "All-season",
    "colour": "Color 8 Shell Cordovan",
    "colourCode": "#492C2E",
    "fabric": "Horween shell cordovan",
    "weight": "563",
    "size": "US 10.5 E",
    "purchaseDate": "2023-01-19",
    "notes": "The Alden 563 is often considered the original tassel loafer, its design tracing back to a Hollywood commission in the late 1940s. In Color 8 shell cordovan, it remains one of the enduring icons of American menswear.\n\nSole: Single oak leather outsole \nLast: Aberdeen",
    "metadata": {
      "price": 200,
      "basicColour": "red",
      "priceCurrency": "USD",
      "showcase_rank": 7
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/tassel-moccasin-loafer/main/1.webp?v=a1fd7afc",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/tassel-moccasin-loafer/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/tassel-moccasin-loafer/main/3.webp"
    ]
  },

  {
    "id": "ferret",
    "section": "Footwear",
    "category": "Footwear",
    "brand": "Paraboot",
    "name": "Ferret",
    "season": "S/S",
    "colour": "Lisse Café",
    "colourCode": "#332826",
    "weight": "Rubber Sole",
    "size": "UK 10",
    "purchaseDate": "2025-08-03",
    "notes": "Traditionally associated with fisherman sandals, a mid-century reinterpretation of Mediterranean utilitarian footwear, the Ferret introduces a style I would almost certainly have overlooked before moving to Tokyo.\n\nLiving in Tokyo revealed forms of elegance outside the traditional British framework that had long shaped my wardrobe. What began as an effort to develop a more complete summer wardrobe gradually became an appreciation for style as something lived rather than studied.\n\nThe Ferret became one of the first acquisitions to emerge from that shift.",
    "metadata": {
      "price": 41696,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ferret/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ferret/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ferret/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ferret/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ferret/main/5.webp"
    ]
  },

  // ——— Foundation ———,

  {
    "id": "beaufort-waxed-jacket",
    "section": "Foundation",
    "category": "Outerwear",
    "brand": "Barbour",
    "name": "Beaufort Waxed Jacket",
    "season": "A/W",
    "colour": "Sage",
    "colourCode": "#40403C",
    "fabric": "Waxed cotton",
    "size": "44",
    "purchaseDate": "2025-08-01",
    "notes": "Barbour has been a recurring presence throughout the evolution of the collection, with multiple jackets acquired and revisited over time. Within this long-standing engagement, the Beaufort is widely regarded as the most complete expression of the brand’s country heritage. While the Bedale introduces a shorter, more contemporary silhouette and the Border extends into a more overtly functional field coat, the Beaufort retains a balanced proportion that aligns most closely with the classic imagery of British country dress associated with Barbour’s mid-20th-century identity.\n\nIt remains the most balanced expression of Barbour’s waxed jacket tradition.\n\nAcquisition history:\n* 2016 — First Barbour (Beaufort 38) — GBP 101.31 ≈ TWD 4,050\n* 2019 — Bedale 38 (vintage) — GBP 108.99 ≈ TWD 4,360\n* 2019 — Bedale 40 — GBP 101.59 ≈ TWD 4,060\n* 2021 — Beaufort 42 — USD 147.90 ≈ TWD 4,140\n* 2021 — International Classic 40 — GBP 148 ≈ TWD 5,840\n* 2021 — Beaufort 40 (vintage) — GBP 112.20 ≈ TWD 4,430\n* 2025 — Beaufort 44 — JPY 43,200 ≈ TWD 8,640",
    "metadata": {
      "price": 43200,
      "priceCurrency": "JPY",
      "showcase_rank": 1
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/beaufort-waxed-jacket/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/beaufort-waxed-jacket/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/beaufort-waxed-jacket/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/beaufort-waxed-jacket/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/beaufort-waxed-jacket/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/beaufort-waxed-jacket/main/7.webp"
    ]
  },

  {
    "id": "balmacaan-coat",
    "section": "Foundation",
    "category": "Outerwear",
    "brand": "Burberrys",
    "name": "Balmacaan Coat",
    "season": "A/W",
    "colour": "Stone Beige",
    "colourCode": "#dbd3c7",
    "fabric": "Cotton",
    "weight": "Single-Breasted",
    "size": "42R",
    "purchaseDate": "2020-12-06",
    "notes": "The Balmacaan coat originated in late-19th-century Scottish tailoring as a relaxed cotton raincoat with raglan sleeves and an unstructured silhouette. It sits in the tradition of British weatherwear rather than insulated overcoats, defined by its drape, ease of movement, and protection against rain and transition conditions, rather than thermal weight.",
    "metadata": {
      "price": 83.99,
      "priceCurrency": "USD",
      "showcase_rank": 20
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/balmacaan-coat/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/balmacaan-coat/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/balmacaan-coat/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/balmacaan-coat/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/balmacaan-coat/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/balmacaan-coat/main/6.webp"
    ]
  },

  // ——— Fragrance ———,

  {
    "id": "grand-soir-eau-de-parfum",
    "section": "Fragrance",
    "category": "Evening",
    "brand": "Maison Francis Kurkdjian",
    "name": "Grand Soir Eau de Parfum",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "weight": "Labdanum, benzoin, vanilla, amber",
    "size": "70 ml",
    "purchaseDate": "2025-08-01",
    "notes": "Grand Soir is an amber composition positioned within the night/AW category of the collection, defined by warmth and density rather than transparency or freshness.",
    "metadata": {
      "price": 22000,
      "basicColour": "__omit__",
      "priceCurrency": "JPY",
      "showcase_rank": 16
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/grand-soir-eau-de-parfum/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/grand-soir-eau-de-parfum/main/2.webp"
    ]
  },

  {
    "id": "new-york-intense-eau-de-parfum",
    "section": "Fragrance",
    "category": "Day",
    "brand": "Nicolaï",
    "name": "New York Intense Eau de Parfum",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "weight": "Bergamot, black pepper, oak moss.",
    "size": "100 ml",
    "purchaseDate": "2025-08-02",
    "notes": "Nicolai New York Intense is a classically structured fougère composition positioned within the daytime section of the collection, defined by a traditional masculine structure.",
    "metadata": {
      "price": 23000,
      "basicColour": "__omit__",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/new-york-intense-eau-de-parfum/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/new-york-intense-eau-de-parfum/main/2.webp"
    ]
  },

  // ——— Future Pieces ———,

  {
    "id": "sapphire-three-stone-ring",
    "pillar": "Jewellery",
    "section": "Future Pieces",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Sapphire Three-Stone Ring",
    "season": "All-season",
    "colour": "Platinum",
    "colourCode": "#E8E8E8",
    "fabric": "Platinum",
    "measuredDimensions": "Emerald-cut sapphire (~1.1 ct): 6.8 × 5.1 mm\nTapered baguette sides diamonds: ~1 ct",
    "notes": "A favourite example of mid-century jewellery design. The combination of an emerald-cut sapphire and tapered baguette diamonds balances geometry, elegance, and restraint. Despite its mid-century origins, the style feels remarkably current amid the renewed popularity of emerald-cut engagement rings.\n\nSigned Cartier. c.1950–65.",
    "metadata": {
      "basicColour": "silver",
      "secondaryColour": "Sapphire",
      "secondaryColourCode": "#1B57BC"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/sapphire-three-stone-ring/main/1.webp?v=ca6e4689",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/sapphire-three-stone-ring/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/sapphire-three-stone-ring/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/sapphire-three-stone-ring/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/sapphire-three-stone-ring/main/5.webp"
    ]
  },

  // ——— Jewellery ———,

  {
    "id": "curb-bracelet",
    "section": "Jewellery",
    "category": "Jewellery",
    "brand": "Bespoke",
    "name": "Curb Bracelet",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "fabric": "18ct yellow gold",
    "weight": "11.71 g",
    "size": "5.3 mm",
    "measuredDimensions": "Lentgh: 20.5 cm",
    "purchaseDate": "2024-10-26",
    "notes": "The curb bracelet marks a subtle shift beyond the traditionally British character of the collection. Acquired during the same period that reshaped my approach to summer dressing, it reflects an appreciation for jewellery as modern dress has become increasingly informal. The classic curb chain remains a timeless and understated form.\n\nGold price: 596 CNY/g (base: 472, +45% vs 2020)\nMaking: 124 CNY/g",
    "metadata": {
      "price": 6973,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/curb-bracelet/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/curb-bracelet/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/curb-bracelet/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/curb-bracelet/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/curb-bracelet/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/curb-bracelet/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/curb-bracelet/main/7.webp"
    ]
  },

  {
    "id": "sapphire-ring",
    "section": "Jewellery",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Sapphire Ring",
    "season": "All-season",
    "colour": "Platinum",
    "colourCode": "#E8E8E8",
    "fabric": "Platinum",
    "measuredDimensions": "Sapphire (~1.3–1.5 ct): 8 × 6 mm",
    "notes": "Reference: Inspired by the Garrard sapphire cluster engagement ring famously chosen by Diana, Princess of Wales, in 1981.",
    "metadata": {
      "secondaryColour": "Light cornflower blue",
      "secondaryColourCode": "#384D87"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/sapphire-ring/main/1.webp?v=d0c9ec6f",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/sapphire-ring/main/2.webp"
    ]
  },

  // ——— Knitwear ———,

  {
    "id": "driver-knit-zip-up-jumper",
    "pillar": "Clothing",
    "section": "Knitwear",
    "category": "Outerwear",
    "brand": "Maison Margiela",
    "name": "Driver Knit Zip-Up Jumper",
    "season": "All-season",
    "colour": "Grey",
    "colourCode": "#6B6B6B",
    "fabric": "Wool",
    "size": "XL",
    "measuredDimensions": "Shoulder: 47 cm\nChest: 128 cm\nSleeve: 73 cm\nLength: 74 cm",
    "purchaseDate": "2026-06-09",
    "metadata": {
      "price": 175.925,
      "basicColour": "grey",
      "priceCurrency": "CNY",
      "measurementRows": [
        {
          "label": "Shoulder",
          "value": "47"
        },
        {
          "label": "Chest",
          "value": "128"
        },
        {
          "label": "Sleeve",
          "value": "73"
        },
        {
          "label": "Length",
          "value": "74"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/driver-knit-zip-up-jumper/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/driver-knit-zip-up-jumper/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/driver-knit-zip-up-jumper/main/3.webp"
    ]
  },

  {
    "id": "aran-cable-knit-jumper",
    "section": "Knitwear",
    "category": "Layering",
    "brand": "Muji",
    "name": "Aran Cable-Knit Jumper",
    "season": "A/W",
    "colour": "Mushroom Taupe",
    "colourCode": "#B2A9A5",
    "fabric": "Wool",
    "weight": "Heavy",
    "size": "XL",
    "purchaseDate": "2024-12-27",
    "notes": "Originating in the Aran Islands of Ireland during the late 1800s, the Aran jumper developed as working knitwear for fishing communities, defined by dense wool construction and traditional cable patterns. Its heavily textured surface has made it one of the most enduring forms of traditional knitwear.",
    "metadata": {
      "price": 7990,
      "basicColour": "beige",
      "priceCurrency": "JPY",
      "showcase_rank": 18
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/aran-cable-knit-jumper/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/aran-cable-knit-jumper/main/2.webp"
    ]
  },

  {
    "id": "v-neck-cardigan",
    "pillar": "Collections",
    "section": "Knitwear",
    "category": "Layering",
    "brand": "Muji",
    "name": "V-Neck Cardigan",
    "season": "A/W",
    "colour": "Navy",
    "colourCode": "#19202c",
    "fabric": "High-Gauge Wool",
    "weight": "Lightweight",
    "size": "XL",
    "purchaseDate": "2024-12-17",
    "notes": "紳士洗えるウールハイゲージＶネックカーディガン紳士ＸＬ・ダークネイビー",
    "metadata": {
      "price": 4990,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/v-neck-cardigan/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/v-neck-cardigan/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/v-neck-cardigan/main/3.webp"
    ]
  },

  {
    "id": "fair-isle-vest",
    "section": "Knitwear",
    "category": "Layering",
    "brand": "The Engineer",
    "name": "Fair Isle Vest",
    "season": "A/W",
    "colour": "Brown Mixed",
    "colourCode": "#766051",
    "fabric": "Wool",
    "size": "XXL",
    "purchaseDate": "2024-11-03",
    "notes": "Originating in the Shetland Islands, Fair Isle knitwear entered mainstream British dress during the 1920s through its association with the Prince of Wales, later Duke of Windsor. Among patterned knitwear, Fair Isle remains one of the few traditions equally associated with British country dress and Ivy League style.",
    "metadata": {
      "price": 357.97,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fair-isle-vest/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fair-isle-vest/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fair-isle-vest/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fair-isle-vest/main/4.webp"
    ]
  },

  {
    "id": "kataaze-knit-mock-neck-jumper",
    "section": "Knitwear",
    "category": "Tops",
    "brand": "Uniqlo",
    "name": "Kataaze Knit Mock Neck Jumper",
    "season": "A/W",
    "colour": "Beige",
    "colourCode": "#d0bcac",
    "fabric": "Acrylic blend",
    "size": "XL",
    "purchaseDate": "2022-02-13",
    "notes": "Emerging in the 1950s–1960s from functional sports and military underlayers, the mock-neck knit evolved into a minimalist wardrobe staple, valued for its clean neckline and understated silhouette.",
    "metadata": {
      "price": 990,
      "priceCurrency": "TWD"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kataaze-knit-mock-neck-jumper/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/kataaze-knit-mock-neck-jumper/main/2.webp"
    ]
  },

  // ——— Objects ———,

  {
    "id": "x100vi-camera",
    "section": "Objects",
    "category": "Objects",
    "brand": "Fujifilm",
    "name": "X100VI Camera",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "fabric": "Aluminium / Leatherette",
    "weight": "40.2 MP APS-C, 23 mm f/2",
    "size": "128 × 75 × 55 mm",
    "measuredDimensions": "Weight: 521 g",
    "purchaseDate": "2024-10-24",
    "notes": "Since high school, I had wanted a proper camera of my own. Photography remained a long-standing interest that never progressed much beyond casual snapshots until I was encouraged by my friend Daniel to take it more seriously.\n\nChosen for its rangefinder-inspired design, the X100VI occupies a unique position in the modern camera market. Apart from Leica, few cameras embrace that visual language so completely. While not a Leica M, it captures much of the same appeal in a form that is considerably more practical and accessible.",
    "metadata": {
      "price": 14117,
      "priceCurrency": "CNY",
      "showcase_rank": 10,
      "measurementRows": [
        {
          "unit": "g",
          "label": "Weight",
          "value": "521"
        }
      ],
      "secondaryColour": "Silver"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/x100vi-camera/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/x100vi-camera/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/x100vi-camera/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/x100vi-camera/main/4.webp"
    ]
  },

  {
    "id": "ryoma-folding-fan",
    "section": "Objects",
    "category": "Objects",
    "brand": "Miyawaki Baisenan",
    "name": "Ryoma Folding Fan",
    "season": "S/S",
    "colour": "Mustard",
    "colourCode": "#81431b",
    "fabric": "Bamboo, karaki finish / Washi paper",
    "size": "8 sun",
    "purchaseDate": "2025-08-22",
    "notes": "Acquired in Kyoto from Miyawaki Baisenan, a folding-fan specialist established in 1823, this fan is finished in kakishibu, a traditional persimmon tannin coating that gradually darkens and develops character with age.",
    "metadata": {
      "price": 7150,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ryoma-folding-fan/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ryoma-folding-fan/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ryoma-folding-fan/main/3.webp"
    ]
  },

  {
    "id": "ligne-2-lighter",
    "section": "Objects",
    "category": "Objects",
    "brand": "S.T. Dupont",
    "name": "Ligne 2 Lighter",
    "season": "All-season",
    "colour": "Gold Diamond Head",
    "colourCode": "#C9A84C",
    "measuredDimensions": "Size: 62 x 36.9 mm\nThickness: 10.8 mm",
    "purchaseDate": "2026-05-19",
    "notes": "Founded in 1872, S.T. Dupont became one of the defining names in luxury lighters. Although I do not smoke, this example was acquired purely as an object of design and craftsmanship.\n\nThe classic Diamond Head pattern and distinctive ping upon opening have made the Ligne 2 one of the house’s enduring icons.",
    "metadata": {
      "price": 255,
      "priceCurrency": "CNY",
      "showcase_rank": 14,
      "measurementRows": [
        {
          "label": "Size",
          "value": "62 x 36.9 mm"
        },
        {
          "label": "Thickness",
          "value": "10.8 mm"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ligne-2-lighter/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ligne-2-lighter/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ligne-2-lighter/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ligne-2-lighter/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ligne-2-lighter/main/5.webp"
    ]
  },

  {
    "id": "arabesque-card-case",
    "section": "Objects",
    "category": "Objects",
    "brand": "Tsubota Pearl",
    "name": "Arabesque Card Case",
    "season": "All-season",
    "colour": "Silver",
    "colourCode": "#E8E8E8",
    "fabric": "Stainless Steel",
    "measuredDimensions": "Dimensions: 97 × 66 × 13 mm",
    "purchaseDate": "2025-03-19",
    "notes": "At Hololive 6th Fes in 2025, I became fascinated by the Japanese practice of exchanging business cards within hobby communities. Wanting to participate, I designed my own cards and chose this engraved silver card case for its distinctly Edwardian character.",
    "metadata": {
      "price": 1950,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/arabesque-card-case/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/arabesque-card-case/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/arabesque-card-case/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/arabesque-card-case/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/arabesque-card-case/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/arabesque-card-case/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/arabesque-card-case/main/7.webp"
    ]
  },

  {
    "id": "cordovan-l-zip-wallet",
    "section": "Objects",
    "category": "Objects",
    "brand": "Tsuchiya Kaban",
    "name": "Cordovan L Zip Wallet",
    "season": "All-season",
    "colour": "Brown",
    "colourCode": "#7c371b",
    "size": "Cordovan",
    "purchaseDate": "2024-12-26",
    "notes": "Tsuchiya Kaban was a brand I had admired since high school, though it once seemed rather extravagant for something as ordinary as a wallet. In 2020, I discovered the Nume L Zip Wallet and quickly understood its appeal: compact, practical, remarkably slim, and easy to live with.\n\nAfter four years of daily use, moving to Japan in 2024 felt like the natural occasion to replace it with this cordovan version. The design remained unchanged; only the leather evolved.",
    "metadata": {
      "price": 33000,
      "basicColour": "brown",
      "priceCurrency": "JPY",
      "showcase_rank": 12
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cordovan-l-zip-wallet/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cordovan-l-zip-wallet/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cordovan-l-zip-wallet/main/3.webp"
    ]
  },

  // ——— S/S – Mediterranean Resort ———,

  {
    "id": "rib-knit-polo-shirt-dark-chocolate",
    "pillar": "Clothing",
    "section": "S/S – Mediterranean Resort",
    "category": "Tops",
    "brand": "Zara",
    "name": "Rib Knit Polo Shirt",
    "season": "S/S",
    "colour": "Dark Chocolate",
    "colourCode": "#2C2928",
    "size": "XL",
    "measuredDimensions": "Measurements: Chest 59.5 cm · Front length 71.5 cm · Sleeve length 24 cm · Back width 51.5 cm · Arm width 19.5 cm ·  ·  · cm",
    "purchaseDate": "2026-05-14",
    "notes": "Regular fit knitted polo shirt made from cotton yarn. Lapel collar with front button fastening. Ribbed trims.",
    "metadata": {
      "price": 1490,
      "basicColour": "brown",
      "priceCurrency": "TWD",
      "measurementRows": [
        {
          "label": "Measurements",
          "value": "Chest 59.5 cm · Front length 71.5 cm · Sleeve length 24 cm · Back width 51.5 cm · Arm width 19.5 cm ·  ·  ·"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-polo-shirt-dark-chocolate/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-polo-shirt-dark-chocolate/main/2.webp"
    ]
  },

  // ——— Shirts & Tops ———,

  {
    "id": "cable-knit-polo",
    "pillar": "Collections",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "GU",
    "name": "Cable-Knit Polo",
    "season": "S/S",
    "colour": "Wine (White Striped Trim)",
    "colourCode": "#451e2b",
    "fabric": "53% Cotton, 47% Acrylic",
    "size": "XL",
    "purchaseDate": "2025-07-15",
    "metadata": {
      "price": 1990,
      "basicColour": "red",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cable-knit-polo/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cable-knit-polo/main/2.webp"
    ]
  },

  {
    "id": "striped-camp-collar-shirt",
    "pillar": "Collections",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "H&M",
    "name": "Striped Camp Collar Shirt",
    "season": "S/S",
    "colour": "Oatmeal/Striped",
    "colourCode": "#cdc5bc",
    "size": "XL",
    "purchaseDate": "2025-08-01",
    "notes": "Associated with post-war holiday dressing and Mediterranean resort culture, the striped camp-collar shirt represents a form of summer dressing that existed largely outside the traditions that originally shaped the collection.",
    "metadata": {
      "price": 2499,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/striped-camp-collar-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/striped-camp-collar-shirt/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/striped-camp-collar-shirt/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/striped-camp-collar-shirt/main/4.webp"
    ]
  },

  {
    "id": "breton-sailor-shirt",
    "pillar": "Clothing",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Muji",
    "name": "Breton Sailor Shirt",
    "season": "A/W",
    "colour": "Off-White / Navy",
    "colourCode": "#eeeeef",
    "fabric": "Cotton",
    "weight": "Midweight",
    "size": "XL",
    "purchaseDate": "2025-01-31",
    "notes": "The Breton stripe originated in the 1858 French naval uniform as functional maritime wear, later absorbed into 20th-century leisure dressing and adopted by European and American coastal style cultures.",
    "metadata": {
      "price": 2990,
      "basicColour": "white",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/breton-sailor-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/breton-sailor-shirt/main/2.webp"
    ]
  },

  {
    "id": "fine-knit-t-shirt",
    "pillar": "Collections",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Muji",
    "name": "Fine Knit T-Shirt",
    "season": "S/S",
    "colour": "Slate Blue",
    "colourCode": "#606a72",
    "fabric": "Knit",
    "weight": "Lightweight",
    "size": "XL",
    "measuredDimensions": "Measurements: XL\t72.0cm\t48.0cm\t120.0cm\t118.0cm\t53.0cm\t27.5cm\t51.5cm\t106.0cm\t60.0cm\t59.0cm",
    "purchaseDate": "2025-04-07",
    "notes": "* Lightweight hemp-blend knit with a dry, breathable hand feel.\n* Knitted from twisted hemp and polyester yarns for improved washability, shape retention, and reduced surface fuzz.\n* Garment-washed to preserve the natural texture of hemp while achieving 90%+ UV protection.\n* Relaxed crew-neck silhouette, suitable for wearing alone or layered over a T-shirt.\n* Slightly sheer, lightweight fabric with an easy, relaxed fit.",
    "metadata": {
      "price": 1990,
      "priceCurrency": "JPY",
      "measurementRows": [
        {
          "label": "Measurements",
          "value": "XL\t72.0cm\t48.0cm\t120.0cm\t118.0cm\t53.0cm\t27.5cm\t51.5cm\t106.0cm\t60.0cm\t59.0cm"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fine-knit-t-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/fine-knit-t-shirt/main/2.webp"
    ]
  },

  {
    "id": "rugby-shirt",
    "section": "Shirts & Tops",
    "category": "Layering",
    "brand": "Polo Ralph Lauren",
    "name": "Rugby Shirt",
    "season": "A/W",
    "colour": "Wine",
    "colourCode": "#6A1124",
    "fabric": "Cotton",
    "size": "XL",
    "purchaseDate": "2025-01-19",
    "notes": "Originating in 19th-century English rugby uniforms, the striped rugby shirt became a staple of mid-20th-century Ivy League and American preppy style through Ralph Lauren’s reinterpretation.",
    "metadata": {
      "price": 6490,
      "basicColour": "red",
      "priceCurrency": "JPY",
      "secondaryColour": "Cream",
      "secondaryColourCode": "#F5F1E8"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rugby-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rugby-shirt/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rugby-shirt/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rugby-shirt/main/4.webp"
    ]
  },

  {
    "id": "knit-long-sleeve-polo",
    "pillar": "Collections",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "The Engineer",
    "name": "Knit Long-Sleeve Polo",
    "season": "A/W",
    "colour": "Black",
    "colourCode": "#000000",
    "fabric": "Cotton",
    "size": "XXL",
    "purchaseDate": "2024-11-03",
    "metadata": {
      "price": 407.82,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/knit-long-sleeve-polo/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/knit-long-sleeve-polo/main/2.webp"
    ]
  },

  {
    "id": "linen-camp-collar-shirt",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Uniqlo",
    "name": "Linen Camp Collar Shirt",
    "season": "S/S",
    "colour": "Dusty Ice Blue",
    "colourCode": "#B5CDED",
    "fabric": "57% Cotton, 43% Linen",
    "size": "XL",
    "purchaseDate": "2025-07-13",
    "notes": "Originally purchased for a planned visit to the 77th Kamakura Fireworks Festival with Mabel in July 2025, this shirt marked the beginning of a broader shift in how I approached summer dressing.\n\nWanting a shirt that would complement her yukata led me to choose pale blue — a colour I would almost certainly have overlooked in earlier years.\n\nAlthough the festival was ultimately cancelled due to weather, the shirt remained as a reminder of that summer and of the shift in perspective that would later reshape how I approached summer dressing.",
    "metadata": {
      "price": 2990,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/linen-camp-collar-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/linen-camp-collar-shirt/main/2.webp"
    ]
  },

  {
    "id": "ocbd-shirt",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Uniqlo",
    "name": "OCBD Shirt",
    "season": "All-season",
    "colour": "White",
    "colourCode": "#F5F5F9",
    "fabric": "Cotton",
    "size": "XL",
    "purchaseDate": "2020-01-01",
    "notes": "Few garments are more closely associated with Ivy League dress than the OCBD shirt. Originally developed for polo players, its button-down collar was designed to keep the collar in place during play. While the term “polo shirt” is now commonly associated with knitted garments, the original polo shirt was in fact the button-down Oxford shirt. Through Brooks Brothers and Ivy League dress, it became one of the defining foundations of the American wardrobe.",
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY",
      "showcase_rank": 23,
      "colourVariants": [
        {
          "key": "white",
          "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/1.webp",
          "label": "White",
          "notes": "",
          "colour": "White",
          "gallery": [
            "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/2.webp",
            "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/3.webp"
          ],
          "colourCode": "#F5F5F9",
          "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/preview.webp"
        },
        {
          "key": "blue",
          "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue/1.webp",
          "label": "Blue",
          "notes": "",
          "colour": "Blue",
          "gallery": [
            "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue/2.webp"
          ],
          "colourCode": "#BAC9EF",
          "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue/preview.webp"
        },
        {
          "key": "pink-stripe",
          "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/pink-stripe/1.webp",
          "label": "Pink stripe",
          "notes": "",
          "colour": "Pink stripe",
          "gallery": [],
          "colourCode": "#EEE7E4",
          "basicColour": "red",
          "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/pink-stripe/preview.webp"
        },
        {
          "key": "blue-striped",
          "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue-striped/1.webp",
          "label": "Blue striped",
          "notes": "",
          "colour": "Blue striped",
          "gallery": [],
          "colourCode": "#DCE1F5",
          "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue-striped/preview.webp"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/1.webp",
    "colourVariants": [
      {
        "key": "white",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/1.webp",
        "label": "White",
        "notes": "",
        "colour": "White",
        "gallery": [
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/2.webp",
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/3.webp"
        ],
        "colourCode": "#F5F5F9",
        "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/white/preview.webp"
      },
      {
        "key": "blue",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue/1.webp",
        "label": "Blue",
        "notes": "",
        "colour": "Blue",
        "gallery": [
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue/2.webp"
        ],
        "colourCode": "#BAC9EF",
        "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue/preview.webp"
      },
      {
        "key": "pink-stripe",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/pink-stripe/1.webp",
        "label": "Pink stripe",
        "notes": "",
        "colour": "Pink stripe",
        "gallery": [],
        "colourCode": "#EEE7E4",
        "basicColour": "red",
        "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/pink-stripe/preview.webp"
      },
      {
        "key": "blue-striped",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue-striped/1.webp",
        "label": "Blue striped",
        "notes": "",
        "colour": "Blue striped",
        "gallery": [],
        "colourCode": "#DCE1F5",
        "previewImage": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ocbd-shirt/variants/blue-striped/preview.webp"
      }
    ]
  },

  {
    "id": "cutwork-knit-polo-shirt",
    "pillar": "Collections",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Zara",
    "name": "Cutwork Knit Polo Shirt",
    "season": "S/S",
    "colour": "Charcoal",
    "colourCode": "#262626",
    "fabric": "88% acrylic, 12% polyester",
    "size": "XL",
    "purchaseDate": "2025-07-29",
    "metadata": {
      "price": 7990,
      "basicColour": "grey",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cutwork-knit-polo-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cutwork-knit-polo-shirt/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/cutwork-knit-polo-shirt/main/3.webp"
    ]
  },

  {
    "id": "henley-knit-t-shirt",
    "pillar": "Clothing",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Zara",
    "name": "Henley Knit T-Shirt",
    "season": "S/S",
    "colour": "Navy",
    "colourCode": "#1f222e",
    "size": "XL",
    "purchaseDate": "2025-08-09",
    "metadata": {
      "price": 6590,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/7.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/henley-knit-t-shirt/main/8.webp"
    ]
  },

  {
    "id": "linen-loop-collar-shirt",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Zara",
    "name": "Linen Loop-Collar Shirt",
    "season": "S/S",
    "colour": "Oyster-white",
    "fabric": "Linen",
    "size": "XL",
    "purchaseDate": "2025-08-09",
    "notes": "Emerging from mid-century resort wear and leisure dressing, the loop-collar shirt became one of the defining garments of warm-weather casual style. Its open collar and relaxed silhouette make it a natural counterpart to linen tailoring and summer knitwear.",
    "metadata": {
      "price": 8590,
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/linen-loop-collar-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/linen-loop-collar-shirt/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/linen-loop-collar-shirt/main/3.webp"
    ]
  },

  {
    "id": "purl-knit-t-shirt",
    "pillar": "Collections",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Zara",
    "name": "Purl-Knit T-Shirt",
    "season": "S/S",
    "colour": "Off-White",
    "size": "XL",
    "purchaseDate": "2025-08-05",
    "metadata": {
      "price": 5990,
      "basicColour": "white",
      "priceCurrency": "JPY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/purl-knit-t-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/purl-knit-t-shirt/main/2.webp"
    ]
  },

  {
    "id": "rib-knit-polo-shirt-dusty-ice-blue",
    "pillar": "Collections",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Zara",
    "name": "Rib Knit Polo Shirt",
    "season": "S/S",
    "colour": "Dusty Ice Blue",
    "colourCode": "#92a5b1",
    "fabric": "Knit",
    "size": "XL",
    "purchaseDate": "2025-12-12",
    "metadata": {
      "price": 1570,
      "priceCurrency": "TWD"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-polo-shirt-dusty-ice-blue/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/rib-knit-polo-shirt-dusty-ice-blue/main/2.webp"
    ]
  },

  {
    "id": "structured-knit-polo-shirt",
    "pillar": "Clothing",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Zara",
    "name": "Structured Knit Polo Shirt",
    "season": "S/S",
    "colourCode": "#3E3934",
    "size": "XL",
    "measuredDimensions": "Chest: 59.5 cm\nFront length: 71.5 cm\nSleeve length: 24 cm\nBack width: 51.5 cm\nArm width: 19.5 cm",
    "purchaseDate": "2026-05-14",
    "notes": "Regular fit knitted polo shirt in spun cotton yarn. Lapel collar with front opening and short sleeve. Ribbed trims.",
    "metadata": {
      "price": 1490,
      "basicColour": "green",
      "priceCurrency": "TWD",
      "measurementRows": [
        {
          "label": "Chest",
          "value": "59.5"
        },
        {
          "label": "Front length",
          "value": "71.5"
        },
        {
          "label": "Sleeve length",
          "value": "24"
        },
        {
          "label": "Back width",
          "value": "51.5"
        },
        {
          "label": "Arm width",
          "value": "19.5"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/structured-knit-polo-shirt/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/structured-knit-polo-shirt/main/2.webp"
    ]
  },

  // ——— Tailoring & Outerwear ———,

  {
    "id": "golden-fleece-navy-blazer",
    "section": "Tailoring & Outerwear",
    "category": "Tailoring",
    "brand": "Brooks Brothers",
    "name": "Golden Fleece Navy Blazer",
    "season": "A/W",
    "colour": "Navy",
    "colourCode": "#1B1C26",
    "fabric": "Twill",
    "weight": "300 gsm",
    "size": "46R",
    "purchaseDate": "2025-02-01",
    "notes": "Few garments are more closely associated with Ivy League dress than the navy blazer. For many years, I found myself searching for a blazer that combined the details most closely associated with the tradition: swelled-edge stitching, patch pockets, and the classic 3-roll-2 front.\n\nAs Brooks Brothers’ highest-tier tailoring line, Golden Fleece represented the house’s clearest expression of Ivy League tailoring. In bringing together all of those elements, it became the navy blazer I had been searching for all along.",
    "metadata": {
      "price": 55,
      "priceCurrency": "USD",
      "showcase_rank": 4
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/golden-fleece-navy-blazer/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/golden-fleece-navy-blazer/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/golden-fleece-navy-blazer/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/golden-fleece-navy-blazer/main/4.webp"
    ]
  },

  {
    "id": "houndstooth-tweed-jacket",
    "section": "Tailoring & Outerwear",
    "category": "Tailoring",
    "brand": "Brooks Brothers",
    "name": "Houndstooth Tweed Jacket",
    "season": "A/W",
    "colour": "Camel",
    "colourCode": "#998573",
    "fabric": "Tweed",
    "weight": "~450 gsm",
    "size": "46R",
    "purchaseDate": "2025-03-09",
    "notes": "Long associated with British country-house culture and the world of shooting parties, houndstooth later found a second life within Ivy League and American country club dressing, where it became a classic expression of informal upper-class style. Its strong pattern provides a useful contrast to the plainer tweeds elsewhere in the collection.",
    "metadata": {
      "price": 79.99,
      "priceCurrency": "USD"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/houndstooth-tweed-jacket/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/houndstooth-tweed-jacket/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/houndstooth-tweed-jacket/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/houndstooth-tweed-jacket/main/4.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/houndstooth-tweed-jacket/main/5.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/houndstooth-tweed-jacket/main/6.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/houndstooth-tweed-jacket/main/7.webp"
    ]
  },

  {
    "id": "1930s-half-belt-leather-jacket",
    "section": "Tailoring & Outerwear",
    "category": "Outerwear",
    "brand": "Future Piece",
    "name": "1930s Half-Belt Leather Jacket",
    "season": "A/W",
    "colour": "Vicenza Seal",
    "colourCode": "#56382e",
    "notes": "Aero Leather Clothing\n* Vicenza Seal +£90\n* Waldes Grommet Brass +£42\n* Brown Drill\n* Match Stitch\n* Ball & Chain\n* No Inside Pocket\n\n£1,182\n* 47,000～51,000 TWD",
    "metadata": {
      "basicColour": "brown"
    },
    "colourVariants": [
      {
        "key": "seal",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/1.webp",
        "label": "Seal",
        "notes": "",
        "colour": "Vicenza Seal",
        "gallery": [
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/2.webp",
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/3.webp",
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/4.webp",
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/5.webp",
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/6.webp"
        ],
        "colourCode": "#56382e"
      },
      {
        "key": "dark-seal",
        "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Dark%20Seal/1.webp",
        "label": "Dark Seal",
        "notes": "",
        "colour": "Dark Seal",
        "gallery": [
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Dark%20Seal/2.webp",
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Dark%20Seal/3.webp",
          "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/1930s-half-belt-leather-jacket/variants/Dark%20Seal/4.webp"
        ],
        "colourCode": "#291F1D"
      }
    ]
  },

  {
    "id": "herringbone-tweed-jacket",
    "section": "Tailoring & Outerwear",
    "category": "Tailoring",
    "brand": "J. Press",
    "name": "Herringbone Tweed Jacket",
    "season": "A/W",
    "colour": "Grey",
    "colourCode": "#c2bfbb",
    "fabric": "Tweed",
    "weight": "~480 gsm",
    "size": "46R",
    "purchaseDate": "2025-01-13",
    "notes": "Herringbone tweed occupies a central place within both British country tailoring and Ivy League dress. Through its longstanding association with Yale University, J. Press became one of the most influential interpreters of that tradition in America.",
    "metadata": {
      "price": 175,
      "priceCurrency": "USD",
      "showcase_rank": 9
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/herringbone-tweed-jacket/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/herringbone-tweed-jacket/main/2.webp"
    ]
  },

  {
    "id": "boa-fleece-vest",
    "pillar": "Clothing",
    "section": "Tailoring & Outerwear",
    "category": "Layering",
    "brand": "Muji",
    "name": "Boa Fleece Vest",
    "season": "A/W",
    "colour": "Ecru",
    "colourCode": "#eae0d2",
    "fabric": "Sherpa fleece",
    "size": "XL",
    "purchaseDate": "2023-12-09",
    "notes": "A fleece vest from the 1980s–1990s technical outdoor system, associated with Patagonia as a defining brand of functional mid-layer insulation.",
    "metadata": {
      "price": 1190,
      "priceCurrency": "TWD",
      "secondaryColour": "Olive Trim",
      "secondaryColourCode": "#737051"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boa-fleece-vest/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/boa-fleece-vest/main/2.webp"
    ]
  },

  {
    "id": "basket-weave-linen-jacket",
    "section": "Tailoring & Outerwear",
    "category": "Tailoring",
    "brand": "Polo Ralph Lauren",
    "name": "Basket-Weave Linen Jacket",
    "season": "S/S",
    "colour": "Tan",
    "colourCode": "#aa9b83",
    "fabric": "Linen / Lining: Cupro",
    "weight": "~280 gsm",
    "size": "AB8",
    "measuredDimensions": "49 cm\n61 cm\n64 cm\n78 cm",
    "purchaseDate": "2025-02-01",
    "notes": "A Japanese domestic licensed piece from the 1990s under Impact 21, featuring classic American tailoring details including a 3-roll-2 front, notch lapels, side vents, and breathable linen construction. The relaxed silhouette reflects the softer Ivy / trad tailoring proportions typical of Ralph Lauren’s 1990s tailoring. Suitable as a warm-weather sport coat with strong compatibility for both Ivy and classic American casual wardrobes.",
    "metadata": {
      "price": 10620,
      "basicColour": "beige",
      "priceCurrency": "JPY",
      "measurementRows": [
        {
          "label": "",
          "value": "49 cm"
        },
        {
          "label": "",
          "value": "61 cm"
        },
        {
          "label": "",
          "value": "64 cm"
        },
        {
          "label": "",
          "value": "78 cm"
        }
      ]
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/basket-weave-linen-jacket/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/basket-weave-linen-jacket/main/2.webp"
    ]
  },

  {
    "id": "ventile-harrington-jacket",
    "pillar": "Clothing",
    "section": "Tailoring & Outerwear",
    "category": "Outerwear",
    "brand": "Private White VC",
    "name": "Ventile Harrington Jacket",
    "season": "A/W",
    "colour": "Midnight Navy",
    "colourCode": "#20252F",
    "fabric": "Ventile",
    "size": "6=XL",
    "purchaseDate": "2025-12-26",
    "notes": "A 1950s Manchester-produced Harrington jacket constructed from WWII-era Ventile cotton.",
    "metadata": {
      "price": 3377,
      "priceCurrency": "CNY",
      "showcase_rank": 21
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ventile-harrington-jacket/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ventile-harrington-jacket/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ventile-harrington-jacket/main/3.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/ventile-harrington-jacket/main/4.webp"
    ]
  },

  {
    "id": "safari-jacket",
    "section": "Tailoring & Outerwear",
    "category": "Outerwear",
    "brand": "The Engineer",
    "name": "Safari Jacket",
    "season": "S/S",
    "colour": "Ecru",
    "colourCode": "#EBE0D6",
    "fabric": "Linen",
    "weight": "~350 gsm",
    "size": "XXL",
    "purchaseDate": "2023-01-28",
    "notes": "Originating in late 19th-century British colonial travel wear and early 20th-century tropical military dress, the safari jacket developed as a lightweight utility garment adapted to warm climates. Its combination of tailoring and practicality has long made it one of the most distinctive forms of warm-weather menswear, occupying a unique position between military, sporting, and civilian dress.",
    "metadata": {
      "price": 893.32,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/safari-jacket/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/safari-jacket/main/2.webp"
    ]
  },

  // ——— Watches ———,

  {
    "id": "dw-5600e",
    "section": "Watches",
    "category": "Beater",
    "brand": "G-Shock",
    "name": "DW-5600E",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "size": "48.9 × 42.8 mm",
    "measuredDimensions": "Case: 48.9 × 42.8 mm\nThickness: 13.4 mm",
    "purchaseDate": "2020-04-09",
    "notes": "First introduced in 1983, the square G-Shock remains one of the defining forms of the modern digital watch. The DW-5600E was acquired as the collection’s dedicated beater watch, while also serving as a tribute to the Casio digital watch I wore during military service in 2016.",
    "metadata": {
      "price": 1479,
      "basicColour": "black",
      "priceCurrency": "TWD"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/dw-5600e/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/dw-5600e/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/dw-5600e/main/3.webp"
    ]
  },

  {
    "id": "datejust-36-mod",
    "section": "Watches",
    "category": "Everyday",
    "brand": "Seiko",
    "name": "Datejust 36 Mod",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "size": "36 mm",
    "measuredDimensions": "Case: 36 mm\nThickness: 12 mm\nLugs: 20 mm",
    "purchaseDate": "2026-06-10",
    "notes": "Inspired by the all-gold Rolex Datejust, this piece was acquired not as a substitute for the original, but as an appreciation of one of the most enduring forms in post-war watch design.",
    "metadata": {
      "price": 591,
      "priceCurrency": "CNY"
    },
    "image": "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/datejust-36-mod/main/1.webp",
    "gallery": [
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/datejust-36-mod/main/2.webp",
      "https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/datejust-36-mod/main/4.webp"
    ]
  }
];
