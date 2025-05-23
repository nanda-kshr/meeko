import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/authContext';

import "./globals.css";

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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
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
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Navbar />
        </AuthProvider>
      </body>
    </html>
  );
}