"use client";

import { motion } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  mode?: "letters" | "words";
  className?: string;
  delay?: number;
  stagger?: number;
};

export default function AnimatedText({
  text,
  mode = "words",
  className = "",
  delay = 0,
  stagger = 0.06,
}: AnimatedTextProps) {
  const items = mode === "letters" ? text.split("") : text.split(" ");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: -24 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-block"
        >
          {item === " " ? "\u00A0" : item}
          {mode === "words" && i < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}