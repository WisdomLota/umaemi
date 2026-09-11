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
  "inline-flex items-center justify-center gap-4 px-10 py-6 rounded-tl-3xl rounded-br-3xl font-mono text-base font-medium tracking-wide transition-colors duration-200 w-full max-w-md";

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
      {showArrow && <ArrowRight size={22} strokeWidth={2.5} />}
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