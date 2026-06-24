import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "héReSonare | Sound Beyond Boundaries",

  description:
    "héReSonare explores the resonance between sound, emotion and technology, creating meaningful experiences beyond boundaries.",

  keywords: [
    "héReSonare",
    "Sound Beyond Boundaries",
    "Audio Innovation",
    "Creative Technology",
    "Sound Design",
    "Creative Brand",
    "Future Experience",
  ],

  authors: [
    {
      name: "héReSonare",
    },
  ],

  creator: "héReSonare",

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "héReSonare | Sound Beyond Boundaries",

    description:
      "Creating resonance between sound, emotion and technology.",

    siteName: "héReSonare",

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "héReSonare | Sound Beyond Boundaries",

    description:
      "Creating resonance between sound, emotion and technology.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
