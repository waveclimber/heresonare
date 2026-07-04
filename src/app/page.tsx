import HomeContent from "@/components/HomeContent";
import { createHomeMetadata } from "@/lib/pageMetadata";

export const metadata = createHomeMetadata();

export default function Home() {
  return <HomeContent />;
}
