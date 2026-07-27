import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Variable.ttf",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-VariableItalic.ttf",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const neueHaasGrotesk = localFont({
  src: [
    {
      path: "../fonts/NHaasGroteskDSPro-45Lt.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/NHaasGroteskDSPro-46LtIt.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/NHaasGroteskDSPro-55Rg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/NHaasGroteskDSPro-75Bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/NHaasGroteskDSPro-95Blk.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-neue-haas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio | Kenny Nguyen",
  description:
    "Multidisciplinary designer and developer portfolio focused on process and usability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${neueHaasGrotesk.variable} ${inter.variable} ${satoshi.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
