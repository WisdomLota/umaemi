import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import WorldTracker from "@/components/providers/WorldTracker";
import Preloader from "@/components/layout/Preloader";
import Cursor from "@/components/ui/Cursor";
import StageMount from "@/components/three/StageMount";

// Variable font with width + optical size axes so the type can move.
const bricolage = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Umaemi handles the tech, so you can focus on growth.",
  description: "Umaemi helps non-technical businesses and individuals turn ideas into seamless digital solutions.",
};

export const viewport: Viewport = {
  themeColor: "#FFD0A5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-world="peach"
      className={`${bricolage.variable} ${dmMono.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col bg-night text-ink font-sans overflow-x-clip">
        <SmoothScrollProvider>
          <Preloader />
          {children}
          <StageMount />
          <WorldTracker />
          <Cursor />
          <div aria-hidden className="grain" />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
