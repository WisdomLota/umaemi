import Image from "next/image";
import Link from "next/link";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import InstagramIcon from "@/components/ui/InstagramIcon";
import XIcon from "@/components/ui/XIcon";
import Reveal from "@/components/ui/Reveal";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: LinkedinIcon, href: "#" },
  { icon: InstagramIcon, href: "#" },
  { icon: XIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A0503] px-6 sm:px-10 md:px-16 pb-16">
      <div className="max-w-7xl mx-auto">
        <div
          className="mb-16 h-0.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,245,236,0.4) 0, rgba(255,245,236,0.4) 10px, transparent 10px, transparent 20px)",
          }}
        />

        <Reveal>
        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left justify-between gap-12">
          <Image src="/icons/logo-gray.svg" alt="" width={130} height={130} />
          <div className="flex flex-col items-center md:items-end gap-8">
            <div className="flex gap-5">
              {socials.map(({ icon: Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className="w-12 h-12 rounded-full border border-cream flex items-center justify-center text-cream hover:bg-cream/10 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 font-mono text-sm md:text-base text-cream">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-burnt transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="font-mono text-sm text-cream/60">
              Umaemi Innovation and Technologies copyright 2026 ©
            </p>
          </div>
        </div>
    </Reveal>
      </div>
    </footer>
  );
}