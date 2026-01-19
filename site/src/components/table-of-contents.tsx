import { useEffect, useMemo, useState, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ChevronRight, CircleDot, Star } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utilities.ts";

type HeadingItem = {
  id: string;
  label: string;
  level: number;
};

type TocNode = HeadingItem & { children: TocNode[] };

type Properties = {
  contentId: string;
  activeRoute: string | undefined;
  isSmall?: boolean;
};

type TocLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const tocLinks: TocLink[] = [
  {
    label: "Star on GitHub",
    href: "https://github.com/HealthSamurai/aidbox-forms-renderer",
    icon: Star,
  },
  {
    label: "Create Issues",
    href: "https://github.com/HealthSamurai/aidbox-forms-renderer/issues",
    icon: CircleDot,
  },
];

const tocIconLinks: TocLink[] = [
  // {
  //   label: "GitHub",
  //   href: "https://github.com/HealthSamurai/aidbox-forms-renderer",
  //   icon: Github,
  // },
];

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, "")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-");
};

const ensureUniqueId = (value: string, usedIds: Set<string>) => {
  const baseId = slugify(value) || "section";
  let candidate = baseId;
  let index = 2;
  while (usedIds.has(candidate)) {
    candidate = `${baseId}-${index}`;
    index += 1;
  }
  usedIds.add(candidate);
  return candidate;
};

const collectHeadings = (container: HTMLElement) => {
  const headingNodes = [
    ...container.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4"),
  ];
  const usedIds = new Set<string>();

  return headingNodes.reduce<HeadingItem[]>((items, heading) => {
    const label = heading.textContent?.trim() ?? "";
    if (!label) return items;

    if (heading.id) {
      usedIds.add(heading.id);
    } else {
      heading.id = ensureUniqueId(label, usedIds);
    }

    const level = Number.parseInt(heading.tagName.slice(1), 10);
    items.push({ id: heading.id, label, level });
    return items;
  }, []);
};

const buildTree = (headings: HeadingItem[]) => {
  const root: TocNode[] = [];
  const stack: TocNode[] = [];

  headings.forEach((heading) => {
    const node: TocNode = { ...heading, children: [] };

    while (stack.length > 0 && (stack.at(-1)?.level ?? 0) >= heading.level) {
      stack.pop();
    }

    const parent = stack.at(-1);
    if (parent) {
      parent.children.push(node);
    } else {
      root.push(node);
    }

    stack.push(node);
  });

  return root;
};

const TocTree = ({
  nodes,
  activeIds,
  level,
  className,
  onNavigate,
}: {
  nodes: TocNode[];
  activeIds: string[];
  level: number;
  className?: string;
  onNavigate?: (id: string) => void;
}) => {
  return (
    <ul className={cn(level !== 0 && "pl-4", className)}>
      {nodes.map((node) => {
        const isActive = activeIds.includes(node.id);
        const showBar = level === 0 || isActive;
        const barPositionClass =
          level === 0 ? "left-0 md:left-[6px]" : "-left-4 md:left-[-10px]";
        return (
          <li
            key={node.id}
            className={cn(
              "relative py-1",
              level !== 0 && "[&:first-child]:pt-2 [&:last-child]:pb-0",
            )}
          >
            <div className="flex items-center">
              {showBar ? (
                <div
                  className={cn(
                    "absolute top-0 bottom-0 w-px transition-colors duration-300 ease-in-out",
                    barPositionClass,
                    level === 0
                      ? isActive
                        ? "bg-primary"
                        : "bg-border"
                      : "bg-primary",
                  )}
                />
              ) : undefined}
              <a
                href={`#${node.id}`}
                className={cn(
                  "text-muted-foreground hover:text-primary transition-all",
                  "pl-4.5 md:pl-5.5",
                  isActive && "text-primary",
                )}
                onClick={() => onNavigate?.(node.id)}
              >
                {node.label}
              </a>
            </div>
            {node.children.length > 0 ? (
              <TocTree
                nodes={node.children}
                activeIds={activeIds}
                level={level + 1}
                {...(onNavigate ? { onNavigate } : {})}
              />
            ) : undefined}
          </li>
        );
      })}
    </ul>
  );
};

