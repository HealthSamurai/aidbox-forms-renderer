import "./questionnaire-addon.tsx";
import "./questionnaire-response-addon.tsx";
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import "./manager.css";

const theme = create({
  base: "light",
  brandTitle: "Aidbox Forms Renderer",
  brandUrl: "https://github.com/HealthSamurai/aidbox-forms-renderer",
  brandImage: "android-chrome-192x192.png",
  brandTarget: "_blank",
});

addons.setConfig({ theme });
