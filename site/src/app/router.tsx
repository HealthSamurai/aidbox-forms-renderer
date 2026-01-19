import type { ReactElement } from "react";

import Landing from "../pages/landing.tsx";
import DocumentPage from "../features/docs/page.tsx";
import Themes from "../features/docs/themes.tsx";
import DocumentationIndex from "../features/docs/index.tsx";
import Layout from "../features/docs/layout.tsx";
import Shell from "../components/shell.tsx";
import { flattenedSidebar, routes } from "../features/docs/manifest.ts";
import { stripBase } from "../lib/base-url.ts";

type RouteResult = {
  element: ReactElement;
  title: string;
};

const normalizeRoute = (value: string) => {
  if (!value.startsWith("/")) {
    value = `/${value}`;
  }
  if (value === "/") return value;
  return value.endsWith("/") ? value : `${value}/`;
};

const NotFound = ({ title }: { title: string }) => (
  <Shell title={title}>
    <div
      id="content"
      className="flex h-[calc(100vh-3.5rem)] items-center justify-center"
    >
      <h3 className="scroll-m-20 border-r px-4 py-3 text-2xl font-semibold">
        404
      </h3>
      <span className="scroll-m-20 px-4">This page could not be found.</span>
    </div>
  </Shell>
);

export const getRoutes = () => [
  "/",
  "/docs/",
  "/docs/themes/",
  ...routes.keys(),
];

export const resolveRoute = async (url: string): Promise<RouteResult> => {
  const pathname = normalizeRoute(
    stripBase(new URL(url, "http://localhost").pathname),
  );

  if (pathname.startsWith("/docs/")) {
    if (pathname === "/docs/") {
      return {
        element: (
          <Layout
            title="Aidbox Docs"
            activeRoute={pathname}
            pages={flattenedSidebar}
          >
            <DocumentationIndex />
          </Layout>
        ),
        title: "Aidbox Docs",
      };
    }

    if (pathname === "/docs/themes/") {
      return {
        element: (
          <Layout
            title="Themes"
            activeRoute={pathname}
            pages={flattenedSidebar}
          >
            <Themes />
          </Layout>
        ),
        title: "Themes - Aidbox Docs",
      };
    }

    const entry = routes.get(pathname);
    if (!entry) {
      return {
        element: <NotFound title="Docs · Not Found" />,
        title: "Docs · Not Found",
      };
    }

    const module = await entry.load();
    const Content = module.default;

    return {
      element: (
        <Layout
          title={entry.title}
          activeRoute={pathname}
          pages={flattenedSidebar}
        >
          <DocumentPage
            title={entry.title}
            description={entry.description}
            route={pathname}
            pages={flattenedSidebar}
          >
            <Content />
          </DocumentPage>
        </Layout>
      ),
      title: `${entry.title} - Aidbox Docs`,
    };
  }

  if (pathname !== "/") {
    return {
      element: <NotFound title="Not Found" />,
      title: "Not Found",
    };
  }

  return {
    element: <Landing />,
    title: "Aidbox Forms Renderer",
  };
};
