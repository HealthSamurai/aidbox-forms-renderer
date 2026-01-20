import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDirectory = path.resolve(__dirname, "..");
const distributionDirectory = path.join(siteDirectory, "dist");
const clientDirectory = distributionDirectory;
const serverDirectory = path.join(distributionDirectory, "server");
let serverEntry = path.join(serverDirectory, "entry-server.js");

try {
  await fs.access(serverEntry);
} catch {
  const entries = await fs.readdir(serverDirectory);
  const match = entries.find(
    (file) => file.startsWith("entry-server") && file.endsWith(".js"),
  );
  if (!match) {
    throw new Error("SSR entry not found in dist/server.");
  }
  serverEntry = path.join(serverDirectory, match);
}

const template = await fs.readFile(
  path.join(clientDirectory, "index.html"),
  "utf8",
);
const { render, prerenderRoutes } = await import(
  pathToFileURL(serverEntry).href
);

const routes =
  typeof prerenderRoutes === "function" ? prerenderRoutes() : ["/"];

const normalizeRoute = (value) => {
  if (!value.startsWith("/")) {
    value = `/${value}`;
  }
  if (value === "/") return value;
  return value.endsWith("/") ? value : `${value}/`;
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

for (const route of routes) {
  const normalizedRoute = normalizeRoute(route);
  const { appHtml, title } = await render(normalizedRoute);
  const resolvedTitle = title && title.trim() ? title : "Formbox Renderer";
  const withAppHtml = template.includes("<!--app-html-->")
    ? template.replace("<!--app-html-->", appHtml)
    : template.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`,
      );
  const html = withAppHtml.replace(
    /<title>.*?<\/title>/s,
    `<title>${escapeHtml(resolvedTitle)}</title>`,
  );

  const outputPath =
    normalizedRoute === "/"
      ? path.join(clientDirectory, "index.html")
      : path.join(clientDirectory, normalizedRoute.slice(1), "index.html");

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, "utf8");
}
