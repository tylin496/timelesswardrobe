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
    "id": "beaufort-waxed-jacket",
    "section": "Foundation",
    "category": "Outerwear",
    "brand": "Barbour",
    "name": "Beaufort Waxed Jacket",
    "season": "A/W",
    "colour": "Sage",
    "colourCode": "40403C",
    "fabric": "Waxed cotton",
    "size": "44",
    "purchaseDate": "2025-08-01",
    "image": "/images/wardrobe/beaufort-waxed-jacket/main/1.webp",
    "gallery": [
      "/images/wardrobe/beaufort-waxed-jacket/main/2.webp",
      "/images/wardrobe/beaufort-waxed-jacket/main/3.webp",
      "/images/wardrobe/beaufort-waxed-jacket/main/4.webp",
      "/images/wardrobe/beaufort-waxed-jacket/main/5.webp",
      "/images/wardrobe/beaufort-waxed-jacket/main/6.webp",
      "/images/wardrobe/beaufort-waxed-jacket/main/7.webp"
    ],
    "metadata": {
      "price": 43200,
      "priceCurrency": "JPY"
    }
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
    "weight": "Single-Breasted",
    "size": "42R",
    "purchaseDate": "2020-12-06",
    "image": "/images/wardrobe/balmacaan-coat/main/1.webp",
    "gallery": [
      "/images/wardrobe/balmacaan-coat/main/2.webp",
      "/images/wardrobe/balmacaan-coat/main/3.webp",
      "/images/wardrobe/balmacaan-coat/main/4.webp",
      "/images/wardrobe/balmacaan-coat/main/5.webp",
      "/images/wardrobe/balmacaan-coat/main/6.webp"
    ],
    "metadata": {
      "price": 83.99,
      "priceCurrency": "USD"
    }
  },

  {
    "id": "camel-hair-polo-coat",
    "section": "Foundation",
    "pillar": "Clothing",
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
    "image": "/images/wardrobe/camel-hair-polo-coat/main/1.webp",
    "gallery": [
      "/images/wardrobe/camel-hair-polo-coat/main/2.webp",
      "/images/wardrobe/camel-hair-polo-coat/main/3.webp",
      "/images/wardrobe/camel-hair-polo-coat/main/4.webp",
      "/images/wardrobe/camel-hair-polo-coat/main/5.webp"
    ],
    "metadata": {
      "price": 718.2,
      "basicColour": "brown",
      "priceCurrency": "USD"
    }
  },

  {
    "id": "navy-double-breasted-blazer",
    "section": "Foundation",
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
    "image": "/images/wardrobe/navy-double-breasted-blazer/main/1.webp",
    "gallery": [
      "/images/wardrobe/navy-double-breasted-blazer/main/2.webp",
      "/images/wardrobe/navy-double-breasted-blazer/main/3.webp"
    ],
    "metadata": {
      "price": 1284.65,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "tank-solo",
    "section": "Foundation",
    "category": "Dress",
    "brand": "Cartier",
    "name": "Tank Solo",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "weight": "W5200004",
    "size": "Large Model",
    "purchaseDate": "2024-11-03",
    "image": "/images/wardrobe/tank-solo/main/1.webp",
    "gallery": [
      "/images/wardrobe/tank-solo/main/2.webp"
    ],
    "notes": "Reference: W5200004\nMovement: Cartier Cal. 690 quartz\nCase: 34.8 × 27.4 mm, 18ct yellow gold\nStrap: Brown square-scale alligator leather with original 18ct yellow gold ardillon buckle\n\nDesigned by Louis Cartier in 1917, the Tank remains one of the defining forms of modern watch design. In continuous production for over a century, it has remained unmistakable while becoming one of the canonical objects of the twentieth century. As the only solid-gold watch in this collection, it serves as its aesthetic anchor.",
    "metadata": {
      "price": 100000,
      "basicColour": "gold",
      "priceCurrency": "TWD",
      "secondaryColour": "Brown Aligator Strap",
      "secondaryColourCode": "9A4B17"
    }
  },

  {
    "id": "black-bay-58",
    "section": "Foundation",
    "category": "Dive",
    "brand": "Tudor",
    "name": "Black Bay 58",
    "season": "All-season",
    "colour": "Steel",
    "colourCode": "#E8E8E8",
    "weight": "M79030N",
    "size": "39 mm",
    "purchaseDate": "2024-10-17",
    "image": "/images/wardrobe/black-bay-58/main/1.webp",
    "gallery": [
      "/images/wardrobe/black-bay-58/main/2.webp",
      "/images/wardrobe/black-bay-58/main/3.jpeg",
      "/images/wardrobe/black-bay-58/main/4.webp"
    ],
    "notes": "Movement: MT5402\nCase: 39mm SS, thickness 11.9mm\nLugs: 20mm lug width\nDial: Black domed\nBracelet: Riveted steel bracelet\n\nThe Tudor Black Bay 58 draws heavily upon the visual language of the iconic Rolex Submariner 6538 ‘Big Crown’, from the red triangle at 12 o’clock to the restrained proportions that defined the finest diving watches of the 1950s. The gilt dial introduces a welcome warmth that sits comfortably alongside the gold pieces elsewhere in the collection. It remains the collection’s sole dedicated sports watch.",
    "metadata": {
      "price": 82000,
      "basicColour": "silver",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "signet-ring",
    "section": "Foundation",
    "category": "Jewellery",
    "brand": "Bespoke Tailor",
    "name": "Signet Ring",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "weight": "18ct yellow gold, 12 × 14 mm",
    "size": "HK 14",
    "purchaseDate": "2020-11-01",
    "image": "/images/wardrobe/signet-ring/main/1.webp",
    "gallery": [
      "/images/wardrobe/signet-ring/main/2.webp",
      "/images/wardrobe/signet-ring/main/3.webp",
      "/images/wardrobe/signet-ring/main/4.webp",
      "/images/wardrobe/signet-ring/main/5.webp"
    ],
    "notes": "Size: HK 14 (2020-11-20; confirmed 2026-04-07)\nWeight: 9.6 g (actual)       Gold price: 411 CNY/g (base: 385 CNY/g)\nMaking: 78 CNY/g\nTotal: 4,698 CNY ≈ 20,000 TWD (2020)\nDate: 1 November 2020\n\nEngraving: Victorian interlaced monogram (TYL)",
    "metadata": {
      "price": 20000,
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "pembroke",
    "section": "Foundation",
    "category": "Footwear",
    "brand": "Crockett & Jones",
    "name": "Pembroke",
    "season": "All-season",
    "colour": "Tan",
    "colourCode": "#a3480e",
    "fabric": "Scotch grain calf",
    "size": "UK 10 E",
    "purchaseDate": "2020-10-26",
    "image": "/images/wardrobe/pembroke/main/1.webp",
    "gallery": [
      "/images/wardrobe/pembroke/main/2.webp",
      "/images/wardrobe/pembroke/main/3.webp"
    ],
    "notes": "Type: Full brogue country derby, wing-tip with full punching\nSole: Dainite rubber\nLast: 325",
    "metadata": {
      "price": 201.75,
      "basicColour": "brown",
      "priceCurrency": "USD"
    }
  },

  {
    "id": "ventile-harrington-jacket",
    "section": "Tailoring & Outerwear",
    "pillar": "Clothing",
    "category": "Outerwear",
    "brand": "Private White VC",
    "name": "Ventile Harrington Jacket",
    "season": "A/W",
    "colour": "Midnight Navy",
    "colourCode": "#20252F",
    "fabric": "Ventile",
    "size": "6=XL",
    "purchaseDate": "2025-12-26",
    "image": "/images/wardrobe/ventile-harrington-jacket/main/1.webp",
    "gallery": [
      "/images/wardrobe/ventile-harrington-jacket/main/2.webp",
      "/images/wardrobe/ventile-harrington-jacket/main/3.webp",
      "/images/wardrobe/ventile-harrington-jacket/main/4.webp"
    ],
    "notes": "A jacket with soul. First stitched in the 1950s and still made in Manchester, it has dressed rebels, musicians, and silver-screen legends for generations. With its stand collar, copper zip, and waterproof Ventile shell, the Harrington is as it was meant to be - timeless, understated, and unmistakably British.",
    "metadata": {
      "price": 3377,
      "priceCurrency": "CNY"
    }
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
    "image": "/images/wardrobe/herringbone-tweed-jacket/main/1.webp",
    "gallery": [
      "/images/wardrobe/herringbone-tweed-jacket/main/2.webp"
    ],
    "metadata": {
      "price": 175,
      "priceCurrency": "USD"
    }
  },

  {
    "id": "glen-check-tweed-jacket",
    "section": "Tailoring & Outerwear",
    "pillar": "Clothing",
    "category": "Tailoring",
    "brand": "Cultum",
    "name": "Glen Check Tweed Jacket",
    "season": "A/W",
    "colour": "Brown",
    "colourCode": "7B5A43",
    "fabric": "Tweed",
    "weight": "620 gsm",
    "size": "58B",
    "measuredDimensions": "Shoulder: 51.8\nChest: 120\nWaist: 111\nSleeve: 64.4\nLength: 79",
    "purchaseDate": "2025-11-22",
    "image": "/images/wardrobe/glen-check-tweed-jacket/main/1.webp",
    "gallery": [
      "/images/wardrobe/glen-check-tweed-jacket/main/2.webp",
      "/images/wardrobe/glen-check-tweed-jacket/main/3.webp",
      "/images/wardrobe/glen-check-tweed-jacket/main/4.webp",
      "/images/wardrobe/glen-check-tweed-jacket/main/5.webp"
    ],
    "metadata": {
      "price": 867,
      "basicColour": "brown",
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "linen-safari-jacket",
    "section": "Tailoring & Outerwear",
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
    "image": "/images/wardrobe/linen-safari-jacket/main/1.webp",
    "gallery": [
      "/images/wardrobe/linen-safari-jacket/main/2.webp"
    ],
    "metadata": {
      "price": 893.32,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "1930s-half-belt-leather-jacket",
    "section": "Tailoring & Outerwear",
    "category": "Outerwear",
    "brand": "Aero Leather Clothing",
    "name": "1930s Half-Belt Leather Jacket",
    "colour": "Vicenza Seal",
    "colourCode": "#56382e",
    "notes": "* Vicenza Seal +£90\n* Waldes Grommet Brass +£42\n* Brown Drill\n* Match Stitch\n* Ball & Chain\n* No Inside Pocket\n\n£1,182\n* 47,000～51,000 TWD",
    "season": "A/W",
    "colourVariants": [
      {
        "key": "seal",
        "image": "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/1.webp",
        "label": "Seal",
        "notes": "",
        "colour": "Vicenza Seal",
        "gallery": [
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/2.webp",
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/3.webp",
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/4.webp",
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/5.webp",
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Seal/6.webp"
        ],
        "colourCode": "#56382e"
      },
      {
        "key": "dark-seal",
        "image": "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Dark Seal/1.webp",
        "label": "Dark Seal",
        "notes": "",
        "colour": "Dark Seal",
        "gallery": [
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Dark Seal/2.webp",
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Dark Seal/3.webp",
          "/images/wardrobe/1930s-half-belt-leather-jacket/variants/Dark Seal/4.webp"
        ],
        "colourCode": "#291F1D"
      }
    ],
    "metadata": {
      "basicColour": "brown",
      "price": 1591.82,
      "priceCurrency": "USD"
    }
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
    "image": "/images/wardrobe/houndstooth-tweed-jacket/main/1.webp",
    "gallery": [
      "/images/wardrobe/houndstooth-tweed-jacket/main/2.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/3.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/4.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/5.webp",
      "/images/wardrobe/houndstooth-tweed-jacket/main/6.webp"
    ],
    "metadata": {
      "price": 79.99,
      "priceCurrency": "USD"
    }
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
    "fabric": "Linen",
    "weight": "~280 gsm",
    "size": "AB8",
    "purchaseDate": "2025-02-01",
    "image": "/images/wardrobe/basket-weave-linen-jacket/main/1.webp",
    "gallery": [
      "/images/wardrobe/basket-weave-linen-jacket/main/2.webp"
    ],
    "notes": "Polo Ralph Lauren Vintage Linen Sport Coat (1990s, Made in Japan)\n\n* Era: 1990s\n* Line: Polo by Ralph Lauren\n* Licensee: Impact 21 Co., Ltd. (Japanese subsidiary of Ralph Lauren)\n* Measurements:\n    * Back Length: 78 cm\n    * Shoulder: 49 cm\n    * Chest: 61 cm\n    * Sleeve Length: 64 cm\n* Colour: Mixed Beige\n* Shell: 100% Linen\n* Lining: Cupro\n* Country of Origin: Made in Japan\n\nNotes:\nA Japanese domestic licensed piece from the 1990s under Impact 21, featuring classic American tailoring details including a 3-roll-2 front, notch lapels, side vents, and breathable linen construction. The relaxed silhouette reflects the softer Ivy / trad tailoring proportions typical of Ralph Lauren’s 1990s tailoring. Suitable as a warm-weather sport coat with strong compatibility for both Ivy and classic American casual wardrobes.",
    "metadata": {
      "price": 10620,
      "basicColour": "beige",
      "priceCurrency": "JPY"
    }
  },

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
    "image": "/images/wardrobe/golden-fleece-navy-blazer/main/1.webp",
    "gallery": [
      "/images/wardrobe/golden-fleece-navy-blazer/main/2.PNG",
      "/images/wardrobe/golden-fleece-navy-blazer/main/3.webp",
      "/images/wardrobe/golden-fleece-navy-blazer/main/4.webp"
    ],
    "metadata": {
      "price": 55,
      "priceCurrency": "USD"
    }
  },

  {
    "id": "boa-fleece-vest",
    "section": "Tailoring & Outerwear",
    "pillar": "Clothing",
    "category": "Layering",
    "brand": "Muji",
    "name": "Boa Fleece Vest",
    "season": "A/W",
    "colour": "Ecru",
    "colourCode": "#eae0d2",
    "fabric": "Sherpa fleece",
    "size": "XL",
    "purchaseDate": "2023-12-09",
    "image": "/images/wardrobe/boa-fleece-vest/main/1.webp",
    "gallery": [
      "/images/wardrobe/boa-fleece-vest/main/2.webp"
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
    "id": "aran-cable-knit-jumper",
    "section": "Knitwear",
    "category": "Layering",
    "brand": "Muji",
    "name": "Aran Cable-Knit Jumper",
    "season": "A/W",
    "colour": "Mushroom Taupe",
    "colourCode": "B2A9A5",
    "fabric": "Wool",
    "weight": "Heavy",
    "size": "XL",
    "purchaseDate": "2024-12-27",
    "image": "/images/wardrobe/aran-cable-knit-jumper/main/1.webp",
    "gallery": [
      "/images/wardrobe/aran-cable-knit-jumper/main/2.webp"
    ],
    "metadata": {
      "price": 7990,
      "basicColour": "beige",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "driver-knit-zip-up-jumper",
    "section": "Knitwear",
    "pillar": "Clothing",
    "category": "Outerwear",
    "brand": "Maison Margiela",
    "name": "Driver Knit Zip-Up Jumper",
    "season": "All-season",
    "colour": "Grey",
    "colourCode": "#6B6B6B",
    "fabric": "Wool",
    "size": "XL",
    "purchaseDate": "2026-06-09",
    "measuredDimensions": "Shoulder: 47\nChest: 128\nSleeve: 73\nLength: 74",
    "image": "/images/wardrobe/driver-knit-zip-up-jumper/main/1.webp",
    "gallery": [
      "/images/wardrobe/driver-knit-zip-up-jumper/main/2.webp",
      "/images/wardrobe/driver-knit-zip-up-jumper/main/3.webp"
    ],
    "metadata": {
      "price": 175.925,
      "priceCurrency": "CNY",
      "basicColour": "grey",
      "measurementRows": [
        { "label": "Shoulder", "value": "47" },
        { "label": "Chest", "value": "128" },
        { "label": "Sleeve", "value": "73" },
        { "label": "Length", "value": "74" }
      ]
    }
  },

  {
    "id": "polo-bear-jumper",
    "section": "Knitwear",
    "category": "Layering",
    "brand": "Polo Ralph Lauren",
    "name": "Polo Bear Jumper",
    "season": "A/W",
    "colour": "Wine",
    "colourCode": "#49131e",
    "fabric": "Wool-cashmere",
    "size": "XL",
    "purchaseDate": "2025-01-07",
    "image": "/images/wardrobe/polo-bear-jumper/main/1.webp",
    "gallery": [
      "/images/wardrobe/polo-bear-jumper/main/2.webp",
      "/images/wardrobe/polo-bear-jumper/main/3.webp",
      "/images/wardrobe/polo-bear-jumper/main/4.webp",
      "/images/wardrobe/polo-bear-jumper/main/5.webp",
      "/images/wardrobe/polo-bear-jumper/main/6.webp"
    ],
    "metadata": {
      "price": 28000,
      "priceCurrency": "JPY"
    }
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
    "image": "/images/wardrobe/fair-isle-vest/main/1.webp",
    "gallery": [
      "/images/wardrobe/fair-isle-vest/main/2.webp",
      "/images/wardrobe/fair-isle-vest/main/3.webp",
      "/images/wardrobe/fair-isle-vest/main/4.webp"
    ],
    "metadata": {
      "price": 357.97,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "cricket-cable-knit-jumper-vest",
    "section": "Knitwear",
    "pillar": "Clothing",
    "category": "Layering",
    "brand": "UNIQLO",
    "name": "Cricket Cable-Knit Jumper Vest",
    "season": "A/W",
    "colour": "Ecru",
    "colourCode": "#fffcf5",
    "fabric": "Cotton-acrylic",
    "size": "XL",
    "purchaseDate": "2022-08-08",
    "image": "/images/wardrobe/cricket-cable-knit-jumper-vest/main/1.webp",
    "gallery": [
      "/images/wardrobe/cricket-cable-knit-jumper-vest/main/2.webp",
      "/images/wardrobe/cricket-cable-knit-jumper-vest/main/3.webp",
      "/images/wardrobe/cricket-cable-knit-jumper-vest/main/4.webp"
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
    "id": "v-neck-cardigan",
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
    "image": "/images/wardrobe/v-neck-cardigan/main/1.webp",
    "gallery": [
      "/images/wardrobe/v-neck-cardigan/main/2.webp",
      "/images/wardrobe/v-neck-cardigan/main/3.webp"
    ],
    "notes": "紳士　洗えるウールハイゲージＶネックカーディガン紳士ＸＬ・ダークネイビー",
    "metadata": {
      "price": 4990,
      "priceCurrency": "JPY"
    }
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
    "image": "/images/wardrobe/kataaze-knit-mock-neck-jumper/main/1.webp",
    "gallery": [
      "/images/wardrobe/kataaze-knit-mock-neck-jumper/main/2.webp"
    ],
    "metadata": {
      "price": 990,
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "rib-knit-roll-neck-jumper",
    "section": "Knitwear",
    "pillar": "Clothing",
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
    "image": "/images/wardrobe/rib-knit-roll-neck-jumper/main/1.webp",
    "gallery": [
      "/images/wardrobe/rib-knit-roll-neck-jumper/main/2.webp",
      "/images/wardrobe/rib-knit-roll-neck-jumper/main/3.webp",
      "/images/wardrobe/rib-knit-roll-neck-jumper/main/4.webp"
    ],
    "notes": "紳士 洗えるウールリブタートルネックセーター",
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "ocbd-shirt",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "UNIQLO",
    "name": "OCBD Shirt",
    "season": "All-season",
    "colour": "White",
    "colourCode": "#F5F5F9",
    "image": "/images/wardrobe/ocbd-shirt/variants/white/1.webp",
    "fabric": "Cotton",
    "size": "XL",
    "purchaseDate": "2020-01-01",
    "colourVariants": [
      {
        "key": "white",
        "image": "/images/wardrobe/ocbd-shirt/variants/white/1.webp",
        "label": "White",
        "notes": "",
        "colour": "White",
        "gallery": [
          "/images/wardrobe/ocbd-shirt/variants/white/2.webp",
          "/images/wardrobe/ocbd-shirt/variants/white/3.webp"
        ],
        "colourCode": "#F5F5F9",
        "previewImage": "/images/wardrobe/ocbd-shirt/variants/white/preview.webp"
      },
      {
        "key": "blue",
        "image": "/images/wardrobe/ocbd-shirt/variants/blue/1.webp",
        "label": "Blue",
        "notes": "",
        "colour": "Blue",
        "gallery": [
          "/images/wardrobe/ocbd-shirt/variants/blue/2.webp"
        ],
        "colourCode": "#BAC9EF",
        "previewImage": "/images/wardrobe/ocbd-shirt/variants/blue/preview.webp"
      },
      {
        "key": "pink-stripe",
        "image": "/images/wardrobe/ocbd-shirt/variants/pink-stripe/1.webp",
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
        "image": "/images/wardrobe/ocbd-shirt/variants/blue-striped/1.webp",
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
      "priceCurrency": "JPY"
    }
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
    "fabric": "Linen",
    "size": "XL",
    "purchaseDate": "2025-07-13",
    "image": "/images/wardrobe/linen-camp-collar-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/linen-camp-collar-shirt/main/2.webp"
    ],
    "notes": "コットンリネンシャツ",
    "metadata": {
      "price": 2990,
      "priceCurrency": "JPY"
    }
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
    "image": "/images/wardrobe/linen-loop-collar-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/linen-loop-collar-shirt/main/2.webp",
      "/images/wardrobe/linen-loop-collar-shirt/main/3.webp"
    ],
    "notes": "FLOWING REGULAR FIT SHIRT",
    "metadata": {
      "price": 8590,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "striped-camp-collar-shirt",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "H&M",
    "name": "Striped Camp Collar Shirt",
    "season": "S/S",
    "colour": "Oatmeal/Striped",
    "colourCode": "#cdc5bc",
    "size": "XL",
    "purchaseDate": "2025-08-01",
    "image": "/images/wardrobe/striped-camp-collar-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/striped-camp-collar-shirt/main/2.webp",
      "/images/wardrobe/striped-camp-collar-shirt/main/3.webp",
      "/images/wardrobe/striped-camp-collar-shirt/main/4.webp"
    ],
    "notes": "Regular Fit Textured resort shirt",
    "metadata": {
      "price": 2499,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "breton-sailor-shirt",
    "section": "Shirts & Tops",
    "pillar": "Clothing",
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
    "image": "/images/wardrobe/breton-sailor-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/breton-sailor-shirt/main/2.webp"
    ],
    "notes": "紳士 洗いざらし太番手ボートネック九分袖Ｔシャツ",
    "metadata": {
      "price": 2990,
      "basicColour": "white",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "washed-rugby-shirt",
    "section": "Shirts & Tops",
    "category": "Layering",
    "brand": "Polo Ralph Lauren",
    "name": "Washed Rugby Shirt",
    "season": "A/W",
    "colour": "Wine",
    "colourCode": "6A1124",
    "fabric": "Cotton",
    "size": "XL",
    "purchaseDate": "2025-01-19",
    "image": "/images/wardrobe/washed-rugby-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/washed-rugby-shirt/main/2.webp",
      "/images/wardrobe/washed-rugby-shirt/main/3.webp",
      "/images/wardrobe/washed-rugby-shirt/main/4.webp"
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
    "id": "henley-knit-t-shirt",
    "section": "Shirts & Tops",
    "pillar": "Clothing",
    "category": "Tops",
    "brand": "Zara",
    "name": "Henley Knit T-Shirt",
    "season": "S/S",
    "colour": "Navy",
    "colourCode": "#1f222e",
    "size": "XL",
    "purchaseDate": "2025-08-09",
    "image": "/images/wardrobe/henley-knit-t-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/henley-knit-t-shirt/main/2.webp",
      "/images/wardrobe/henley-knit-t-shirt/main/3.webp",
      "/images/wardrobe/henley-knit-t-shirt/main/4.webp",
      "/images/wardrobe/henley-knit-t-shirt/main/5.webp",
      "/images/wardrobe/henley-knit-t-shirt/main/6.webp",
      "/images/wardrobe/henley-knit-t-shirt/main/7.webp",
      "/images/wardrobe/henley-knit-t-shirt/main/8.webp"
    ],
    "notes": "BUTTON-NECK KNIT T-SHIRT",
    "metadata": {
      "price": 6590,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "fine-knit-t-shirt",
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
    "image": "/images/wardrobe/fine-knit-t-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/fine-knit-t-shirt/main/2.webp"
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
    "id": "purl-knit-t-shirt",
    "section": "Shirts & Tops",
    "category": "Tops",
    "brand": "Zara",
    "name": "Purl-Knit T-Shirt",
    "season": "S/S",
    "colour": "Off-White",
    "size": "XL",
    "purchaseDate": "2025-08-05",
    "image": "/images/wardrobe/purl-knit-t-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/purl-knit-t-shirt/main/2.webp"
    ],
    "metadata": {
      "price": 5990,
      "basicColour": "white",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "knit-long-sleeve-polo",
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
    "image": "/images/wardrobe/knit-long-sleeve-polo/main/1.webp",
    "gallery": [
      "/images/wardrobe/knit-long-sleeve-polo/main/2.webp"
    ],
    "metadata": {
      "price": 407.82,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "cable-knit-polo",
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
    "image": "/images/wardrobe/cable-knit-polo/main/1.webp",
    "gallery": [
      "/images/wardrobe/cable-knit-polo/main/2.webp"
    ],
    "metadata": {
      "price": 1990,
      "basicColour": "red",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "cutwork-knit-polo-shirt",
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
    "image": "/images/wardrobe/cutwork-knit-polo-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/cutwork-knit-polo-shirt/main/2.webp",
      "/images/wardrobe/cutwork-knit-polo-shirt/main/3.webp"
    ],
    "notes": "Relaxed fit knit polo shirt woven from yarn with an open structure. Lapel collar with front opening. Short sleeves. Ribbed trims.",
    "metadata": {
      "price": 7990,
      "basicColour": "grey",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "rib-knit-polo-shirt-dark-chocolate",
    "section": "Shirts & Tops",
    "pillar": "Clothing",
    "category": "Tops",
    "brand": "Zara",
    "name": "Rib Knit Polo Shirt",
    "season": "S/S",
    "colour": "Dark Chocolate",
    "colourCode": "#2C2928",
    "size": "XL",
    "measuredDimensions": "Measurements: Chest 59.5 cm · Front length 71.5 cm · Sleeve length 24 cm · Back width 51.5 cm · Arm width 19.5 cm ·  ·  · cm",
    "purchaseDate": "2026-05-14",
    "image": "/images/wardrobe/rib-knit-polo-shirt-dark-chocolate/main/1.webp",
    "gallery": [
      "/images/wardrobe/rib-knit-polo-shirt-dark-chocolate/main/2.webp"
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
    "id": "rib-knit-polo-shirt-dusty-ice-blue",
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
    "image": "/images/wardrobe/rib-knit-polo-shirt-dusty-ice-blue/main/1.webp",
    "gallery": [
      "/images/wardrobe/rib-knit-polo-shirt-dusty-ice-blue/main/2.webp"
    ],
    "notes": "ZARA RIB KNIT POLO SHIRT",
    "metadata": {
      "price": 1570,
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "structured-knit-polo-shirt",
    "section": "Shirts & Tops",
    "pillar": "Clothing",
    "category": "Tops",
    "brand": "Zara",
    "name": "Structured Knit Polo Shirt",
    "season": "S/S",
    "colourCode": "#3E3934",
    "size": "XL",
    "measuredDimensions": "Chest: 59.5 cm\nFront length: 71.5 cm\nSleeve length: 24 cm\nBack width: 51.5 cm\nArm width: 19.5 cm",
    "purchaseDate": "2026-05-14",
    "image": "/images/wardrobe/structured-knit-polo-shirt/main/1.webp",
    "gallery": [
      "/images/wardrobe/structured-knit-polo-shirt/main/2.webp"
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
  },

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
    "image": "/images/wardrobe/fluid-boot-cut-trousers/main/1.webp",
    "gallery": [
      "/images/wardrobe/fluid-boot-cut-trousers/main/2.webp",
      "/images/wardrobe/fluid-boot-cut-trousers/main/3.webp",
      "/images/wardrobe/fluid-boot-cut-trousers/main/4.webp"
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
    }
  },

  {
    "id": "wide-straight-trousers",
    "section": "Bottoms",
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
    "image": "/images/wardrobe/wide-straight-trousers/main/1.webp",
    "gallery": [
      "/images/wardrobe/wide-straight-trousers/main/2.webp"
    ],
    "notes": "ワイドスラックス+EC(丈長め78.5cm)",
    "metadata": {
      "price": 2990,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "corduroy-trousers",
    "section": "Bottoms",
    "category": "Trousers",
    "brand": "L.L.Bean",
    "name": "Corduroy Trousers",
    "season": "A/W",
    "colour": "Dark Khaki",
    "colourCode": "#c6ac88",
    "fabric": "Corduroy",
    "size": "38 x 30 inch",
    "purchaseDate": "2025-01-01",
    "image": "/images/wardrobe/corduroy-trousers/main/1.webp",
    "gallery": [
      "/images/wardrobe/corduroy-trousers/main/2.webp",
      "/images/wardrobe/corduroy-trousers/main/3.webp",
      "/images/wardrobe/corduroy-trousers/main/4.webp"
    ],
    "metadata": {
      "price": 11000,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "pleated-trousers",
    "section": "Bottoms",
    "pillar": "Clothing",
    "category": "Trousers",
    "brand": "UNIQLO",
    "name": "Pleated Trousers",
    "season": "All-season",
    "colour": "Grey",
    "colourCode": "#5F5F62",
    "size": "XL",
    "purchaseDate": "2023-11-20",
    "notes": "Fabric details\nBody: 62% Polyester - Recycled Fiber, 29% Viscose, 5% Polyester, 4% Elastane/ Pocket Lining: 65% Polyester, 35% Cotton\nWashing instructions\nMachine wash up to 40 degrees, gentle cycle, Dry Clean, Not suitable for tumble-drying.",
    "colourVariants": [
      {
        "key": "grey",
        "image": "/images/wardrobe/pleated-trousers/variants/grey/1.webp",
        "label": "Grey",
        "notes": "",
        "colour": "Grey",
        "gallery": [
          "/images/wardrobe/pleated-trousers/variants/grey/2.webp"
        ],
        "colourCode": "#5F5F62",
        "basicColour": "grey",
        "previewImage": "/images/wardrobe/pleated-trousers/variants/grey/preview.webp"
      },
      {
        "key": "beige",
        "image": "/images/wardrobe/pleated-trousers/variants/beige/1.webp",
        "label": "Beige",
        "notes": "",
        "colour": "Beige",
        "gallery": [
          "/images/wardrobe/pleated-trousers/variants/beige/2.webp"
        ],
        "colourCode": "#CEBEA6",
        "basicColour": "beige",
        "previewImage": "/images/wardrobe/pleated-trousers/variants/beige/preview.webp"
      }
    ],
    "metadata": {
      "price": 3990,
      "priceCurrency": "JPY"
    }
  },

  // ——— Accessories ———,

  {
    "id": "linen-pleated-shorts",
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
    "image": "/images/wardrobe/linen-pleated-shorts/main/1.webp",
    "gallery": [
      "/images/wardrobe/linen-pleated-shorts/main/2.webp"
    ],
    "metadata": {
      "price": 3600,
      "basicColour": "white",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "jwa-straight-jeans",
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
    "image": "/images/wardrobe/jwa-straight-jeans/main/1.webp",
    "gallery": [
      "/images/wardrobe/jwa-straight-jeans/main/2.webp"
    ],
    "metadata": {
      "price": 1290,
      "basicColour": "blue",
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "wide-leg-jeans",
    "section": "Bottoms",
    "category": "Trousers",
    "brand": "MUJI",
    "name": "Wide-Leg Jeans",
    "season": "All-season",
    "colour": "Cream",
    "colourCode": "#ebe6d5",
    "fabric": "Kapok, Cotton",
    "size": "XL",
    "purchaseDate": "2025-04-21",
    "image": "/images/wardrobe/wide-leg-jeans/main/1.webp",
    "gallery": [
      "/images/wardrobe/wide-leg-jeans/main/2.webp"
    ],
    "notes": "木の実から作ったカポック混キャンバスワイドパンツ\nカラー：生成\nサイズ：紳士ＸＬ\n商品番号：84218460",
    "metadata": {
      "price": 4990,
      "priceCurrency": "JPY"
    }
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
    "image": "/images/wardrobe/wide-leg-white-jeans/main/1.webp",
    "gallery": [
      "/images/wardrobe/wide-leg-white-jeans/main/2.webp"
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
    "id": "x100vi-camera",
    "section": "Objects",
    "category": "Objects",
    "brand": "Fujifilm",
    "name": "X100VI Camera",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "purchaseDate": "2024-10-24",
    "image": "/images/wardrobe/x100vi-camera/main/1.webp",
    "gallery": [
      "/images/wardrobe/x100vi-camera/main/2.webp",
      "/images/wardrobe/x100vi-camera/main/3.webp",
      "/images/wardrobe/x100vi-camera/main/4.webp"
    ],
    "metadata": {
      "price": 14117,
      "priceCurrency": "CNY"
    }
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
    "purchaseDate": "2026-05-19",
    "image": "/images/wardrobe/ligne-2-lighter/main/1.webp",
    "gallery": [
      "/images/wardrobe/ligne-2-lighter/main/2.webp",
      "/images/wardrobe/ligne-2-lighter/main/3.webp",
      "/images/wardrobe/ligne-2-lighter/main/4.webp",
      "/images/wardrobe/ligne-2-lighter/main/5.webp"
    ],
    "notes": "Decorated with the iconic house pattern: diamond-pattern tip and yellow gold plating. Associated lighter stone: black (REF 900600). Associated gas refill: yellow (REF 900432).",
    "metadata": {
      "price": 255,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "meisterstuck-legrand-ballpoint-pen",
    "section": "Objects",
    "category": "Objects",
    "brand": "Montblanc",
    "name": "Meisterstück LeGrand Ballpoint Pen",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "image": "/images/wardrobe/meisterstuck-legrand-ballpoint-pen/main/1.webp",
    "gallery": [
      "/images/wardrobe/meisterstuck-legrand-ballpoint-pen/main/2.webp",
      "/images/wardrobe/meisterstuck-legrand-ballpoint-pen/main/3.webp",
      "/images/wardrobe/meisterstuck-legrand-ballpoint-pen/main/4.webp",
      "/images/wardrobe/meisterstuck-legrand-ballpoint-pen/main/5.webp",
      "/images/wardrobe/meisterstuck-legrand-ballpoint-pen/main/6.webp"
    ],
    "purchaseDate": "2014-03-10",
    "notes": "Originally owned by my father.",
    "metadata": {
      "price": 570,
      "priceCurrency": "USD",
      "secondaryColour": "Gold",
      "secondaryColourCode": "#C9A84C"
    }
  },

  {
    "id": "meisterstuck-classique-rollerball",
    "section": "Objects",
    "category": "Objects",
    "brand": "Montblanc",
    "name": "Meisterstück Classique Rollerball",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "purchaseDate": "2022-02-20",
    "image": "/images/wardrobe/meisterstuck-classique-rollerball/main/1.webp",
    "gallery": [
      "/images/wardrobe/meisterstuck-classique-rollerball/main/2.webp",
      "/images/wardrobe/meisterstuck-classique-rollerball/main/3.webp",
      "/images/wardrobe/meisterstuck-classique-rollerball/main/4.webp"
    ],
    "metadata": {
      "secondaryColour": "Gold",
      "secondaryColourCode": "#C9A84C"
    }
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
    "image": "/images/wardrobe/cordovan-l-zip-wallet/main/1.webp",
    "gallery": [
      "/images/wardrobe/cordovan-l-zip-wallet/main/2.webp",
      "/images/wardrobe/cordovan-l-zip-wallet/main/3.webp"
    ],
    "notes": "Crafted from aniline-dyed Japanese cordovan, this minimalist wallet offers sleek design and efficient functionality. The luxuriously smooth leather has striking presence in a streamlined profile that slips effortlessly into any pocket. Over time, it develops a rich, gem-like luster—the perfect companion for an intentional lifestyle.",
    "metadata": {
      "price": 33000,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "passport-cover",
    "section": "Objects",
    "category": "Objects",
    "brand": "Louis Vuitton",
    "name": "Passport Cover",
    "season": "All-season",
    "colour": "Monogram Canvas",
    "colourCode": "#6B5234",
    "purchaseDate": "2024-10-26",
    "image": "/images/wardrobe/passport-cover/main/1.webp",
    "gallery": [
      "/images/wardrobe/passport-cover/main/2.webp",
      "/images/wardrobe/passport-cover/main/3.webp",
      "/images/wardrobe/passport-cover/main/4.webp"
    ],
    "metadata": {
      "price": 271.1,
      "basicColour": "brown",
      "priceCurrency": "CNY"
    }
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
    "purchaseDate": "2025-03-19",
    "image": "/images/wardrobe/arabesque-card-case/main/1.webp",
    "gallery": [
      "/images/wardrobe/arabesque-card-case/main/2.webp",
      "/images/wardrobe/arabesque-card-case/main/3.webp",
      "/images/wardrobe/arabesque-card-case/main/4.webp",
      "/images/wardrobe/arabesque-card-case/main/5.webp",
      "/images/wardrobe/arabesque-card-case/main/6.webp",
      "/images/wardrobe/arabesque-card-case/main/7.webp"
    ],
    "notes": "Crafted from stainless steel with a rigid, durable construction.\n\nFeatures a refined silver arabesque pattern and double-sided storage.\n\nOne side can hold business cards, while the other may be used for credit cards or received cards.\n\nCapacity: Approximately 30 standard business cards.\nDimensions: 97 × 66 × 13 mm.",
    "metadata": {
      "price": 1950,
      "priceCurrency": "JPY"
    }
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
    "purchaseDate": "2025-08-22",
    "image": "/images/wardrobe/ryoma-folding-fan/main/1.webp",
    "gallery": [
      "/images/wardrobe/ryoma-folding-fan/main/2.webp",
      "/images/wardrobe/ryoma-folding-fan/main/3.webp"
    ],
    "notes": "Crafted by Miyawaki Baisenan of Kyoto, established in 1823, the fan combines traditional washi paper with kakishibu, a persimmon tannin finish that slowly darkens and develops character through use and age.\n\nSize: 8 sun, approximately 24 cm\nRibs: Bamboo, karaki finish\nFan face: Washi paper",
    "metadata": {
      "price": 7150,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "gt1-hardwood-umbrella",
    "section": "Objects",
    "category": "Objects",
    "brand": "Fox Umbrellas",
    "name": "GT1 Hardwood Umbrella",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "purchaseDate": "2025-01-11",
    "image": "/images/wardrobe/gt1-hardwood-umbrella/main/1.webp",
    "gallery": [
      "/images/wardrobe/gt1-hardwood-umbrella/main/2.webp",
      "/images/wardrobe/gt1-hardwood-umbrella/main/3.webp",
      "/images/wardrobe/gt1-hardwood-umbrella/main/4.webp"
    ],
    "notes": "Made in Britain by Fox Umbrellas, established in 1868.\n\nBuilt on a 25-inch Classic Fox steel tube frame with black ribs, a black 100% Best Polyester canopy, and a polished ash hardwood handle in a light grained finish.\n\nManual opening mechanism with matching outside case.\n\nCanopy diameter: 104.5 cm\nFull length: 91 cm\nWeight: approximately 530 g\nFrame: 25” Classic Fox brown steel tube frame with black ribs\nCanopy: 100% Best Polyester, water-repellent and UV-treated\nHandle: Ash hardwood, light grained finish\nWood genus: Fraxinus\nWood species: Chinensis\nMade in Britain",
    "metadata": {
      "price": 20730,
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "prx-quartz",
    "section": "Watches",
    "category": "Everyday",
    "brand": "Tissot",
    "name": "PRX Quartz",
    "season": "All-season",
    "colour": "Gold PVD",
    "colourCode": "#C9A84C",
    "weight": "T137.210.33.021.00",
    "size": "35 mm",
    "purchaseDate": "2024-08-08",
    "image": "/images/wardrobe/prx-quartz/main/1.webp",
    "gallery": [
      "/images/wardrobe/prx-quartz/main/2.webp"
    ],
    "notes": "Reference: T137.210.33.021.00\nMovement: ETA F06.115 quartz\nCase: 35 mm gold PVD\nDial: Champagne sunburst\nIntegrated gold PVD bracelet\n\nInspired by the integrated-bracelet sports watches of the 1970s, the PRX served as an everyday watch and an introduction to the aesthetic of vintage luxury sports watches prior to a future Rolex Datejust 16018.",
    "metadata": {
      "price": 11309,
      "basicColour": "gold",
      "priceCurrency": "TWD"
    }
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
    "purchaseDate": "2026-06-10",
    "image": "/images/wardrobe/datejust-36-mod/main/1.webp",
    "gallery": [
      "/images/wardrobe/datejust-36-mod/main/2.webp",
      "/images/wardrobe/datejust-36-mod/main/3.webp"
    ],
    "notes": "Inspired by the proportions of the contemporary Datejust 36, this modified Seiko adopts an all-gold configuration no longer found in the current Rolex catalogue, combining modern proportions with an aesthetic more closely associated with earlier generations of the model.",
    "metadata": {
      "price": 591,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "dw-5600e",
    "section": "Watches",
    "category": "Beater",
    "brand": "G-Shock",
    "name": "DW-5600E",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "purchaseDate": "2020-04-09",
    "image": "/images/wardrobe/dw-5600e/main/1.webp",
    "gallery": [
      "/images/wardrobe/dw-5600e/main/2.webp",
      "/images/wardrobe/dw-5600e/main/3.webp"
    ],
    "notes": "The Casio DW-5600E preserves the original square-form design language established by the first G-Shock models of the 1980s. Although positioned within the collection as the dedicated beater watch, it remains one of the defining forms of the modern digital watch, with a design language that has remained essentially unchanged for decades.",
    "metadata": {
      "price": 1479,
      "basicColour": "black",
      "priceCurrency": "TWD"
    }
  },

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
    "image": "/images/wardrobe/tassel-moccasin-loafer/main/1.webp",
    "gallery": [
      "/images/wardrobe/tassel-moccasin-loafer/main/2.webp",
      "/images/wardrobe/tassel-moccasin-loafer/main/3.webp"
    ],
    "notes": "Sole: Single oak leather outsole \nLast: Aberdeen",
    "metadata": {
      "price": 200,
      "basicColour": "red",
      "priceCurrency": "USD"
    }
  },

  {
    "id": "chukka",
    "section": "Footwear",
    "category": "Footwear",
    "brand": "Crockett & Jones",
    "name": "Chukka",
    "season": "All-season",
    "colour": "Snuff",
    "colourCode": "#743E1C",
    "fabric": "Repello suede",
    "size": "UK 10 D",
    "purchaseDate": "2023-01-29",
    "image": "/images/wardrobe/chukka/main/1.webp",
    "gallery": [
      "/images/wardrobe/chukka/main/2.webp",
      "/images/wardrobe/chukka/main/3.webp",
      "/images/wardrobe/chukka/main/4.webp",
      "/images/wardrobe/chukka/main/5.webp",
      "/images/wardrobe/chukka/main/6.webp",
      "/images/wardrobe/chukka/main/7.webp",
      "/images/wardrobe/chukka/main/8.webp"
    ],
    "notes": "Unlined ankle boot; Scotch-guard treated\nSole: single leather\nLast: 200",
    "metadata": {
      "price": 161.44,
      "basicColour": "brown",
      "priceCurrency": "USD"
    }
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
    "image": "/images/wardrobe/ferret/main/1.webp",
    "gallery": [
      "/images/wardrobe/ferret/main/2.webp",
      "/images/wardrobe/ferret/main/3.webp",
      "/images/wardrobe/ferret/main/4.webp",
      "/images/wardrobe/ferret/main/5.webp"
    ],
    "metadata": {
      "price": 41696,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "achilles-low",
    "section": "Footwear",
    "category": "Footwear",
    "brand": "Common Projects",
    "name": "Achilles Low",
    "season": "All-season",
    "colour": "White",
    "colourCode": "#f1f1ee",
    "fabric": "Leather",
    "size": "EU 45",
    "purchaseDate": "2025-11-28",
    "image": "/images/wardrobe/achilles-low/main/1.webp",
    "gallery": [
      "/images/wardrobe/achilles-low/main/2.webp",
      "/images/wardrobe/achilles-low/main/3.webp"
    ],
    "notes": "Margom cup sole. Date: 28 Nov 2025.",
    "metadata": {
      "price": 374.85,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "curb-bracelet",
    "section": "Jewellery",
    "category": "Jewellery",
    "brand": "Bespoke",
    "name": "Curb Bracelet",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "weight": "18ct yellow gold, 5.2 mm",
    "size": "20.5 cm （8.07inches）",
    "purchaseDate": "2024-10-26",
    "image": "/images/wardrobe/curb-bracelet/main/1.webp",
    "gallery": [
      "/images/wardrobe/curb-bracelet/main/2.webp",
      "/images/wardrobe/curb-bracelet/main/3.webp",
      "/images/wardrobe/curb-bracelet/main/4.webp",
      "/images/wardrobe/curb-bracelet/main/5.webp"
    ],
    "notes": "Size: 20.5 cm （8.07inches）\nWeight: 11.71 g\nGold price: 596 CNY/g (base: 472, +45% vs 2020)\nMaking: 124 CNY/g\nTotal: 6,973 CNY ≈ 31,200 TWD (2024)\nDate: 26 October 2024",
    "metadata": {
      "price": 31200,
      "priceCurrency": "TWD"
    }
  },

  {
    "id": "rolo-chain-necklace",
    "section": "Jewellery",
    "category": "Jewellery",
    "brand": "Bespoke Tailor",
    "name": "Rolo Chain Necklace",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "weight": "18ct yellow gold, 2.5 mm",
    "size": "50 cm",
    "purchaseDate": "2024-08-20",
    "image": "/images/wardrobe/rolo-chain-necklace/main/1.webp",
    "gallery": [
      "/images/wardrobe/rolo-chain-necklace/main/2.JPG",
      "/images/wardrobe/rolo-chain-necklace/main/3.webp"
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
    "section": "Jewellery",
    "category": "Jewellery",
    "brand": "Bespoke Tailor",
    "name": "Ruby Gypsy Ring",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "fabric": "18K",
    "weight": "18ct yellow gold with Diamonds, 6.8 mm face, 3 mm shank",
    "size": "HK 22",
    "purchaseDate": "2024-08-04",
    "image": "/images/wardrobe/ruby-gypsy-ring/main/1.webp",
    "gallery": [
      "/images/wardrobe/ruby-gypsy-ring/main/2.webp",
      "/images/wardrobe/ruby-gypsy-ring/main/3.webp"
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
    "id": "sapphire-ring",
    "section": "Jewellery",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Sapphire Ring",
    "season": "All-season",
    "colour": "Platinum",
    "colourCode": "#E8E8E8",
    "fabric": "Platinum",
    "image": "/images/wardrobe/sapphire-ring/main/1.webp",
    "gallery": [
      "/images/wardrobe/sapphire-ring/main/2.webp"
    ],
    "notes": "Sapphire: 8 × 6 mm (1.3 - 1.5 ct)\nHue: Light cornflower blue (矢車菊藍)\n\nReference: Garrard 1735 sapphire ring",
    "metadata": {
      "secondaryColour": "Sapphire",
      "secondaryColourCode": "#384D87"
    }
  },

  {
    "id": "wedding-bands",
    "section": "Jewellery",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Wedding Bands",
    "season": "All-season",
    "colour": "Gold",
    "colourCode": "#C9A84C",
    "fabric": "Pt950 1.8 mm (bride) / 18ct YG 2 mm size 13 (groom)",
    "image": "/images/wardrobe/wedding-bands/main/1.webp",
    "gallery": [
      "/images/wardrobe/wedding-bands/main/2.webp",
      "/images/wardrobe/wedding-bands/main/3.webp",
      "/images/wardrobe/wedding-bands/main/4.webp",
      "/images/wardrobe/wedding-bands/main/5.webp",
      "/images/wardrobe/wedding-bands/main/6.webp"
    ],
    "notes": "Inscription: spouse name · date (e.g. Edward · 29 Mai). Worn at base when stacked. Reference: bands of Prince Edward Duke of Kent (1767–1820) and Princess Victoria Duchess of Kent (1786–1861).",
    "metadata": {
      "basicColour": "gold"
    }
  },

  {
    "id": "kingsman-0847-sunglasses",
    "section": "Eyewear",
    "category": "Eyewear",
    "brand": "Cutler and Gross",
    "name": "Kingsman 0847 Sunglasses",
    "season": "All-season",
    "colour": "Black",
    "colourCode": "#000000",
    "measuredDimensions": "Lens Width: 54 mm\nLens Height: 39.5 mm\nBridge Width: 19 mm\nTemple Length: 145 mm\nFrame Width: 142 mm\nFrame Height: 43 mm",
    "purchaseDate": "2023-11-27",
    "image": "/images/wardrobe/kingsman-0847-sunglasses/main/1.webp",
    "gallery": [
      "/images/wardrobe/kingsman-0847-sunglasses/main/2.jpeg",
      "/images/wardrobe/kingsman-0847-sunglasses/main/3.webp",
      "/images/wardrobe/kingsman-0847-sunglasses/main/4.webp",
      "/images/wardrobe/kingsman-0847-sunglasses/main/5.webp",
      "/images/wardrobe/kingsman-0847-sunglasses/main/6.webp"
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
      "secondaryColour": "Brown Lenses"
    }
  },

  {
    "id": "boston-metal-frames",
    "section": "Eyewear",
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
    "image": "/images/wardrobe/boston-metal-frames/main/1.webp",
    "gallery": [
      "/images/wardrobe/boston-metal-frames/main/2.webp",
      "/images/wardrobe/boston-metal-frames/main/3.webp"
    ],
    "notes": "A contemporary metal-frame design influenced by modern Asian eyewear trends. The softly rounded Boston shape creates a refined yet relaxed impression, while the slim 0.7 mm metal rim provides both a natural fit and comfortable wear. The polished metal construction adds a subtle jewellery-like character, allowing the frame to function easily as an everyday accessory.\n\nFinished in a dark Havana tortoiseshell pattern with gold temples, the frame balances warmer heritage tones with a lighter metallic accent. The slightly taller lens proportions soften the overall silhouette while adding openness to the face, making it suitable for both casual and more refined styling. Designed with a timeless approach, it remains easy to wear across changing trends.",
    "metadata": {
      "price": 9800,
      "basicColour": "gold",
      "priceCurrency": "JPY",
      "measurementRows": [
        {
          "label": "Lens width",
          "value": "52",
          "unit": "mm"
        },
        {
          "label": "Bridge width",
          "value": "20",
          "unit": "mm"
        },
        {
          "label": "Temple length",
          "value": "145",
          "unit": "mm"
        }
      ],
      "secondaryColour": "Gold",
      "secondaryColourCode": "#C9A84C"
    }
  },

  // ——— A/W – Country Classics ———,

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
    "image": "/images/wardrobe/wayfarer-sunglasses/main/1.webp",
    "gallery": [
      "/images/wardrobe/wayfarer-sunglasses/main/2.webp",
      "/images/wardrobe/wayfarer-sunglasses/main/3.webp",
      "/images/wardrobe/wayfarer-sunglasses/main/4.webp",
      "/images/wardrobe/wayfarer-sunglasses/main/5.webp",
      "/images/wardrobe/wayfarer-sunglasses/main/6.webp",
      "/images/wardrobe/wayfarer-sunglasses/main/7.webp",
      "/images/wardrobe/wayfarer-sunglasses/main/8.webp"
    ],
    "metadata": {
      "price": 6490,
      "basicColour": "brown",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "smoke-olive-acetate-optical",
    "section": "Eyewear",
    "category": "Eyewear",
    "brand": "Klassic.",
    "name": "Smoke Olive Acetate Optical",
    "season": "All-season",
    "colour": "Smoke Olive",
    "colourCode": "#555425",
    "weight": "M141",
    "purchaseDate": "2024-08-15",
    "image": "/images/wardrobe/smoke-olive-acetate-optical/main/1.webp",
    "gallery": [
      "/images/wardrobe/smoke-olive-acetate-optical/main/2.webp",
      "/images/wardrobe/smoke-olive-acetate-optical/main/3.webp"
    ],
    "metadata": {
      "price": 990,
      "basicColour": "green",
      "priceCurrency": "TWD"
    }
  },

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
    "image": "/images/wardrobe/grand-soir-eau-de-parfum/main/1.webp",
    "gallery": [
      "/images/wardrobe/grand-soir-eau-de-parfum/main/2.webp"
    ],
    "metadata": {
      "price": 22000,
      "basicColour": "__omit__",
      "priceCurrency": "JPY"
    }
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
    "image": "/images/wardrobe/new-york-intense-eau-de-parfum/main/1.webp",
    "gallery": [
      "/images/wardrobe/new-york-intense-eau-de-parfum/main/2.webp"
    ],
    "metadata": {
      "price": 23000,
      "basicColour": "__omit__",
      "priceCurrency": "JPY"
    }
  },

  {
    "id": "panama-hat",
    "section": "Accessories",
    "pillar": "Accessories",
    "category": "Hats",
    "brand": "Eloy Bernal",
    "name": "Panama Hat",
    "season": "All-season",
    "colour": "Bleached White",
    "colourCode": "#fffced",
    "size": "XL:61cm-1cm",
    "measuredDimensions": "Head Circumference: 61 cm\nBrim Width: 7 cm\nFront Crown Height: 9.7 cm\nCenter Crown Height: 10.7 cm\nOverall Length: 31.5 cm",
    "purchaseDate": "2025-05-11",
    "image": "/images/wardrobe/panama-hat/main/1.webp",
    "gallery": [
      "/images/wardrobe/panama-hat/main/2.webp",
      "/images/wardrobe/panama-hat/main/3.webp",
      "/images/wardrobe/panama-hat/main/4.webp",
      "/images/wardrobe/panama-hat/main/5.webp",
      "/images/wardrobe/panama-hat/main/6.webp",
      "/images/wardrobe/panama-hat/main/7.webp",
      "/images/wardrobe/panama-hat/main/8.webp"
    ],
    "notes": "Construction & Provenance\nHandwoven in Ecuador by ELOY BERNAL, this classic Panama is crafted from 100% natural toquilla straw using the traditional Llano weave. Finished in a bleached white tone with a black grosgrain ribbon, it balances lightweight structure with relaxed warm-weather elegance.\n\nDesign & Proportions (XL)\n* Style: Center-Dent Crown\n* Brim Type: Snap Brim\n* Crown Shape: Classic Fedora\n* Weight: approx. 100 g\n\nMaterial & Weave\n* Material: 100% Natural Toquilla Straw\n* Weave: Llano (classic basket/plain weave)\n* Grade: Standard\n* Hand Feel: Lightweight, soft-structured\n* Rigidity: Soft to medium\n* Breathability: High",
    "metadata": {
      "price": 9600,
      "priceCurrency": "JPY",
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
    }
  },

  {
    "id": "boat-and-tote",
    "section": "Accessories",
    "pillar": "Accessories",
    "category": "Bags",
    "brand": "L.L.Bean",
    "name": "Boat and Tote",
    "season": "All-season",
    "colour": "Cream",
    "colourCode": "#e2d8d0",
    "size": "Medium",
    "purchaseDate": "2025-01-01",
    "image": "/images/wardrobe/boat-and-tote/main/1.webp",
    "gallery": [
      "/images/wardrobe/boat-and-tote/main/2.webp",
      "/images/wardrobe/boat-and-tote/main/3.webp"
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
    "id": "anthony-crossbody-bag",
    "section": "Accessories",
    "pillar": "Accessories",
    "category": "Bags",
    "brand": "Mulberry",
    "name": "Anthony Crossbody Bag",
    "season": "All-season",
    "colour": "Oak",
    "colourCode": "#A95B32",
    "measuredDimensions": "Height: 25 cm\nWidth: 21 cm\nThickness: 7 cm\nStrap Width: 4 cm",
    "purchaseDate": "2025-07-27",
    "image": "/images/wardrobe/anthony-crossbody-bag/main/1.webp",
    "gallery": [
      "/images/wardrobe/anthony-crossbody-bag/main/2.webp",
      "/images/wardrobe/anthony-crossbody-bag/main/3.webp"
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
    "id": "american-flag-cap",
    "section": "Accessories",
    "pillar": "Accessories",
    "category": "Hats",
    "brand": "Smathers & Branson",
    "name": "American Flag Cap",
    "season": "All-season",
    "colour": "Steel Blue",
    "colourCode": "#5E829A",
    "measuredDimensions": "Circumference: 22.45 cm\nTop to Side: 6.65 cm\nBrim: 2.9 cm",
    "purchaseDate": "2026-05-11",
    "image": "/images/wardrobe/american-flag-cap/main/1.webp",
    "gallery": [
      "/images/wardrobe/american-flag-cap/main/2.webp",
      "/images/wardrobe/american-flag-cap/main/3.webp"
    ],
    "notes": "Our six panel cotton twill hats are adorned with our signature 100% hand-stitched needlepoint. Each hat is adjustable by a nickel slide on the back of the hat.\n\n-100% hand-stitched needlepoint\n-Stitched with French cotton thread\n-Six Panel Construction\n-Washed Cotton Twill\n-Adjustable. One size fits most adults.",
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
    }
  },

  {
    "id": "helmet-bag",
    "section": "Accessories",
    "pillar": "Accessories",
    "category": "Bags",
    "brand": "Uniqlo",
    "name": "Helmet Bag",
    "season": "All-season",
    "colour": "Grey Green",
    "colourCode": "#59686D",
    "purchaseDate": "2025-08-12",
    "image": "/images/wardrobe/helmet-bag/main/1.webp",
    "gallery": [
      "/images/wardrobe/helmet-bag/main/2.webp",
      "/images/wardrobe/helmet-bag/main/3.webp"
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
    "id": "three-point-gloves",
    "section": "Accessories",
    "category": "Objects",
    "brand": "Unbranded",
    "name": "Three-Point Gloves",
    "season": "A/W",
    "colour": "",
    "colourCode": "#3a241d",
    "fabric": "Lambskin / Cashmere lining",
    "size": "M",
    "measuredDimensions": "Hand circumference: 21.4\nMiddle finger length: 8.6\nTotal length: 24",
    "purchaseDate": "2025-02-17",
    "image": "/images/wardrobe/three-point-gloves/main/1.webp",
    "gallery": [
      "/images/wardrobe/three-point-gloves/main/2.webp"
    ],
    "metadata": {
      "price": 225,
      "priceCurrency": "CNY"
    }
  },

  {
    "id": "sapphire-three-stone-ring",
    "section": "Future Pieces",
    "pillar": "Jewellery",
    "category": "Jewellery",
    "brand": "Future Piece",
    "name": "Sapphire Three-Stone Ring",
    "season": "All-season",
    "colour": "Platinum",
    "colourCode": "#E8E8E8",
    "fabric": "Platinum",
    "image": "/images/wardrobe/sapphire-three-stone-ring/main/1.webp",
    "gallery": [
      "/images/wardrobe/sapphire-three-stone-ring/main/2.webp",
      "/images/wardrobe/sapphire-three-stone-ring/main/3.webp",
      "/images/wardrobe/sapphire-three-stone-ring/main/4.webp",
      "/images/wardrobe/sapphire-three-stone-ring/main/5.webp"
    ],
    "notes": "Emerald-cut sapphire 6.8×5.1 mm ~1.1 ct; tapered baguette sides; ~1 ct diamonds total. Signed Cartier.  c.1950–65",
    "metadata": {
      "basicColour": "silver",
      "secondaryColour": "Sapphire",
      "secondaryColourCode": "#1B57BC"
    }
  },

  // ——— S/S – Mediterranean Resort ———,
];
