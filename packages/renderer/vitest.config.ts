import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@aidbox-forms/theme": path.resolve(__dirname, "../theme/lib"),
      "@aidbox-forms/hs-theme": path.resolve(
        __dirname,
        "../../themes/hs-theme/lib",
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "lib/__tests__/setup-tests.ts")],
    silent: "passed-only",
  },
});
