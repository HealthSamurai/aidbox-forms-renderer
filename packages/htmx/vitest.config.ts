import { configDefaults, defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceAliases = [
  {
    find: "@formbox/fhir",
    replacement: path.resolve(__dirname, "../fhir/lib"),
  },
  {
    find: "@formbox/renderer",
    replacement: path.resolve(__dirname, "../renderer/lib"),
  },
  {
    find: "@formbox/strings",
    replacement: path.resolve(__dirname, "../strings/lib"),
  },
  {
    find: "@formbox/theme",
    replacement: path.resolve(__dirname, "../theme/lib"),
  },
  {
    find: "mobx-react-lite",
    replacement: path.resolve(__dirname, "lib/preact-mobx-react-lite.ts"),
  },
  {
    find: "react/jsx-runtime",
    replacement: "preact/jsx-runtime",
  },
  {
    find: "react/jsx-dev-runtime",
    replacement: "preact/jsx-dev-runtime",
  },
  {
    find: "react",
    replacement: "preact/compat",
  },
];

export default defineConfig({
  resolve: {
    alias: sourceAliases,
    dedupe: ["preact"],
  },
  test: {
    environment: "node",
    exclude: [...configDefaults.exclude, "e2e/**"],
    silent: "passed-only",
  },
});
