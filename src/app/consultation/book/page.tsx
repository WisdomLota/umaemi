import type { Metadata } from "next";
import StepForm from "@/components/forms/StepForm";
import { consultationFlow } from "@/lib/flows";

export const metadata: Metadata = { title: "Book a Free Consultation — Umaemi" };

export default function Page() {
  return (
    <main className="relative z-10">
      <StepForm flow={consultationFlow} back="/consultation" />
    </main>
  );
}
