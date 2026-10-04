import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProjectCatalog from "@/components/sections/ProjectCatalog";
import Services from "@/components/sections/Services";
import ReachOut from "@/components/sections/ReachOut";
import ClosingCTA from "@/components/sections/ClosingCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Hero stays pinned underneath while the catalog rises over it. */}
        <div className="relative">
          <Hero />
          <ProjectCatalog />
        </div>
        <Services />
        <ReachOut />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
