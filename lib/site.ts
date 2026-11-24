/* Shared site-wide content: navigation, contact links, resume. */

export const siteName = "Kenny Nguyen";

export const contactEmail = "pdn1@sfu.ca";

export const resume = {
  href: "/resume.pdf",
  downloadName: "Kenny-Resume.pdf",
} as const;

export const socialLinks = [
  { label: "Github", href: "https://github.com/Yesnt27" },
  { label: "Instagram", href: "https://www.instagram.com/kennynguyen27/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kenny-nguyen-3ab52622a/" },
  { label: "Email", href: "mailto:kennynguyen2726@gmail.com" },
  { label: "X", href: "https://x.com/KennyNguye74746" },
] as const;

export type NavKey = "resume" | "projects" | "about" | "sandbox";

/*
  The card-suit glyphs come straight from the Figma nav (Departure Mono).
  The club is drawn 40px against 30px for the others to match its optical size.
*/
export const navItems: {
  key: NavKey;
  glyph: string;
  label: string;
  href: string;
  glyphSize: number;
}[] = [
  { key: "resume", glyph: "♥", label: "Resume", href: resume.href, glyphSize: 30 },
  { key: "projects", glyph: "♣", label: "Projects", href: "/#work", glyphSize: 40 },
  { key: "about", glyph: "♦", label: "About", href: "/about", glyphSize: 30 },
  { key: "sandbox", glyph: "✦", label: "Sandbox", href: "/sandbox", glyphSize: 30 },
];
