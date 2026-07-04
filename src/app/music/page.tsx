import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("music");

export default function MusicPage() {
  return <StaticPage pageKey="music" />;
}
