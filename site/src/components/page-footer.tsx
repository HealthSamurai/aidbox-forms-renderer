import { ArrowLeft, ArrowRight, ArrowUp, SquarePen } from "lucide-react";

import type { FlattenedSidebarEntry } from "@/components/sidebar.tsx";
import { routes } from "@/features/docs/manifest.ts";
import { withBase } from "@/lib/base-url.ts";

type Properties = {
  route: string;
  pages: FlattenedSidebarEntry[];
};

const getActiveIndex = (pages: FlattenedSidebarEntry[], route: string) => {
  return pages.findIndex((page) => page.href === route);
};

export default function PageFooter({ route, pages }: Properties) {
  const activeIndex = getActiveIndex(pages, route);
  const previous = activeIndex > 0 ? pages[activeIndex - 1] : undefined;
  const next =
    activeIndex >= 0 && activeIndex < pages.length - 1
      ? pages[activeIndex + 1]
      : undefined;
  const entry = routes.get(route);
  const editUrl = entry?.sourcePath
    ? `https://github.com/HealthSamurai/formbox-renderer/edit/master/${entry.sourcePath}`
    : undefined;

  return (
    <div className="mt-16">
      <div className="mb-6 flex w-full items-center justify-between">
        <div className="w-fit">
          {editUrl ? (
            <a
              href={editUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary text-sm font-semibold"
            >
              <div className="flex items-center gap-2">
                <SquarePen className="size-4" />
                Edit this page
              </div>
            </a>
          ) : undefined}
        </div>
        <div className="w-fit">
          <button
            type="button"
            className="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold text-primary transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            onClick={() =>
              globalThis.window?.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <div className="flex items-center gap-2">
              <ArrowUp className="size-4" />
              Back to Top
            </div>
          </button>
        </div>
      </div>
      {previous || next ? (
        <div className="border-t pt-6 lg:flex lg:flex-row">
          {previous ? (
            <a href={withBase(previous.href)} className="basis-1/3">
              <div className="hover:bg-muted/50 mb-4 space-y-2 rounded-lg border p-4 transition-all">
                <div className="flex flex-row gap-3">
                  <div className="flex size-6 min-w-6">
                    <ArrowLeft className="mx-auto size-5 self-center" />
                  </div>
                  <span className="w-full space-y-2 self-center text-left">
                    <div className="text-lg font-semibold">
                      {previous.label}
                    </div>
                  </span>
                </div>
              </div>
            </a>
          ) : undefined}
          <span className="flex-1" />
          {next ? (
            <a href={withBase(next.href)} className="basis-1/3">
              <div className="hover:bg-muted/50 mb-4 space-y-2 rounded-lg border p-4 transition-all">
                <div className="flex flex-row gap-3">
                  <span className="w-full space-y-2 self-center text-right">
                    <div className="text-lg font-semibold">{next.label}</div>
                  </span>
                  <div className="ml-auto flex size-6 min-w-6">
                    <ArrowRight className="mx-auto size-5 self-center" />
                  </div>
                </div>
              </div>
            </a>
          ) : undefined}
        </div>
      ) : undefined}
    </div>
  );
}
