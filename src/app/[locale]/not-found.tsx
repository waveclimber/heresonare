import type { Metadata } from "next";

import NotFoundPage from "@/components/NotFoundPage";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default NotFoundPage;
