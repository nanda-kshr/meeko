import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meeko | Relief from Sad Stories",
  description: "Meeko helps you find uplifting content and get relief from negative news and sad stories",
  keywords: ["positive content", "uplifting stories", "mental health", "news filter"],
  authors: [{ name: "Meeko Team" }],
  openGraph: {
    title: "Meeko | Relief from Sad Stories",
    description: "Find uplifting content and filter out negative news",
    siteName: "Meeko",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meeko | Relief from Sad Stories",
    description: "Find uplifting content and filter out negative news",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {children}
          <Navbar />

      </body>
    </html>
  );
}