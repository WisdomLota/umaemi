import type { Metadata } from "next";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import CatalogGrid from "@/components/sections/CatalogGrid";
import ClosingCTA from "@/components/sections/ClosingCTA";

export const metadata: Metadata = {
  title: "Our Project Catalog",
  description:
    "Brands and digital products Umaemi has designed, built and maintains — from Pixel Codex and TMD to Hastim, Daily Stride and AKH Con Realty.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Our Project Catalog | Umaemi" },
};

export default function ProjectsPage() {
  return (
    <>
      <SubHeader label="Our Project Catalog" back="/" />
      <main className="relative z-10">
        <CatalogGrid />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
