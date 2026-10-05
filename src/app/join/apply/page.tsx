import type { Metadata } from "next";
import StepForm from "@/components/forms/StepForm";
import { joinFlow } from "@/lib/flows";

export const metadata: Metadata = { title: "Join the Umaemi Network — Umaemi" };

export default function Page() {
  return (
    <main className="relative z-10">
      <StepForm flow={joinFlow} back="/join" />
    </main>
  );
}
