export const productionSlugs = [
  "audio-innovation",
  "creative-platform",
  "live-experience",
] as const;

export type ProductionSlug = (typeof productionSlugs)[number];

export function isProductionSlug(value: string): value is ProductionSlug {
  return productionSlugs.some((slug) => slug === value);
}

export function getProductionDetailPath(slug: ProductionSlug) {
  return `/productions/${slug}` as const;
}
