import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://pantrypal-neon-rho.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "PantryPal | Smart Recipe Manager",
    template: "%s | PantryPal",
  },

  description:
    "Discover, create, save, rate, and manage recipes with PantryPal, a bilingual recipe platform built for everyday cooking.",

  applicationName: "PantryPal",

  keywords: [
    "PantryPal",
    "recipes",
    "recipe manager",
    "meal ideas",
    "cooking",
    "bilingual recipes",
    "Chinese recipes",
    "English recipes",
    "food",
  ],

  authors: [
    {
      name: "Ye Lin",
    },
  ],

  creator: "Ye Lin",

  publisher: "PantryPal",

  category: "Food & Drink",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "PantryPal",

    title: "PantryPal | Smart Recipe Manager",

    description:
      "Discover, create, save, rate, and manage recipes in English and Chinese.",

    images: [
      {
        url: "/recipes/shrimp-vermicelli.jpg",
        width: 1200,
        height: 900,
        alt: "PantryPal recipe platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "PantryPal | Smart Recipe Manager",

    description:
      "Discover, create, save, rate, and manage recipes in English and Chinese.",

    images: ["/recipes/shrimp-vermicelli.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Navbar />
        {children}
      </body>
    </html>
  );
}