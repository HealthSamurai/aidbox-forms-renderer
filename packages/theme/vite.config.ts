import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peerDependencies = Object.keys(pkg.peerDependencies ?? {});
const dependencies = Object.keys(pkg.dependencies ?? {});
const externalDeps = new Set([
  ...peerDependencies,
  ...dependencies,
  "react",
  "react-dom",
]);
const subpathMatchers = [...externalDeps]
  .filter((dep) => !dep.includes("/"))
  .map((dep) => new RegExp(`^${dep}/`));
const rollupExternal = [
  ...externalDeps,
  "react/jsx-runtime",
  ...subpathMatchers,
];
const typescriptCompilerFolder = resolve(
  __dirname,
  "../../node_modules/typescript",
);

export default defineConfig(() => {
  return {
    plugins: [
      dts({
        rollupTypes: true,
        tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
        rollupOptions: {
          typescriptCompilerFolder,
        },
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, "lib/index.ts"),
        fileName: "index",
        formats: ["es"],
      },
      rollupOptions: {
        external: rollupExternal,
      },
      copyPublicDir: false,
      minify: false,
    },
  };
});
