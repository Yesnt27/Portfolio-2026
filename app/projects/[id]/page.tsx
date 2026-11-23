import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectTemplate } from "@/lib/project-templates";
import { getAllProjectIds, getProject } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllProjectIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.lead,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  /* Each template renders its own header (compact case-study variant). */
  const ProjectTemplate = getProjectTemplate(project.template);
  return <ProjectTemplate project={project} />;
}
