import { Github } from "lucide-react";
import { type ReactNode, useEffect } from "react";

import { Button } from "./ui/button.tsx";
import SiteHeader from "./site-header.tsx";

type Properties = {
  title: string;
  children: ReactNode;
  mobileNav?: ReactNode;
  mobileToc?: ReactNode;
  search?: ReactNode;
};

export default function Shell({
  title,
  children,
  mobileNav,
  mobileToc,
  search,
}: Properties) {
  useEffect(() => {
    if (!globalThis.document) return;
    const resolvedTitle = title
      ? title.includes("Aidbox Docs")
        ? title
        : `${title} - Aidbox Docs`
      : "Aidbox Docs";
    document.title = resolvedTitle;
  }, [title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
        href="#content"
      >
        Skip to content
      </a>
      <SiteHeader mobileNav={mobileNav} mobileToc={mobileToc} search={search} />

      {children}

      <footer className="text-muted-foreground py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-2 md:h-24 md:flex-row">
          <span className="text-sm">Copyright © 2024</span>
          <span className="flex-1" />
          <div className="flex flex-wrap justify-center gap-2 md:justify-end">
            <Button asChild variant="ghost" size="icon" className="flex gap-2">
              <a
                href="https://github.com/HealthSamurai/aidbox-forms-renderer"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="size-5" />
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
