import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { roboto_mono } from "./font";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real time Chat App",
  description: "Created by Taiwo Tolulope",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto_mono.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
