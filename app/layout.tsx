import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Bottein — Your Protein. Personalized.",
    template: "%s | Bottein",
  },
  description:
    "Science-backed, expert-formulated protein tailored to your goals. Real fruit powder, mix-and-match flavors, zero compromises.",
  metadataBase: new URL("https://bottein.ca"),
  openGraph: {
    title: "Bottein — Your Protein. Personalized.",
    description:
      "Science-backed, expert-formulated protein tailored to your goals.",
    url: "https://bottein.ca",
    siteName: "Bottein",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bottein — Your Protein. Personalized.",
    description:
      "Science-backed, expert-formulated protein tailored to your goals.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bw">
      <head>
        {/* Google Fonts — loaded client-side to avoid build-time network requirements */}
        {/* In production, swap to next/font/google for performance */}
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
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
