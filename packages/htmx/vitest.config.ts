import { configDefaults, defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@formbox/fhir": path.resolve(__dirname, "../fhir/lib"),
      "@formbox/renderer": path.resolve(__dirname, "../renderer/lib"),
      "@formbox/strings": path.resolve(__dirname, "../strings/lib"),
      "@formbox/theme": path.resolve(__dirname, "../theme/lib"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "node",
    exclude: [...configDefaults.exclude, "e2e/**"],
    silent: "passed-only",
  },
});
