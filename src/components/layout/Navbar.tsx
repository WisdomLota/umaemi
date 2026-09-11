"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="h-3 bg-burnt" />
      <div className="bg-peach backdrop-blur-sm border-b border-dark/10">
        <nav className="mx-auto flex items-center justify-between px-10 md:px-16 py-8">
          <Link href="#hero" className="flex items-center gap-2 font-mono font-medium text-dark">
            <Image src="/icons/logo.svg" alt="Umaemi" width={40} height={40} priority />
          </Link>

          <ul className="hidden md:flex items-center gap-12 font-mono text-base font-medium text-dark">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-burnt transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className="md:hidden text-dark"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {open && (
          <ul className="md:hidden flex flex-col gap-4 px-6 pb-6 font-mono text-sm text-dark">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}