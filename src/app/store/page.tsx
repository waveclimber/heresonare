import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("store");

export default function StorePage() {
  return <StaticPage pageKey="store" />;
}
