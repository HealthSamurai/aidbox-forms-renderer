import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { patchCssModules } from "vite-css-modules";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "./package.json";
import crypto from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peerDependencies = Object.keys(pkg.peerDependencies || {});
const externalDeps = new Set([...peerDependencies, "react", "react-dom"]);
const subpathMatchers = [...externalDeps]
  .filter((dep) => !dep.includes("/"))
  .map((dep) => new RegExp(`^${dep}/`));
const rollupExternal = [
  ...externalDeps,
  "react/jsx-runtime",
  ...subpathMatchers,
];
const typescriptCompilerFolder = resolve(__dirname, "node_modules/typescript");

const isBuildApp = process.env.BUILD_TARGET === "app";

function generateScopedName(
  command: string,
  className: string,
  file: string,
): string {
  const fileName = basename(file.split("?", 2)[0], ".module.css")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();

  if (command === "build") {
    const hash = crypto
      .createHash("sha1")
      .update(`${fileName}_${className}`)
      .digest("hex")
      .substring(0, 6);

    return `fpe_${hash}`;
  } else {
    return `${fileName}_${className}`;
  }
}

export default defineConfig(({ command }) => {
  const baseConfig = {
    plugins: [
      react(),
      patchCssModules({
        generateSourceTypes: true,
      }),
      dts({
        rollupTypes: true,
        tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
        rollupOptions: {
          typescriptCompilerFolder,
        },
      }),
    ],
    css: {
      modules: {
        generateScopedName: generateScopedName.bind(null, command),
      },
    },
  };

  if (!isBuildApp) {
    return {
      ...baseConfig,
      build: {
        lib: {
          entry: resolve(__dirname, "lib/index.tsx"),
          fileName: "index",
          formats: ["es"],
        },
        rollupOptions: {
          external: rollupExternal,
        },
        copyPublicDir: false,
      },
    };
  }
  return baseConfig;
});
