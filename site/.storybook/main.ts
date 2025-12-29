// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import linaria from "@wyw-in-js/vite";
import tsconfig from "../../tsconfig.base.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const rootDir = resolve(__dirname, "..", "..");

    const pathAliases = Object.entries(
      tsconfig.compilerOptions?.paths ?? {},
    ).reduce<Record<string, string>>((aliases, [key, paths]) => {
      if (key.includes("*")) {
        return aliases;
      }
      const [firstPath] = paths ?? [];
      if (!firstPath) {
        return aliases;
      }
      aliases[key] = resolve(rootDir, firstPath);
      return aliases;
    }, {});

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      ...pathAliases,
    };

    config.plugins = [
      ...(config.plugins ?? []),
      linaria({
        include: ["**/*.{ts,tsx,js,jsx}"],
        exclude: ["**/dist/**", "**/node_modules/**"],
        babelOptions: {
          parserOpts: {
            plugins: ["typescript", "jsx", "importAssertions"],
          },
        },
        ...(configType === "DEVELOPMENT"
          ? { classNameSlug: "[file]__[title]__[index]" }
          : {}),
      }),
    ];

    return config;
  },
};
export default config;
