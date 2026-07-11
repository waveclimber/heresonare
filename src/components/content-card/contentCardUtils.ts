import type { interfaceContent } from "@/data/interfaceContent";
import type { PageContentItem } from "@/data/pageContent";

export type ContentCardLabels =
  (typeof interfaceContent)[keyof typeof interfaceContent]["staticPage"];

export type NormalizedSpec = NonNullable<PageContentItem["specs"]>[number];

function normalizeForComparison(value: string) {
  return value.toLowerCase();
}

export function normalizeTextList(
  values: Array<string | undefined> | undefined
) {
  const seen = new Set<string>();

  return (values ?? []).reduce<string[]>((normalizedValues, value) => {
    const trimmedValue = value?.trim();
    if (!trimmedValue) return normalizedValues;

    const comparisonValue = normalizeForComparison(trimmedValue);
    if (seen.has(comparisonValue)) return normalizedValues;

    seen.add(comparisonValue);
    normalizedValues.push(trimmedValue);
    return normalizedValues;
  }, []);
}

export function normalizeSpecs(
  specs: PageContentItem["specs"]
): NormalizedSpec[] {
  const seen = new Set<string>();

  return (specs ?? []).reduce<NormalizedSpec[]>((normalizedSpecs, spec) => {
    const label = spec.label.trim();
    const value = spec.value.trim();
    if (!label || !value) return normalizedSpecs;

    const comparisonKey = [
      normalizeForComparison(label),
      normalizeForComparison(value),
    ].join("\u0000");
    if (seen.has(comparisonKey)) return normalizedSpecs;

    seen.add(comparisonKey);
    normalizedSpecs.push({ label, value });
    return normalizedSpecs;
  }, []);
}

function encodeIdPart(value: string) {
  const encoded = Array.from(value)
    .map((character) => character.codePointAt(0)?.toString(16))
    .join("-");

  return encoded || "empty";
}

export function createContentCardHeadingId(itemId: string, instanceId: string) {
  return `content-card-${encodeIdPart(itemId)}-${encodeIdPart(instanceId)}-heading`;
}
