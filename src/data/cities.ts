/** Oʻzbekiston shaharlari (taxminiy koordinatalar, ±0.05°). Namoz vaqtiga taʼsiri — 1 daqiqadan kam. */
export type City = { slug: string; name: string; region: string; lat: number; lng: number };

export const CITIES: City[] = [
  { slug: "toshkent", name: "Toshkent", region: "Toshkent shahri", lat: 41.2995, lng: 69.2401 },
  { slug: "nurafshon", name: "Nurafshon", region: "Toshkent viloyati", lat: 41.0397, lng: 69.3578 },
  { slug: "chirchiq", name: "Chirchiq", region: "Toshkent viloyati", lat: 41.4689, lng: 69.5822 },
  { slug: "angren", name: "Angren", region: "Toshkent viloyati", lat: 41.0167, lng: 70.1436 },
  { slug: "olmaliq", name: "Olmaliq", region: "Toshkent viloyati", lat: 40.8447, lng: 69.5986 },
  { slug: "bekobod", name: "Bekobod", region: "Toshkent viloyati", lat: 40.2208, lng: 69.2697 },
  { slug: "samarqand", name: "Samarqand", region: "Samarqand viloyati", lat: 39.6542, lng: 66.9597 },
  { slug: "kattaqorgon", name: "Kattaqoʻrgʻon", region: "Samarqand viloyati", lat: 39.8989, lng: 66.2561 },
  { slug: "buxoro", name: "Buxoro", region: "Buxoro viloyati", lat: 39.7681, lng: 64.4556 },
  { slug: "gijduvon", name: "Gʻijduvon", region: "Buxoro viloyati", lat: 40.1, lng: 64.6833 },
  { slug: "andijon", name: "Andijon", region: "Andijon viloyati", lat: 40.7821, lng: 72.3442 },
  { slug: "namangan", name: "Namangan", region: "Namangan viloyati", lat: 40.9983, lng: 71.6726 },
  { slug: "fargona", name: "Fargʻona", region: "Fargʻona viloyati", lat: 40.3864, lng: 71.7864 },
  { slug: "qoqon", name: "Qoʻqon", region: "Fargʻona viloyati", lat: 40.5286, lng: 70.9425 },
  { slug: "margilon", name: "Margʻilon", region: "Fargʻona viloyati", lat: 40.4711, lng: 71.7247 },
  { slug: "qarshi", name: "Qarshi", region: "Qashqadaryo viloyati", lat: 38.8606, lng: 65.7891 },
  { slug: "shahrisabz", name: "Shahrisabz", region: "Qashqadaryo viloyati", lat: 39.0578, lng: 66.8342 },
  { slug: "termiz", name: "Termiz", region: "Surxondaryo viloyati", lat: 37.2242, lng: 67.2783 },
  { slug: "denov", name: "Denov", region: "Surxondaryo viloyati", lat: 38.2667, lng: 67.9 },
  { slug: "jizzax", name: "Jizzax", region: "Jizzax viloyati", lat: 40.1158, lng: 67.8422 },
  { slug: "guliston", name: "Guliston", region: "Sirdaryo viloyati", lat: 40.4897, lng: 68.7842 },
  { slug: "navoiy", name: "Navoiy", region: "Navoiy viloyati", lat: 40.0844, lng: 65.3792 },
  { slug: "zarafshon", name: "Zarafshon", region: "Navoiy viloyati", lat: 41.5747, lng: 64.2014 },
  { slug: "urganch", name: "Urganch", region: "Xorazm viloyati", lat: 41.55, lng: 60.6333 },
  { slug: "xiva", name: "Xiva", region: "Xorazm viloyati", lat: 41.3783, lng: 60.3639 },
  { slug: "nukus", name: "Nukus", region: "Qoraqalpogʻiston Respublikasi", lat: 42.46, lng: 59.61 },
];

export const cityBySlug = (slug: string) => CITIES.find((c) => c.slug === slug) ?? CITIES[0];
