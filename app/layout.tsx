import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import DitherBackground from "@/components/DitherBackground";
import BlendCursor from "@/components/site/BlendCursor";
import SiteFooter from "@/components/site/SiteFooter";
import "./globals.css";

/* Pixel UI face: nav, labels, captions, footer. SIL OFL (fonts/DepartureMono-LICENSE.txt). */
const departure = localFont({
  src: "../fonts/DepartureMono-Regular.woff2",
  weight: "400",
  variable: "--font-departure",
  display: "swap",
});

/* Display serif for headings. NOTE: these are the Zetafonts *trial* files. */
const bogart = localFont({
  src: [
    { path: "../fonts/Bogart-Regular-Trial.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Bogart-Medium-Trial.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-bogart",
  display: "swap",
});

/* Body copy. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/* Used for a few Figma call-outs ("View the pitch video →", player subtitle). */
const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Variable.ttf", weight: "300 900", style: "normal" },
    { path: "../fonts/Satoshi-VariableItalic.ttf", weight: "300 900", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Kenny Nguyen | Visual & Product Designer",
    template: "%s | Kenny Nguyen",
  },
  description:
    "Visual and product designer based in Vancouver, BC, designing interactions with an emphasis on creative storytelling.",
};

export const viewport: Viewport = {
  themeColor: "#f3f1ef",
};

/*
  Applies a saved theme before first paint so dark-mode visitors never see a
  light flash. Light is the default, matching the Figma toggle's resting state.
*/
const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")d.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${departure.variable} ${bogart.variable} ${geistMono.variable} ${satoshi.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <DitherBackground />
        {children}
        <SiteFooter />
        {/* Last in <body> so it blends over everything. */}
        <BlendCursor />
      </body>
    </html>
  );
}
