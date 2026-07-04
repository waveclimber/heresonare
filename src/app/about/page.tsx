import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("about");

export default function AboutPage() {
  return <StaticPage pageKey="about" />;
}
