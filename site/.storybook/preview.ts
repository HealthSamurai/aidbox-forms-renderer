import type { Preview } from "@storybook/react-vite";
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
};

export default preview;
