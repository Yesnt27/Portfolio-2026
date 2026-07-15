export type ProjectLink = {
  label: string;
  href: string;
  primary?: boolean;
};

export type ProjectTemplate = "default" | "fuorisalone";

export type Project = {
  id: string;
  template?: ProjectTemplate;
  eyebrow: string;
  title: string;
  lead: string;
  cardDescription?: string;
  tags: string[];
  role: string;
  timeline: string;
  tools: string;
  type: string;
  heroCaption?: string;
  overview: string[];
  challenge: string[];
  process: string[];
  outcome: string[];
  gallery: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "fuorisalone",
    template: "fuorisalone",
    eyebrow: "Case Study",
    title: "Fuorisalone Microsite 2024",
    lead: "Experimental website for visitors of Fuorisalone design district 2024 and encapsulating all its exhibits with concise UX/UI design.",
    tags: ["UI Design", "UX Research", "Prototyping"],
    role: "Design Coordinator",
    timeline: "2024",
    tools: "Figma, Photoshop, Illustrator",
    type: "Case Study",
    heroCaption: "Fuorisalone demo video",
    overview: [
      "Many modern day websites tend to overachieve on certain aspects including visual design, without emphasis on the overarching user experience that can enhance the navigation experience with minimal interruptions.",
    ],
    challenge: [
      "Create a distinctive brand identity for the annual Fuorisalone design festival while bridging the intersections of UX/UI to create a site that is largely experimental and unique.",
    ],
    process: [
      "Each group member worked collaboratively, aligning tasks with respective strengths. Design process covered work on posters which then translated onto inspiration for the site.",
    ],
    outcome: [
      "Designed interactions and site creation showcasing experimental interactions with intention across homepage, district page, and exhibit showcase flows.",
    ],
    gallery: ["Poster 1", "Poster 2", "Poster 3", "Figma Workspace"],
    links: [{ label: "Final Prototype", href: "#", primary: true }],
  },
  {
    id: "2",
    eyebrow: "Project 2",
    title: "Project 2",
    lead: "Brief description for project 2.",
    tags: ["Development"],
    role: "Developer",
    timeline: "2025",
    tools: "HTML, CSS, JavaScript",
    type: "Web App",
    overview: ["Project 2 overview goes here."],
    challenge: ["Project 2 challenge goes here."],
    process: ["Project 2 process goes here."],
    outcome: ["Project 2 outcome goes here."],
    gallery: ["Image 1", "Image 2"],
    links: [],
  },
  {
    id: "3",
    eyebrow: "Project 3",
    title: "Project 3",
    lead: "Brief description for project 3.",
    tags: ["Design"],
    role: "Designer",
    timeline: "2025",
    tools: "Figma",
    type: "Brand",
    overview: ["Project 3 overview goes here."],
    challenge: ["Project 3 challenge goes here."],
    process: ["Project 3 process goes here."],
    outcome: ["Project 3 outcome goes here."],
    gallery: ["Image 1", "Image 2"],
    links: [],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getAllProjectIds(): string[] {
  return projects.map((project) => project.id);
}
