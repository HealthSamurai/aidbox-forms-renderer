import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateSourceDirectory = path.resolve(__dirname, "lib/templates");
const templateDistributionDirectory = path.resolve(__dirname, "dist/templates");

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
      rollupTypes: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.lib.json"),
    }),
    copyTemplateFiles(),
  ],
  resolve: {
    alias: {
      "@formbox/renderer": path.resolve(__dirname, "../renderer/lib/index.tsx"),
    },
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
        "@formbox/theme",
        "handlebars",
        "mobx",
        "mobx-react-lite",
        "mobx-utils",
        "react",
        "react/jsx-runtime",
        "react-dom",
        /^react-dom\//,
        /^node:/,
      ],
    },
    copyPublicDir: false,
    minify: false,
  },
});
