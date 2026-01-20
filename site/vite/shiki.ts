import { parse } from "@babel/parser";
import generatorModule from "@babel/generator";
import traverseModule from "@babel/traverse";
import * as t from "@babel/types";
import dedent from "dedent";
import type { Plugin } from "vite";

import { DOCS_CODE_THEME } from "./theme.ts";

type HtmlNode = {
  properties?: Record<string, unknown>;
};

type CodeBlockEntry = {
  path: import("@babel/traverse").NodePath<t.JSXElement>;
  code: string;
  language: string;
};

const traverse =
  (
    traverseModule as typeof traverseModule & {
      default?: typeof traverseModule;
    }
  ).default ?? traverseModule;
const generate =
  (
    generatorModule as typeof generatorModule & {
      default?: typeof generatorModule;
    }
  ).default ?? generatorModule;

const stripPreStyles = {
  pre(node: HtmlNode) {
    const properties = node.properties;
    if (properties) {
      delete properties["style"];
    }
  },
};

const extractStaticString = (
  value: t.JSXAttribute["value"],
): string | undefined => {
  if (!value) return undefined;
  if (t.isStringLiteral(value)) {
    return dedent(value.value).trim();
  }
  if (t.isJSXExpressionContainer(value)) {
    const expression = value.expression;
    if (t.isStringLiteral(expression)) {
      return dedent(expression.value).trim();
    }
    if (t.isTemplateLiteral(expression)) {
      if (expression.expressions.length > 0) return undefined;
      const text = expression.quasis
        .map((quasi) => quasi.value.cooked ?? quasi.value.raw ?? "")
        .join("");
      return dedent(text).trim();
    }
  }
  return undefined;
};

const getCodeBlockEntries = (code: string) => {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
  const entries: CodeBlockEntry[] = [];

  traverse(ast, {
    JSXElement(path: import("@babel/traverse").NodePath<t.JSXElement>) {
      const opening = path.node.openingElement;
      if (
        !t.isJSXIdentifier(opening.name) ||
        opening.name.name !== "CodeBlock"
      ) {
        return;
      }

      const languageAttribute = opening.attributes.find(
        (attribute): attribute is t.JSXAttribute =>
          t.isJSXAttribute(attribute) &&
          t.isJSXIdentifier(attribute.name) &&
          (attribute.name.name === "language" ||
            attribute.name.name === "lang"),
      );
      const codeAttribute = opening.attributes.find(
        (attribute): attribute is t.JSXAttribute =>
          t.isJSXAttribute(attribute) &&
          t.isJSXIdentifier(attribute.name) &&
          attribute.name.name === "code",
      );

      const language = languageAttribute
        ? extractStaticString(languageAttribute.value)
        : undefined;
      const snippet = codeAttribute
        ? extractStaticString(codeAttribute.value)
        : undefined;

      if (!language || !snippet) return;

      entries.push({ path, code: snippet, language });
    },
  });

  return { ast, entries };
};

const createHighlighter = async (languages: string[]) => {
  const { createHighlighter } = await import("shiki");
  return createHighlighter({
    themes: [DOCS_CODE_THEME],
    langs: languages,
  });
};

export const shiki = (): Plugin => {
  return {
    name: "formbox-code-blocks",
    enforce: "pre",
    async transform(source, id) {
      const cleanId = id.split("?", 1)[0];
      if (!cleanId.endsWith(".tsx")) return;
      if (!source.includes("CodeBlock")) return;

      const { ast, entries } = getCodeBlockEntries(source);
      if (entries.length === 0) return;

      const languages = [...new Set(entries.map((entry) => entry.language))];
      const highlighter = await createHighlighter(languages);

      for (const entry of entries) {
        const html = highlighter.codeToHtml(entry.code, {
          lang: entry.language,
          theme: DOCS_CODE_THEME,
          transformers: [stripPreStyles],
        });
        const opening = entry.path.node.openingElement;
        opening.attributes = opening.attributes.filter(
          (attribute: t.JSXAttribute | t.JSXSpreadAttribute) => {
            if (
              !t.isJSXAttribute(attribute) ||
              !t.isJSXIdentifier(attribute.name)
            ) {
              return true;
            }
            return (
              attribute.name.name !== "code" &&
              attribute.name.name !== "language" &&
              attribute.name.name !== "lang"
            );
          },
        );
        opening.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("html"),
            t.jsxExpressionContainer(t.stringLiteral(html)),
          ),
        );
        opening.selfClosing = true;
        entry.path.node.children = [];
      }

      const output = generate(ast, { retainLines: true }, source);
      return {
        code: output.code,
        map: output.map,
      };
    },
  };
};
