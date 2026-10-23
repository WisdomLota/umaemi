import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Public pages only — the form steps are excluded (and marked noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projects"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/consultation"), lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/join"), lastModified, changeFrequency: "yearly", priority: 0.7 },
  ];
}