export default function TableOfContents({
  contentId,
  activeRoute,
  isSmall,
}: Properties) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaReference = useRef<HTMLDivElement | null>(
    undefined as unknown as HTMLDivElement | null,
  );

  useEffect(() => {
    const documentReference = globalThis.document;
    if (!documentReference) return;

    const scheduleUpdate =
      globalThis.queueMicrotask ??
      ((callback: () => void) => globalThis.setTimeout(callback, 0));

    const container = documentReference.querySelector<HTMLElement>(
      `#${contentId}`,
    );
    if (!container) {
      scheduleUpdate(() => {
        setHeadings([]);
        setActiveIds([]);
      });
      return;
    }

    const items = collectHeadings(container);
    scheduleUpdate(() => {
      setHeadings(items);
      const firstItem = items.at(0);
      setActiveIds(firstItem ? [firstItem.id] : []);
    });

    if (items.length === 0 || !globalThis.IntersectionObserver) {
      return;
    }

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const headingId = entry.target.id;
          if (!headingId) return;
          if (entry.isIntersecting) {
            visibleIds.add(headingId);
          } else {
            visibleIds.delete(headingId);
          }
        });

        const nextActive = items
          .filter((item) => visibleIds.has(item.id))
          .map((item) => item.id);
        setActiveIds((previous) =>
          nextActive.length > 0 ? nextActive : previous,
        );
      },
      {
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0,
      },
    );

    items.forEach((item) => {
      const heading = documentReference.querySelector<HTMLElement>(
        `#${item.id}`,
      );
      if (heading) observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [contentId, activeRoute]);

  useEffect(() => {
    if (isSmall || activeIds.length === 0) return;
    const viewport = scrollAreaReference.current?.querySelector<HTMLElement>(
      "[data-radix-scroll-area-viewport]",
    );
    if (!viewport) return;
    const escapeSelector =
      typeof globalThis.CSS?.escape === "function"
        ? globalThis.CSS.escape
        : (value: string) => value.replaceAll(/["\\]/g, String.raw`\$&`);
    const padding = 16;
    const viewportRect = viewport.getBoundingClientRect();
    const target = activeIds
      .map((id) =>
        viewport.querySelector<HTMLElement>(`a[href="#${escapeSelector(id)}"]`),
      )
      .find((node) => {
        if (!node) return false;
        const rect = node.getBoundingClientRect();
        return (
          rect.top < viewportRect.top + padding ||
          rect.bottom > viewportRect.bottom - padding
        );
      });

    if (!target) return;
    const targetRect = target.getBoundingClientRect();
    if (targetRect.top < viewportRect.top + padding) {
      viewport.scrollBy({
        top: targetRect.top - viewportRect.top - padding,
        behavior: "smooth",
      });
      return;
    }
    if (targetRect.bottom > viewportRect.bottom - padding) {
      viewport.scrollBy({
        top: targetRect.bottom - viewportRect.bottom + padding,
        behavior: "smooth",
      });
    }
  }, [activeIds, isSmall]);

  const tree = useMemo(() => buildTree(headings), [headings]);

  if (headings.length === 0) return;

  if (isSmall) {
    return (
      <div className="block w-full text-sm lg:hidden">
        <button
          className="flex w-full px-4 md:px-8 py-3 text-left font-medium"
          type="button"
          onClick={() => setIsOpen((value) => !value)}
        >
          On this page
          <ChevronRight
            className={cn(
              "ml-auto self-center transition-all",
              isOpen && "rotate-90",
            )}
          />
        </button>
        {isOpen ? (
          <div className="mx-4 mb-3 pl-2 text-sm">
            <TocTree
              nodes={tree}
              activeIds={activeIds}
              level={0}
              onNavigate={(id) => setActiveIds([id])}
            />
          </div>
        ) : undefined}
      </div>
    );
  }

  return (
    <ScrollArea
      ref={scrollAreaReference}
      className="z-30 hidden overflow-y-auto md:block lg:block"
    >
      <div className="flex h-[calc(100vh-6.5rem)] flex-col gap-5">
        <div>
          <p className="mb-2 text-base font-semibold">On this page</p>
          <TocTree
            nodes={tree}
            activeIds={activeIds}
            level={0}
            className="border-b pb-5"
            onNavigate={(id) => setActiveIds([id])}
          />
        </div>
        {tocLinks.length > 0 ? (
          <div
            className={cn(
              "text-muted-foreground",
              tocIconLinks.length > 0 && "border-b pb-5",
            )}
          >
            {tocLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex w-full gap-1 underline-offset-4 hover:underline [&:not(:first-child)]:pt-3"
              >
                <link.icon className="mr-1 self-center size-4" />
                {link.label}
                <ArrowUpRight
                  className="text-muted-foreground ml-auto self-center"
                  size={13}
                />
              </a>
            ))}
          </div>
        ) : undefined}
        {tocIconLinks.length > 0 ? (
          <div className="text-muted-foreground">
            {tocIconLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <button className="ring-offset-background focus-visible:ring-ring inline-flex size-7 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                  <link.icon />
                </button>
              </a>
            ))}
          </div>
        ) : undefined}
        <div className="flex-grow" />
      </div>
    </ScrollArea>
  );
}
