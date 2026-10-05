export type ProjectTag = "BRANDING" | "DEVELOPMENT" | "MAINTENANCE";

export type Project = {
  slug: string;
  name: string;
  /** Logo in the project's own colours; tiles grey it out with CSS. */
  icon: string;
  /** The project's brand colour — tints the featured frame and glow. */
  accent: string;
  tags: ProjectTag[];
  action: "Visit Site" | "View Guide";
  /** Live site or guide PDF. Fill in when available; "#" until then. */
  url?: string;
  /** Copy as written for the home page catalog (only the five featured). */
  home?: { name?: string; description: string };
  /** Copy as written for the full catalog page. */
  catalog: { name?: string; description: string };
};

export const projects: Project[] = [
  {
    slug: "pixel-codex",
    name: "Pixel Codex",
    icon: "/icons/projects/pixel-codex.svg",
    accent: "#4CC9F0",
    tags: ["BRANDING", "DEVELOPMENT", "MAINTENANCE"],
    action: "Visit Site",
    home: {
      description:
        "An Ed-Tech company that helps beginners in the tech space grow to a professional level of proficiency",
    },
    catalog: { description: "An Ed-Tech company helping beginners become tech professionals." },
  },
  {
    slug: "akhcon",
    name: "AKHCON Realty",
    icon: "/icons/projects/akhcon.svg",
    accent: "#822E27",
    tags: ["DEVELOPMENT", "MAINTENANCE"],
    action: "Visit Site",
    home: { description: "A real estate company delivering modern homes through thoughtful design and transparency." },
    catalog: { name: "AKH Con Realty", description: "A real estate company creating modern homes with transparency." },
  },
  {
    slug: "hastim",
    name: "Hastim",
    icon: "/icons/projects/hastim-color.svg",
    accent: "#B87333",
    tags: ["BRANDING"],
    action: "View Guide",
    home: { description: "A luxury footwear brand combining timeless craftsmanship with modern sophistication." },
    catalog: { description: "A luxury footwear brand rooted in craftsmanship and sophistication." },
  },
  {
    slug: "daily-stride",
    name: "Daily Stride",
    icon: "/icons/projects/daily-stride.svg",
    accent: "#598BD3",
    tags: ["DEVELOPMENT", "MAINTENANCE"],
    action: "Visit Site",
    home: { description: "A venture studio creating and managing innovative digital products in-house." },
    catalog: { description: "A venture studio building and managing innovative digital products." },
  },
  {
    slug: "tmd",
    name: "TMD",
    icon: "/icons/projects/tmd-color.svg",
    accent: "#FEEAC5",
    tags: ["BRANDING", "DEVELOPMENT", "MAINTENANCE"],
    action: "View Guide",
    home: { description: "A quantitative finance firm providing data-driven investment opportunities for investors." },
    catalog: { description: "A quantitative finance firm delivering data-driven investment growth." },
  },
  {
    slug: "efandex",
    name: "Efandex",
    icon: "/icons/projects/efandex-color.svg",
    accent: "#375381",
    tags: ["DEVELOPMENT", "MAINTENANCE"],
    action: "Visit Site",
    catalog: { description: "A marketplace connecting event hosts with unique venue spaces." },
  },
  {
    slug: "lowin",
    name: "Lowin",
    icon: "/icons/projects/lowin-color.svg",
    accent: "#FF8D19",
    tags: ["BRANDING"],
    action: "View Guide",
    catalog: { description: "A micro-cap cryptocurrency investment company focused on growth." },
  },
  {
    slug: "ekida",
    name: "Ekida",
    icon: "/icons/projects/ekida.svg",
    accent: "#144DA8",
    tags: ["BRANDING", "DEVELOPMENT", "MAINTENANCE"],
    action: "View Guide",
    catalog: { description: "A smart investment platform tailored for Nigerian investors." },
  },
  {
    slug: "ichademia",
    name: "Ichademia",
    icon: "/icons/projects/ichademia.svg",
    accent: "#F6EF01",
    tags: ["BRANDING", "DEVELOPMENT", "MAINTENANCE"],
    action: "View Guide",
    catalog: { description: "An Ed-Tech platform transforming study materials into audio learning." },
  },
];

/** The five on the home page, in tile order: featured first, then the slots. */
export const homeProjects = ["pixel-codex", "hastim", "tmd", "daily-stride", "akhcon"].map(
  (slug) => projects.find((p) => p.slug === slug)!
);
