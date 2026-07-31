import ConnectFooter from "@/components/ConnectFooter";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#111] text-white">
      <Hero />
      <ProjectsGrid />
      <ConnectFooter variant="landing" />
    </main>
  );
}
