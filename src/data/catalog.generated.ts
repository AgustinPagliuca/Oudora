// ════════════════════════════════════════════════════════════
//  ARCHIVO AUTOGENERADO · NO EDITAR A MANO
// ════════════════════════════════════════════════════════════
//
//  Generado por: scripts/sync-catalog.mjs
//  Fuente:       Supabase (brands, products, product_images, reviews, reels, announcements, hero_slides)
//  Última sync:  2026-09-12T18:15:57.379Z
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
  },
  {
    "id": "31d8f7ae-7968-4003-b98b-992fe7b42750",
    "slug": "french-avenue",
    "name": "French Avenue",
    "catalog": "arabe"
  },
  {
    "id": "bc19847f-905a-4c3d-b592-1a6ff4d41b15",
    "slug": "dolce-gabbana",
    "name": "Dolce & Gabbana",
    "catalog": "disenador"
  },
  {
    "id": "9f387c88-6a65-47f8-92c9-1114515c751a",
    "slug": "giorgio-armani",
    "name": "Giorgio Armani",
    "catalog": "disenador"
  }
];

export const PRODUCTS: readonly Product[] = [
  {
    "id": "d5dc34f6-64c9-4e5c-a049-d641a804cbb5",
    "slug": "cocoa-morado",
    "brandId": "31d8f7ae-7968-4003-b98b-992fe7b42750",
    "catalog": "arabe",
    "name": "Cocoa Morado",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 62000,
    "stock": 10,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/d5dc34f6-64c9-4e5c-a049-d641a804cbb5/68243e14-305d-456b-9d44-c030388edd17.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/d5dc34f6-64c9-4e5c-a049-d641a804cbb5/7e6cd74e-1377-4ca6-848d-bcf1bd182afb.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "662f4d4a-3d0f-4083-9523-3e289d5513b9",
    "slug": "liquid-brun",
    "brandId": "31d8f7ae-7968-4003-b98b-992fe7b42750",
    "catalog": "arabe",
    "name": "Liquid Brun",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 70000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/662f4d4a-3d0f-4083-9523-3e289d5513b9/75859f24-3c31-4025-98ad-8ddc1c702a0e.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/662f4d4a-3d0f-4083-9523-3e289d5513b9/6073bec3-3744-4e6e-92f1-eb27cad4fdc0.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "be4958cb-723f-4397-a0ef-67e7db63885f",
    "slug": "royal-blend-nero-extrait",
    "brandId": "31d8f7ae-7968-4003-b98b-992fe7b42750",
    "catalog": "arabe",
    "name": "Royal Blend Nero Extrait",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 65000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/be4958cb-723f-4397-a0ef-67e7db63885f/3daac301-9968-4773-a815-ac120dc90f1f.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/be4958cb-723f-4397-a0ef-67e7db63885f/adc3e030-539b-4019-8af2-22fbe96beeec.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "012e07cc-b98d-4ad6-a95a-2d73bd5db46b",
    "slug": "tropical-kiss",
    "brandId": "31d8f7ae-7968-4003-b98b-992fe7b42750",
    "catalog": "arabe",
    "name": "Tropical Kiss",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 80,
    "priceArs": 60000,
    "stock": 10,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/012e07cc-b98d-4ad6-a95a-2d73bd5db46b/e35fb33f-a8b7-45f7-848e-609d48d288af.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/012e07cc-b98d-4ad6-a95a-2d73bd5db46b/0c65feb7-c1ce-44bb-bdd4-5f0f33e392ec.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "7889307e-e1fe-40f3-9921-b44c278305f4",
    "slug": "vulcan-feu",
    "brandId": "31d8f7ae-7968-4003-b98b-992fe7b42750",
    "catalog": "arabe",
    "name": "Vulcan Feu",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 75000,
    "stock": 10,
    "description": "Es una fragancia tropical, frutal y especiada, muy popular por ser una alternativa inspirada en el lujoso God of Fire de Stéphane Humbert Lucas 777. Destaca por su gran duración y su intenso aroma a mango jugoso",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7889307e-e1fe-40f3-9921-b44c278305f4/b9f8430a-c7aa-47ee-9630-1f97dc17449e.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7889307e-e1fe-40f3-9921-b44c278305f4/988876c2-ab73-4358-aaf5-737812f807f3.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "a64aa7e2-f8cd-4e81-9d87-2f662c1c9c0c",
    "slug": "emporio-stronger-with-you-intensely",
    "brandId": "9f387c88-6a65-47f8-92c9-1114515c751a",
    "catalog": "disenador",
    "name": "Emporio Stronger With You Intensely",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 160000,
    "stock": 5,
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/a64aa7e2-f8cd-4e81-9d87-2f662c1c9c0c/c09044a4-5af2-43ba-b851-4fe0a13ed27d.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/a64aa7e2-f8cd-4e81-9d87-2f662c1c9c0c/3eda4ffc-4517-40b8-a5ca-4b2c5d48a3c7.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "f85aa51d-81ae-4d94-a412-92902df8bf66",
    "slug": "my-way",
    "brandId": "9f387c88-6a65-47f8-92c9-1114515c751a",
    "catalog": "disenador",
    "name": "My Way",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 167000,
    "stock": 5,
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/f85aa51d-81ae-4d94-a412-92902df8bf66/a3cba818-e5cf-450e-accd-766ffc49f4b5.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/f85aa51d-81ae-4d94-a412-92902df8bf66/993d8aba-d4d6-4cca-a128-aa2bf4cab74a.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "f6e5f355-bf5a-4b84-a851-a3c3c402a0b2",
    "slug": "9-pm",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "9 PM",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 60000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/f6e5f355-bf5a-4b84-a851-a3c3c402a0b2/92de8409-e2de-43db-bd0b-28f5431e6b63.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/f6e5f355-bf5a-4b84-a851-a3c3c402a0b2/c11df64b-02a5-4296-ab4b-91619590b9ae.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "1aaea0ea-94e7-4f83-b0ec-c30fa45a9d76",
    "slug": "9am-dive",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "9AM Dive",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 68000,
    "stock": 1000,
    "description": "Perfume unisex de la familia olfativa Aromática Acuática, lanzado en 2022. Destaca por su aroma fresco, limpio y energizante, ideal para el calor, la primavera y el verano, con un perfil que recuerda a fragancias azules populares como Bleu de Chanel",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/1aaea0ea-94e7-4f83-b0ec-c30fa45a9d76/c5661283-be1d-4c5d-8dab-22965a2a7bd0.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/1aaea0ea-94e7-4f83-b0ec-c30fa45a9d76/1b7c7c6d-37f2-46b4-acb1-dcb1f33c7768.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "bcc6298c-f0a1-45a2-a600-91578ee4c8ea",
    "slug": "9am-pink-pour-femme",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "9AM Pink  Pour Femme",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 65000,
    "stock": 1000,
    "description": "Perfume femenino lanzado en 2022 de la familia oriental, ideal para el uso diario gracias a su carácter fresco, chispeante, frutal y dulce",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/bcc6298c-f0a1-45a2-a600-91578ee4c8ea/f4f101a4-b3ca-46c9-8edf-7eaaded5afe5.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/bcc6298c-f0a1-45a2-a600-91578ee4c8ea/bf742d7f-8e9d-440c-acdb-17851ed359bb.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "20d768a2-f6ea-41ae-b9a6-78e470b34a45",
    "slug": "9am-white",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "9AM White",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 65000,
    "stock": 1000,
    "description": "9AM White de Afnan es un perfume fresco, unisex y de estilo vibrante. Está diseñado para transmitir la energía de una mañana limpia y luminosa, ideal para usar todos los días en climas cálidos o templados.",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/20d768a2-f6ea-41ae-b9a6-78e470b34a45/ed46e0d7-3cff-4d1c-b5de-0c8e59d3e53e.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/20d768a2-f6ea-41ae-b9a6-78e470b34a45/b72a6e4b-9885-416d-b903-9d6e87357cc1.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "8385d648-49aa-4e06-bbb8-2ef23358beb7",
    "slug": "badee-al-oud-honor-and-glory",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "Badee al oud Honor and Glory",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 54000,
    "stock": 10,
    "description": "Pertenece a la familia olfativa oriental especiada y gourmand, famoso por combinar una salida frutal y cremosa de piña con crema catalana (crème brûlée), evolucionando hacia un fondo cálido, avainillado y amaderado de gran fijación",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/8385d648-49aa-4e06-bbb8-2ef23358beb7/239cc5c1-3118-481a-a606-6329efd354be.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/8385d648-49aa-4e06-bbb8-2ef23358beb7/f6a2b84a-f7c2-410d-888d-d7b81fbde7d6.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "1cb5254d-588a-4921-a6b9-dc296491557a",
    "slug": "club-de-nuit-woman",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "Club de Nuit woman",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 105,
    "priceArs": 65000,
    "stock": 8,
    "description": "Es una fragancia elegante, sofisticada y luminosa, muy reconocida por ser una alternativa accesible e inspirada en el icónico Coco Mademoiselle de Chanel.",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/1cb5254d-588a-4921-a6b9-dc296491557a/ea61d7b1-71cd-4f55-a9b6-5087ec9f245d.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/1cb5254d-588a-4921-a6b9-dc296491557a/d62f79ce-e043-48b6-a333-dad624bd3670.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "73448280-0553-454d-85e3-00c18e57a9f7",
    "slug": "odyssey-mandarin-sky",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "Odyssey Mandarin Sky",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 60000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/73448280-0553-454d-85e3-00c18e57a9f7/f410978f-b79e-41a8-82eb-b12912b5c075.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/73448280-0553-454d-85e3-00c18e57a9f7/21696b17-e717-4fb2-b2a7-a0e576bd74f7.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "a81113ea-f2b5-4abe-a77b-2f47669174af",
    "slug": "turathi-blue",
    "brandId": "afnan",
    "catalog": "arabe",
    "name": "Turathi Blue",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 58000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/a81113ea-f2b5-4abe-a77b-2f47669174af/e9226c22-e792-41b1-8ae5-340397106e2d.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/a81113ea-f2b5-4abe-a77b-2f47669174af/f1f2a622-3bc1-414b-b559-40adcf1dff41.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "e1f2fa33-184f-4980-87f1-83529b52bd81",
    "slug": "al-haramain-amber-oud-dubai-night-exdp",
    "brandId": "al-haramain",
    "catalog": "arabe",
    "name": "Al Haramain Amber Oud Dubai Night EXDP",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 95000,
    "stock": 10,
    "description": "Destaca por un aroma denso, dulce, especiado y de lujo nocturno con una estela potente y larga duración. Suele asociarse por su vibra dulce y especiada al estilo de Arabians Tonka de Montale",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/e1f2fa33-184f-4980-87f1-83529b52bd81/f7337e33-d7bc-45ee-9ef3-9aabb3cad8e5.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/e1f2fa33-184f-4980-87f1-83529b52bd81/72512bc8-1540-4bf4-9f7a-3332e31037ab.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "24834dbf-8460-41ca-9b4c-2c6e6b04a49c",
    "slug": "al-haramain-amber-oud-gold",
    "brandId": "al-haramain",
    "catalog": "arabe",
    "name": "Al Haramain Amber Oud Gold",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 100000,
    "stock": 1000,
    "description": "Perfume  popular Eau de Parfum unisex de la familia olfativa Ámbar Vainilla. Destaca por su aroma frutal, dulce y tropical con una fijación muy alta en piel, siendo frecuentemente comparado con fragancias de lujo como Erba Pura de Xerjoff",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/24834dbf-8460-41ca-9b4c-2c6e6b04a49c/a339e3c7-1386-4e60-acd3-a05a8db8fe25.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/24834dbf-8460-41ca-9b4c-2c6e6b04a49c/18109aa6-80d4-422d-a632-62d0804a0403.webp",
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
    "stock": 10,
    "notes": [
      "limón",
      "oud",
      "ámbar gris",
      "almizcle"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/al-haramain-amber-oud-carbon/dbfc14a4-844c-460e-85b6-62e96cbed23a.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/al-haramain-amber-oud-carbon/86de9bbc-68c9-4a37-a5e1-5850e91617bd.webp",
        "position": 1
      }
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
    "id": "43a1500f-45e5-4a4b-acdb-b6a1f6234521",
    "slug": "club-de-nuit-maleka",
    "brandId": "armaf",
    "catalog": "arabe",
    "name": "Club de Nuit Maleka",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 105,
    "priceArs": 67000,
    "stock": 5,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/43a1500f-45e5-4a4b-acdb-b6a1f6234521/ad0b2391-cc6f-4c1d-8df4-92b537df3654.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/43a1500f-45e5-4a4b-acdb-b6a1f6234521/f1d84fd2-8e77-4bcf-b960-4dbc6a6a95e6.webp",
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
    "priceArs": 64000,
    "stock": 7,
    "notes": [
      "limón",
      "menta",
      "ámbar gris",
      "cedro"
    ],
    "description": "Perfume masculino lanzado en 2023. Pertenece a la familia olfativa amaderada aromática. Es un aroma muy fresco, limpio, acuático y energético, pensado para días de calor, primavera y verano. Muchos usuarios notan que se parece a Rabanne Invictus Platinum, pero con un toque más mentolado",
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
    "id": "7eacf5f4-6b67-46ee-b0ea-4ce1e2efd031",
    "slug": "odyssey-limoni-fresh-edition",
    "brandId": "armaf",
    "catalog": "arabe",
    "name": "Odyssey Limoni ( Fresh Edition)",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 49000,
    "stock": 10,
    "description": "Destaca por una explosión vibrante de frescura mediterránea, inspirada en perfiles lujosos como Afternoon Swim de Louis Vuitton, ofreciendo un aroma limpio, enérgico y veraniego",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7eacf5f4-6b67-46ee-b0ea-4ce1e2efd031/c764026a-2458-4c43-b24b-2ef0ac15d658.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7eacf5f4-6b67-46ee-b0ea-4ce1e2efd031/2af0df6e-021a-4b1d-b9bc-b9cee44eb02d.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "ae48c84d-7038-4af3-a6a7-cb9cef0dc779",
    "slug": "devotion-intense",
    "brandId": "bc19847f-905a-4c3d-b592-1a6ff4d41b15",
    "catalog": "disenador",
    "name": "Devotion Intense",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 135000,
    "stock": 5,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ae48c84d-7038-4af3-a6a7-cb9cef0dc779/def1a01d-9b07-4ca4-96d5-a7cefaa14334.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ae48c84d-7038-4af3-a6a7-cb9cef0dc779/6bb5473e-2833-47f8-a60c-a2eec189c8bb.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "ch-212-vip-rose",
    "slug": "212-vip-rose",
    "brandId": "carolina-herrera",
    "catalog": "disenador",
    "name": "212 VIP Rose Elixir",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 80,
    "priceArs": 143000,
    "stock": 5,
    "notes": [
      "champagne rosado",
      "rosa",
      "almizcle",
      "ámbar"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ch-212-vip-rose/be90f7fc-fb99-44ca-9c7e-08595f31bc96.webp",
        "position": 0
      }
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
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ch-good-girl/c21b97d6-28f2-4019-a129-6b5ac3771278.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ch-good-girl/b3bf3f91-3f08-4a48-a9c5-503f35e47d51.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "chanel-bleu-edp",
    "slug": "bleu-edp",
    "brandId": "chanel",
    "catalog": "disenador",
    "name": "Bleu de Chanel",
    "gender": "masculino",
    "concentration": "EDT",
    "volumeMl": 100,
    "priceArs": 185000,
    "stock": 5,
    "notes": [
      "pomelo",
      "menta",
      "incienso",
      "sándalo"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/chanel-bleu-edp/545f73a5-f636-4f16-912b-c7275576f899.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/chanel-bleu-edp/4487d072-4f50-4b01-bb20-ac2012a12ec9.webp",
        "position": 1
      }
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
    "priceArs": 170000,
    "stock": 5,
    "notes": [
      "pera",
      "ylang ylang",
      "jazmín",
      "rosa"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dior-jadore-edp/e7db3441-a4a3-4272-b43b-5ea5d2e67f0f.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dior-jadore-edp/a473152e-ca3d-450e-859a-fa6d714cf445.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "dior-miss-dior-edp",
    "slug": "miss-dior-edp",
    "brandId": "dior",
    "catalog": "disenador",
    "name": "Miss Dior",
    "gender": "femenino",
    "concentration": "Parfum",
    "volumeMl": 100,
    "priceArs": 172000,
    "stock": 5,
    "notes": [
      "rosa",
      "peonía",
      "almizcle",
      "haba tonka"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dior-miss-dior-edp/e7af70c3-fd6e-4447-88fb-806ff6eedd3c.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dior-miss-dior-edp/7e2a9814-bef7-4858-9633-7514416d313c.webp",
        "position": 1
      }
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
    "priceArs": 168000,
    "stock": 5,
    "notes": [
      "bergamota",
      "pimienta",
      "ambroxan",
      "vainilla"
    ],
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dior-sauvage-edp/3b52bee0-5f20-4fe1-9024-56ca936a487f.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dior-sauvage-edp/ecd2a881-bbde-4ab6-af46-8bf7d0d02bae.webp",
        "position": 1
      }
    ]
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
    "priceArs": 138000,
    "stock": 5,
    "notes": [
      "pera",
      "ron",
      "vainilla",
      "sándalo"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/jpg-la-belle/62818a3a-a6d6-41c6-b383-8d13a55301da.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/jpg-la-belle/3cebda60-6e7f-4288-b21c-378b634f9c0e.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "jpg-le-male-elixir",
    "slug": "le-male-elixir",
    "brandId": "jean-paul-gaultier",
    "catalog": "disenador",
    "name": "Le Male",
    "gender": "masculino",
    "concentration": "EDT",
    "volumeMl": 125,
    "priceArs": 130000,
    "stock": 4,
    "notes": [
      "lavanda",
      "tabaco",
      "haba tonka",
      "miel"
    ],
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/jpg-le-male-elixir/7754b8fb-9bf3-4619-856a-32b569b0dce0.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/jpg-le-male-elixir/ac19d131-2ac3-4947-8259-9aaf38ba28ed.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "1d40fd6b-2b0c-496f-b343-f11f31cbb2ae",
    "slug": "ana-abiyedh-rouge",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Ana Abiyedh Rouge",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 60,
    "priceArs": 45000,
    "stock": 10,
    "description": "Es ampliamente conocido por ser un económico y excelente clon del famoso Baccarat Rouge 540, destacando por su dulzura acaramelada, estela llamativa y buena duración en la piel",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/1d40fd6b-2b0c-496f-b343-f11f31cbb2ae/b3e8da1e-102a-47f6-ba18-6c2b351902ce.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/1d40fd6b-2b0c-496f-b343-f11f31cbb2ae/f824e4b5-6f56-4a1a-9c69-fd712031f406.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "24ff769a-d03d-48ae-8b2d-b225258045f3",
    "slug": "angham",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Angham",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 54000,
    "stock": 5,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/24ff769a-d03d-48ae-8b2d-b225258045f3/8fcecd7a-4611-42b1-885e-cbe71617af9a.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/24ff769a-d03d-48ae-8b2d-b225258045f3/e0d17c6b-dd07-4404-809a-a69e6e6ee9e8.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "b69ee3aa-9a9e-4ab2-9607-82e0acb7865d",
    "slug": "angham-second-song",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Angham Second Song",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 54000,
    "stock": 10,
    "description": "Pertenece a la familia olfativa Floral Frutal Gourmand. Ofrece una mezcla luminosa, dulce y cremosa que combina notas de salida frescas de flor del peral y bergamota con un corazón de praliné y flores",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/b69ee3aa-9a9e-4ab2-9607-82e0acb7865d/6413a656-db43-4d6b-b93c-91d12d990469.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/b69ee3aa-9a9e-4ab2-9607-82e0acb7865d/d4fdee5c-9293-4388-ab03-cfcad770fc73.webp",
        "position": 1
      }
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
    "priceArs": 52000,
    "stock": 12,
    "notes": [
      "bergamota",
      "iris",
      "ámbar",
      "vainilla"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-asad/a582ad4f-2cc6-4f44-92ed-deaebe82ea8f.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/lattafa-asad/e2d52911-dfda-47fe-8c7f-aea2f93a25b1.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "722f02e3-1e64-4282-b839-34e2d6fcbdf9",
    "slug": "asad-bourbon",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Asad Bourbon",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 63000,
    "stock": 5,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/722f02e3-1e64-4282-b839-34e2d6fcbdf9/c5dae363-222f-494f-b891-6f11722c6ae1.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/722f02e3-1e64-4282-b839-34e2d6fcbdf9/88b5fa6f-e288-4946-bcef-0dd900227c9d.webp",
        "position": 1
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
    "id": "38d8afd0-6ad1-4304-9068-29f64a42deb2",
    "slug": "badee-al-oud-for-glory",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Badee al Oud For Glory",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 48000,
    "stock": 10,
    "description": "Es mundialmente famoso por ser una alternativa económica de alta calidad muy similar a la lujosa fragancia Oud for Greatness de Initio Parfums Prives",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/38d8afd0-6ad1-4304-9068-29f64a42deb2/bb2e4159-cd55-40d0-8e42-c84ab780287b.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/38d8afd0-6ad1-4304-9068-29f64a42deb2/07306492-d080-4321-ad66-7d7419a4b738.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "14cbd4f8-918f-41f4-b304-aa376af08ecd",
    "slug": "badee-al-oud-noble-blush",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Badee al oud Noble Blush",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 50000,
    "stock": 10,
    "description": "Fragancia de la familia olfativa floral frutal gourmand para mujeres lanzada en 2024. Destaca por un perfil etéreo, cremoso, avainillado y atalcado con una marcada sensación a postre lujoso",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/14cbd4f8-918f-41f4-b304-aa376af08ecd/4834dbe6-3797-475f-87e4-cddd5f3fb380.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/14cbd4f8-918f-41f4-b304-aa376af08ecd/8cff7794-6e35-441b-93f8-a212fd3bf343.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "406f3840-507f-4b1c-84bc-e4a8dfe6c0cf",
    "slug": "badee-al-oud-sublime",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Badee Al Oud Sublime",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 48000,
    "stock": 10,
    "description": "Fragancia unisex de la familia amaderada aromática lanzada en 2023. Su combinación destaca por un inicio frutal muy fresco que evoluciona hacia un corazón floral y frutal, cerrando con una base cálida y terrosa",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/406f3840-507f-4b1c-84bc-e4a8dfe6c0cf/3971b0ff-4bb9-4005-ba5f-298b48365430.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/406f3840-507f-4b1c-84bc-e4a8dfe6c0cf/fa827075-4d7a-411e-9142-36572adce079.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "538e4a5e-4caa-4211-bad1-a0728006990e",
    "slug": "eclaire",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Eclaire",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 56000,
    "stock": 5,
    "featured": true,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/538e4a5e-4caa-4211-bad1-a0728006990e/e8d0938c-bc0a-488c-8e03-5e77b5db06dc.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/538e4a5e-4caa-4211-bad1-a0728006990e/699ab4e6-6dc8-4c9b-a35f-8f69adbf036b.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "9c69ac01-7c9e-4b01-a2e6-b87eb8f1795d",
    "slug": "fakhar-black",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Fakhar Black",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 55000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/9c69ac01-7c9e-4b01-a2e6-b87eb8f1795d/37ff95cb-0a43-448f-874e-060ac06da38d.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/9c69ac01-7c9e-4b01-a2e6-b87eb8f1795d/0fe5351b-5eea-4119-b75e-9e5a233c0e04.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "81fa3707-da19-4e28-b1be-929527df35bc",
    "slug": "fakhar-rose-gold",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Fakhar Rose Gold",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 59000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/81fa3707-da19-4e28-b1be-929527df35bc/f84fc5ad-0fbd-48db-8a33-9f628083024c.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/81fa3707-da19-4e28-b1be-929527df35bc/22f3de0f-d3dd-4873-9a61-88e2ddfa94c2.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "e1cad411-3c15-4e03-a1bd-e8db000e98bd",
    "slug": "haya-pink",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Haya Pink",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 54000,
    "stock": 10,
    "description": "Destaca por su aroma chispeante, alegre y juvenil, que evoca una sensación de frescura y celebración con un toque chic muy coqueto",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/e1cad411-3c15-4e03-a1bd-e8db000e98bd/49f0b819-d4ce-4aa1-ae6d-5dacab454014.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/e1cad411-3c15-4e03-a1bd-e8db000e98bd/070d36e2-3917-4419-9d98-a841b66c42e8.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "13828a5e-058c-4cd0-ba6c-93ec1285b0f8",
    "slug": "her-confession",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Her confession",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 60000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/13828a5e-058c-4cd0-ba6c-93ec1285b0f8/25e3b87c-76d4-4472-bd4e-003a670840fd.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/13828a5e-058c-4cd0-ba6c-93ec1285b0f8/12e98d1e-f770-413f-83d4-18e4c6649677.webp",
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
    "id": "4ed5d3a0-5788-4409-8fcf-213319118f83",
    "slug": "khamrah-dukhan",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Khamrah Dukhan",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 50000,
    "stock": 10,
    "description": "Lattafa Khamrah Dukhan es un perfume lanzado en 2025. Pertenece a la familia oriental ambarina y destaca por su perfil ahumado y especiado, volviéndose una versión más madura, profunda y de inclinación masculina dentro de la famosa línea Khamrah.",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/4ed5d3a0-5788-4409-8fcf-213319118f83/d58e248d-ce57-4993-a961-97a4be89cccb.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/4ed5d3a0-5788-4409-8fcf-213319118f83/51e6d2e7-6236-4332-bac6-3b67cb0781a7.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "7306119d-9e93-4808-82ce-941525799630",
    "slug": "khamrah-qahwa",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Khamrah Qahwa",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 58000,
    "stock": 15,
    "description": "Es una variante más intensa y especiada del clásico Khamrah, destacando por incorporar una nota de café árabe en su fondo",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7306119d-9e93-4808-82ce-941525799630/745fbccb-c4ed-4d33-b1ca-044feac359bd.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7306119d-9e93-4808-82ce-941525799630/87f973f5-7ab4-4a0b-b0f3-ebf589b50ded.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "c295c67d-4148-468f-9e7e-ebb07d4d6c0f",
    "slug": "lattafa-badee-al-oud-honor-glory",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Lattafa Badee Al Oud Honor & Glory",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 53000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/c295c67d-4148-468f-9e7e-ebb07d4d6c0f/4bf8f869-a398-426f-ba38-754c7b747e10.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/c295c67d-4148-468f-9e7e-ebb07d4d6c0f/e72c7333-381e-4ee7-bc6c-3525f5dc3802.webp",
        "position": 1
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
    "id": "0993666b-5bff-45ac-889b-d08eb1368850",
    "slug": "mayar-cherry",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Mayar Cherry",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 56000,
    "stock": 10,
    "description": "Destaca por su aroma dulce, frutal y gourmand, protagonizado por una intensa nota de mermelada de cereza combinada con un toque de cacao",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/0993666b-5bff-45ac-889b-d08eb1368850/a5d8b732-cd61-46a9-a0f0-231eadff772e.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/0993666b-5bff-45ac-889b-d08eb1368850/0c11944a-3a17-4ba4-a5f6-4de327e9f1a7.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "7261a7f2-6e27-44cc-9a5f-377c24685629",
    "slug": "mayar-pink",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Mayar Pink",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 48000,
    "stock": 10,
    "description": "Destaca por ser un aroma ultra femenino, vibrante, dulce y fresco, con una excelente duración en la piel.",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7261a7f2-6e27-44cc-9a5f-377c24685629/630674d4-6e5d-4c7a-ba7e-c2cf3a4e4507.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/7261a7f2-6e27-44cc-9a5f-377c24685629/0c136b58-ee2e-46c8-8698-61d725a85d44.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "cee484f2-7960-4bf0-9e65-efa8bfd59d58",
    "slug": "opulent-dubai",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Opulent Dubai",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 48000,
    "stock": 10,
    "description": "Perfume unisex de la familia oriental floral lanzado en 2025. Destaca por su aroma tropical y frutal con una nota dominante de mango jugoso acompañada de cítricos frescos y un fondo amaderado muy elegante",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/cee484f2-7960-4bf0-9e65-efa8bfd59d58/0a3d2582-2352-43a3-a2ba-bf6efebf38d8.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/cee484f2-7960-4bf0-9e65-efa8bfd59d58/753ec7b5-24dc-4c8c-b5de-b5dc47fe294e.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "dec1c7d8-fcf9-4d45-841c-f1a633011ad0",
    "slug": "qaed-al-fursan-black",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Qaed al Fursan Black",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 45000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dec1c7d8-fcf9-4d45-841c-f1a633011ad0/386ce336-4799-45d7-9ad5-2ea0afb953f4.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/dec1c7d8-fcf9-4d45-841c-f1a633011ad0/c7916f4b-96ca-43a5-be9c-971a690ab0bb.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "e98bfa5b-b56a-4d8e-a2fc-8e5a5170b4ed",
    "slug": "qaed-al-fursan-blanco",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Qaed al fursan Blanco",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 38000,
    "stock": 10,
    "description": "Fragancia unisex lanzada en 2022 de la familia olfativa Floral Frutal Gourmand. Destaca por su aroma cremoso y tropical que recuerda a un postre o a una piña colada.",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/e98bfa5b-b56a-4d8e-a2fc-8e5a5170b4ed/792b1ac6-2a7f-4ef7-bf79-659cd15e192b.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/e98bfa5b-b56a-4d8e-a2fc-8e5a5170b4ed/65b1ce70-8629-4163-8e2d-b892485e4208.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "45e167d2-1fcc-4b3a-9a67-4c6228bc39ca",
    "slug": "the-kingdom",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "The Kingdom",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 68000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/45e167d2-1fcc-4b3a-9a67-4c6228bc39ca/b3796014-cfb8-49c3-b619-cbbe5dedeb6b.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/45e167d2-1fcc-4b3a-9a67-4c6228bc39ca/4c225fb5-fc5b-4c64-8e22-5800e6247c47.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "0a86f99d-9c28-424c-859d-a2c8755e4075",
    "slug": "victoria",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Victoria",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 55999,
    "stock": 10,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/0a86f99d-9c28-424c-859d-a2c8755e4075/f259f3ac-b8df-4a10-9724-feaef5bef98c.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/0a86f99d-9c28-424c-859d-a2c8755e4075/cefa0b86-2c1c-421b-a898-ba7922dfe25f.webp",
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
    "id": "6614236a-6cd3-4741-974e-296ba0692621",
    "slug": "yara-candy",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Yara Candy",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 50000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/6614236a-6cd3-4741-974e-296ba0692621/0a7ae839-a778-45f1-94d3-3929cbdd8efd.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/6614236a-6cd3-4741-974e-296ba0692621/9aaed5e9-328a-4892-a57f-8e47b8d28917.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "c5079f52-dc6e-4243-af21-d634e256c255",
    "slug": "yara-elixir",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Yara Elixir",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 65000,
    "stock": 10,
    "description": "Se destaca por ser una versión más intensa, madura, cremosa y profunda en comparación con el Yara clásico, manteniendo un carácter goloso (gourmand) muy seductor",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/c5079f52-dc6e-4243-af21-d634e256c255/2061965f-96a9-4076-bfcb-6c9f331ba961.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/c5079f52-dc6e-4243-af21-d634e256c255/1e9075e1-4701-460c-b188-155abf532da8.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "d020fa2b-9be9-4de1-8d16-7defc6de64b6",
    "slug": "yara-tours",
    "brandId": "lattafa",
    "catalog": "arabe",
    "name": "Yara Tours",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 48000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/d020fa2b-9be9-4de1-8d16-7defc6de64b6/949833ea-d1ea-4455-8d3a-03e033c1b615.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/d020fa2b-9be9-4de1-8d16-7defc6de64b6/9430c6a2-9b04-4d4f-906d-c895a892e9ed.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "639f5e6e-26f1-4774-9f7c-8bf44f072a2f",
    "slug": "delilah-blanc",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Delilah Blanc",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 63000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/639f5e6e-26f1-4774-9f7c-8bf44f072a2f/8e673271-dd1e-40a6-b70a-eefd3a58ed83.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/639f5e6e-26f1-4774-9f7c-8bf44f072a2f/2f9ef9cf-1b75-4bf0-a79c-cfdfd3b894ce.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "05d100f3-aab3-444c-928c-ac6dee43c4d0",
    "slug": "galactic-men-intense",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Galactic Men Intense",
    "gender": "masculino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 48000,
    "stock": 10,
    "description": "Perfume oriental ambarado para hombres lanzado en 2025. Está inspirado en el clásico AMen Pure Havane* de Mugler, destacando por combinar notas dulces, terrosas y avainilladas con un prominente aroma a tabaco de pipa y miel",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/05d100f3-aab3-444c-928c-ac6dee43c4d0/236295f9-53d1-4605-a65c-8c6fbf531c79.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/05d100f3-aab3-444c-928c-ac6dee43c4d0/11cb7bf4-db1d-4717-9358-9e7d1f92bc4f.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "84d2bca9-d888-4e82-a0df-9282c99a16b3",
    "slug": "jean-lowe-inmortal",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Jean Lowe inmortal",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 50000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/84d2bca9-d888-4e82-a0df-9282c99a16b3/2e452e10-1185-4024-9a69-fbbc6406f20d.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/84d2bca9-d888-4e82-a0df-9282c99a16b3/b31900c5-11fa-4894-9446-b3c883114731.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "ba56baff-f724-469d-b05b-fd068bace383",
    "slug": "jorge-di-profumo",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Jorge Di profumo",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 43000,
    "stock": 10,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ba56baff-f724-469d-b05b-fd068bace383/190b2398-e996-425d-9148-8865e3efab5b.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ba56baff-f724-469d-b05b-fd068bace383/ef4165f2-cd67-4b45-9b38-1573567ae160.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "433f2059-6315-4cc8-b06e-dc7097d7376d",
    "slug": "opera-rouge",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Opera Rouge",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 40000,
    "stock": 10,
    "description": "Destaca por su aroma dulce, frutal y avainillado con un fondo avasallante de café, ideal para usar en climas frescos o de noche. Funciona como una alternativa económica (\"dupe\") muy lograda del popular perfume Black Opium Over Red de Yves Saint Laurent.",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/433f2059-6315-4cc8-b06e-dc7097d7376d/1c3830f8-06eb-4c95-a314-3c0d18d5dee5.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/433f2059-6315-4cc8-b06e-dc7097d7376d/48ca868b-1f85-4a2d-bbbd-2f46bf9ebc05.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "ef86ac4b-dfa5-4a6a-831c-1e5e8b059598",
    "slug": "rose-seduction-vip",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Rose Seduction VIP",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 43000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ef86ac4b-dfa5-4a6a-831c-1e5e8b059598/b3c075dc-32ee-40dd-861e-b27f6060be47.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ef86ac4b-dfa5-4a6a-831c-1e5e8b059598/2025003a-e1b2-4bf3-8da1-665f80e1dee0.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "b92f83e8-719b-4599-b0b1-0743b9e941da",
    "slug": "rose-seduction-vip-pour-femme",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Rose Seduction Vip pour Femme",
    "gender": "femenino",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 47000,
    "stock": 10,
    "description": "Reconocido por ser un excelente equivalente del famoso 212 VIP Rosé de Carolina Herrera, destaca por su carácter chispeante, elegante y festivo ideal para ocasiones especiales o uso nocturno",
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/b92f83e8-719b-4599-b0b1-0743b9e941da/1b5e8d2e-c8ba-4ad3-83b0-34dec19246c6.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/b92f83e8-719b-4599-b0b1-0743b9e941da/3bac7d8a-b87b-4497-b33e-5194397b7324.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "ba73203b-19a6-4839-a190-12963d22b668",
    "slug": "salvo",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Salvo",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 45000,
    "stock": 10,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ba73203b-19a6-4839-a190-12963d22b668/32b53fe1-5a01-4fa6-a6bd-79ab44cde6f4.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ba73203b-19a6-4839-a190-12963d22b668/8493b172-e056-4f74-a2df-e35d0a4edf6f.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "b8832e1b-6541-449e-b349-a2825b8f556e",
    "slug": "victorioso",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Victorioso",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 45000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/b8832e1b-6541-449e-b349-a2825b8f556e/4b269b8e-b51e-4732-86cb-daaaf6094b25.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/b8832e1b-6541-449e-b349-a2825b8f556e/3703fc40-aa43-48e7-b965-9e5b6d31a1ab.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "5ac6e0d9-32f5-4d18-a1bb-84dde6902ee3",
    "slug": "yeah-man",
    "brandId": "maison-alhambra",
    "catalog": "arabe",
    "name": "Yeah Man",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 43000,
    "stock": 12,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/5ac6e0d9-32f5-4d18-a1bb-84dde6902ee3/a95ee72d-6aa8-47e3-aee8-8d9448b9fc42.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/5ac6e0d9-32f5-4d18-a1bb-84dde6902ee3/e03f7aea-3d97-4c01-85c2-773a368fe009.webp",
        "position": 1
      }
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
    "priceArs": 129000,
    "stock": 5,
    "notes": [
      "nerolí",
      "frambuesa",
      "jazmín",
      "ámbar"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/paco-lady-million/504efe0c-83ba-45d9-a99c-54e74478e284.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/paco-lady-million/fc805b49-e8e7-4f10-9fe6-e2354239fa04.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "paco-1-million",
    "slug": "1-million",
    "brandId": "paco-rabanne",
    "catalog": "disenador",
    "name": "One Million",
    "gender": "masculino",
    "concentration": "EDT",
    "volumeMl": 100,
    "priceArs": 110000,
    "stock": 9,
    "notes": [
      "pomelo",
      "menta",
      "cuero",
      "ámbar"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/paco-1-million/5bbc4ff6-776f-4013-9878-c5b6f6f61f8d.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/paco-1-million/04bb394d-087e-42bd-a640-5c19efd64caa.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "02b91635-e422-409f-8fe1-c568112541d3",
    "slug": "hawas-for-him",
    "brandId": "rasasi",
    "catalog": "arabe",
    "name": "Hawas for him",
    "gender": "unisex",
    "concentration": "EDP",
    "volumeMl": 100,
    "priceArs": 57000,
    "stock": 15,
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/02b91635-e422-409f-8fe1-c568112541d3/968cc298-13bf-43fc-803c-cd702e429954.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/02b91635-e422-409f-8fe1-c568112541d3/4b7c6d0d-879f-43bc-b0a8-a5e8dff6a80b.webp",
        "position": 1
      }
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
    "volumeMl": 50,
    "priceArs": 80000,
    "stock": 8,
    "notes": [
      "menta",
      "manzana",
      "haba tonka",
      "vainilla"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/versace-eros/42668978-ddd4-45fa-bc75-1066e7d884df.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/versace-eros/aa03b253-a73b-4b62-833f-3a26619a14a3.webp",
        "position": 1
      }
    ]
  },
  {
    "id": "ysl-libre-edp",
    "slug": "libre-edp",
    "brandId": "ysl",
    "catalog": "disenador",
    "name": "Libre",
    "gender": "femenino",
    "concentration": "EDT",
    "volumeMl": 90,
    "priceArs": 166000,
    "stock": 5,
    "notes": [
      "mandarina",
      "lavanda",
      "azahar",
      "almizcle"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ysl-libre-edp/1514d749-89b4-48bb-a3aa-56f5811a0c1b.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ysl-libre-edp/9609612d-fbbd-430e-a4bd-a7ae0055149c.webp",
        "position": 1
      }
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
    "priceArs": 162000,
    "stock": 6,
    "notes": [
      "bergamota",
      "salvia",
      "ambroxan",
      "vetiver"
    ],
    "images": [
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ysl-y-edp/55325af1-68ed-40fb-920f-e910a23fcbd4.webp",
        "position": 0
      },
      {
        "url": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/product-images/ysl-y-edp/3e96f9c9-bb0c-4128-9ee7-8d1df225e97f.webp",
        "position": 1
      }
    ]
  }
];

export const REVIEWS: readonly Review[] = [
  {
    "id": "d3719a5c-3859-4429-9104-5c28d5c14ef6",
    "authorName": "Julian",
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
    "subtitle": "Dior, Chanel, Versace, Giorgio Armani",
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
    "subtitle": "Envío sin cargo a partir de $130.000.",
    "imageUrl": "https://kvnibtoewaugqrdhljnx.supabase.co/storage/v1/object/public/hero-slides/slides/e253897d-05bf-4442-8653-db71be1c51b9.jpg",
    "imagePath": "slides/e253897d-05bf-4442-8653-db71be1c51b9.jpg",
    "ctaLabel": "Ver catálogo",
    "ctaHref": "/catalogo",
    "sortOrder": 30,
    "published": true,
    "createdAt": "2026-05-25T23:14:32.048069+00:00"
  }
];
