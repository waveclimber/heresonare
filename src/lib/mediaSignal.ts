export type MediaSignalVariant = "audio" | "platform" | "live";

export function getMediaSignalVariant(source: string): MediaSignalVariant {
  if (source.includes("creative") || source.includes("platform")) {
    return "platform";
  }

  if (source.includes("live") || source.includes("experience")) {
    return "live";
  }

  return "audio";
}
