import type { Metadata } from "next";
import SandboxGallery from "@/components/sandbox/SandboxGallery";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Experiments, photos, motion pieces and paintings by Kenny Nguyen.",
};

/*
  Sandbox — Figma frames 645:2308 ("1 bit dither", INDEX view) and
  510:6986 (SHUFFLE view).
*/
export default function SandboxPage() {
  return (
    <>
      <SiteHeader active="sandbox" />
      <main id="main" className="mx-auto max-w-frame">
        <h1 className="sr-only">Sandbox</h1>
        <SandboxGallery />
        <div aria-hidden="true" className="h-[clamp(56px,7.6vw,115px)]" />
      </main>
    </>
  );
}
