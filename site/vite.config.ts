import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { shiki } from "./vite/shiki.ts";
import { mdx } from "./vite/mdx.ts";
import { getCodeBlockBackground } from "./vite/theme.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const mdxReactPath = require.resolve("@mdx-js/react");

export default defineConfig(async ({ mode, isSsrBuild }) => {
  const environment = loadEnv(mode, process.cwd(), "VITE_");
  return {
    base: environment["VITE_BASE_URL"] ?? "/",
    define: {
      __DOCS_CODE_BLOCK_BG__: JSON.stringify(await getCodeBlockBackground()),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@mdx-js/react": mdxReactPath,
      },
    },
    plugins: [shiki(), mdx(), react(), tailwind()],
    server: {
      host: "127.0.0.1",
      port: 5173,
      fs: {
        allow: [repoRoot],
      },
    },
    build: isSsrBuild
      ? {
          outDir: "dist/server",
          ssr: "src/app/entry-server.tsx",
        }
      : {
          outDir: "dist",
          rollupOptions: {
            input: path.resolve(__dirname, "index.html"),
          },
        },
  };
});
