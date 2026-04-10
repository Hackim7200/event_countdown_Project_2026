import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientRoot } from "./client-root";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Silent Architect",
  description: "Productivity sequence and Pomodoro planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white font-sans text-[#1A1A1A] antialiased">
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
