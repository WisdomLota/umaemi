"use client";

import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import ArrowRight from "./ArrowRight";
import Magnetic from "./Magnetic";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "dark" | "outline" | "light";
  showArrow?: boolean;
  icon?: ReactNode;
  magnetic?: boolean;
  wrapperClassName?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "group/btn relative inline-flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-5 md:py-6 corner [--r:1rem] font-mono text-base font-medium tracking-wide overflow-hidden w-full max-w-md isolate";

const variants = {
  primary: "bg-burnt text-cream",
  dark: "bg-dark text-cream",
  outline: "border-2 border-current text-current bg-transparent",
  light: "bg-cream text-dark",
};

const fill = {
  primary: "bg-dark",
  dark: "bg-burnt",
  outline: "bg-burnt",
  light: "bg-burnt",
};

const fillText = {
  primary: "group-hover/btn:text-cream",
  dark: "group-hover/btn:text-cream",
  outline: "group-hover/btn:text-cream",
  light: "group-hover/btn:text-cream",
};

/**
 * The label rolls up to reveal an identical copy, a fill sweeps in from the
 * brand corner, and the arrow leaves right while its twin enters from left.
 */
export default function Button({
  children,
  href,
  variant = "primary",
  showArrow = true,
  icon,
  magnetic = true,
  className = "",
  wrapperClassName = "",
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${className}`;
  const trailing = icon ?? (showArrow ? <ArrowRight className="w-5 h-5" /> : null);

  const content = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 -z-10 ${fill[variant]} corner [--r:1rem] origin-top-left scale-0 group-hover/btn:scale-100 transition-transform duration-700 ease-out-expo`}
      />
      <span className={`relative flex items-center gap-4 transition-colors duration-300 ${fillText[variant]}`}>
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full">
            {children}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0"
          >
            {children}
          </span>
        </span>
        {trailing && (
          <span className="relative inline-flex overflow-hidden">
            <span className="inline-flex transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-[150%]">
              {trailing}
            </span>
            <span
              aria-hidden
              className="absolute inset-0 inline-flex translate-x-[-150%] transition-transform duration-500 delay-75 ease-out-expo group-hover/btn:translate-x-0"
            >
              {trailing}
            </span>
          </span>
        )}
      </span>
    </>
  );

  const element = href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <button className={classes} {...props}>
      {content}
    </button>
  );

  if (!magnetic) return element;
  return (
    <Magnetic strength={0.18} reach={24} className={`w-full max-w-md ${wrapperClassName}`}>
      {element}
    </Magnetic>
  );
}
