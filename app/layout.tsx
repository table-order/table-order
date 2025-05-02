import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainHeader from "./components/MainHeader";
import ToastPortal from "./components/ToastPortal";
import SetupUserChannel from "./components/SetupUserChannel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "테이블 오더",
  description: "테이블 오더",
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
        <SetupUserChannel />
        <header>
          <MainHeader />
        </header>
        {children}
        <ToastPortal />
      </body>
    </html>
  );
}
