import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("tour");

export default function TourPage() {
  return <StaticPage pageKey="tour" />;
}
