import type { ComponentType } from "react";
import ProjectDetail from "@/components/ProjectDetail";
import FuorisaloneProject from "@/components/projects/FuorisaloneProject";
import type { Project, ProjectTemplate } from "@/lib/projects";

type ProjectTemplateComponent = ComponentType<{ project: Project }>;

const projectTemplates: Record<ProjectTemplate, ProjectTemplateComponent> = {
  default: ProjectDetail,
  fuorisalone: FuorisaloneProject,
};

export function getProjectTemplate(
  template: ProjectTemplate = "default",
): ProjectTemplateComponent {
  return projectTemplates[template];
}
