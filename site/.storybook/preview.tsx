import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@aidbox-forms/renderer/ui/theme.tsx";
import { resolveTheme, type ThemeId } from "../stories/helpers.tsx";
import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme applied to all stories",
      defaultValue: "hs",
      toolbar: {
        icon: "cog",
        items: [
          { value: "hs", title: "Health Samurai" },
          { value: "nshuk", title: "National Health Service" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme =
        (context.globals["theme"] as ThemeId | undefined) ?? ("hs" as const);

      return (
        <ThemeProvider theme={resolveTheme(theme)}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
