import { renderToString } from "react-dom/server";

import { resolveRoute } from "./router.tsx";

export { getRoutes as prerenderRoutes } from "./router.tsx";

export async function render(url: string) {
  const { element, title } = await resolveRoute(url);
  const appHtml = renderToString(element);

  return { appHtml, title };
}
