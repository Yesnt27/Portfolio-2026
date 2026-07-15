import Link from "next/link";
import type { Project } from "@/lib/projects";

type ProjectDetailProps = {
  project: Project;
};

function TextBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="project-section-content">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <main className="project-page">
      <div className="project-container">
        <nav className="project-nav">
          <Link href="/#projects">&larr; Back to Projects</Link>
        </nav>

        <header className="project-hero">
          <p className="project-eyebrow">{project.eyebrow}</p>
          <h1 className="project-title">{project.title}</h1>
          <p className="project-lead">{project.lead}</p>
          {project.tags.length > 0 && (
            <ul className="project-tags" aria-label="Project categories">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <dl className="project-meta-grid">
          <div className="project-meta-item">
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div className="project-meta-item">
            <dt>Timeline</dt>
            <dd>{project.timeline}</dd>
          </div>
          <div className="project-meta-item">
            <dt>Tools</dt>
            <dd>{project.tools}</dd>
          </div>
          <div className="project-meta-item">
            <dt>Type</dt>
            <dd>{project.type}</dd>
          </div>
        </dl>

        <figure className="project-feature-media">
          <div className="project-media-placeholder">Hero image or video</div>
          {project.heroCaption && (
            <figcaption className="project-media-caption">
              {project.heroCaption}
            </figcaption>
          )}
        </figure>

        <div className="project-body">
          <section className="project-section">
            <h2>Overview</h2>
            <TextBlock paragraphs={project.overview} />
          </section>

          <section className="project-section">
            <h2>The Challenge</h2>
            <TextBlock paragraphs={project.challenge} />
          </section>

          <section className="project-section project-section--split">
            <div className="project-split-block">
              <h2>Process</h2>
              <TextBlock paragraphs={project.process} />
            </div>
            <div className="project-split-block">
              <h2>Outcome</h2>
              <TextBlock paragraphs={project.outcome} />
            </div>
          </section>
        </div>

        {project.gallery.length > 0 && (
          <section className="project-gallery" aria-label="Project gallery">
            <div className="project-gallery-grid">
              {project.gallery.map((label) => (
                <div key={label} className="project-gallery-item">
                  {label}
                </div>
              ))}
            </div>
          </section>
        )}

        {project.links.length > 0 && (
          <footer className="project-footer">
            <div className="project-links">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={link.primary ? "btn btn--primary" : "btn"}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
