"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";
import ArrowRight from "./ArrowRight";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "dark" | "outline";
  showArrow?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "relative inline-flex items-center justify-center gap-4 px-10 py-6 rounded-tl-2xl rounded-br-2xl font-mono text-base font-medium tracking-wide overflow-hidden w-full max-w-md";

const variants = {
  primary: "bg-burnt text-cream",
  dark: "bg-dark text-cream",
  outline: "border-2 border-burnt text-burnt bg-transparent",
};

const overlay = {
  primary: "bg-[#c23a00]",
  dark: "bg-[#2b0a02]",
  outline: "bg-burnt/10",
};

export default function Button({
  children,
  href,
  variant = "primary",
  showArrow = true,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  const content = (
    <motion.span
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="relative flex items-center justify-center gap-4 w-full h-full"
    >
      <motion.span
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
        className={`absolute inset-0 ${overlay[variant]}`}
      />
      <motion.span
        variants={{ tap: { scale: 0.97 } }}
        className="relative z-10 flex items-center gap-4"
      >
        {children}
        {showArrow && (
          <motion.span
            variants={{ rest: { x: 0 }, hover: { x: 6 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-flex"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        )}
      </motion.span>
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}