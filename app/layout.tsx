import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Max & Lila's Bedtime Stories",
  description: "Magical bedtime stories for Max and Lila",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${nunito.variable} h-full bg-[#0f0c29] text-[#f0f0f0]`}>
        {children}
      </body>
    </html>
  );
}
