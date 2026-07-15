import Link from "next/link";
import { projects } from "@/lib/projects";

export default function ProjectsGrid() {
  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="project-card"
          >
            <div className="project-placeholder">{project.eyebrow}</div>
            <h3>{project.title}</h3>
            <p>{project.lead}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
