import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "dark";
  showArrow?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "inline-flex items-center gap-3 px-6 py-4 rounded-xl font-mono text-sm tracking-wide transition-colors duration-200";

const variants = {
  primary: "bg-burnt text-cream hover:bg-[#c23a00]",
  dark: "bg-dark text-cream hover:bg-[#2b0a02]",
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
    <>
      {children}
      {showArrow && <ArrowRight size={18} />}
    </>
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