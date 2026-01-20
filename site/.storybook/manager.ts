import "./questionnaire-addon.tsx";
import "./questionnaire-response-addon.tsx";
import { addons, types } from "storybook/manager-api";
import { create } from "storybook/theming";
import "./manager.css";

const theme = create({
  base: "light",
  brandTitle: "Formbox Renderer",
  brandUrl: "https://github.com/HealthSamurai/formbox-renderer",
  brandImage: "android-chrome-192x192.png",
  brandTarget: "_blank",
});

addons.setConfig({ theme });

const panelOrder = [
  "addon-controls",
  "formbox/questionnaire/panel",
  "formbox/questionnaire-response/panel",
];

function reorderAddonPanels() {
  const panels = addons.getElements(types.PANEL);
  if (!panels || Object.keys(panels).length === 0) {
    return false;
  }

  const orderedPanels: typeof panels = {};
  panelOrder.forEach((id) => {
    if (panels[id]) {
      orderedPanels[id] = panels[id];
    }
  });

  Object.keys(panels).forEach((id) => {
    if (!orderedPanels[id]) {
      orderedPanels[id] = panels[id];
    }
  });

  Object.keys(panels).forEach((id) => {
    delete panels[id];
  });
  Object.assign(panels, orderedPanels);

  return panelOrder.every((id) => !!orderedPanels[id]);
}

function ensurePanelOrder(attempt = 0) {
  const maxAttempts = 30;
  const delayMs = 50;

  const hasAll = reorderAddonPanels();
  if (hasAll || attempt >= maxAttempts) {
    return;
  }

  setTimeout(() => {
    ensurePanelOrder(attempt + 1);
  }, delayMs);
}

ensurePanelOrder();
