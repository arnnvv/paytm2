import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/ui/lib/utils";
import AppbarComponent from "./_components/AppbarComponent";
import { Toaster } from "@repo/ui/components/ui/sonner";

export const metadata: Metadata = {
  title: "PayTM",
  description: "Generated by ARNNVV",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default ({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element => (
  <html lang="en">
    <body
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
      )}
    >
      <Toaster richColors />
      <AppbarComponent />
      {children}
    </body>
  </html>
);
