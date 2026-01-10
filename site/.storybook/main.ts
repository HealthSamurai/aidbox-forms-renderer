// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import linaria from "@wyw-in-js/vite";
import tsconfig from "../../tsconfig.base.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const escapeRegExp = (value: string) =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const rootDirectory = path.resolve(__dirname, "..", "..");
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
      aliases[key] = path.resolve(rootDirectory, firstPath);
      return aliases;
    }, {});

    config.resolve = config.resolve ?? {};
    const themePackageNames = new Set(
      Object.keys(pathAliases).filter((key) => key.endsWith("-theme")),
    );
    const themeAliases = [...themePackageNames].map((packageName) => {
      const themeBasePath = pathAliases[packageName];
      const themePath = themeBasePath.endsWith(".ts")
        ? themeBasePath
        : path.resolve(themeBasePath, "theme.ts");
      return {
        find: new RegExp(`^${escapeRegExp(packageName)}$`),
        replacement: themePath,
      };
    });
    const existingAliases = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : Object.entries(config.resolve.alias ?? {}).map(
          ([find, replacement]) => ({
            find,
            replacement,
          }),
        );
    const pathAliasEntries = Object.entries(pathAliases)
      .filter(([key]) => !themePackageNames.has(key))
      .map(([find, replacement]) => ({ find, replacement }));

    config.resolve.alias = [
      ...themeAliases,
      ...existingAliases,
      ...pathAliasEntries,
    ];

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
