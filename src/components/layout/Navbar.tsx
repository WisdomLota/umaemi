"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import AnimatedText from "@/components/ui/AnimatedText";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

function NavLink({ label, href, delay }: { label: string; href: string; delay: number }) {
  return (
    <Link href={href} className="relative group inline-block">
      <span className="group-hover:text-burnt transition-colors">
        <AnimatedText text={label} mode="letters" delay={delay} stagger={0.03} />
      </span>
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-burnt scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50"
    >
      <div className="h-3 bg-burnt" />
      <div className="bg-peach/90 backdrop-blur-sm border-b border-dark/10">
        <nav className="mx-auto flex items-center justify-between px-10 md:px-16 py-8">
          <Link href="#hero" className="flex items-center gap-2 font-mono font-medium text-dark">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
              >
                <Image src="/icons/logo.svg" alt="Umaemi" width={44} height={44} priority />
              </motion.div>
            </motion.div>
          </Link>

          <ul className="hidden md:flex items-center gap-12 font-mono text-base font-medium text-dark">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <NavLink {...link} delay={0.6 + i * 0.1} />
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
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden flex flex-col gap-4 px-6 pb-6 font-mono text-sm text-dark"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.header>
  );
}