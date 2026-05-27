// ════════════════════════════════════════════════════════════
//  ARCHIVO AUTOGENERADO · NO EDITAR A MANO
// ════════════════════════════════════════════════════════════
//
//  Generado por: scripts/sync-catalog.mjs
//  Fuente:       Supabase (brands, products, product_images, reviews, reels, announcements, hero_slides)
//  Última sync:  2026-05-27T13:30:49.551Z
//
//  Para regenerar: pnpm run sync
//
// ════════════════════════════════════════════════════════════

import type { Brand, Product, Review, Reel, Announcement, HeroSlide } from "@/types/catalog";

export const BRANDS: readonly Brand[] = [
  {
    "id": "lattafa",
    "slug": "lattafa",
    "name": "Lattafa",
    "catalog": "arabe"
  },
  {
    "id": "maison-alhambra",
    "slug": "maison-alhambra",
    "name": "Maison Alhambra",
    "catalog": "arabe"
  },
  {
    "id": "armaf",
    "slug": "armaf",
    "name": "Armaf",
    "catalog": "arabe"
  },
  {
    "id": "al-haramain",
    "slug": "al-haramain",
    "name": "Al Haramain",
    "catalog": "arabe"
  },
  {
    "id": "rasasi",
    "slug": "rasasi",
    "name": "Rasasi",
    "catalog": "arabe"
  },
  {
    "id": "afnan",
    "slug": "afnan",
    "name": "Afnan",
    "catalog": "arabe"
  },
  {
    "id": "dior",
    "slug": "dior",
    "name": "Dior",
    "catalog": "disenador"
  },
  {
    "id": "chanel",
    "slug": "chanel",
    "name": "Chanel",
    "catalog": "disenador"
  },
  {
    "id": "ysl",
    "slug": "ysl",
    "name": "Yves Saint Laurent",
    "catalog": "disenador"
  },
  {
    "id": "carolina-herrera",
    "slug": "carolina-herrera",
    "name": "Carolina Herrera",
    "catalog": "disenador"
  },
  {
    "id": "paco-rabanne",
    "slug": "paco-rabanne",
    "name": "Paco Rabanne",
    "catalog": "disenador"
  },
  {
    "id": "versace",
    "slug": "versace",
    "name": "Versace",
    "catalog": "disenador"
  },
  {
    "id": "jean-paul-gaultier",
    "slug": "jean-paul-gaultier",
    "name": "Jean Paul Gaultier",
    "catalog": "disenador"
  },
  {
    "id": "tom-ford",
    "slug": "tom-ford",
    "name": "Tom Ford",
    "catalog": "disenador"
  }
];

