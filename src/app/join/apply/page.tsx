import type { Metadata } from "next";
import StepForm from "@/components/forms/StepForm";
import { joinFlow } from "@/lib/flows";

// Form steps aren't useful search results; the introduction page is.
export const metadata: Metadata = {
  title: "Join the Umaemi Network",
  alternates: { canonical: "/join/apply" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="relative z-10">
      <StepForm flow={joinFlow} back="/join" />
    </main>
  );
}
