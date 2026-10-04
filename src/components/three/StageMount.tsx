"use client";

import dynamic from "next/dynamic";
import { useStageEnabled } from "@/lib/media";

// three.js is the heaviest thing on the page — keep it out of the initial
// bundle and never render it on the server.
const DiamondStage = dynamic(() => import("./DiamondStage"), { ssr: false });

export default function StageMount() {
  const enabled = useStageEnabled();
  return enabled ? <DiamondStage /> : null;
}
