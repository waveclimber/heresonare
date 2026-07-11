/**
 * Content media is opt-in. Add a public path here only after confirming that
 * the file exists under `public/`, is approved for use, and matches its stated
 * file extension. Unlisted content paths are never sent to `next/image`.
 */
export const approvedContentMediaPaths: ReadonlySet<string> = new Set([]);

export const contentCardFallbackMedia = "/images/logo/logo-white.svg";

export function isApprovedContentMediaPath(
  path: string | undefined
): path is string {
  return Boolean(path && approvedContentMediaPaths.has(path));
}
