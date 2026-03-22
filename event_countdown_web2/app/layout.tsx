import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppFooter } from "@/features/todo/components/app-footer";
import { Providers } from "./providers";
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
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
