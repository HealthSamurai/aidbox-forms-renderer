import type { ReactNode } from "react";

import Breadcrumbs from "@/components/breadcrumbs.tsx";
import Markdown from "@/components/markdown.tsx";
import PageFooter from "@/components/page-footer.tsx";
import TableOfContents from "@/components/table-of-contents.tsx";
import type { FlattenedSidebarEntry } from "@/components/sidebar.tsx";

export default function Page({
  title,
  description,
  route,
  pages,
  children,
}: {
  title: string;
  description: string | undefined;
  route: string;
  pages: FlattenedSidebarEntry[];
  children: ReactNode;
}) {
  return (
    <main
      id="content"
      className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-14 lg:py-8 relative py-6"
    >
      <div className="mx-auto w-full min-w-0">
        <Breadcrumbs route={route} pages={pages} />
        <div className="mb-8">
          <h1 className="scroll-m-20 break-words text-4xl font-extrabold tracking-tight lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground pt-1 text-lg">{description}</p>
          ) : undefined}
        </div>
        <Markdown contentId="docs-content">{children}</Markdown>
        <PageFooter route={route} pages={pages} />
      </div>
      <div className="hidden text-sm lg:block">
        <div className="sticky md:top-[91px]">
          <TableOfContents contentId="docs-content" activeRoute={route} />
        </div>
      </div>
    </main>
  );
}
