import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@aidbox-forms/renderer/ui/theme.tsx";
import type { Theme } from "@aidbox-forms/theme";
import type { ComponentType, PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import "./preview.css";
import { theme as hsTheme } from "@aidbox-forms/hs-theme";
import antdThemeCssUrl from "../../themes/antd-theme/lib/style.css?url";
import hsThemeCssUrl from "../../themes/hs-theme/lib/style.css?url";
import mantineThemeCssUrl from "../../themes/mantine-theme/lib/style.css?url";
import nshukThemeCssUrl from "../../themes/nshuk-theme/lib/style.css?url";

type LoadedTheme = {
  theme: Theme;
  Provider?: ComponentType<PropsWithChildren> | undefined;
};

type ThemeDefinition = {
  title: string;
  packageName: string;
  themePath: string;
  css: string;
  load: () => Promise<LoadedTheme>;
};

export const themes = {
  antd: {
    title: "Ant Design",
    packageName: "@aidbox-forms/antd-theme",
    themePath: "themes/antd-theme/lib/theme.ts",
    css: antdThemeCssUrl,
    load: async () => {
      const module = await import("@aidbox-forms/antd-theme");
      return { theme: module.theme };
    },
  },
  hs: {
    title: "Health Samurai",
    packageName: "@aidbox-forms/hs-theme",
    themePath: "themes/hs-theme/lib/theme.ts",
    css: hsThemeCssUrl,
    load: async () => ({ theme: hsTheme }),
  },
  mantine: {
    title: "Mantine",
    packageName: "@aidbox-forms/mantine-theme",
    themePath: "themes/mantine-theme/lib/theme.ts",
    css: mantineThemeCssUrl,
    load: async () => {
      const module = await import("@aidbox-forms/mantine-theme");
      return { theme: module.theme, Provider: module.Provider };
    },
  },
  nshuk: {
    title: "National Health Service",
    packageName: "@aidbox-forms/nshuk-theme",
    themePath: "themes/nshuk-theme/lib/theme.ts",
    css: nshukThemeCssUrl,
    load: async () => {
      const module = await import("@aidbox-forms/nshuk-theme");
      return { theme: module.theme, Provider: module.Provider };
    },
  },
} satisfies Record<string, ThemeDefinition>;

type ThemeId = keyof typeof themes;
const defaultThemeId: ThemeId = "hs";

const themeCache = new Map<ThemeId, LoadedTheme>();

type LoadState =
  | { status: "idle"; value: LoadedTheme | undefined }
  | { status: "loading"; value: LoadedTheme | undefined }
  | { status: "loaded"; value: LoadedTheme }
  | { status: "error"; value: LoadedTheme | undefined; error: unknown };

async function loadTheme(themeId: ThemeId): Promise<LoadedTheme> {
  const cached = themeCache.get(themeId);
  if (cached) return cached;

  const loaded = await themes[themeId].load();
  themeCache.set(themeId, loaded);
  return loaded;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme applied to all stories",
      defaultValue: defaultThemeId,
      toolbar: {
        icon: "cog",
        items: Object.entries(themes).map(([id, { title }]) => ({
          value: id,
          title,
        })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const selectedTheme =
        (context.globals["theme"] as string | undefined) ?? defaultThemeId;
      const themeId = (
        selectedTheme in themes ? selectedTheme : defaultThemeId
      ) as ThemeId;

      useEffect(() => {
        const linkId = "aidbox-theme-css";
        let link = document.querySelector<HTMLLinkElement>(`#${linkId}`);
        if (!link) {
          link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          document.head.append(link);
        }
        link.dataset["theme"] = themeId;
        link.href = themes[themeId].css;
      }, [themeId]);

      const [state, setState] = useState<LoadState>(() => {
        const cached = themeCache.get(themeId);
        return cached
          ? { status: "loaded", value: cached }
          : { status: "idle", value: undefined };
      });

      useEffect(() => {
        let cancelled = false;

        const cached = themeCache.get(themeId);
        if (cached) {
          setState({ status: "loaded", value: cached });
          return () => {
            cancelled = true;
          };
        }

        setState((previous) => ({ status: "loading", value: previous.value }));

        loadTheme(themeId)
          .then((loaded) => {
            if (cancelled) return;
            setState({ status: "loaded", value: loaded });
          })
          .catch((error: unknown) => {
            if (cancelled) return;
            setState((previous) => ({
              status: "error",
              value: previous.value,
              error,
            }));
          });

        return () => {
          cancelled = true;
        };
      }, [themeId]);

      if (state.status === "error") {
        return (
          <div style={{ padding: 16 }}>
            Failed to load theme "{themeId}": {String(state.error)}
          </div>
        );
      }

      if (state.status !== "loaded") {
        return <div style={{ padding: 16 }}>Loading theme…</div>;
      }

      const story = (
        <ThemeProvider theme={state.value.theme}>
          <Story />
        </ThemeProvider>
      );

      const Provider = state.value.Provider;
      return Provider ? <Provider>{story}</Provider> : story;
    },
  ],
};

export default preview;
