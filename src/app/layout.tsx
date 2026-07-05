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

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
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
