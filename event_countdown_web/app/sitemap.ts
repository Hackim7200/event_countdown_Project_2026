import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = "https://arkun.co.uk";

const paths = ["/", "/todos/", "/events/", "/support/", "/privacy/", "/policy/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
  }));
}
