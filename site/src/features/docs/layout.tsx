import { Menu } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import Shell from "@/components/shell.tsx";

import Search from "@/components/search.tsx";
import Sidebar from "@/components/sidebar.tsx";
import type { FlattenedSidebarEntry } from "@/components/sidebar.tsx";
import TableOfContents from "@/components/table-of-contents.tsx";
import { sidebar } from "@/features/docs/manifest.ts";

type Properties = {
  title: string;
  activeRoute?: string;
  children: ReactNode;
  pages: FlattenedSidebarEntry[];
};

export default function Layout({
  title,
  activeRoute,
  children,
  pages,
}: Properties) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Shell
      title={title}
      search={<Search pages={pages} />}
      mobileNav={
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-[18px]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-4 pb-4">
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
            <div className="relative h-full overflow-hidden py-6 pr-6 text-sm">
              <Sidebar
                sidebar={sidebar}
                activeRoute={activeRoute}
                onNavigate={() => setMenuOpen(false)}
              />
            </div>
            <SheetHeader className="sr-only">
              <SheetTitle>Docs navigation</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      }
      mobileToc={
        <TableOfContents
          contentId="docs-content"
          activeRoute={activeRoute}
          isSmall
        />
      }
    >
      <div className="min-h-screen border-b">
        <div className="flex-1 items-start px-4 md:grid md:gap-6 md:px-8 lg:gap-10 container md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-[calc(100vh-3.5rem)] md:top-[61px] fixed z-30 -ml-2 hidden w-full shrink-0 overflow-y-auto top-[102px] md:sticky md:block">
            <ScrollArea className="h-full py-6 pr-6 text-sm md:pr-4">
              <Sidebar sidebar={sidebar} activeRoute={activeRoute} />
            </ScrollArea>
          </aside>
          {children}
        </div>
      </div>
    </Shell>
  );
}
