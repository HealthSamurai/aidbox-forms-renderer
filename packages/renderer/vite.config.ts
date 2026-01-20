import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import package_ from "./package.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peerDependencies = Object.keys(package_.peerDependencies);

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.lib.json"),
      pathsToAliases: false,
      compilerOptions: {
        paths: {
          "@formbox/theme": ["packages/theme/lib"],
        },
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.tsx"),
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
