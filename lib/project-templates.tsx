import type { ComponentType } from "react";
import ProjectDetail from "@/components/ProjectDetail";
import FuorisaloneProject from "@/components/projects/FuorisaloneProject";
import SolProject from "@/components/projects/SolProject";
import type { Project, ProjectTemplate } from "@/lib/projects";

type ProjectTemplateComponent = ComponentType<{ project: Project }>;

const projectTemplates: Record<ProjectTemplate, ProjectTemplateComponent> = {
  default: ProjectDetail,
  fuorisalone: FuorisaloneProject,
  sol: SolProject,
};

export function getProjectTemplate(
  template: ProjectTemplate = "default",
): ProjectTemplateComponent {
  return projectTemplates[template];
}
