import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import WorldTracker from "@/components/providers/WorldTracker";
import Preloader from "@/components/layout/Preloader";
import Cursor from "@/components/ui/Cursor";
import StageMount from "@/components/three/StageMount";
import { SITE, SITE_URL, absoluteUrl } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: SITE.keywords,
  authors: [{ name: SITE.legalName, url: SITE_URL }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  category: "technology",
};

// Structured data: tells search engines who Umaemi is, so a search for the
// name can be matched to this site (and, in time, a knowledge panel).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE_URL,
      logo: absoluteUrl("/logo.png"),
      description: SITE.description,
      ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
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
        <script
          type="application/ld+json"
          // Static object defined above — safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
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
