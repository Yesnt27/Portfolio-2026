import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getProjectTemplate } from "@/lib/project-templates";
import { getAllProjectIds, getProject } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllProjectIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    return { title: "Project Not Found | Portfolio" };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.lead,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  const ProjectTemplate = getProjectTemplate(project.template);
  const hasCustomShell =
    project.template === "fuorisalone" || project.template === "sol";

  if (hasCustomShell) {
    return <ProjectTemplate project={project} />;
  }

  return (
    <>
      <Navbar variant="inner" />
      <ProjectTemplate project={project} />
    </>
  );
}
