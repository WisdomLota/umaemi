// One source of truth for how the site describes itself to search engines and
// link previews. umaemi.com redirects to www, so www is the canonical address.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.umaemi.com").replace(/\/$/, "");

export const SITE = {
  name: "Umaemi",
  legalName: "Umaemi Innovation and Technologies",
  title: "Umaemi | We handle the tech, so you can focus on growth",
  description:
    "Umaemi helps non-technical businesses and individuals turn ideas into seamless digital solutions. Book a consultation and let's scale your business with tech.",
  keywords: [
    "Umaemi",
    "Umaemi Innovation and Technologies",
    "tech consultation",
    "custom tech solutions",
    "white-label software",
    "branding and visualization",
    "digital solutions for businesses",
    "web development",
    "Nigeria",
  ],
  // Add real profile URLs here when available; they power Google's knowledge panel.
  sameAs: [] as string[],
};

/** Absolute URL for a path on this site. */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
