import type { ComponentType } from "react";

import type {
  FlattenedSidebarEntry,
  SidebarGroup,
  SidebarPage,
  SidebarSection,
} from "@/components/sidebar.tsx";

type Module = { default: ComponentType };
type Loader = () => Promise<Module>;
type Frontmatter = {
  title?: string;
  description?: string;
  order?: number;
  icon?: string;
};

const PATH_RE = /\/(packages|themes)\/([^/]+)\/(?:doc|docs)\/(.+)\.(md|mdx)$/i;

const modules = import.meta.glob<Module>(
  "../../../../{packages,themes}/*/{doc,docs}/**/*.{md,mdx}",
);
const frontmatterByPath = import.meta.glob<Frontmatter>(
  "../../../../{packages,themes}/*/{doc,docs}/**/*.{md,mdx}",
  {
    eager: true,
    import: "frontmatter",
  },
);

const toPosix = (value: string) => value.replaceAll("\\", "/");

export const routes = new Map<
  string,
  {
    title: string;
    description: string | undefined;
    load: Loader;
    sourcePath: string;
    icon: string | undefined;
  }
>();

const availableThemesRoute = "/docs/themes/";

const coreGroup: SidebarGroup = {
  label: "",
  pages: [],
  href: undefined,
  icon: undefined,
};
const availableThemesGroup: SidebarGroup = {
  label: "Available Themes",
  pages: [],
  href: availableThemesRoute,
  icon: "palette",
};
const themeBuilderGroup: SidebarGroup = {
  label: "Custom Theme",
  pages: [],
  href: undefined,
  icon: "paintbrush",
};

const sidebarTemplate: SidebarSection[] = [
  { label: "Core", groups: [coreGroup], href: undefined, icon: "rocket" },
  {
    label: "Themes",
    groups: [availableThemesGroup, themeBuilderGroup],
    href: undefined,
    icon: "palette",
  },
];

const comparePages = (left: SidebarPage, right: SidebarPage) => {
  const leftOrder = left.order ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.order ?? Number.POSITIVE_INFINITY;
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  return left.label.localeCompare(right.label, undefined, {
    sensitivity: "base",
  });
};

for (const [filePath, load] of Object.entries(modules)) {
  const normalized = toPosix(filePath);
  const match = PATH_RE.exec(normalized);
  if (!match) continue;

  const theme = match[1] === "themes";
  const packageName = match[2];
  const slug = match[3];
  const isIndex = slug.toLowerCase() === "index";
  const route = isIndex
    ? `/docs/${packageName}/`
    : `/docs/${packageName}/${slug}/`;

  const title = frontmatterByPath[filePath]?.title;
  if (!title) {
    throw new Error(`Missing frontmatter title for ${filePath}`);
  }
  const order = frontmatterByPath[filePath]?.order;

  const sourcePath = normalized.replace(/^(\.\.\/)+/, "");
  const entry = {
    title,
    description: frontmatterByPath[filePath]?.description,
    load,
    sourcePath,
    icon: frontmatterByPath[filePath]?.icon,
  };

  routes.set(route, entry);

  if (theme) {
    if (isIndex) {
      availableThemesGroup.pages.push({
        label: entry.title,
        href: route,
        matchPrefix: true,
        order,
        icon: entry.icon,
      });
    }
  } else if (packageName === "renderer") {
    coreGroup.pages.push({
      label: entry.title,
      href: route,
      matchPrefix: false,
      order,
      icon: entry.icon,
    });
  } else if (packageName === "theme") {
    if (isIndex) {
      themeBuilderGroup.href = route;
    }
    themeBuilderGroup.pages.push({
      label: entry.title,
      href: route,
      matchPrefix: false,
      order,
      icon: entry.icon,
    });
  }
}

coreGroup.pages.sort(comparePages);
availableThemesGroup.pages.sort(comparePages);
themeBuilderGroup.pages.sort(comparePages);

const resolveSectionHref = (section: SidebarSection) => {
  return (
    section.groups.find((group) => group.href)?.href ??
    section.groups.flatMap((group) => group.pages)[0]?.href
  );
};

export const sidebar = sidebarTemplate
  .map((section) => {
    const groups = section.groups.filter((group) => group.pages.length > 0);
    return {
      ...section,
      groups,
      href: resolveSectionHref({ ...section, groups }),
    };
  })
  .filter((section) => section.groups.length > 0);

export const flattenedSidebar: FlattenedSidebarEntry[] = sidebar.flatMap(
  (section) =>
    section.groups.flatMap((group) =>
      group.pages.map((page) => ({
        ...page,
        sectionLabel: section.label,
        sectionHref: section.href,
        groupLabel: group.label,
        groupHref: group.href,
      })),
    ),
);
