import {
  BookOpen,
  ChevronDown,
  HeartPulse,
  LayoutGrid,
  List,
  Paintbrush2,
  Palette,
  Rocket,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { withBase } from "@/lib/base-url.ts";
import { cn } from "@/lib/utilities.ts";

export type SidebarPage = {
  label: string;
  href: string;
  matchPrefix: boolean;
  order: number | undefined;
  icon: string | undefined;
};

export type SidebarGroup = {
  label: string;
  href: string | undefined;
  pages: SidebarPage[];
  icon: string | undefined;
};

export type SidebarSection = {
  label: string;
  href: string | undefined;
  groups: SidebarGroup[];
  icon: string | undefined;
};

export type FlattenedSidebarEntry = SidebarPage & {
  sectionLabel: string;
  sectionHref: string | undefined;
  groupLabel: string;
  groupHref: string | undefined;
};

const isPageActive = (
  activeRoute: string | undefined,
  href: string,
  matchPrefix: boolean,
) => {
  return matchPrefix ? activeRoute?.startsWith(href) : activeRoute === href;
};

const getSectionHref = (section: SidebarSection) => {
  return (
    section.href ??
    section.groups.find((group) => group.href)?.href ??
    section.groups.flatMap((group) => group.pages)[0]?.href ??
    "/docs/"
  );
};

const getActiveSection = (
  sidebar: SidebarSection[],
  activeRoute: string | undefined,
) => {
  return (
    sidebar.find((section) =>
      activeRoute
        ? activeRoute.startsWith(getSectionHref(section)) ||
          section.groups.some((group) =>
            group.pages.some((page) =>
              isPageActive(activeRoute, page.href, page.matchPrefix),
            ),
          )
        : false,
    ) ?? sidebar[0]
  );
};

type Properties = {
  sidebar: SidebarSection[];
  activeRoute: string | undefined;
  onNavigate?: () => void;
};

export default function Sidebar({
  sidebar,
  activeRoute,
  onNavigate,
}: Properties) {
  const activeSection = getActiveSection(sidebar, activeRoute);
  const iconRegistry: Record<string, typeof Rocket> = {
    rocket: Rocket,
    palette: Palette,
    paintbrush: Paintbrush2,
    "book-open": BookOpen,
    settings: Settings,
    list: List,
    "layout-grid": LayoutGrid,
    "heart-pulse": HeartPulse,
    sparkles: Sparkles,
    shield: Shield,
  };
  const getIcon = (icon: string | undefined) =>
    icon ? iconRegistry[icon] : undefined;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const autoOpenGroups = useMemo(() => {
    const nextState: Record<string, boolean> = {};
    activeSection?.groups.forEach((group) => {
      if (!group.label) return;
      const isGroupActive = group.pages.some((page) =>
        isPageActive(activeRoute, page.href, page.matchPrefix),
      );
      if (isGroupActive) {
        nextState[group.label] = true;
      }
    });
    return nextState;
  }, [activeRoute, activeSection]);

  if (!activeSection) return;

  return (
    <>
      <ul className="flex flex-col gap-1 border-b pb-4">
        {sidebar.map((section) => {
          const href = getSectionHref(section);
          const isActive = activeRoute === href;
          const Icon = getIcon(section.icon);
          return (
            <li key={section.label}>
              <a
                href={withBase(href)}
                onClick={onNavigate}
                className={cn(
                  "text-foreground/80 hover:bg-muted hover:text-primary flex h-8 items-center gap-2 rounded-md p-2 text-sm",
                  isActive && "bg-muted !text-primary font-medium",
                )}
              >
                {Icon ? <Icon className="size-4 self-center" /> : undefined}
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
      <ul className="flex flex-col gap-1 py-1 pt-4">
        {activeSection.groups.map((group) => {
          if (!group.label) {
            return group.pages.map((item) => {
              const isActive = isPageActive(
                activeRoute,
                item.href,
                item.matchPrefix,
              );
              const Icon = getIcon(item.icon);
              return (
                <li key={item.href}>
                  <a
                    href={withBase(item.href)}
                    onClick={onNavigate}
                    className={cn(
                      "text-foreground/80 hover:bg-muted hover:text-primary flex h-8 items-center gap-2 rounded-md p-2 text-sm",
                      isActive && "bg-muted !text-primary font-medium",
                    )}
                  >
                    {Icon ? (
                      <Icon className="min-w-4 self-center" size={16} />
                    ) : undefined}
                    <span className="truncate text-nowrap">{item.label}</span>
                  </a>
                </li>
              );
            });
          }

          const Icon = getIcon(group.icon);
          const isOpen =
            openGroups[group.label] ?? autoOpenGroups[group.label] ?? false;

          return (
            <li key={group.label}>
              <div>
                <button
                  type="button"
                  className="text-foreground/80 hover:bg-muted hover:text-primary flex h-8 w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left text-sm"
                  onClick={() =>
                    setOpenGroups((previous) => ({
                      ...previous,
                      [group.label]: !(previous[group.label] ?? false),
                    }))
                  }
                >
                  {Icon ? (
                    <Icon className="min-w-4 self-center" size={16} />
                  ) : undefined}
                  <span className="truncate text-nowrap">{group.label}</span>
                  <ChevronDown
                    className={cn(
                      "ml-auto transition-transform",
                      !isOpen && "-rotate-90",
                    )}
                    size={16}
                  />
                </button>
                <div style={isOpen ? undefined : { display: "none" }}>
                  <ul className="mx-3.5 flex flex-col gap-1 border-l px-2.5 py-1">
                    {group.pages.map((item) => {
                      const isActive = isPageActive(
                        activeRoute,
                        item.href,
                        item.matchPrefix,
                      );
                      const PageIcon = getIcon(item.icon);
                      return (
                        <li key={item.href}>
                          <a
                            href={withBase(item.href)}
                            onClick={onNavigate}
                            className={cn(
                              "text-foreground/80 hover:bg-muted hover:text-primary flex h-8 items-center gap-2 rounded-md p-2 text-sm",
                              isActive && "bg-muted !text-primary font-medium",
                            )}
                          >
                            {PageIcon ? (
                              <PageIcon
                                className="min-w-4 self-center"
                                size={16}
                              />
                            ) : undefined}
                            <span className="truncate text-nowrap">
                              {item.label}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
