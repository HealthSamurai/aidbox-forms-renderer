import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@formbox/theme": path.resolve(__dirname, "../packages/theme/lib"),
      "@formbox/hs-theme": path.resolve(__dirname, "../themes/hs-theme/lib"),
      "@formbox/renderer": path.resolve(__dirname, "../packages/renderer/lib"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "test/setup.ts")],
    silent: "passed-only",
  },
});
