import type { Metadata } from "next";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import FlowIntro from "@/components/sections/FlowIntro";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { joinFlow } from "@/lib/flows";

export const metadata: Metadata = {
  title: "Join the Umaemi Network",
  description:
    "Our community brings together businesses, professionals, entrepreneurs, and organizations looking to grow through meaningful connections and shared opportunities.",
  alternates: { canonical: "/join" },
  openGraph: { url: "/join", title: "Join the Umaemi Network | Umaemi" },
};

export default function Page() {
  return (
    <>
      <SubHeader label={joinFlow.label} back="/" />
      <main className="relative z-10">
        <FlowIntro flow={joinFlow} />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
