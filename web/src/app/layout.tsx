import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LifeOS AI - Your Personal Career & Wellness OS",
  description: "AI-driven platform for career growth, skill mastery, and burnout prevention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background text-foreground antialiased font-sans`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 w-full flex flex-col items-center justify-center pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
