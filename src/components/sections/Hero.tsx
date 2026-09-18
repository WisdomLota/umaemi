"use client"

import Image from "next/image";
import Button from "@/components/ui/Button";
import HeroDiamond from "@/components/three/HeroDiamond";
import HeroSceneWrapper from "@/components/three/HeroSceneWrapper";
import { motion } from "framer-motion";
import AnimatedText from "@/components/ui/AnimatedText";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto px-10 md:px-16 pt-16 pb-28 grid md:grid-cols-2 gap-12 items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
        <HeroSceneWrapper />
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15, delayChildren: 1.2 } },
        }}
      >
        <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-dark">
          <AnimatedText text="We handle the tech, so you can focus on growth." mode="words" delay={0.2} stagger={0.05} />
        </h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-md font-mono text-base text-dark/80 leading-relaxed"
        >
          Umaemi helps non-technical businesses and individuals turn ideas
          into seamless digital solutions. Book a consultation and let&apos;s
          scale your business with tech.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <Button href="#contact">Book Consultation Session</Button>
        </motion.div>
      </motion.div>

      <div className="flex justify-center md:justify-end">
        <div className="w-[280px] md:w-[420px] overflow-hidden">
          <HeroDiamond />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-dark/40 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-dark/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}