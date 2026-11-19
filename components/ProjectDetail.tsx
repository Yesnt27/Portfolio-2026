import { CaseShell, Indent, MetaGrid, TocSection } from "@/components/projects/case-parts";
import SiteHeader from "@/components/site/SiteHeader";
import type { Project } from "@/lib/projects";

/*
  Generic case study for projects without a bespoke layout yet. Uses the same
  parts and rhythm as the Sol / Fuorisalone pages so a new project slots
  straight into the redesign.
*/
const sections = [
  { id: "overview", label: "Overview", key: "overview" },
  { id: "challenge", label: "The Challenge", key: "challenge" },
  { id: "process", label: "Process", key: "process" },
  { id: "outcome", label: "Outcome", key: "outcome" },
] as const;

export default function ProjectDetail({ project }: { project: Project }) {
  return (
    <>
      <SiteHeader active="projects" compact />
      <main id="main">
        <CaseShell toc={sections.map(({ id, label }) => ({ id, label }))}>
          <Indent x={286} as="header" reveal={false} className="pt-[clamp(64px,9.9vw,150px)]">
            <p className="font-pixel text-[16.5px] leading-[normal] text-muted">{project.eyebrow}</p>
            <h1 className="rise-in mt-4 font-serif text-[clamp(44px,4.6vw,70px)] leading-[1.2] tracking-[-0.01em] text-copy">
              {project.title}
            </h1>
            <p className="mt-6 max-w-[760px] font-mono text-[16.5px] leading-[normal] text-copy">{project.lead}</p>
            <div className="mt-[72px] max-w-[1061px]">
              <MetaGrid
                template="1fr 1fr 1fr 1fr"
                columns={[
                  { label: "Role", value: project.role },
                  { label: "Timeline", value: project.timeline },
                  { label: "Tools", value: project.tools },
                  { label: "Type", value: project.type },
                ]}
              />
            </div>
          </Indent>

          {sections.map(({ id, label, key }) => (
            <TocSection key={id} id={id} label={label}>
              <Indent x={286} className="mt-[120px]">
                <h2 className="font-mono text-[16.5px] font-bold leading-[normal] text-copy">{label}</h2>
                <div className="mt-[18px] max-w-[903px] space-y-[21px] font-mono text-[16.5px] leading-[normal] text-copy">
                  {project[key].map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Indent>
            </TocSection>
          ))}

          {project.links.length > 0 && (
            <Indent x={286} className="mt-[96px] flex flex-wrap gap-6">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group inline-flex items-baseline gap-[0.25em] font-sans text-[32px] leading-[normal] text-copy transition-colors hover:text-ink"
                >
                  {link.label}
                  <span aria-hidden="true" className="transition-transform duration-300 ease-snap group-hover:translate-x-2">
                    →
                  </span>
                </a>
              ))}
            </Indent>
          )}
          <div className="h-[140px]" />
        </CaseShell>
      </main>
    </>
  );
}
