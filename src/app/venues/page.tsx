import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("venues");

export default function VenuesPage() {
  return <StaticPage pageKey="venues" />;
}
