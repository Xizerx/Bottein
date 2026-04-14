import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "BOTTEIN",
    template: "%s | BOTTEIN",
  },
  description:
    "Real fruit powder. Expert-formulated protein blends with zero artificial ingredients. Personalized to your goals — clean, precise, uncompromising.",
  metadataBase: new URL("https://bottein.ca"),
  alternates: {
    canonical: "https://bottein.ca",
  },
  openGraph: {
    title: "BOTTEIN ✦ Your Protein. Personalized.",
    description:
      "Real fruit powder. Expert-formulated, zero artificial ingredients. Personalized to you.",
    url: "https://bottein.ca",
    siteName: "BOTTEIN",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
      title: "BOTTEIN ✦ Your Protein. Personalized.",
    description:
      "Real fruit powder. Expert-formulated, zero artificial ingredients. Personalized to you.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BOTTEIN",
  url: "https://bottein.ca",
  description:
    "Science-backed, personalized protein powder with real fruit flavours.",
  foundingDate: "2024",
  areaServed: "CA",
  sameAs: ["https://instagram.com/bottein.ca"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* noinspection HtmlRequiredTitleElement */}
      <html lang="en" className="bw">
        <head>
          <title>BOTTEIN</title>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen flex flex-col">
          <CartProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </>
  );
}