export const PRODUCTS: readonly Product[] = [
  {
    "id": "afnan-9pm",
    "slug": "9pm",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "9PM",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 60000,
    "stock": 11,
    "notes": [
      "manzana",
      "lavanda",
      "vainilla",
      "haba tonka"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/afnan-9pm/b1f46ded-7db0-49e8-9349-e1e926f7aeda.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/afnan-9pm/36bd4024-6191-4f47-b0ac-990900aabc41.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "al-haramain-amber-oud-carbon",
    "slug": "amber-oud-carbon-edition",
    "brandId": "al-haramain",
    "catalog": "arabe",
    "name": "Amber Oud Carbon Edition",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 60,
    "priceArs": 52000,
    "stock": 2,
    "notes": [
      "limón",
      "oud",
      "ámbar gris",
      "almizcle"
    ]
  },
  {
    "id": "armaf-club-de-nuit-intense-man",
    "slug": "club-de-nuit-intense-man",
    "brandId": "armaf",
    "catalog": "arabe",
    "name": "Club de Nuit Intense Man",
    "gender": "masculino",
    "concentration": "EDT",
    "volumeMl": 105,
    "priceArs": 60000,
    "stock": 3,
    "notes": [
      "piña negra",
      "manzana",
      "abedul",
      "almizcle"
    ],
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/armaf-club-de-nuit-intense-man/640a6492-6488-477a-bcc5-ffba21fcf10f.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/armaf-club-de-nuit-intense-man/b59be177-b9aa-454e-897f-3009d263575b.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "armaf-club-de-nuit-sillage",
    "slug": "club-de-nuit-sillage",
    "brandId": "armaf",
    "catalog": "arabe",
    "name": "Club de Nuit Sillage",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 105,
    "priceArs": 65000,
    "stock": 1,
    "notes": [
      "bergamota",
      "rosa",
      "incienso",
      "oud"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/armaf-club-de-nuit-sillage/8114362d-877e-42b6-a63d-55865e9dcfc0.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/armaf-club-de-nuit-sillage/00d8b79f-d954-43ab-8445-94a4bf1376c3.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "armaf-odyssey-aqua",
    "slug": "odyssey-aqua",
    "brandId": "armaf",
    "catalog": "arabe",
    "name": "Odyssey Aqua",
    "gender": "masculino",
    "concentration": "EDT",
    "volumeMl": 100,
    "priceArs": 56000,
    "stock": 7,
    "notes": [
      "limón",
      "menta",
      "ámbar gris",
      "cedro"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/armaf-odyssey-aqua/55f452ec-ca62-44f8-a11f-7380a533137a.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/armaf-odyssey-aqua/8bcc91e9-b648-45c6-93f7-40b05c76cb17.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "ch-212-vip-rose",
    "slug": "212-vip-rose",
    "brandId": "carolina-herrera",
    "catalog": "disenador",
    "name": "212 VIP Rose",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 80,
    "priceArs": 132000,
    "stock": 5,
    "notes": [
      "champagne rosado",
      "rosa",
      "almizcle",
      "ámbar"
    ]
  },
  {
    "id": "ch-good-girl",
    "slug": "good-girl",
    "brandId": "carolina-herrera",
    "catalog": "disenador",
    "name": "Good Girl",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 80,
    "priceArs": 142000,
    "stock": 7,
    "notes": [
      "almendra",
      "café",
      "jazmín",
      "haba tonka"
    ],
    "featured": true
  },
  {
    "id": "chanel-bleu-edp",
    "slug": "bleu-edp",
    "brandId": "chanel",
    "catalog": "disenador",
    "name": "Bleu de Chanel",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 195000,
    "stock": 2,
    "notes": [
      "pomelo",
      "menta",
      "incienso",
      "sándalo"
    ],
    "featured": true
  },
  {
    "id": "chanel-coco-mademoiselle",
    "slug": "coco-mademoiselle",
    "brandId": "chanel",
    "catalog": "disenador",
    "name": "Coco Mademoiselle",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 198000,
    "stock": 3,
    "notes": [
      "naranja",
      "rosa",
      "pachulí",
      "almizcle"
    ]
  },
  {
    "id": "dior-jadore-edp",
    "slug": "jadore-edp",
    "brandId": "dior",
    "catalog": "disenador",
    "name": "J'adore",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 178000,
    "stock": 3,
    "notes": [
      "pera",
      "ylang ylang",
      "jazmín",
      "rosa"
    ]
  },
  {
    "id": "dior-miss-dior-edp",
    "slug": "miss-dior-edp",
    "brandId": "dior",
    "catalog": "disenador",
    "name": "Miss Dior",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 172000,
    "stock": 5,
    "notes": [
      "rosa",
      "peonía",
      "almizcle",
      "haba tonka"
    ]
  },
  {
    "id": "dior-sauvage-edp",
    "slug": "sauvage-edp",
    "brandId": "dior",
    "catalog": "disenador",
    "name": "Sauvage",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 165000,
    "stock": 4,
    "notes": [
      "bergamota",
      "pimienta",
      "ambroxan",
      "vainilla"
    ],
    "featured": true
  },
  {
    "id": "jpg-la-belle",
    "slug": "la-belle",
    "brandId": "jean-paul-gaultier",
    "catalog": "disenador",
    "name": "La Belle",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 158000,
    "stock": 5,
    "notes": [
      "pera",
      "ron",
      "vainilla",
      "sándalo"
    ]
  },
  {
    "id": "jpg-le-male-elixir",
    "slug": "le-male-elixir",
    "brandId": "jean-paul-gaultier",
    "catalog": "disenador",
    "name": "Le Male Elixir",
    "gender": "masculino",
    "concentration": "Parfum",
    "volumeMl": 125,
    "priceArs": 175000,
    "stock": 3,
    "notes": [
      "lavanda",
      "tabaco",
      "haba tonka",
      "miel"
    ]
  },
  {
    "id": "lattafa-asad",
    "slug": "asad",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Asad",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 99998,
    "stock": 12,
    "notes": [
      "bergamota",
      "iris",
      "ámbar",
      "vainilla"
    ],
    "labels": [
      {
        "text": "-20%",
        "color": "red"
      }
    ]
  },
  {
    "id": "lattafa-badee-al-oud-amethyst",
    "slug": "badee-al-oud-amethyst",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Bade'e Al Oud Amethyst",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 52000,
    "stock": 1,
    "notes": [
      "oud",
      "azafrán",
      "rosa",
      "ámbar"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-badee-al-oud-amethyst/7338dc00-9da6-4807-a7ad-fb6e418f189f.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-badee-al-oud-amethyst/18d767e0-a668-4420-8064-511480970aad.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "lattafa-fakhar",
    "slug": "fakhar",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Fakhar Black",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 55000,
    "stock": 1,
    "notes": [
      "lavanda",
      "cedro",
      "tabaco",
      "vetiver"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-fakhar/3e5558a8-39c8-4fe5-ab49-aa0f6ed0fdfd.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-fakhar/8b19a2cb-56d2-48ec-95ed-c26804cd604c.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "lattafa-khamrah",
    "slug": "khamrah",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Khamrah",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 55000,
    "stock": 2,
    "notes": [
      "canela",
      "vainilla",
      "dátil",
      "praliné"
    ],
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-khamrah/1dfc8002-bff9-4747-84a5-a6c582134a4f.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-khamrah/ae5735b4-db19-43a2-85d1-9a63048ed7c9.webp",
        "position": 1
      }
    ],
    "labels": [
      {
        "text": "TENDENCIA🔥​​",
        "color": "dark"
      }
    ]
  },
  {
    "id": "lattafa-maahir-legacy",
    "slug": "maahir-legacy",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Maahir Legacy",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 54000,
    "stock": 1,
    "notes": [
      "pera",
      "haba tonka",
      "ámbar",
      "musgo"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-maahir-legacy/b93cd4d8-6d08-49b7-bb81-582808902eb6.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-maahir-legacy/40b7054e-e700-469f-84be-7fb6dd6fecc6.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "lattafa-yara",
    "slug": "yara",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Yara",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 50000,
    "stock": 8,
    "notes": [
      "orquídea",
      "vainilla",
      "sándalo",
      "almizcle"
    ],
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-yara/7bec310c-d719-4aa8-90fa-56d6926cebea.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-yara/00499982-46fe-4ac6-951d-7e4aa9f337ed.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "paco-1-million",
    "slug": "1-million",
    "brandId": "paco-rabanne",
    "catalog": "disenador",
    "name": "1 Million",
    "gender": "masculino",
    "concentration": "EDT",
    "volumeMl": 100,
    "priceArs": 128000,
    "stock": 9,
    "notes": [
      "pomelo",
      "menta",
      "cuero",
      "ámbar"
    ]
  },
  {
    "id": "paco-lady-million",
    "slug": "lady-million",
    "brandId": "paco-rabanne",
    "catalog": "disenador",
    "name": "Lady Million",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 80,
    "priceArs": 138000,
    "stock": 4,
    "notes": [
      "nerolí",
      "frambuesa",
      "jazmín",
      "ámbar"
    ]
  },
  {
    "id": "rasasi-hawas",
    "slug": "hawas",
    "brandId": "rasasi",
    "catalog": "arabe",
    "name": "Hawas",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 5203,
    "stock": 4,
    "notes": [
      "jengibre",
      "manzana",
      "ámbar gris",
      "almizcle"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/rasasi-hawas/07ec3fd9-7322-4daa-8638-088bea3ba2bd.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/rasasi-hawas/46943334-e6e9-48ad-bbc7-21c46e831da0.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "tom-ford-black-orchid",
    "slug": "black-orchid",
    "brandId": "tom-ford",
    "catalog": "disenador",
    "name": "Black Orchid",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 50,
    "priceArs": 245000,
    "stock": 3,
    "notes": [
      "orquídea negra",
      "trufa",
      "pachulí",
      "incienso"
    ]
  },
  {
    "id": "versace-eros",
    "slug": "eros",
    "brandId": "versace",
    "catalog": "disenador",
    "name": "Eros",
    "gender": "masculino",
    "concentration": "EDT",
    "volumeMl": 100,
    "priceArs": 118000,
    "stock": 8,
    "notes": [
      "menta",
      "manzana",
      "haba tonka",
      "vainilla"
    ]
  },
  {
    "id": "ysl-libre-edp",
    "slug": "libre-edp",
    "brandId": "ysl",
    "catalog": "disenador",
    "name": "Libre",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 90,
    "priceArs": 168000,
    "stock": 4,
    "notes": [
      "mandarina",
      "lavanda",
      "azahar",
      "almizcle"
    ]
  },
  {
    "id": "ysl-y-edp",
    "slug": "y-edp",
    "brandId": "ysl",
    "catalog": "disenador",
    "name": "Y",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 158000,
    "stock": 6,
    "notes": [
      "bergamota",
      "salvia",
      "ambroxan",
      "vetiver"
    ]
  }
];

export const REVIEWS: readonly Review[] = [
  {
    "id": "d3719a5c-3859-4429-9104-5c28d5c14ef6",
    "authorName": "Test",
    "body": "Producto excelente, lo recomiendo. Llegó rápido y muy bien empaquetado.",
    "rating": 5,
    "featured": true,
    "published": true,
    "sortOrder": 1,
    "createdAt": "2026-05-24T17:34:24.218221+00:00"
  }
];

export const REELS: readonly Reel[] = [
  {
    "id": "73c2e5c5-3afb-48a0-a5e6-2384a132a959",
    "title": "Querés oler bien este invierno? ❄️ Te traigo el top 3 de Oudora",
    "thumbnailUrl": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/reel-thumbnails/thumbs/4790f384-51a5-4e72-91bb-979493593d96.png",
    "thumbnailPath": "thumbs/4790f384-51a5-4e72-91bb-979493593d96.png",
    "instagramUrl": "https://www.instagram.com/reel/DXAeviNhkzC/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    "duration": null,
    "sortOrder": 1,
    "published": true,
    "createdAt": "2026-05-24T18:48:10.674496+00:00"
  },
  {
    "id": "7bed1a40-5029-4a12-9225-b4c92e01fbb7",
    "title": "Lo que parecía ser una pesadilla terminó siendo una hermosa noticia",
    "thumbnailUrl": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/reel-thumbnails/thumbs/ec08c1f8-4d8c-408f-802f-566d22082cf7.png",
    "thumbnailPath": "thumbs/ec08c1f8-4d8c-408f-802f-566d22082cf7.png",
    "instagramUrl": "https://www.instagram.com/reel/DWryeL9Dutr/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "duration": null,
    "sortOrder": 2,
    "published": true,
    "createdAt": "2026-05-24T19:17:50.988171+00:00"
  },
  {
    "id": "00cb947b-e13f-4c77-a279-05473d2e294d",
    "title": "Chicos, así está davo?",
    "thumbnailUrl": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/reel-thumbnails/thumbs/914be9b9-9d07-46b9-acfd-e5a5fd90d059.png",
    "thumbnailPath": "thumbs/914be9b9-9d07-46b9-acfd-e5a5fd90d059.png",
    "instagramUrl": "https://www.instagram.com/reel/DYF8g2vO4GA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    "duration": null,
    "sortOrder": 3,
    "published": true,
    "createdAt": "2026-05-24T19:21:24.554845+00:00"
  }
];

export const ANNOUNCEMENTS: readonly Announcement[] = [
  {
    "id": "a2a1a9fb-8e6c-45f7-ab25-9701af79f33d",
    "text": "Envío gratis a partir de $130.000",
    "icon": "truck",
    "sortOrder": 1,
    "published": true,
    "createdAt": "2026-05-25T16:06:52.302026+00:00"
  },
  {
    "id": "8ac440c4-8134-4cee-81b1-07cf886d544b",
    "text": "Cuotas con MercadoPago",
    "icon": "credit-card",
    "sortOrder": 2,
    "published": true,
    "createdAt": "2026-05-25T16:07:56.297754+00:00"
  },
  {
    "id": "f750a359-9722-47a2-a6ca-0d5e0ebd20ed",
    "text": "Retirá en puntos de encuentro específicos",
    "icon": "map-pin",
    "sortOrder": 3,
    "published": true,
    "createdAt": "2026-05-25T16:12:03.581015+00:00"
  }
];

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    "id": "24269492-a8f4-45a8-adb2-586aa8735055",
    "overline": "NUEVA COLECCIÓN",
    "title": "Perfumes árabes de colección",
    "subtitle": "Fragancias originales importadas.",
    "imageUrl": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/hero-slides/slides/a4a9e2f8-3215-4d67-b6af-0fe28adbd416.jpg",
    "imagePath": "slides/a4a9e2f8-3215-4d67-b6af-0fe28adbd416.jpg",
    "ctaLabel": "Ver colección",
    "ctaHref": "/catalogo?catalogo=arabe",
    "sortOrder": 10,
    "published": true,
    "createdAt": "2026-05-25T23:05:26.62728+00:00"
  },
  {
    "id": "8217649d-75c3-4b71-80c5-0b63b2704525",
    "overline": "NUEVA COLECCIÓN",
    "title": "Perfumes de diseñador",
    "subtitle": "Dior, Chanel, Tom Ford, Prada",
    "imageUrl": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/hero-slides/slides/4b8d2391-9638-4b3f-9706-18f40fd8eaea.jpg",
    "imagePath": "slides/4b8d2391-9638-4b3f-9706-18f40fd8eaea.jpg",
    "ctaLabel": "Explorar",
    "ctaHref": "/catalogo?catalogo=disenador",
    "sortOrder": 20,
    "published": true,
    "createdAt": "2026-05-25T23:12:58.96258+00:00"
  },
  {
    "id": "ef79860b-b4ba-43ce-b5c5-e5a788e95eb5",
    "overline": "ENVÍO GRATIS",
    "title": "Recibilo en todo el país",
    "subtitle": "Sin cargo a partir de $130.000.",
    "imageUrl": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/hero-slides/slides/e253897d-05bf-4442-8653-db71be1c51b9.jpg",
    "imagePath": "slides/e253897d-05bf-4442-8653-db71be1c51b9.jpg",
    "ctaLabel": "Ver catálogo",
    "ctaHref": "/catalogo",
    "sortOrder": 30,
    "published": true,
    "createdAt": "2026-05-25T23:14:32.048069+00:00"
  }
];
