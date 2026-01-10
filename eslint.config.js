import storybook from "eslint-plugin-storybook";
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";

const tsconfigRootDirection = new URL("./", import.meta.url).pathname;

export default tseslint.config(
  { ignores: ["**/dist/**", "**/storybook-static/**"] },
  unicorn.configs["flat/recommended"],
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // "@typescript-eslint/no-unnecessary-condition": "error",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-nested-ternary": "off",
    },
  },
  {
    files: ["packages/renderer/lib/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./packages/renderer/tsconfig.lib.json"],
        tsconfigRootDir: tsconfigRootDirection,
      },
    },
    rules: {
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/]",
          message:
            "Renderer should not use DOM elements; use theme components instead.",
        },
        {
          selector: "JSXAttribute[name.name=/^(className|style)$/]",
          message:
            "Renderer should not set className/style; use theme components instead.",
        },
      ],
    },
  },
  storybook.configs["flat/recommended"],
);
