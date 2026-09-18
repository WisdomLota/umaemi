"use client";

import { useEffect, useState } from "react";
import HeroScene from "./HeroScene";

export default function HeroSceneWrapper() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[420px] md:h-[520px]">
      <HeroScene />
    </div>
  );
}