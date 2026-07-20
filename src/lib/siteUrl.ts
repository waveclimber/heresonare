export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://heresonare.com"
);

export function getAbsoluteSiteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}
