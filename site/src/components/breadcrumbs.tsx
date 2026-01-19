import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

import type { FlattenedSidebarEntry } from "@/components/sidebar.tsx";
import { withBase } from "@/lib/base-url.ts";
import { cn } from "@/lib/utilities.ts";

type Properties = {
  route: string;
  pages: FlattenedSidebarEntry[];
};

export default function Breadcrumbs({ route, pages }: Properties) {
  const page = pages.find((item) => item.href === route);
  const items: { label: string; href: string | undefined }[] = [];

  if (page?.sectionLabel) {
    items.push({ label: page.sectionLabel, href: page.sectionHref });
  }
  if (page?.groupLabel) {
    const href =
      page.groupHref && page.groupHref !== route ? page.groupHref : undefined;
    items.push({ label: page.groupLabel, href });
  }
  if (page?.label && page?.label !== page.groupLabel) {
    items.push({ label: page.label, href: route });
  }

  if (items.length === 0) return;

  const lastIndex = items.length - 1;

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
        {items.map((item, index) => {
          const showSeparator = index < lastIndex;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="inline-flex items-center gap-1.5">
                {item.href ? (
                  <a
                    href={withBase(item.href)}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      index === lastIndex && "text-foreground",
                    )}
                    aria-current={index === lastIndex ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-foreground font-normal">
                    {item.label}
                  </span>
                )}
              </li>
              {showSeparator && (
                <li
                  role="presentation"
                  aria-hidden="true"
                  className="[&>svg]:h-3.5 [&>svg]:w-3.5"
                >
                  <ChevronRight className="size-3.5" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
