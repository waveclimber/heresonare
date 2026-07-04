import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("productions");

export default function ProductionsPage() {
  return <StaticPage pageKey="productions" />;
}
