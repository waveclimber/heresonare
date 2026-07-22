import type { NextConfig } from "next";
import { getSecurityHeaders } from "./src/config/http.mjs";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: getSecurityHeaders(process.env.NODE_ENV),
      },
    ];
  },
};

export default nextConfig;
