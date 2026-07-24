import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "HR Assist",
  description: "System zarządzania pracownikami i ewidencją czasu pracy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} h-full`}>
      <body className="h-full overflow-hidden antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
