import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";

const sideProjects = [
  { name: "Hastium", icon: "/icons/projects/hastim.svg" },
  { name: "TMD", icon: "/icons/projects/tmd.svg" },
];
const sideProjectsRight = [
  { name: "Efandex", icon: "/icons/projects/efandex.svg" },
  { name: "Lowin", icon: "/icons/projects/lowin.svg" },
];

export default function ProjectCatalog() {
  return (
    <section id="projects" className="bg-[#1A0503] text-cream py-24 md:py-36 px-6 sm:px-10 md:px-16">
      <h2 className="text-center font-sans text-3xl md:text-4xl mb-16 md:mb-24">
        Our Project Catalog
      </h2>

      {/* mobile: simple stacked layout */}
      <div className="flex flex-col items-center gap-10 md:hidden">
        <div className="flex gap-4 flex-wrap justify-center">
          {[...sideProjects, ...sideProjectsRight].map((p) => (
            <div key={p.name} className="w-20 h-20 rounded-xl border border-cream/20 opacity-40 grayscale flex items-center justify-center">
              <Image src={p.icon} alt={p.name} width={40} height={40} />
            </div>
          ))}
        </div>
        <div className="relative w-56 h-80">
          <div className="absolute inset-0 rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-none border-2 border-dashed border-cream" />
          <div className="absolute inset-2 rounded-tr-none rounded-tl-2xl rounded-br-2xl rounded-bl-none border-2 border-[#4CC9F0] flex items-center justify-center">
            <Image src="/icons/projects/pixel-codex.svg" alt="Pixel Codex" width={100} height={100} />
          </div>
        </div>
        <div className="text-center max-w-xs">
          <h3 className="font-sans text-2xl font-medium mb-4">Pixel Codex</h3>
          <p className="font-mono text-sm text-cream/70 mb-6">
            An Ed-Tech company that helps beginners in the tech space grow to
            a professional level of proficiency
          </p>
          <div className="flex justify-center gap-4 flex-wrap font-mono text-xs font-medium text-burnt mb-8">
            <span>BRANDING</span>
            <span>DEVELOPMENT</span>
            <span>MAINTENANCE</span>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-4 w-full max-w-xs">
          <a href="#" className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-tl-2xl rounded-br-2xl border-2 border-cream text-cream font-mono text-sm font-medium hover:bg-cream/10 transition-colors">
            Visit Site <ArrowUpRight size={20} strokeWidth={2.5} />
          </a>
          <Button href="#" className="w-full justify-center">Explore</Button>
        </div>
      </div>

      {/* desktop: full layout */}
      <div className="hidden md:flex w-full justify-center items-start gap-6 lg:gap-10">
        <div className="relative h-136 w-64 lg:w-80">
          <div className="absolute -top-14 right-0 flex gap-6">
            {sideProjects.map((p) => (
              <div key={p.name} className="w-32 h-32 lg:w-40 lg:h-40 rounded-tl-xl rounded-br-xl border border-cream/20 opacity-70 grayscale flex items-center justify-center">
                <Image src={p.icon} alt={p.name} width={64} height={64} />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-14 right-0 max-w-xs text-left">
            <h3 className="font-sans text-3xl lg:text-4xl font-medium mb-4">Pixel Codex</h3>
            <p className="font-mono text-base text-cream/70 mb-6">
              An Ed-Tech company that helps beginners in the tech space grow
              to a professional level of proficiency
            </p>
            <div className="flex gap-6 font-mono text-sm font-medium text-burnt">
              <span>BRANDING</span>
              <span>DEVELOPMENT</span>
              <span>MAINTENANCE</span>
            </div>
          </div>
        </div>
        
        <div className="relative w-60 lg:w-72 h-112 lg:h-136 shrink-0">
          <div className="absolute inset-0 rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-none border-2 border-dashed border-cream" />
          <div className="absolute inset-2 rounded-tr-none rounded-tl-2xl rounded-br-2xl rounded-bl-none border-2 border-[#4CC9F0] flex items-center justify-center">
            <Image src="/icons/projects/pixel-codex.svg" alt="Pixel Codex" width={120} height={120} />
          </div>
        </div>
        
        <div className="relative h-136 w-64 lg:w-80">
          <div className="absolute -top-14 left-0 flex gap-6">
            {sideProjectsRight.map((p) => (
              <div key={p.name} className="w-32 h-32 lg:w-40 lg:h-40 rounded-tl-xl rounded-br-xl border border-cream/20 opacity-70 grayscale flex items-center justify-center">
                <Image src={p.icon} alt={p.name} width={64} height={64} />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-14 left-0 flex flex-col items-stretch gap-4 w-72">
            <a href="#" className="inline-flex items-center justify-center gap-3 px-10 py-6 rounded-tl-2xl rounded-br-2xl border-2 border-cream text-cream font-mono text-base font-medium hover:bg-cream/10 transition-colors">
              Visit Site <ArrowUpRight size={22} strokeWidth={2.5} />
            </a>
            <Button href="#" className="w-full justify-center">Explore</Button>
          </div>
        </div>
      </div>
    </section>
  );
}