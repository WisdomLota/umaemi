import type { Metadata } from "next";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import FlowIntro from "@/components/sections/FlowIntro";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { consultationFlow } from "@/lib/flows";

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description:
    "Our process begins with a free consultation session designed to understand your business, challenges, and goals — practical next steps, without pressure or technical jargon.",
  alternates: { canonical: "/consultation" },
  openGraph: { url: "/consultation", title: "Book a Free Consultation | Umaemi" },
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
