import type { Metadata } from "next";
import { Hanken_Grotesk, Bricolage_Grotesque, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

// Matches Eventry's real text-style system: Hanken Grotesk for
// headings/section titles, Geist Mono for dates/stats/metadata/detail
// text, Inter for body copy and interface (buttons, forms), Bricolage
// Grotesque reserved for rare accent tags (e.g. image hover captions).
const headingFont = Hanken_Grotesk({
  variable: "--font-heading-raw",
  subsets: ["latin"],
});

const accentFont = Bricolage_Grotesque({
  variable: "--font-accent-raw",
  subsets: ["latin"],
});

const monoFont = Geist_Mono({
  variable: "--font-mono-raw",
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "event photographer Abuja",
    "event videographer Nigeria",
    "MC and event hosting",
    "stand-up comedian Abuja",
    "event planning Nigeria",
    "hype man booking",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} ${accentFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
