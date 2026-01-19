import type { ReactNode } from "react";
import { Github } from "lucide-react";

import { Button } from "./ui/button.tsx";

type NavLink = {
  href: string;
  label: string;
};

type Properties = {
  links?: NavLink[];
  extraNav?: ReactNode;
  mobileNav?: ReactNode;
  mobileToc?: ReactNode;
  search?: ReactNode;
  showGithubIcon?: boolean;
};

export default function SiteHeader({
  links,
  extraNav,
  mobileNav,
  mobileToc,
  search,
  showGithubIcon = true,
}: Properties) {
  const navLinks = links ?? [
    { href: "/", label: "Home" },
    { href: "/docs/", label: "Docs" },
    { href: "/storybook/", label: "Storybook" },
  ];

  return (
    <header className="bg-background/80 sticky top-0 z-40 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between gap-2 px-4 md:px-8">
        <div className="hidden flex-1 md:flex">
          <a className="flex" href="/">
            <img
              className="h-7 w-7 brightness-0 invert"
              src="/android-chrome-192x192.png"
              alt="Aidbox logo"
            />
            <span className="ml-3 self-center font-bold">
              Aidbox Forms Renderer
            </span>
          </a>
        </div>
        {mobileNav}
        <a className="flex md:hidden" href="/">
          <img
            className="h-7 w-7 brightness-0 invert"
            src="/android-chrome-192x192.png"
            alt="Aidbox logo"
          />
          <span className="ml-3 self-center font-bold">
            Aidbox Forms Renderer
          </span>
        </a>
        <nav
          className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          {extraNav}
        </nav>
        <div className="flex flex-1 justify-end gap-2">
          {search}
          {showGithubIcon ? (
            <div className="flex">
              <Button asChild variant="ghost" size="icon">
                <a
                  href="https://github.com/HealthSamurai/aidbox-forms-renderer"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="size-[18px]" />
                </a>
              </Button>
            </div>
          ) : undefined}
        </div>
      </div>
      {mobileToc ? <div className="lg:hidden">{mobileToc}</div> : undefined}
    </header>
  );
}
