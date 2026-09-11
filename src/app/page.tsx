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
      <Hero />
      <ProjectCatalog />
      <Services />
      <ReachOut />
      <ClosingCTA />
      <Footer />
    </>
  );
}