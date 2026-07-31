import Link from "next/link";

type NavbarProps = {
  variant?: "home" | "inner";
  theme?: "light" | "dark";
};

export default function Navbar({ variant = "home", theme = "light" }: NavbarProps) {
  const homeHref = variant === "home" ? "#home" : "/#home";
  const projectsHref = variant === "home" ? "#projects" : "/#projects";
  const resumeHref = variant === "home" ? "/about" : "/about";

  if (theme === "dark") {
    return (
      <header className="sticky top-0 z-50 bg-black">
        <nav
          className="mx-auto flex w-full max-w-page items-center gap-nav-gap px-gutter py-nav-y font-display text-nav font-light text-white"
          aria-label="Main navigation"
        >
          <Link href={homeHref} className="transition-opacity hover:opacity-70">
            Home
          </Link>
          <Link href={projectsHref} className="transition-opacity hover:opacity-70">
            Projects
          </Link>
          <Link href={resumeHref} className="transition-opacity hover:opacity-70">
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
          <Link href="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
