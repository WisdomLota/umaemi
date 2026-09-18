"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const PULSE_DURATION = 1.2;
const GAP = 24;

export default function HeroDiamond() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.svg
      width="469"
      height="439"
      viewBox="0 0 469 439"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: 0 }}
      animate={{ rotate: 720 }}
      transition={{ duration: 4.5, ease: [0.22, 0.61, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="w-full h-full cursor-pointer"
    >
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [0, -GAP, 0] }}
        transition={{
          duration: PULSE_DURATION,
          repeat: Infinity,
          repeatDelay: PULSE_DURATION,
          delay: 5,
          ease: "easeInOut",
        }}
      >
        <motion.path style={{ transformOrigin: "307px 380px" }} d="M282.664 355.599L307.091 331.172L331.519 355.599L258.235 428.882C244.797 442.32 223.042 442.372 209.539 429.039L136.099 355.599L160.527 331.171L184.954 355.599L193.267 347.286C194.462 345.71 195.778 344.197 197.215 342.759C198.653 341.321 200.167 340.006 201.743 338.811L233.809 306.744L282.664 355.599Z" fill="#460E04" />
      </motion.g>

      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, GAP, 0] }}
        transition={{
          duration: PULSE_DURATION,
          repeat: Infinity,
          repeatDelay: PULSE_DURATION,
          delay: 5 + PULSE_DURATION,
          ease: "easeInOut",
        }}
      >
        <motion.path style={{ transformOrigin: "60px 219px" }} d="M122.137 146.218L97.7093 170.645L146.564 219.5L97.7093 268.355L122.137 292.782L97.7093 317.209L0 219.5L97.7093 121.791L122.137 146.218Z" fill="#460E04" />
      </motion.g>

      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, -GAP, 0] }}
        transition={{
          duration: PULSE_DURATION,
          repeat: Infinity,
          repeatDelay: PULSE_DURATION,
          delay: 5 + PULSE_DURATION,
          ease: "easeInOut",
        }}
      >
        <motion.path style={{ transformOrigin: "409px 219px" }} d="M468.439 218.884L370.729 316.593L346.302 292.166L370.729 267.739L321.874 218.884L351.688 189.071C353.033 187.21 354.544 185.431 356.22 183.755C357.896 182.079 359.675 180.569 361.535 179.223L370.729 170.029L346.302 145.602L370.729 121.174L468.439 218.884Z" fill="#460E04" />
      </motion.g>

      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [0, GAP, 0] }}
        transition={{
          duration: PULSE_DURATION,
          repeat: Infinity,
          repeatDelay: PULSE_DURATION,
          delay: 5,
          ease: "easeInOut",
        }}
      >
        <motion.path style={{ transformOrigin: "234px 60px" }} d="M210.151 10.1176C223.589 -3.32032 245.344 -3.37211 258.847 9.96095L332.287 83.4014L307.859 107.829L283.431 83.4006L234.577 132.256L185.722 83.4006L161.295 107.828L136.867 83.4006L210.151 10.1176Z" fill="#460E04" />
      </motion.g>
    </motion.svg>
  );
}