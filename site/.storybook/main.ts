import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import linaria from "@wyw-in-js/vite";
import type { Alias, AliasOptions } from "vite";
import tsconfig from "../../tsconfig.base.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type ViteAliasEntry = Alias;

const escapeRegExp = (value: string) =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const getRepositoryRootDirectory = (currentFileDirectory: string) =>
  path.resolve(currentFileDirectory, "..", "..");

const getTsconfigPathEntries = (): Array<[string, string[] | undefined]> =>
  Object.entries(
    (tsconfig.compilerOptions?.paths ?? {}) as Record<string, string[]>,
  );

const buildExactAliasesForNonWildcardTsconfigPaths = (
  pathEntries: Array<[string, string[] | undefined]>,
  rootDirectory: string,
) =>
  pathEntries.reduce<Record<string, string>>((aliases, [key, paths]) => {
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

const buildWildcardAliasEntriesForTsconfigPaths = (
  pathEntries: Array<[string, string[] | undefined]>,
  rootDirectory: string,
): ViteAliasEntry[] =>
  pathEntries.flatMap(([key, paths]) => {
    if (!key.includes("*")) {
      return [];
    }
    const [firstPath] = paths ?? [];
    if (!firstPath) {
      return [];
    }
    const find = new RegExp(
      `^${escapeRegExp(key).replaceAll(String.raw`\*`, "(.*)")}$`,
    );
    const replacement = path.resolve(
      rootDirectory,
      firstPath.replaceAll("*", "$1"),
    );
    return [{ find, replacement }];
  });

const buildThemePackageNameSetFromExactAliases = (
  exactPathAliases: Record<string, string>,
) =>
  new Set(
    Object.keys(exactPathAliases).filter((key) => key.endsWith("-theme")),
  );

const buildViteAliasEntriesForThemePackageImports = (
  themePackageNames: Set<string>,
  exactPathAliases: Record<string, string>,
): ViteAliasEntry[] =>
  [...themePackageNames].map((packageName) => {
    const themeBasePath = exactPathAliases[packageName];
    const themePath = themeBasePath.endsWith(".ts")
      ? themeBasePath
      : path.resolve(themeBasePath, "theme.ts");
    return {
      find: new RegExp(`^${escapeRegExp(packageName)}$`),
      replacement: themePath,
    };
  });

const normalizeExistingViteAliasEntries = (
  existingAliases: AliasOptions | undefined,
): ViteAliasEntry[] =>
  Array.isArray(existingAliases)
    ? [...existingAliases]
    : Object.entries(existingAliases ?? {}).map(([find, replacement]) => ({
        find,
        replacement,
      }));

const buildViteAliasEntriesForNonThemeExactPaths = (
  exactPathAliases: Record<string, string>,
  themePackageNames: Set<string>,
): ViteAliasEntry[] =>
  Object.entries(exactPathAliases)
    .filter(([key]) => !themePackageNames.has(key))
    .map(([find, replacement]) => ({ find, replacement }));

const buildLocalSourceAliasEntry = (
  currentFileDirectory: string,
): ViteAliasEntry => ({
  find: "@",
  replacement: path.resolve(currentFileDirectory, "../src"),
});

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const rootDirectory = getRepositoryRootDirectory(__dirname);
    const pathEntries = getTsconfigPathEntries();
    const exactPathAliases = buildExactAliasesForNonWildcardTsconfigPaths(
      pathEntries,
      rootDirectory,
    );
    const wildcardAliases = buildWildcardAliasEntriesForTsconfigPaths(
      pathEntries,
      rootDirectory,
    );

    config.resolve = config.resolve ?? {};
    const themePackageNames =
      buildThemePackageNameSetFromExactAliases(exactPathAliases);
    const themeAliases = buildViteAliasEntriesForThemePackageImports(
      themePackageNames,
      exactPathAliases,
    );
    const existingAliases = normalizeExistingViteAliasEntries(
      config.resolve.alias,
    );
    const pathAliasEntries = buildViteAliasEntriesForNonThemeExactPaths(
      exactPathAliases,
      themePackageNames,
    );
    const localAlias = buildLocalSourceAliasEntry(__dirname);

    config.resolve.alias = [
      ...themeAliases,
      ...existingAliases,
      ...pathAliasEntries,
      ...wildcardAliases,
      localAlias,
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
