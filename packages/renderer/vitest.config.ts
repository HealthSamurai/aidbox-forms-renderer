import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@formbox/theme": path.resolve(__dirname, "../theme/lib"),
      "@formbox/hs-theme": path.resolve(__dirname, "../../themes/hs-theme/lib"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "lib/__tests__/setup-tests.ts")],
    silent: "passed-only",
  },
});
