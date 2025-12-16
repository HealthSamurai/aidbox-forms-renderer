import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peerDependencies = Object.keys(pkg.peerDependencies);

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
      pathsToAliases: false,
      compilerOptions: {
        paths: {
          "@aidbox-forms/theme": ["packages/theme/lib"],
        },
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.tsx"),
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react/jsx-runtime",
        ...peerDependencies,
        ...peerDependencies
          .filter((dep) => !dep.includes("/"))
          .map((dep) => new RegExp(`^${dep}/`)),
      ],
    },
    copyPublicDir: false,
  },
});
