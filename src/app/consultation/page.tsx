import type { Metadata } from "next";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import FlowIntro from "@/components/sections/FlowIntro";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { consultationFlow } from "@/lib/flows";

export const metadata: Metadata = {
  title: "Book a Free Consultation — Umaemi",
  description: "Start with a free consultation to explore what's possible for your business.",
};

export default function Page() {
  return (
    <>
      <SubHeader label={consultationFlow.label} back="/" />
      <main className="relative z-10">
        <FlowIntro flow={consultationFlow} />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
