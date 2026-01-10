import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import package_ from "./package.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peerDependencies = Object.keys(package_.peerDependencies ?? {});
const dependencies = Object.keys(package_.dependencies ?? {});
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
const typescriptCompilerFolder = path.resolve(
  __dirname,
  "../../node_modules/typescript",
);

export default defineConfig(() => {
  return {
    plugins: [
      dts({
        rollupTypes: true,
        tsconfigPath: path.resolve(__dirname, "tsconfig.lib.json"),
        pathsToAliases: true,
        rollupOptions: {
          typescriptCompilerFolder,
        },
      }),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, "lib/index.ts"),
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
