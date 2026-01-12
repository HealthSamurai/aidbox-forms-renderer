import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@aidbox-forms/renderer/ui/theme.tsx";
import { useEffect } from "react";
import "./preview.css";
import { theme as antdTheme } from "@aidbox-forms/antd-theme";
import { theme as hsTheme } from "@aidbox-forms/hs-theme";
import { theme as nshukTheme } from "@aidbox-forms/nshuk-theme";
import antdThemeCssUrl from "../../themes/antd-theme/lib/style.css?url";
import hsThemeCssUrl from "../../themes/hs-theme/lib/style.css?url";
import nshukThemeCssUrl from "../../themes/nshuk-theme/lib/style.css?url";

export const themes = {
  antd: {
    title: "Ant Design",
    packageName: "@aidbox-forms/antd-theme",
    themePath: "themes/antd-theme/lib/theme.ts",
    css: antdThemeCssUrl,
    instance: antdTheme,
  },
  hs: {
    title: "Health Samurai",
    packageName: "@aidbox-forms/hs-theme",
    themePath: "themes/hs-theme/lib/theme.ts",
    css: hsThemeCssUrl,
    instance: hsTheme,
  },
  nshuk: {
    title: "National Health Service",
    packageName: "@aidbox-forms/nshuk-theme",
    themePath: "themes/nshuk-theme/lib/theme.ts",
    css: nshukThemeCssUrl,
    instance: nshukTheme,
  },
};

type ThemeId = keyof typeof themes;
const defaultThemeId = "hs";

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
      const selectedTheme = ((context.globals["theme"] as string | undefined) ??
        defaultThemeId) as ThemeId;
      const themeIds = new Set(Object.keys(themes));
      const theme = themeIds.has(selectedTheme)
        ? selectedTheme
        : defaultThemeId;

      useEffect(() => {
        const linkId = "aidbox-theme-css";
        let link = document.querySelector<HTMLLinkElement>(`#${linkId}`);
        if (!link) {
          link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          document.head.append(link);
        }
        link.dataset["theme"] = theme;
        link.href = themes[theme].css;
      }, [theme]);

      return (
        <ThemeProvider
          theme={
            theme ? themes[theme].instance : themes[defaultThemeId].instance
          }
        >
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
