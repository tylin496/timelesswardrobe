/**
 * Timeless Wardrobe — frozen catalogue seed (offline fallback + dev).
 *
 * Frozen from Supabase wardrobe_items on 2026-05-30T00:14:43.899Z.
 * Regenerate: npm run db:freeze-catalogue
 *
 * Collection thesis is described in the site header. Each row uses `category` (and optional
 * `season`) for browsing; `section` / `pillar` are legacy fields and not shown in the UI.
 *
 * Images: local files under `/images/wardrobe/` (backed up from Supabase Storage).
 * Optional `gallery`: string[] of extra image URLs; `image` is always the cover.
 * Optional `colourVariants`: same product in multiple colours — one collection row.
 * Optional `size`, `measuredDimensions`, and `purchaseDate`.
 */

const WARDROBE_ITEMS = [
  {
    "id": "1930s-half-belt",
    "category": "Outerwear",
    "brand": "Aero Leather Clothing",
    "name": "1930s Half Belt",
    "colour": "Vicenza Seal",
    "colourCode": "#56382e",
    "image": "/images/wardrobe/1930s-half-belt/main/cover.png",
    "gallery": [
      "/images/wardrobe/1930s-half-belt/main/gallery/01.jpg",
      "/images/wardrobe/1930s-half-belt/main/gallery/02.png",
      "/images/wardrobe/1930s-half-belt/main/gallery/03.png",
      "/images/wardrobe/1930s-half-belt/main/gallery/04.jpg",
      "/images/wardrobe/1930s-half-belt/main/gallery/05.png",
      "/images/wardrobe/1930s-half-belt/main/gallery/06.png",
      "/images/wardrobe/1930s-half-belt/main/gallery/07.png"
    ],
    "notes": "* Vicenza Seal\n* Match Stitch\n* Brown Drill\n* Waldes Grommet Brass\n* Ball & Chain\n* No Inside Pocket",
    "metadata": {
      "basicColour": "brown"
    }
  },

  {
    "id": "tassel-loafer",
    "category": "Footwear",
    "brand": "Alden",
    "name": "Tassel Loafer",
    "season": "All-season",
    "colour": "Color 8",
    "colourCode": "#492C2E",
    "fabric": "Horween shell cordovan",
    "weight": "563",
    "size": "US 10.5 E",
    "purchaseDate": "2023-01-19",
    "image": "/images/wardrobe/tassel-loafer/main/cover.webp",
    "gallery": [
      "/images/wardrobe/tassel-loafer/main/gallery/01.webp"
    ],
    "notes": "Sole: Single oak leather outsole \nLast: Aberdeen",
    "metadata": {
      "price": 200,
      "basicColour": "red",
      "priceCurrency": "USD"
    }
  },

  {
    "id": "sage-beaufort-waxed-jacket",
    "category": "Outerwear",
    "brand": "Barbour",
    "name": "Beaufort Waxed Jacket",
    "season": "A/W",
    "colour": "Sage",
    "colourCode": "40403C",
    "fabric": "Waxed cotton",
    "size": "44",
    "purchaseDate": "2025-08-01",
    "image": "/images/wardrobe/sage-beaufort-waxed-jacket/main/cover.webp",
    "gallery": [
      "/images/wardrobe/sage-beaufort-waxed-jacket/main/gallery/01.webp",
      "/images/wardrobe/sage-beaufort-waxed-jacket/main/gallery/02.webp",
      "/images/wardrobe/sage-beaufort-waxed-jacket/main/gallery/04.webp",
      "/images/wardrobe/sage-beaufort-waxed-jacket/main/gallery/03.webp"
    ],
    "metadata": {
      "price": 43200,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "curb-bracelet",
    "category": "Jewellery",
    "brand": "Bespoke",
    "name": "Curb Bracelet",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#D6C082",
    "weight": "18ct yellow gold, 5.2 mm",
    "size": "20.5 cm （8.07inches）",
    "purchaseDate": "2024-10-26",
    "image": "/images/wardrobe/curb-bracelet/1778704222719-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/curb-bracelet/main/gallery/01.webp",
      "/images/wardrobe/curb-bracelet/main/gallery/01.webp"
    ],
    "notes": "Size: 20.5 cm （8.07inches）\nWeight: 11.71 g\nGold price: 596 CNY/g (base: 472, +45% vs 2020)\nMaking: 124 CNY/g\nTotal: 6,973 CNY ≈ 31,200 TWD (2024)\nDate: 26 October 2024",
    "metadata": {
      "price": 31200,
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "rolo-chain",
    "category": "Jewellery",
    "brand": "Bespoke Tailor",
    "name": "Rolo Chain",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#ffe691",
    "weight": "18ct yellow gold, 2.5 mm",
    "size": "50 cm",
    "purchaseDate": "2024-08-20",
    "image": "/images/wardrobe/rolo-chain/1778704232768-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/rolo-chain/main/gallery/01.webp"
    ],
    "notes": "Size: 50 cm\nWeight: 9.29 g\nGold price: 514 CNY/g (base: 431, +25% vs 2020)\nMaking: 83 CNY/g\nTotal: 4,778 CNY ≈ 21,400 TWD (2024)\n\u001aDate: 20 August 2024",
    "metadata": {
      "price": 21400,
      "basicColour": "gold",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "ruby-gypsy-ring",
    "category": "Jewellery",
    "brand": "Bespoke Tailor",
    "name": "Ruby Gypsy Ring",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#ffe691",
    "fabric": "18K",
    "weight": "18ct yellow gold with Diamonds, 6.8 mm face, 3 mm shank",
    "size": "HK 22",
    "purchaseDate": "2024-08-04",
    "image": "/images/wardrobe/ruby-gypsy-ring/1778698277222-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/ruby-gypsy-ring/main/gallery/02.webp",
      "/images/wardrobe/ruby-gypsy-ring/main/gallery/01.webp"
    ],
    "notes": "Size: HK 22 (2024-10-10; adjusted to 22.5–23 on 2026-04-07)\nWeight: 8.20 g (total, including stones)       Gold price: 604 CNY/g (base 450, +47% vs 2020)\nRuby: 3 × 4 mm (~0.2 ct)\nDiamonds: 2.3 mm × 2 (total ~0.1 ct)\nMaking: 154 CNY/g\nTotal: 5,057 CNY ≈ 22,600 TWD (2024)\n\nEngraving\nInscription: Ad Meliora . 2024\n\nReference: A gold ring inset with a single turquoise, inscribed Rumpenheim, 1843",
    "metadata": {
      "price": 22600,
      "basicColour": "gold",
      "priceCurrency": "TWD",
      "secondaryColour": "Pigeon's Blood Ruby",
      "secondaryColourCode": "b7172a"
    }
  },

  {
    "id": "signet-ring",
    "category": "Jewellery",
    "brand": "Bespoke Tailor",
    "name": "Signet Ring",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#ffe691",
    "weight": "18ct yellow gold, 12 × 14 mm",
    "size": "HK 14",
    "purchaseDate": "2020-11-01",
    "image": "/images/wardrobe/signet-ring/main/cover.webp",
    "gallery": [
      "/images/wardrobe/signet-ring/main/gallery/02.webp",
      "/images/wardrobe/signet-ring/main/gallery/01.webp",
      "/images/wardrobe/signet-ring/main/gallery/01.webp"
    ],
    "notes": "Size: HK 14 (2020-11-20; confirmed 2026-04-07)\nWeight: 9.6 g (actual)       Gold price: 411 CNY/g (base: 385 CNY/g)\nMaking: 78 CNY/g\nTotal: 4,698 CNY ≈ 20,000 TWD (2020)\nDate: 1 November 2020\n\nEngraving: Victorian interlaced monogram (TYL)",
    "metadata": {
      "price": 20000,
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "golden-fleece-navy-blazer",
    "category": "Jackets",
    "brand": "Brooks Brothers",
    "name": "Golden Fleece Navy Blazer",
    "season": "A/W",
    "colour": "Navy",
    "colourCode": "#1B1C26",
    "fabric": "Twill",
    "weight": "300 gsm",
    "size": "46R",
    "purchaseDate": "2025-02-01",
    "image": "/images/wardrobe/golden-fleece-navy-blazer/1778693552701-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/golden-fleece-navy-blazer/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 55,
      "priceCurrency": "USD"
    }
  },

  {
    "id": "houndstooth-tweed-jacket",
    "category": "Jackets",
    "brand": "Brooks Brothers",
    "name": "Houndstooth Tweed Jacket",
    "season": "A/W",
    "colour": "Camel",
    "colourCode": "#998573",
    "fabric": "Tweed",
    "weight": "~450 gsm",
    "size": "46R",
    "purchaseDate": "2025-03-09",
    "image": "/images/wardrobe/houndstooth-tweed-jacket/main/cover.webp",
    "gallery": [
      "/images/wardrobe/houndstooth-tweed-jacket/main/gallery/01.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/gallery/02.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/gallery/03.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/gallery/04.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/gallery/05.webp"
    ],
    "metadata": {
      "price": 79.99,
      "priceCurrency": "USD"
    }
  },

  {
    "id": "balmacaan-coat",
    "category": "Outerwear",
    "brand": "Burberrys",
    "name": "Balmacaan Coat",
    "season": "A/W",
    "colour": "Stone Beige",
    "colourCode": "#dbd3c7",
    "weight": "Single-Breasted",
    "size": "42R",
    "purchaseDate": "2020-12-06",
    "image": "/images/wardrobe/balmacaan-coat/main/cover.webp",
    "gallery": [
      "/images/wardrobe/balmacaan-coat/main/gallery/01.webp",
      "/images/wardrobe/balmacaan-coat/main/gallery/02.webp",
      "/images/wardrobe/balmacaan-coat/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 83.99,
      "priceCurrency": "USD"
    }
  },

  {
    "id": "tank-solo",
    "category": "Dress watch",
    "brand": "Cartier",
    "name": "Tank Solo",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "D6C082",
    "weight": "W5200004",
    "size": "Large Model",
    "purchaseDate": "2024-11-03",
    "image": "/images/wardrobe/tank-solo/main/cover.webp",
    "gallery": [
      "/images/wardrobe/tank-solo/main/gallery/01.webp"
    ],
    "notes": "Reference: W5200004\nMovement: Cartier Cal. 690 quartz\nCase: 34.8 × 27.4 mm, 18ct yellow gold with alloyed steel case back\nThickness: 5.55 mm\nLugs: 17 mm\nCrown: Beaded crown set with blue synthetic spinel cabochon\nDial: Clear silvered opaline dial, Roman numerals\nHands: Blued-steel sword-shaped hands\nCrystal: Square sapphire crystal\nStrap: Brown square-scale alligator leather\nBuckle: 18ct yellow gold ardillon buckle\nWater Resistance: 3 bar (30 m)\n\nNotes:\nDesigned by Louis Cartier in 1917, the Tank remains one of the purest expressions of modern watch design, defined by geometry, restraint, and exact proportion. In continuous production for over a century, it has remained unmistakable while giving rise to later interpretations including Tank Cintrée, Chinoise, Américaine, and Française. The blue spinel cabochon crown, Roman numerals, and blued-steel hands preserve Cartier’s original design language. At only 5.55 mm thick, it retains the ultra-thin elegance expected of a true dress watch. As the only solid-gold watch in this collection, the Tank serves as its aesthetic anchor—not a variation, but one of the original canonical forms of twentieth-century design.",
    "metadata": {
      "price": 100000,
      "basicColour": "gold",
      "priceCurrency": "TWD",
      "secondaryColour": "Brown Aligator Strap",
      "secondaryColourCode": "9A4B17"
    }
  },

  {
    "id": "achilles-low",
    "category": "Footwear",
    "brand": "Common Projects",
    "name": "Achilles Low",
    "season": "All-season",
    "colour": "White",
    "colourCode": "#f1f1ee",
    "fabric": "Leather",
    "size": "EU 45",
    "purchaseDate": "2025-11-28",
    "image": "/images/wardrobe/achilles-low/main/1779712394690-onysgz-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/achilles-low/main/gallery/1779712396116-2zw3m1-gallery-01.webp",
      "/images/wardrobe/achilles-low/main/gallery/1779712392924-2o7afz-gallery-02.webp"
    ],
    "notes": "Margom cup sole. Date: 28 Nov 2025.",
    "metadata": {
      "price": 374.85,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "funnel-neck-knitted-wool-jacket",
    "category": "Outerwear",
    "brand": "COS",
    "name": "Funnel-Neck Knitted Wool Jacket",
    "season": "All-season",
    "colour": "Charcoal",
    "colourCode": "#4e4e50",
    "fabric": "Wool",
    "size": "XL",
    "measuredDimensions": "51.5 cm\n122 cm\n45.5 cm\n64 cm",
    "purchaseDate": "2026-06-23",
    "image": "/images/wardrobe/funnel-neck-knitted-wool-jacket/main/1779727406820-zngvl9-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/funnel-neck-knitted-wool-jacket/main/gallery/01.webp",
      "/images/wardrobe/funnel-neck-knitted-wool-jacket/main/gallery/1779712063546-y4a466-gallery-02.webp",
      "/images/wardrobe/funnel-neck-knitted-wool-jacket/main/gallery/1779712067243-s4mdvc-gallery-03.webp",
      "/images/wardrobe/funnel-neck-knitted-wool-jacket/main/gallery/1779712069188-69w47n-gallery-04.webp"
    ],
    "metadata": {
      "price": 366.1,
      "priceCurrency": "CNY",
      "measurementRows": [
        {
          "label": "",
          "value": "51.5"
        },
        {
          "label": "",
          "value": "122"
        },
        {
          "label": "",
          "value": "45.5"
        },
        {
          "label": "",
          "value": "64"
        }
      ]
    }
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
    "image": "/images/wardrobe/chukka/1778697977522-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/chukka/main/gallery/01.webp"
    ],
    "notes": "Unlined ankle boot; Scotch-guard treated\nSole: single leather\nLast: 200",
    "metadata": {
      "price": 161.44,
      "basicColour": "brown",
      "priceCurrency": "USD"
    }
  },

  {
    "id": "pembroke",
    "category": "Footwear",
    "brand": "Crockett & Jones",
    "name": "Pembroke",
    "season": "All-season",
    "colour": "Tan",
    "colourCode": "#a3480e",
    "fabric": "Scotch grain calf",
    "size": "UK 10 E",
    "purchaseDate": "2020-10-26",
    "image": "/images/wardrobe/pembroke/1778698000508-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/pembroke/main/cover.webp"
    ],
    "notes": "Type: Full brogue country derby, wing-tip with full punching\nSole: Dainite rubber\nLast: 325",
    "metadata": {
      "price": 201.75,
      "basicColour": "brown",
      "priceCurrency": "USD"
    }
  },

  {
    "id": "copy",
    "category": "Bottoms",
    "brand": "Cultum",
    "name": "Fluid Boot-Cut Trousers",
    "season": "All-season",
    "colour": "Walnut Brown",
    "colourCode": "#343132",
    "fabric": "Fabric: 64.2% Polyester / 19.2% Viscose / 16.6% Wool Lining: 55% Polyester / 45%",
    "weight": "345 gsm",
    "size": "W36",
    "measuredDimensions": "Waist: 94 cm\nHip: 124 cm\nFront Rise: 35.3 cm\nBack Rise: 47.9 cm\nOutseam Length: 114 cm\nThigh Width: 77.6 cm\nLeg Opening: 58 cm",
    "purchaseDate": "2026-06-25",
    "image": "/images/wardrobe/copy/main/1779727431483-jccst3-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/copy/main/1779723202155-ax5rke-cover-edit.webp",
      "/images/wardrobe/copy/main/gallery/01.webp",
      "/images/wardrobe/copy/main/gallery/02.webp"
    ],
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
          "label": "Outseam Length",
          "value": "114"
        },
        {
          "label": "Thigh Width",
          "value": "77.6"
        },
        {
          "label": "Leg Opening",
          "value": "58"
        }
      ]
    }
  },

  {
    "id": "navy-double-breasted-blazer",
    "category": "Jackets",
    "brand": "Cultum",
    "name": "Navy Double-Breasted  Blazer",
    "season": "A/W",
    "colour": "Navy",
    "colourCode": "#20232D",
    "fabric": "Super 120s Wool",
    "weight": "265 gsm",
    "size": "56C",
    "purchaseDate": "2024-11-06",
    "image": "/images/wardrobe/navy-double-breasted-blazer/main/cover.webp",
    "gallery": [
      "/images/wardrobe/navy-double-breasted-blazer/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 1284.65,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "white-jeans",
    "category": "Bottoms",
    "brand": "Cultum",
    "name": "Wide-Leg White Jeans",
    "season": "All-season",
    "colour": "White",
    "fabric": "Cotton",
    "weight": "470 gsm",
    "size": "W36",
    "measuredDimensions": "Waist: 94 cm\nHip: 115 cm\nFront Rise: 34.5 cm\nBack Rise: 47 cm\nThigh: 73 cm\nKnee: 58 cm\nLeg Opening: 53 cm\nOutseam: 110 cm",
    "purchaseDate": "2026-06-25",
    "image": "/images/wardrobe/white-jeans/main/1779712484801-3hnc98-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/white-jeans/main/gallery/01.webp"
    ],
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
    }
  },

  {
    "id": "kingsman-0847-sunglasses",
    "category": "Eyewear",
    "brand": "Cutler and Gross",
    "name": "Kingsman 0847 Sunglasses",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "measuredDimensions": "Lens Width: 54 mm\nBridge Width: 19 mm\nTemple Length: 145 mm\nLens Height: 39.5 mm\nFrame Height: 43 mm\nFrame Width: 142 mm",
    "purchaseDate": "2023-11-27",
    "image": "/images/wardrobe/kingsman-0847-sunglasses/main/cover.webp",
    "gallery": [
      "/images/wardrobe/kingsman-0847-sunglasses/main/gallery/01.webp",
      "/images/wardrobe/kingsman-0847-sunglasses/main/gallery/02.webp"
    ],
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
          "label": "Bridge Width",
          "value": "19"
        },
        {
          "label": "Temple Length",
          "value": "145"
        },
        {
          "label": "Lens Height",
          "value": "39.5"
        },
        {
          "label": "Frame Height",
          "value": "43"
        },
        {
          "label": "Frame Width",
          "value": "142"
        }
      ],
      "measurementUnit": "mm",
      "secondaryColour": "Brown Lenses"
    }
  },

  {
    "id": "gt1-hardwood-umbrella",
    "category": "Objects",
    "brand": "Fox Umbrellas",
    "name": "GT1 Hardwood Umbrella",
    "season": "All-season",
    "colour": "Black",
    "purchaseDate": "2026-01-11",
    "image": "/images/wardrobe/gt1-hardwood-umbrella/main/1779749315137-pjd8if-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/gt1-hardwood-umbrella/main/gallery/1779749317922-ims43k-gallery-01.webp",
      "/images/wardrobe/gt1-hardwood-umbrella/main/gallery/1779749321205-vtrgl1-gallery-02.webp",
      "/images/wardrobe/gt1-hardwood-umbrella/main/gallery/1779749322083-j16hm5-gallery-03.webp",
      "/images/wardrobe/gt1-hardwood-umbrella/main/1779730770610-j2eqty-cover-edit.webp"
    ],
    "notes": "Made in Britain by Fox Umbrellas, established in 1868.\n\nBuilt on a 25-inch Classic Fox steel tube frame with black ribs, a black 100% Best Polyester canopy, and a polished ash hardwood handle in a light grained finish.\n\nManual opening mechanism with matching outside case.\n\nCanopy diameter: 104.5 cm\nFull length: 91 cm\nWeight: approximately 530 g\nFrame: 25” Classic Fox brown steel tube frame with black ribs\nCanopy: 100% Best Polyester, water-repellent and UV-treated\nHandle: Ash hardwood, light grained finish\nWood genus: Fraxinus\nWood species: Chinensis\nMade in Britain",
    "metadata": {
      "price": 20730,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "x100vi",
    "category": "Objects",
    "brand": "Fujifilm",
    "name": "X100VI",
    "season": "All-season",
    "colour": "Black",
    "purchaseDate": "2024-10-24",
    "image": "/images/wardrobe/x100vi/main/1779749526596-gob720-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/x100vi/main/gallery/1779749530199-rcvmfn-gallery-01.webp",
      "/images/wardrobe/x100vi/main/gallery/1779749531894-83ln93-gallery-02.webp",
      "/images/wardrobe/x100vi/main/gallery/1779749535052-7nm6mi-gallery-03.webp"
    ],
    "metadata": {
      "price": 14117,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "a-2-leather-jacket",
    "category": "Outerwear",
    "brand": "Future Piece",
    "name": "A-2 Leather Jacket",
    "season": "A/W",
    "colour": "Dark Brown",
    "colourCode": "#312525",
    "fabric": "Horsehide",
    "image": "/images/wardrobe/a-2-leather-jacket/main/cover.webp",
    "gallery": [
      "/images/wardrobe/a-2-leather-jacket/main/gallery/01.webp"
    ]
  },

  {
    "id": "sapphire-ring",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Sapphire Ring",
    "season": "All-season",
    "colour": "Platinum",
    "colourCode": "#e8e8e8",
    "fabric": "Platinum",
    "image": "/images/wardrobe/sapphire-ring/main/cover.webp",
    "gallery": [
      "/images/wardrobe/sapphire-ring/main/gallery/01.webp"
    ],
    "notes": "Sapphire: 8 × 6 mm (1.3 - 1.5 ct)\nHue: Light cornflower blue (矢車菊藍)\n\nReference: Garrard 1735 sapphire ring",
    "metadata": {
      "secondaryColour": "Sapphire",
      "secondaryColourCode": "#384D87"
    }
  },

  {
    "id": "wedding-bands",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Wedding Bands",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#ffe691",
    "fabric": "Pt950 1.8 mm (bride) / 18ct YG 2 mm size 13 (groom)",
    "image": "/images/wardrobe/wedding-bands/main/cover.webp",
    "gallery": [
      "/images/wardrobe/wedding-bands/main/gallery/05.webp",
      "/images/wardrobe/wedding-bands/main/gallery/02.webp",
      "/images/wardrobe/wedding-bands/main/gallery/03.webp",
      "/images/wardrobe/wedding-bands/main/gallery/04.webp"
    ],
    "notes": "Inscription: spouse name · date (e.g. Edward · 29 Mai). Worn at base when stacked. Reference: bands of Prince Edward Duke of Kent (1767–1820) and Princess Victoria Duchess of Kent (1786–1861).",
    "metadata": {
      "basicColour": "gold"
    }
  },

  {
    "id": "dw-5600",
    "category": "Beater",
    "brand": "G-Shock",
    "name": "DW-5600E",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#121212",
    "purchaseDate": "2020-04-09",
    "image": "/images/wardrobe/dw-5600/main/cover.webp",
    "gallery": [
      "/images/wardrobe/dw-5600/main/gallery/01.webp"
    ],
    "notes": "The Casio DW-5600E preserves the original square-form design language established by the first G-Shock models of the 1980s. Although positioned within the collection as the dedicated beater watch, it remains one of the defining forms of the modern digital watch, with a design language that has remained essentially unchanged for decades.",
    "metadata": {
      "price": 1479,
      "basicColour": "black",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "cable-knit-polo",
    "category": "Shirts",
    "brand": "GU",
    "name": "Cable-Knit Polo",
    "season": "S/S",
    "colour": "Wine (White Striped Trim)",
    "colourCode": "#451e2b",
    "fabric": "53% Cotton, 47% Acrylic",
    "size": "XL",
    "purchaseDate": "2025-07-15",
    "image": "/images/wardrobe/cable-knit-polo/main/cover.webp",
    "gallery": [
      "/images/wardrobe/cable-knit-polo/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 1990,
      "basicColour": "red",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "wide-straight-trousers",
    "category": "Bottoms",
    "brand": "GU",
    "name": "Wide-Straight Trousers",
    "season": "All-season",
    "colour": "Tan",
    "colourCode": "#8A7C6F",
    "fabric": "Poly blend",
    "weight": "Crease front",
    "size": "XL",
    "purchaseDate": "2025-08-11",
    "image": "/images/wardrobe/wide-straight-trousers/main/cover.webp",
    "gallery": [
      "/images/wardrobe/wide-straight-trousers/main/gallery/01.avif"
    ],
    "notes": "ワイドスラックス+EC(丈長め78.5cm)",
    "metadata": {
      "price": 2990,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "hole-knit-polo-shirt",
    "category": "Shirts",
    "brand": "H&M",
    "name": "Hole-Knit Polo Shirt",
    "season": "S/S",
    "colour": "Oatmeal Beige",
    "colourCode": "#D6C6B4",
    "fabric": "Knit",
    "size": "XL",
    "purchaseDate": "2025-07-28",
    "image": "/images/wardrobe/hole-knit-polo-shirt/1778703469914-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/hole-knit-polo-shirt/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 2499,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "linen-pleated-shorts",
    "category": "Bottoms",
    "brand": "H&M",
    "name": "Linen Pleated Shorts",
    "season": "S/S",
    "colour": "Ecru",
    "colourCode": "#E2DDD1",
    "fabric": "Linen",
    "size": "XL",
    "purchaseDate": "2025-07-29",
    "image": "/images/wardrobe/linen-pleated-shorts/1778703351069-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/linen-pleated-shorts/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 3600,
      "basicColour": "white",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "striped-camp-collar-shirt",
    "category": "Shirts",
    "brand": "H&M",
    "name": "Striped Camp Collar Shirt",
    "season": "S/S",
    "colour": "Oatmeal/Striped",
    "colourCode": "#cdc5bc",
    "size": "XL",
    "purchaseDate": "2025-08-01",
    "image": "/images/wardrobe/striped-camp-collar-shirt/1778703504683-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/striped-camp-collar-shirt/main/gallery/01.webp",
      "/images/wardrobe/striped-camp-collar-shirt/main/gallery/02.webp",
      "/images/wardrobe/striped-camp-collar-shirt/main/gallery/03.webp"
    ],
    "notes": "Regular Fit Textured resort shirt",
    "metadata": {
      "price": 2499,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "herringbone-tweed-jacket",
    "category": "Jackets",
    "brand": "J. Press",
    "name": "Herringbone Tweed Jacket",
    "season": "A/W",
    "colour": "Grey",
    "colourCode": "#c2bfbb",
    "fabric": "Tweed",
    "weight": "~480 gsm",
    "size": "46R",
    "purchaseDate": "2025-01-13",
    "image": "/images/wardrobe/herringbone-tweed-jacket/main/cover.webp",
    "gallery": [
      "/images/wardrobe/herringbone-tweed-jacket/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 175,
      "priceCurrency": "USD"
    }
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
    "image": "/images/wardrobe/smoke-olive-acetate-optical/main/cover.webp",
    "gallery": [
      "/images/wardrobe/smoke-olive-acetate-optical/main/gallery/01.webp",
      "/images/wardrobe/smoke-olive-acetate-optical/main/gallery/02.webp"
    ],
    "metadata": {
      "price": 990,
      "basicColour": "green",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "corduroy-trousers",
    "category": "Bottoms",
    "brand": "L.L.Bean",
    "name": "Corduroy Trousers",
    "season": "A/W",
    "colour": "Dark Khaki",
    "colourCode": "#c6ac88",
    "fabric": "Corduroy",
    "size": "38 x 30 inch",
    "purchaseDate": "2025-01-01",
    "image": "/images/wardrobe/corduroy-trousers/main/1779712803040-23iajc-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/corduroy-trousers/main/gallery/1779712797549-lk3wxj-gallery-01.webp"
    ],
    "metadata": {
      "price": 11000,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "passport-cover",
    "category": "Objects",
    "brand": "Louis Vuitton",
    "name": "Passport Cover",
    "season": "All-season",
    "colour": "Monogram Canvas",
    "colourCode": "#6B5234",
    "purchaseDate": "2024-10-26",
    "image": "/images/wardrobe/passport-cover/main/1779734508194-a3qa3i-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/passport-cover/main/gallery/1779749812525-hqjbkn-gallery-01.webp",
      "/images/wardrobe/passport-cover/main/gallery/1779746767926-uidc35-gallery-02.webp",
      "/images/wardrobe/passport-cover/main/gallery/1779734518981-8jccfr-gallery-03.webp"
    ],
    "metadata": {
      "price": 271.1,
      "basicColour": "brown",
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "grand-soir",
    "category": "Evening",
    "brand": "Maison Francis Kurkdjian",
    "name": "Grand Soir",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#D6C082",
    "weight": "Labdanum, benzoin, vanilla, amber",
    "size": "70 ml",
    "purchaseDate": "2025-08-01",
    "image": "/images/wardrobe/grand-soir/main/cover.webp",
    "gallery": [
      "/images/wardrobe/grand-soir/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 22000,
      "basicColour": "__omit__",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "ryoma-kakishibu-folding-fan",
    "category": "Objects",
    "brand": "Miyawaki Baisenan",
    "name": "Ryoma Kakishibu Folding Fan",
    "season": "S/S",
    "colour": "Mustard",
    "colourCode": "#81431b",
    "purchaseDate": "2025-08-22",
    "image": "/images/wardrobe/ryoma-kakishibu-folding-fan/main/1779748519691-niy1k7-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/ryoma-kakishibu-folding-fan/main/gallery/1779748523574-pcyo9m-gallery-01.webp",
      "/images/wardrobe/ryoma-kakishibu-folding-fan/main/gallery/1779748525757-htusek-gallery-02.webp"
    ],
    "notes": "Handcrafted in Japan by Miyawaki Baisenan, a Kyoto fan maker.\n\nThe washi paper fan face is finished with kakishibu, a fermented green persimmon tannin dye that improves the durability of the paper. The colour will gradually deepen and settle with oxidation through use.\n\nMade with karaki-finished bamboo ribs.\n\nSize: 8 sun, approximately 24 cm\nRibs: Bamboo, karaki finish\nFan face: Washi paper\nMade in Japan",
    "metadata": {
      "price": 7150,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "meisterstuck-classique-rollerball",
    "category": "Objects",
    "brand": "Montblanc",
    "name": "Meisterstück Classique Rollerball",
    "season": "All-season",
    "colour": "Black",
    "purchaseDate": "2022-02-20",
    "image": "/images/wardrobe/meisterstuck-classique-rollerball/main/1779736503515-pu6ma1-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/meisterstuck-classique-rollerball/main/gallery/1779736505967-9sansv-gallery-01.webp",
      "/images/wardrobe/meisterstuck-classique-rollerball/main/gallery/1779736507513-jsgp15-gallery-02.webp",
      "/images/wardrobe/meisterstuck-classique-rollerball/main/gallery/1779736509426-6hxfyi-gallery-03.webp"
    ],
    "metadata": {
      "secondaryColour": "Gold"
    }
  },

  {
    "id": "aran-cable-knit-jumper",
    "category": "Mid Layer",
    "brand": "Muji",
    "name": "Aran Cable-Knit Jumper",
    "season": "A/W",
    "colour": "Mushroom Taupe",
    "colourCode": "B2A9A5",
    "fabric": "Wool",
    "weight": "Heavy",
    "size": "XL",
    "purchaseDate": "2024-12-27",
    "image": "/images/wardrobe/aran-cable-knit-jumper/main/cover.webp",
    "gallery": [
      "/images/wardrobe/aran-cable-knit-jumper/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 7990,
      "basicColour": "beige",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "fine-knit-t-shirt",
    "category": "Shirts",
    "brand": "Muji",
    "name": "Fine Knit T-Shirt",
    "season": "S/S",
    "colour": "Slate Blue",
    "colourCode": "#606a72",
    "fabric": "Knit",
    "weight": "Lightweight",
    "size": "XL",
    "measuredDimensions": "Measurements: XL\t72.0cm\t48.0cm\t120.0cm\t118.0cm\t53.0cm\t27.5cm\t51.5cm\t106.0cm\t60.0cm\t59.0cm cm",
    "purchaseDate": "2025-04-07",
    "image": "/images/wardrobe/fine-knit-t-shirt/main/cover.webp",
    "gallery": [
      "/images/wardrobe/fine-knit-t-shirt/main/gallery/01.webp"
    ],
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
    }
  },

  {
    "id": "v-neck-cardigan",
    "category": "Mid Layer",
    "brand": "Muji",
    "name": "V-Neck Cardigan",
    "season": "A/W",
    "colour": "Navy",
    "colourCode": "#19202c",
    "fabric": "High-Gauge Wool",
    "weight": "Lightweight",
    "size": "XL",
    "purchaseDate": "2024-12-17",
    "image": "/images/wardrobe/v-neck-cardigan/main/cover.webp",
    "gallery": [
      "/images/wardrobe/v-neck-cardigan/main/gallery/01.webp",
      "/images/wardrobe/v-neck-cardigan/main/gallery/02.webp"
    ],
    "notes": "紳士　洗えるウールハイゲージＶネックカーディガン紳士ＸＬ・ダークネイビー",
    "metadata": {
      "price": 4990,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "wide-leg-jeans",
    "category": "Bottoms",
    "brand": "MUJI",
    "name": "Wide-Leg Jeans",
    "season": "All-season",
    "colour": "Cream",
    "colourCode": "#ebe6d5",
    "fabric": "Kapok, Cotton",
    "size": "XL",
    "purchaseDate": "2025-04-21",
    "image": "/images/wardrobe/wide-leg-jeans/main/cover.webp",
    "gallery": [
      "/images/wardrobe/wide-leg-jeans/main/gallery/01.webp"
    ],
    "notes": "木の実から作ったカポック混キャンバスワイドパンツ\nカラー：生成\nサイズ：紳士ＸＬ\n商品番号：84218460",
    "metadata": {
      "price": 4990,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "new-york",
    "category": "Day",
    "brand": "Nicolaï",
    "name": "New York",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#BFA665",
    "weight": "Bergamot, black pepper, oak moss.",
    "size": "100 ml",
    "purchaseDate": "2025-08-02",
    "image": "/images/wardrobe/new-york/1778704154934-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/new-york/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 23000,
      "basicColour": "__omit__",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "ferret",
    "category": "Footwear",
    "brand": "Paraboot",
    "name": "Ferret",
    "season": "S/S",
    "colour": "Lisse Café",
    "colourCode": "#332826",
    "weight": "Rubber Sole",
    "size": "UK 10",
    "purchaseDate": "2025-08-03",
    "image": "/images/wardrobe/ferret/main/cover.webp",
    "gallery": [
      "/images/wardrobe/ferret/main/gallery/01.webp",
      "/images/wardrobe/ferret/main/gallery/02.webp",
      "/images/wardrobe/ferret/main/gallery/03.webp"
    ],
    "metadata": {
      "price": 41696,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "basket-weave-linen-jacket",
    "category": "Jackets",
    "brand": "Polo Ralph Lauren",
    "name": "Basket-Weave Linen Jacket",
    "season": "S/S",
    "colour": "Tan",
    "colourCode": "#aa9b83",
    "fabric": "Linen",
    "weight": "~280 gsm",
    "size": "AB8",
    "purchaseDate": "2025-02-01",
    "image": "/images/wardrobe/basket-weave-linen-jacket/main/cover.webp",
    "gallery": [
      "/images/wardrobe/basket-weave-linen-jacket/main/gallery/01.webp"
    ],
    "notes": "Polo Ralph Lauren Vintage Linen Sport Coat (1990s, Made in Japan)\n\n* Era: 1990s\n* Line: Polo by Ralph Lauren\n* Licensee: Impact 21 Co., Ltd. (Japanese subsidiary of Ralph Lauren)\n* Measurements:\n    * Back Length: 78 cm\n    * Shoulder: 49 cm\n    * Chest: 61 cm\n    * Sleeve Length: 64 cm\n* Colour: Mixed Beige\n* Shell: 100% Linen\n* Lining: Cupro\n* Country of Origin: Made in Japan\n\nNotes:\nA Japanese domestic licensed piece from the 1990s under Impact 21, featuring classic American tailoring details including a 3-roll-2 front, notch lapels, side vents, and breathable linen construction. The relaxed silhouette reflects the softer Ivy / trad tailoring proportions typical of Ralph Lauren’s 1990s tailoring. Suitable as a warm-weather sport coat with strong compatibility for both Ivy and classic American casual wardrobes.",
    "metadata": {
      "price": 10620,
      "basicColour": "beige",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "polo-bear-jumper",
    "category": "Mid Layer",
    "brand": "Polo Ralph Lauren",
    "name": "Polo Bear Jumper",
    "season": "A/W",
    "colour": "Wine",
    "colourCode": "#49131e",
    "fabric": "Wool-cashmere",
    "size": "XL",
    "purchaseDate": "2025-01-07",
    "image": "/images/wardrobe/polo-bear-jumper/main/1779713122257-6x5qds-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/polo-bear-jumper/main/gallery/1779713124140-6vyknw-gallery-01.webp",
      "/images/wardrobe/polo-bear-jumper/main/gallery/1779713125604-j8pyv4-gallery-02.webp",
      "/images/wardrobe/polo-bear-jumper/main/gallery/1779713126669-3epg0i-gallery-03.webp",
      "/images/wardrobe/polo-bear-jumper/main/gallery/1779713128474-6r1sao-gallery-04.webp",
      "/images/wardrobe/polo-bear-jumper/main/gallery/1779713120746-2ffn73-gallery-06.webp",
      "/images/wardrobe/polo-bear-jumper/main/gallery/1779913582311-z0gikr-gallery-06.webp"
    ],
    "metadata": {
      "price": 28000,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "washed-rugby-shirt",
    "category": "Mid Layer",
    "brand": "Polo Ralph Lauren",
    "name": "Washed Rugby Shirt",
    "season": "A/W",
    "colour": "Wine",
    "colourCode": "6A1124",
    "fabric": "Cotton",
    "size": "XL",
    "purchaseDate": "2025-01-19",
    "image": "/images/wardrobe/washed-rugby-shirt/1778705113968-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/washed-rugby-shirt/main/gallery/01.webp",
      "/images/wardrobe/washed-rugby-shirt/main/gallery/02.webp",
      "/images/wardrobe/washed-rugby-shirt/main/gallery/03.webp"
    ],
    "metadata": {
      "price": 6490,
      "basicColour": "red",
      "priceCurrency": "JPY",
      "secondaryColour": "Cream",
      "secondaryColourCode": "F5F1E8"
    }
  },

  {
    "id": "original-wayfarer-sunglasses",
    "category": "Eyewear",
    "brand": "Ray-Ban",
    "name": "Original Wayfarer Sunglasses",
    "season": "All-season",
    "colour": "Tortoise, G-15 Green",
    "colourCode": "#332720",
    "purchaseDate": "2025-08-08",
    "image": "/images/wardrobe/original-wayfarer-sunglasses/main/cover.webp",
    "gallery": [
      "/images/wardrobe/original-wayfarer-sunglasses/main/gallery/05.webp",
      "/images/wardrobe/original-wayfarer-sunglasses/main/gallery/01.webp",
      "/images/wardrobe/original-wayfarer-sunglasses/main/gallery/02.webp",
      "/images/wardrobe/original-wayfarer-sunglasses/main/gallery/03.webp",
      "/images/wardrobe/original-wayfarer-sunglasses/main/gallery/04.webp"
    ],
    "metadata": {
      "price": 6490,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "ligne-2",
    "category": "Objects",
    "brand": "S.T. Dupont",
    "name": "Ligne 2",
    "season": "All-season",
    "colour": "Gold Diamond Head",
    "colourCode": "#ffe691",
    "purchaseDate": "2026-05-19",
    "image": "/images/wardrobe/ligne-2/main/1779733490968-uklszy-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/ligne-2/main/gallery/1779733494013-dw96zm-gallery-02.webp",
      "/images/wardrobe/ligne-2/main/gallery/1779733492547-zu2ey2-gallery-01.webp",
      "/images/wardrobe/ligne-2/main/gallery/1779733495229-vvhr0s-gallery-03.webp",
      "/images/wardrobe/ligne-2/main/gallery/1779733496852-eq184q-gallery-04.webp"
    ],
    "notes": "Decorated with the iconic house pattern: diamond-pattern tip and yellow gold plating. Associated lighter stone: black (REF 900600). Associated gas refill: yellow (REF 900432).",
    "metadata": {
      "price": 255,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "fair-isle-vest",
    "category": "Mid Layer",
    "brand": "The Engineer",
    "name": "Fair Isle Vest",
    "season": "A/W",
    "colour": "Brown Mixed",
    "colourCode": "#766051",
    "fabric": "Wool",
    "size": "XXL",
    "purchaseDate": "2024-11-03",
    "image": "/images/wardrobe/fair-isle-vest/main/cover.webp",
    "gallery": [
      "/images/wardrobe/fair-isle-vest/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 357.97,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "knit-long-sleeve-polo",
    "category": "Shirts",
    "brand": "The Engineer",
    "name": "Knit Long-Sleeve Polo",
    "season": "A/W",
    "colour": "Black",
    "fabric": "Cotton",
    "size": "XXL",
    "purchaseDate": "2024-11-03",
    "image": "/images/wardrobe/knit-long-sleeve-polo/main/cover.webp",
    "gallery": [
      "/images/wardrobe/knit-long-sleeve-polo/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 407.82,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "linen-safari-jacket",
    "category": "Outerwear",
    "brand": "The Engineer",
    "name": "Linen Safari Jacket",
    "season": "S/S",
    "colour": "Ecru",
    "colourCode": "#EBE0D6",
    "fabric": "Linen",
    "weight": "~350 gsm",
    "size": "XXL",
    "purchaseDate": "2023-01-28",
    "image": "/images/wardrobe/linen-safari-jacket/main/cover.webp",
    "gallery": [
      "/images/wardrobe/linen-safari-jacket/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 893.32,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "prx-quartz",
    "category": "Everyday",
    "brand": "Tissot",
    "name": "PRX Quartz",
    "season": "All-season",
    "colour": "Gold PVD",
    "colourCode": "#D6C082",
    "weight": "T137.210.33.021.00",
    "size": "35 mm",
    "purchaseDate": "2024-08-08",
    "image": "/images/wardrobe/prx-quartz/main/cover.webp",
    "gallery": [
      "/images/wardrobe/prx-quartz/main/gallery/01.webp"
    ],
    "notes": "Movement: ETA F06.115 quartz\nCase: : 35mm YG PVD coating, thckness 9.6mm\nDial: Champagne sunburst\nBracelet: Integrated gold PVD coating\n\n\fNotes:\nPRX 源⾃ 70 年代 integrated-bracelet watch 的設計語⾔ , 與 VC 222 共享類似的造型 ｡ 儘管全錶都是⾦⾊調 , vintage luxury sports watch 的外觀使其仍能作為⼀隻稱職的 everyday watch , 同時作為未來邁向 Rolex 16018 的過渡 ｡",
    "metadata": {
      "price": 11309,
      "basicColour": "gold",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "silver-arabesque-card-case",
    "category": "Objects",
    "brand": "Tsubota Pearl",
    "name": "Silver Arabesque Card Case",
    "season": "All-season",
    "colour": "Silver",
    "colourCode": "#E8E8E8",
    "purchaseDate": "2025-03-19",
    "image": "/images/wardrobe/silver-arabesque-card-case/main/1779749696299-yrzmfp-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/silver-arabesque-card-case/main/gallery/1779733417375-we18bh-gallery-02.webp",
      "/images/wardrobe/silver-arabesque-card-case/main/gallery/1779733413784-atuymh-gallery-01.webp",
      "/images/wardrobe/silver-arabesque-card-case/main/gallery/1779733421684-y3leaj-gallery-03.webp",
      "/images/wardrobe/silver-arabesque-card-case/main/1779733264854-yqupnm-cover-edit.webp"
    ],
    "notes": "Crafted from stainless steel with a rigid, durable construction.\n\nFeatures a refined silver arabesque pattern and double-sided storage.\n\nOne side can hold business cards, while the other may be used for credit cards or received cards.\n\nCapacity: Approximately 30 standard business cards.\nDimensions: 97 × 66 × 13 mm.",
    "metadata": {
      "price": 1950,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "cordovan-l-zip-wallet-regular-price-copy",
    "category": "Objects",
    "brand": "Tsuchiya Kaban",
    "name": "Cordovan L Zip Wallet",
    "season": "All-season",
    "colour": "Brown",
    "colourCode": "#7c371b",
    "size": "Cordovan",
    "purchaseDate": "2024-12-26",
    "image": "/images/wardrobe/cordovan-l-zip-wallet-regular-price-copy/main/1779750007287-2nembs-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/cordovan-l-zip-wallet-regular-price-copy/main/gallery/1779750027971-9hqedy-gallery-01.webp",
      "/images/wardrobe/cordovan-l-zip-wallet-regular-price-copy/main/gallery/1779750031344-zqf0j8-gallery-02.webp"
    ],
    "notes": "Crafted from aniline-dyed Japanese cordovan, this minimalist wallet offers sleek design and efficient functionality. The luxuriously smooth leather has striking presence in a streamlined profile that slips effortlessly into any pocket. Over time, it develops a rich, gem-like luster—the perfect companion for an intentional lifestyle.",
    "metadata": {
      "price": 33000,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "black-bay-58",
    "category": "Dive",
    "brand": "Tudor",
    "name": "Black Bay 58",
    "season": "All-season",
    "colour": "Steel",
    "colourCode": "#e8e8e8",
    "weight": "M79030N",
    "size": "39 mm",
    "purchaseDate": "2024-10-17",
    "image": "/images/wardrobe/black-bay-58/main/cover.webp",
    "gallery": [
      "/images/wardrobe/black-bay-58/main/gallery/01.webp",
      "/images/wardrobe/black-bay-58/main/gallery/02.webp"
    ],
    "notes": "Movement: MT5402\nCase: 39mm SS, thickness 11.9mm\nLugs: 20mm lug width\nDial: Black domed\nBracelet: Riveted steel bracelet\n\nThe proportions and detailing of the Tudor Black Bay 58 inherit the design language of the 1958 Tudor / Rolex Submariner references 7924 and 7922, including the narrow bezel and slim mid-case. The red triangle at 12 o’clock echoes the 6538 ‘Big Crown’, while the gilt dial complements the gold jewellery already present within the collection. It remains the only true sports watch in the collection.",
    "metadata": {
      "price": 82000,
      "basicColour": "silver",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "leather-gloves-with-cashmere-lining",
    "category": "Objects",
    "brand": "Unbranded",
    "name": "Three-Point Cashmere-Lined Gloves",
    "season": "A/W",
    "colour": "Dark Brown",
    "colourCode": "#3a241d",
    "purchaseDate": "2025-02-17",
    "image": "/images/wardrobe/leather-gloves-with-cashmere-lining/main/1779741077934-2f2owr-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/leather-gloves-with-cashmere-lining/main/gallery/1779741601360-yq4wvk-gallery-01.webp"
    ],
    "metadata": {
      "price": 225,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "jwa-straight-jeans",
    "category": "Bottoms",
    "brand": "Uniqlo",
    "name": "JWA Straight Jeans",
    "season": "All-season",
    "colour": "Light Wash Blue",
    "colourCode": "#98B0C7",
    "fabric": "Denim",
    "size": "35inch",
    "purchaseDate": "2026-03-24",
    "image": "/images/wardrobe/jwa-straight-jeans/main/cover.webp",
    "gallery": [
      "/images/wardrobe/jwa-straight-jeans/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 1290,
      "basicColour": "blue",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "kataaze-knit-mock-neck",
    "category": "Shirts",
    "brand": "Uniqlo",
    "name": "Kataaze Knit Mock Neck",
    "season": "A/W",
    "colour": "Beige",
    "colourCode": "#d0bcac",
    "fabric": "Acrylic blend",
    "size": "XL",
    "purchaseDate": "2022-02-13",
    "image": "/images/wardrobe/kataaze-knit-mock-neck/main/cover.webp",
    "gallery": [
      "/images/wardrobe/kataaze-knit-mock-neck/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 990,
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "linen-camp-collar-shirt",
    "category": "Shirts",
    "brand": "Uniqlo",
    "name": "Linen Camp Collar Shirt",
    "season": "S/S",
    "colour": "Dusty Ice Blue",
    "colourCode": "#B5CDED",
    "fabric": "Linen",
    "size": "XL",
    "purchaseDate": "2025-07-13",
    "image": "/images/wardrobe/linen-camp-collar-shirt/1778705380735-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/linen-camp-collar-shirt/main/gallery/01.avif"
    ],
    "notes": "コットンリネンシャツ",
    "metadata": {
      "price": 2990,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "ocbd-shirt",
    "category": "Shirts",
    "brand": "UNIQLO",
    "name": "OCBD Shirt",
    "season": "All-season",
    "colour": "Blue",
    "colourCode": "#BAC9EF",
    "fabric": "Cotton",
    "size": "XL",
    "purchaseDate": "2020-01-01",
    "image": "/images/wardrobe/ocbd-shirt/main/cover.webp",
    "colourVariants": [
      {
        "key": "blue",
        "image": "/images/wardrobe/ocbd-shirt/variants/blue/cover.webp",
        "label": "Blue",
        "notes": "",
        "colour": "Blue",
        "gallery": [
          "/images/wardrobe/ocbd-shirt/variants/blue/gallery/01.webp",
          "/images/wardrobe/ocbd-shirt/variants/blue/gallery/02.webp"
        ],
        "colourCode": "#BAC9EF",
        "previewImage": "/images/wardrobe/ocbd-shirt/variants/blue/preview.webp"
      },
      {
        "key": "white",
        "image": "/images/wardrobe/ocbd-shirt/variants/white/cover.webp",
        "label": "White",
        "notes": "",
        "colour": "White",
        "gallery": [],
        "colourCode": "#F5F5F9",
        "previewImage": "/images/wardrobe/ocbd-shirt/variants/white/preview.webp"
      },
      {
        "key": "pink-stripe",
        "image": "/images/wardrobe/ocbd-shirt/variants/pink-stripe/cover.webp",
        "label": "Pink stripe",
        "notes": "",
        "colour": "Pink stripe",
        "gallery": [],
        "colourCode": "#EEE7E4",
        "basicColour": "red",
        "previewImage": "/images/wardrobe/ocbd-shirt/variants/pink-stripe/preview.webp"
      },
      {
        "key": "blue-striped",
        "image": "/images/wardrobe/ocbd-shirt/variants/blue-striped/cover.webp",
        "label": "Blue striped",
        "notes": "",
        "colour": "Blue striped",
        "gallery": [],
        "colourCode": "#DCE1F5",
        "previewImage": "/images/wardrobe/ocbd-shirt/variants/blue-striped/preview.webp"
      }
    ],
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY",
      "colourVariants": [
        {
          "key": "blue",
          "image": "/images/wardrobe/ocbd-shirt/variants/blue/cover.webp",
          "label": "Blue",
          "notes": "",
          "colour": "Blue",
          "gallery": [
            "/images/wardrobe/ocbd-shirt/variants/blue/gallery/01.webp",
            "/images/wardrobe/ocbd-shirt/variants/blue/gallery/02.webp"
          ],
          "colourCode": "#BAC9EF",
          "previewImage": "/images/wardrobe/ocbd-shirt/variants/blue/preview.webp"
        },
        {
          "key": "white",
          "image": "/images/wardrobe/ocbd-shirt/variants/white/cover.webp",
          "label": "White",
          "notes": "",
          "colour": "White",
          "gallery": [],
          "colourCode": "#F5F5F9",
          "previewImage": "/images/wardrobe/ocbd-shirt/variants/white/preview.webp"
        },
        {
          "key": "pink-stripe",
          "image": "/images/wardrobe/ocbd-shirt/variants/pink-stripe/cover.webp",
          "label": "Pink stripe",
          "notes": "",
          "colour": "Pink stripe",
          "gallery": [],
          "colourCode": "#EEE7E4",
          "basicColour": "red",
          "previewImage": "/images/wardrobe/ocbd-shirt/variants/pink-stripe/preview.webp"
        },
        {
          "key": "blue-striped",
          "image": "/images/wardrobe/ocbd-shirt/variants/blue-striped/cover.webp",
          "label": "Blue striped",
          "notes": "",
          "colour": "Blue striped",
          "gallery": [],
          "colourCode": "#DCE1F5",
          "previewImage": "/images/wardrobe/ocbd-shirt/variants/blue-striped/preview.webp"
        }
      ]
    }
  },

  {
    "id": "cutwork-knit-polo-shirt",
    "category": "Shirts",
    "brand": "Zara",
    "name": "Cutwork Knit Polo Shirt",
    "season": "S/S",
    "colour": "Charcoal",
    "colourCode": "#262626",
    "fabric": "88% acrylic, 12% polyester",
    "size": "XL",
    "purchaseDate": "2025-07-29",
    "image": "/images/wardrobe/cutwork-knit-polo-shirt/main/cover.webp",
    "gallery": [
      "/images/wardrobe/cutwork-knit-polo-shirt/main/gallery/01.webp",
      "/images/wardrobe/cutwork-knit-polo-shirt/main/gallery/02.webp"
    ],
    "notes": "Relaxed fit knit polo shirt woven from yarn with an open structure. Lapel collar with front opening. Short sleeves. Ribbed trims.",
    "metadata": {
      "price": 7990,
      "basicColour": "grey",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "linen-loop-collar-shirt",
    "category": "Shirts",
    "brand": "Zara",
    "name": "Linen Loop-Collar Shirt",
    "season": "S/S",
    "colour": "Oyster-white",
    "fabric": "Linen",
    "size": "XL",
    "purchaseDate": "2025-08-09",
    "image": "/images/wardrobe/linen-loop-collar-shirt/main/cover.webp",
    "gallery": [
      "/images/wardrobe/linen-loop-collar-shirt/main/gallery/01.webp"
    ],
    "notes": "FLOWING REGULAR FIT SHIRT",
    "metadata": {
      "price": 8590,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "purl-knit-t-shirt",
    "category": "Shirts",
    "brand": "Zara",
    "name": "Purl-Knit T-Shirt",
    "season": "S/S",
    "colour": "Off-White",
    "size": "XL",
    "purchaseDate": "2025-08-05",
    "image": "/images/wardrobe/purl-knit-t-shirt/main/cover.webp",
    "gallery": [
      "/images/wardrobe/purl-knit-t-shirt/main/gallery/01.webp"
    ],
    "metadata": {
      "price": 5990,
      "basicColour": "white",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "rib-knit-polo-shirt-dusty-ice-blue",
    "category": "Shirts",
    "brand": "Zara",
    "name": "Rib Knit Polo Shirt",
    "season": "S/S",
    "colour": "Dusty Ice Blue",
    "colourCode": "#92a5b1",
    "fabric": "Knit",
    "size": "XL",
    "purchaseDate": "2025-12-12",
    "image": "/images/wardrobe/rib-knit-polo-shirt-dusty-ice-blue/main/cover.webp",
    "gallery": [
      "/images/wardrobe/rib-knit-polo-shirt-dusty-ice-blue/main/gallery/01.webp"
    ],
    "notes": "ZARA RIB KNIT POLO SHIRT",
    "metadata": {
      "price": 1570,
      "priceCurrency": "TWD"
    }
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
    "measuredDimensions": "Lens width: 52 mm cm cm\nBridge width: 20 mm cm cm\nTemple length: 145 mm cm cm",
    "purchaseDate": "2025-02-28",
    "image": "/images/wardrobe/boston-metal-frames/main/cover.webp",
    "gallery": [
      "/images/wardrobe/boston-metal-frames/main/gallery/01.webp"
    ],
    "notes": "A contemporary metal-frame design influenced by modern Asian eyewear trends. The softly rounded Boston shape creates a refined yet relaxed impression, while the slim 0.7 mm metal rim provides both a natural fit and comfortable wear. The polished metal construction adds a subtle jewellery-like character, allowing the frame to function easily as an everyday accessory.\n\nFinished in a dark Havana tortoiseshell pattern with gold temples, the frame balances warmer heritage tones with a lighter metallic accent. The slightly taller lens proportions soften the overall silhouette while adding openness to the face, making it suitable for both casual and more refined styling. Designed with a timeless approach, it remains easy to wear across changing trends.",
    "metadata": {
      "price": 9800,
      "basicColour": "gold",
      "priceCurrency": "JPY",
      "measurementRows": [
        {
          "label": "Lens width",
          "value": "52 mm cm"
        },
        {
          "label": "Bridge width",
          "value": "20 mm cm"
        },
        {
          "label": "Temple length",
          "value": "145 mm cm"
        }
      ],
      "secondaryColour": "Gold",
      "secondaryColourCode": "#ffe691"
    }
  },

  // ——— A/W – Country Classics ———,

  {
    "id": "glen-check-tweed-jacket",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Jackets",
    "brand": "Cultum",
    "name": "Glen Check Tweed Jacket",
    "season": "A/W",
    "colour": "Brown",
    "colourCode": "7B5A43",
    "fabric": "Tweed",
    "weight": "620 gsm",
    "size": "58B",
    "purchaseDate": "2025-11-22",
    "image": "/images/wardrobe/glen-check-tweed-jacket/main/cover.webp",
    "gallery": [
      "/images/wardrobe/glen-check-tweed-jacket/main/gallery/01.webp",
      "/images/wardrobe/glen-check-tweed-jacket/main/gallery/02.webp",
      "/images/wardrobe/glen-check-tweed-jacket/main/gallery/03.webp"
    ],
    "metadata": {
      "price": 867,
      "basicColour": "brown",
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "boa-fleece-vest",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Mid Layer",
    "brand": "Muji",
    "name": "Boa Fleece Vest",
    "season": "A/W",
    "colour": "Ecru",
    "colourCode": "#eae0d2",
    "fabric": "Sherpa fleece",
    "size": "XL",
    "purchaseDate": "2023-12-09",
    "image": "/images/wardrobe/boa-fleece-vest/main/cover.webp",
    "gallery": [
      "/images/wardrobe/boa-fleece-vest/main/gallery/01.webp"
    ],
    "notes": "紳士 ボアフリースベスト | 無印良品",
    "metadata": {
      "price": 1190,
      "priceCurrency": "TWD",
      "secondaryColour": "Olive Trim",
      "secondaryColourCode": "#737051"
    }
  },

  {
    "id": "rib-knit-roll-neck-neck-jumper",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Shirts",
    "brand": "Muji",
    "name": "Rib Knit Roll-Neck Neck Jumper",
    "season": "A/W",
    "colour": "Black",
    "fabric": "Wool",
    "weight": "Lightweight",
    "size": "XL",
    "purchaseDate": "2024-12-17",
    "image": "/images/wardrobe/rib-knit-roll-neck-neck-jumper/main/cover.webp",
    "gallery": [
      "/images/wardrobe/rib-knit-roll-neck-neck-jumper/main/gallery/01.webp"
    ],
    "notes": "紳士 洗えるウールリブタートルネックセーター",
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "ventile-harrington",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Outerwear",
    "brand": "Private White VC",
    "name": "Ventile Harrington",
    "season": "A/W",
    "colour": "Midnight Navy",
    "colourCode": "#20252F",
    "fabric": "Ventile",
    "size": "6=XL",
    "purchaseDate": "2025-12-26",
    "image": "/images/wardrobe/ventile-harrington/main/cover.webp",
    "gallery": [
      "/images/wardrobe/ventile-harrington/main/gallery/04.webp",
      "/images/wardrobe/ventile-harrington/main/gallery/02.webp",
      "/images/wardrobe/ventile-harrington/main/gallery/03.webp"
    ],
    "notes": "A jacket with soul. First stitched in the 1950s and still made in Manchester, it has dressed rebels, musicians, and silver-screen legends for generations. With its stand collar, copper zip, and waterproof Ventile shell, the Harrington is as it was meant to be - timeless, understated, and unmistakably British.",
    "metadata": {
      "price": 3377,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "camel-hair-polo-coat",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Outerwear",
    "brand": "Spier & Mackay",
    "name": "Camel Hair Polo Coat",
    "season": "A/W",
    "colour": "Golden Camel",
    "colourCode": "#C89C7B",
    "fabric": "Camel hair",
    "weight": "760 gsm",
    "size": "46",
    "purchaseDate": "2025-02-16",
    "image": "/images/wardrobe/camel-hair-polo-coat/main/cover.webp",
    "gallery": [
      "/images/wardrobe/camel-hair-polo-coat/main/gallery/01.webp",
      "/images/wardrobe/camel-hair-polo-coat/main/gallery/02.webp",
      "/images/wardrobe/camel-hair-polo-coat/main/gallery/03.webp"
    ],
    "metadata": {
      "price": 718.2,
      "basicColour": "brown",
      "priceCurrency": "USD"
    }
  },

  {
    "id": "cricket-cable-knit-jumper-vest",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Mid Layer",
    "brand": "UNIQLO",
    "name": "Cricket Cable-Knit Jumper Vest",
    "season": "A/W",
    "colour": "Ecru",
    "colourCode": "#fffcf5",
    "fabric": "Cotton-acrylic",
    "size": "XL",
    "purchaseDate": "2022-08-08",
    "image": "/images/wardrobe/cricket-cable-knit-jumper-vest/main/cover.webp",
    "gallery": [
      "/images/wardrobe/cricket-cable-knit-jumper-vest/main/gallery/01.webp"
    ],
    "notes": "Filename: if slash is problematic on disk, use a variant without “/” in the filename and adjust this path.",
    "metadata": {
      "price": 790,
      "basicColour": "__omit__",
      "priceCurrency": "TWD",
      "secondaryColour": "Navy / Yellow Trim",
      "secondaryColourCode": "#f0c04d",
      "secondaryBasicColour": "white"
    }
  },

  {
    "id": "pleated-trousers",
    "pillar": "Clothing",
    "section": "A/W – Country Classics",
    "category": "Bottoms",
    "brand": "UNIQLO",
    "name": "Pleated Trousers",
    "season": "All-season",
    "colour": "Grey",
    "colourCode": "#5F5F62",
    "size": "XL",
    "purchaseDate": "2023-11-20",
    "image": "/images/wardrobe/pleated-trousers/main/cover.webp",
    "notes": "Fabric details\nBody: 62% Polyester - Recycled Fiber, 29% Viscose, 5% Polyester, 4% Elastane/ Pocket Lining: 65% Polyester, 35% Cotton\nWashing instructions\nMachine wash up to 40 degrees, gentle cycle, Dry Clean, Not suitable for tumble-drying.",
    "colourVariants": [
      {
        "key": "grey",
        "image": "/images/wardrobe/pleated-trousers/variants/grey/cover.webp",
        "label": "Grey",
        "notes": "",
        "colour": "Grey",
        "gallery": [
          "/images/wardrobe/pleated-trousers/main/gallery/01.jpg"
        ],
        "colourCode": "#5F5F62",
        "basicColour": "grey",
        "previewImage": "/images/wardrobe/pleated-trousers/variants/grey/preview.webp"
      },
      {
        "key": "beige",
        "image": "/images/wardrobe/pleated-trousers/variants/beige/cover.webp",
        "label": "Beige",
        "notes": "",
        "colour": "Beige",
        "gallery": [],
        "colourCode": "#CEBEA6",
        "basicColour": "beige",
        "previewImage": "/images/wardrobe/pleated-trousers/variants/beige/preview.webp"
      }
    ],
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY",
      "colourVariants": [
        {
          "key": "grey",
          "image": "/images/wardrobe/pleated-trousers/variants/grey/cover.webp",
          "label": "Grey",
          "notes": "",
          "colour": "Grey",
          "gallery": [
            "/images/wardrobe/pleated-trousers/main/gallery/01.jpg"
          ],
          "colourCode": "#5F5F62",
          "basicColour": "grey",
          "previewImage": "/images/wardrobe/pleated-trousers/variants/grey/preview.webp"
        },
        {
          "key": "beige",
          "image": "/images/wardrobe/pleated-trousers/variants/beige/cover.webp",
          "label": "Beige",
          "notes": "",
          "colour": "Beige",
          "gallery": [],
          "colourCode": "#CEBEA6",
          "basicColour": "beige",
          "previewImage": "/images/wardrobe/pleated-trousers/variants/beige/preview.webp"
        }
      ]
    }
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
    "size": "XL:61cm-1cm",
    "measuredDimensions": "Head Circumference: 61 cm cm cm\nBrim Width: 7 cm cm cm\nFront Crown Height: 9.7 cm cm cm\nCenter Crown Height: 10.7 cm cm cm\nOverall Length: 31.5 cm cm cm",
    "purchaseDate": "2025-05-11",
    "image": "/images/wardrobe/panama-hat/main/cover.webp",
    "gallery": [
      "/images/wardrobe/panama-hat/main/gallery/01.webp",
      "/images/wardrobe/panama-hat/main/gallery/02.avif",
      "/images/wardrobe/panama-hat/main/gallery/03.avif",
      "/images/wardrobe/panama-hat/main/gallery/04.webp"
    ],
    "notes": "Construction & Provenance\nHandwoven in Ecuador by ELOY BERNAL, this classic Panama is crafted from 100% natural toquilla straw using the traditional Llano weave. Finished in a bleached white tone with a black grosgrain ribbon, it balances lightweight structure with relaxed warm-weather elegance.\n\nDesign & Proportions (XL)\n* Style: Center-Dent Crown\n* Brim Type: Snap Brim\n* Crown Shape: Classic Fedora\n* Weight: approx. 100 g\n\nMaterial & Weave\n* Material: 100% Natural Toquilla Straw\n* Weave: Llano (classic basket/plain weave)\n* Grade: Standard\n* Hand Feel: Lightweight, soft-structured\n* Rigidity: Soft to medium\n* Breathability: High",
    "metadata": {
      "price": 9600,
      "priceCurrency": "JPY",
      "measurementRows": [
        {
          "label": "Head Circumference",
          "value": "61 cm cm"
        },
        {
          "label": "Brim Width",
          "value": "7 cm cm"
        },
        {
          "label": "Front Crown Height",
          "value": "9.7 cm cm"
        },
        {
          "label": "Center Crown Height",
          "value": "10.7 cm cm"
        },
        {
          "label": "Overall Length",
          "value": "31.5 cm cm"
        }
      ],
      "secondaryColour": "Black Grosgrain Ribbon"
    }
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
    "image": "/images/wardrobe/boat-and-tote/main/cover.webp",
    "gallery": [
      "/images/wardrobe/boat-and-tote/main/gallery/01.webp"
    ],
    "notes": "Boat and Tote, Open-Top\nItem No.: TC112636\nType: Medium\nColour: Blue Trim\nHandle: Regular\nMonogram: Yes\nLetter Style: Flare (FT)\nThread Colour: Coastal Gold (120)\nEmbroidered Initials: TLY",
    "metadata": {
      "price": 11880,
      "basicColour": "white",
      "priceCurrency": "JPY",
      "secondaryColour": "Navy trim",
      "secondaryColourCode": "#303c73"
    }
  },

  {
    "id": "anthony",
    "pillar": "Accessories",
    "section": "Accessories",
    "category": "Bags",
    "brand": "Mulberry",
    "name": "Anthony",
    "season": "All-season",
    "colour": "Oak",
    "colourCode": "#A95B32",
    "measuredDimensions": "Height: 25 cm\nWidth: 21 cm\nThickness: 7 cm\nStrap Width: 4 cm",
    "purchaseDate": "2025-07-27",
    "image": "/images/wardrobe/anthony/main/cover.webp",
    "gallery": [
      "/images/wardrobe/anthony/main/gallery/01.webp",
      "/images/wardrobe/anthony/main/gallery/02.webp"
    ],
    "notes": "Purchased in near-excellent condition, with only one previous use. No visible stains, scratches, or notable signs of wear. Compact everyday messenger proportions with a broad adjustable shoulder strap, consistent with the classic Antony design language.",
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
    }
  },

  {
    "id": "american-flag-hat",
    "pillar": "Accessories",
    "section": "Accessories",
    "category": "Hats",
    "brand": "Smathers & Branson",
    "name": "American Flag Cap",
    "season": "All-season",
    "colour": "Steel Blue",
    "colourCode": "#5E829A",
    "measuredDimensions": "Circumference: 22.45 cm cm cm cm\nTop to Side: : 6.65 cm cm cm cm\nBrim: 2.9 cm cm cm cm",
    "purchaseDate": "2026-05-11",
    "image": "/images/wardrobe/american-flag-hat/main/cover.webp",
    "gallery": [
      "/images/wardrobe/american-flag-hat/main/gallery/1779721668462-rxj7i7-gallery-01.webp",
      "/images/wardrobe/american-flag-hat/main/gallery/02.webp",
      "/images/wardrobe/american-flag-hat/main/gallery/01.webp"
    ],
    "notes": "Our six panel cotton twill hats are adorned with our signature 100% hand-stitched needlepoint. Each hat is adjustable by a nickel slide on the back of the hat.\n\n-100% hand-stitched needlepoint\n-Stitched with French cotton thread\n-Six Panel Construction\n-Washed Cotton Twill\n-Adjustable. One size fits most adults.",
    "metadata": {
      "price": 1710,
      "priceCurrency": "TWD",
      "measurementRows": [
        {
          "label": "Circumference",
          "value": "22.45 cm cm cm"
        },
        {
          "label": "Top to Side",
          "value": ": 6.65 cm cm cm"
        },
        {
          "label": "Brim",
          "value": "2.9 cm cm cm"
        }
      ]
    }
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
    "purchaseDate": "2025-08-12",
    "image": "/images/wardrobe/helmet-bag/1778720745157-cover-edit.webp",
    "gallery": [
      "/images/wardrobe/helmet-bag/1778712894508-gallery-edit-2.avif",
      "/images/wardrobe/helmet-bag/1778712894182-gallery-edit-1.avif"
    ],
    "notes": "Size\nWidth(Bottom): 34cm, Height: 38cm, Depth: 16cm, Shoulder Strap Length: 61cm～114cm, Bag Capacity: 26Liters\n\nProduct ID: 479880\n\nThe images shown may include colours that are not available.",
    "metadata": {
      "price": 2990,
      "colourCode": "#556469",
      "basicColour": "green",
      "priceCurrency": "JPY"
    }
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
    "colourCode": "#e8e8e8",
    "fabric": "Platinum",
    "image": "/images/wardrobe/sapphire-three-stone-ring/main/cover.webp",
    "gallery": [
      "/images/wardrobe/sapphire-three-stone-ring/main/gallery/04.webp",
      "/images/wardrobe/sapphire-three-stone-ring/main/gallery/01.webp",
      "/images/wardrobe/sapphire-three-stone-ring/main/gallery/02.webp",
      "/images/wardrobe/sapphire-three-stone-ring/main/gallery/03.webp"
    ],
    "notes": "Emerald-cut sapphire 6.8×5.1 mm ~1.1 ct; tapered baguette sides; ~1 ct diamonds total. Signed Cartier.  c.1950–65",
    "metadata": {
      "basicColour": "silver",
      "secondaryColour": "Sapphire",
      "secondaryColourCode": "#1B57BC"
    }
  },

  // ——— S/S – Mediterranean Resort ———,

  {
    "id": "washed-breton-stripe-boat-neck-3-4-sleeve-t-shirt",
    "pillar": "Clothing",
    "section": "S/S – Mediterranean Resort",
    "category": "Shirts",
    "brand": "Muji",
    "name": "Washed Breton-Stripe Boat-Neck 3/4 Sleeve T-Shirt",
    "season": "A/W",
    "colour": "Off-White / Navy",
    "colourCode": "#eeeeef",
    "fabric": "Cotton",
    "weight": "Midweight",
    "size": "XL",
    "purchaseDate": "2025-01-31",
    "image": "/images/wardrobe/washed-breton-stripe-boat-neck-3-4-sleeve-t-shirt/main/cover.webp",
    "gallery": [
      "/images/wardrobe/washed-breton-stripe-boat-neck-3-4-sleeve-t-shirt/main/gallery/01.webp"
    ],
    "notes": "紳士 洗いざらし太番手ボートネック九分袖Ｔシャツ",
    "metadata": {
      "price": 2990,
      "basicColour": "white",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "baker-neck-knitted-t-shirt",
    "pillar": "Clothing",
    "section": "S/S – Mediterranean Resort",
    "category": "Shirts",
    "brand": "Zara",
    "name": "Baker Neck Knitted T-Shirt",
    "season": "S/S",
    "colour": "Navy",
    "colourCode": "#1f222e",
    "size": "XL",
    "purchaseDate": "2025-08-09",
    "image": "/images/wardrobe/baker-neck-knitted-t-shirt/main/cover.webp",
    "gallery": [
      "/images/wardrobe/baker-neck-knitted-t-shirt/main/gallery/01.webp"
    ],
    "notes": "BUTTON-NECK KNIT T-SHIRT",
    "metadata": {
      "price": 6590,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "rib-knit-polo-shirt-dark-chocolate",
    "pillar": "Clothing",
    "section": "S/S – Mediterranean Resort",
    "category": "Shirts",
    "brand": "Zara",
    "name": "Rib Knit Polo Shirt",
    "season": "S/S",
    "colour": "Dark Chocolate",
    "colourCode": "#2C2928",
    "size": "XL",
    "measuredDimensions": "Measurements: Chest 59.5 cm · Front length 71.5 cm · Sleeve length 24 cm · Back width 51.5 cm · Arm width 19.5 cm ·  ·  · cm",
    "purchaseDate": "2026-05-14",
    "image": "/images/wardrobe/rib-knit-polo-shirt-dark-chocolate/main/cover.webp",
    "gallery": [
      "/images/wardrobe/rib-knit-polo-shirt-dark-chocolate/main/gallery/01.webp"
    ],
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
    }
  },

  {
    "id": "structured-knit-polo-shirt",
    "pillar": "Clothing",
    "section": "S/S – Mediterranean Resort",
    "category": "Shirts",
    "brand": "Zara",
    "name": "Structured Knit Polo Shirt",
    "season": "S/S",
    "colourCode": "#3E3934",
    "size": "XL",
    "measuredDimensions": "Chest: 59.5 cm\nFront length: 71.5 cm\nSleeve length: 24 cm\nBack width: 51.5 cm\nArm width: 19.5 cm",
    "purchaseDate": "2026-05-14",
    "image": "/images/wardrobe/structured-knit-polo-shirt/main/cover.webp",
    "gallery": [
      "/images/wardrobe/structured-knit-polo-shirt/main/gallery/01.webp"
    ],
    "notes": "STRUCTURED KNIT POLO SHIRT\nNT$ 1,490\nRef 3332/410\nRegular fit knitted polo shirt in spun cotton yarn. Lapel collar with front opening and short sleeve. Ribbed trims.",
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
    }
  }
];
