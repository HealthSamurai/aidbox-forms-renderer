import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateSourceDirectory = path.resolve(__dirname, "lib/templates");
const templateDistributionDirectory = path.resolve(__dirname, "dist/templates");
const sourceAliases = [
  {
    find: "@formbox/renderer",
    replacement: path.resolve(__dirname, "../renderer/lib/index.tsx"),
  },
  {
    find: "@formbox/theme",
    replacement: path.resolve(__dirname, "../theme/lib/index.ts"),
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

function copyTemplateFiles(): Plugin {
  return {
    name: "copy-htmx-template-files",
    apply: "build",
    async closeBundle() {
      await fs.rm(templateDistributionDirectory, {
        recursive: true,
        force: true,
      });
      await fs.cp(templateSourceDirectory, templateDistributionDirectory, {
        recursive: true,
      });
    },
  };
}

export default defineConfig({
  plugins: [
    dts({
      pathsToAliases: false,
      aliasesExclude: [
        /^@formbox\/theme$/,
        /^mobx-react-lite$/,
        /^react(?:\/.*)?$/,
      ],
      bundledPackages: ["@formbox/theme"],
      rollupTypes: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.lib.json"),
    }),
    copyTemplateFiles(),
  ],
  resolve: {
    alias: sourceAliases,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@formbox/fhir",
        "@formbox/strings",
        "handlebars",
        "mobx",
        "mobx-utils",
        "preact",
        "preact/compat",
        "preact/jsx-runtime",
        "preact/jsx-dev-runtime",
        "preact-render-to-string",
        /^node:/,
      ],
    },
    copyPublicDir: false,
    minify: false,
  },
});
