import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "../components/ConditionalNavbar";
import LayoutContainer from "../components/LayoutContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gradient Institute - Advancing Safe and Responsible AI",
  description:
    "An independent not-for-profit research organisation advancing safe and responsible AI through science-based clarity.",
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
        <ConditionalNavbar />
        <LayoutContainer>{children}</LayoutContainer>
      </body>
    </html>
  );
}
