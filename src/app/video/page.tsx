import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("video");

export default function VideoPage() {
  return <StaticPage pageKey="video" />;
}
