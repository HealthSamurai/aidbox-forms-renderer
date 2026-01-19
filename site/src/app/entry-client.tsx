import { createRoot, hydrateRoot } from "react-dom/client";

import { resolveRoute } from "./router.tsx";
import "../styles/app.css";

const rootElement = globalThis.document.querySelector("#root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const url = globalThis.location.pathname;
const { element, title } = await resolveRoute(url);

if (title && globalThis.document) {
  globalThis.document.title = title;
}

const hasMarkup = [...rootElement.childNodes].some((node) => {
  if (node.nodeType === globalThis.Node.ELEMENT_NODE) return true;
  if (node.nodeType === globalThis.Node.TEXT_NODE) {
    return Boolean(node.textContent?.trim());
  }
  return false;
});

if (hasMarkup) {
  hydrateRoot(rootElement, element);
} else {
  createRoot(rootElement).render(element);
}
