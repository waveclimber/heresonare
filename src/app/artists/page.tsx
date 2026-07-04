import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("artists");

export default function ArtistsPage() {
  return <StaticPage pageKey="artists" />;
}
