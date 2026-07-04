import StaticPage from "@/components/StaticPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata("contact");

export default function ContactPage() {
  return <StaticPage pageKey="contact" />;
}
