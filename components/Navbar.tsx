import Link from "next/link";

type NavbarProps = {
  variant?: "home" | "inner";
  theme?: "light" | "dark";
};

export default function Navbar({ variant = "home", theme = "light" }: NavbarProps) {
  const homeHref = variant === "home" ? "#home" : "/#home";
  const projectsHref = variant === "home" ? "#projects" : "/#projects";
  const aboutHref = variant === "home" ? "#about" : "/#about";

  if (theme === "dark") {
    return (
      <header className="sticky top-0 z-50 bg-black">
        <nav
          className="mx-auto flex max-w-[1920px] items-center gap-[clamp(2rem,6vw,5.25rem)] px-[clamp(1.5rem,5vw,6rem)] py-[clamp(2rem,4vw,3.75rem)] font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-light text-white"
          aria-label="Main navigation"
        >
          <Link href={homeHref} className="transition-opacity hover:opacity-70">
            Home
          </Link>
          <Link href={projectsHref} className="transition-opacity hover:opacity-70">
            Projects
          </Link>
          <Link href={aboutHref} className="transition-opacity hover:opacity-70">
            Resume
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {variant === "home" ? (
          "Portfolio"
        ) : (
          <Link href="/">Portfolio</Link>
        )}
      </div>
      <ul className="navbar-links">
        <li>
          <Link href={homeHref}>Home</Link>
        </li>
        <li>
          <Link href={projectsHref}>Projects</Link>
        </li>
        <li>
          <Link href={aboutHref}>About</Link>
        </li>
      </ul>
    </nav>
  );
}
