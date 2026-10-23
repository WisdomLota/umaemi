import type { Metadata } from "next";
import StepForm from "@/components/forms/StepForm";
import { consultationFlow } from "@/lib/flows";

// Form steps aren't useful search results; the introduction page is.
export const metadata: Metadata = {
  title: "Book a Free Consultation",
  alternates: { canonical: "/consultation/book" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="relative z-10">
      <StepForm flow={consultationFlow} back="/consultation" />
    </main>
  );
}
