import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Directory-style URLs (`/support/`) and `support/index.html` in `out/` — aligns with
  // common static hosting and CloudFront “append index.html” patterns.
  trailingSlash: true,
};

export default nextConfig;
