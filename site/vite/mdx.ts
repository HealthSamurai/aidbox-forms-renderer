import init from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { Plugin } from "vite";
import { remarkDiagramCodeBlocks } from "./mermaid.ts";
import { DOCS_CODE_THEME } from "./theme.ts";

type MdxOptions = NonNullable<Parameters<typeof init>[0]>;

const remarkPlugins = [
  remarkGfm,
  remarkFrontmatter,
  [remarkMdxFrontmatter, { name: "frontmatter" }],
  remarkDiagramCodeBlocks,
] as unknown as NonNullable<MdxOptions["remarkPlugins"]>;

const rehypePlugins = [
  [rehypeShiki, { theme: DOCS_CODE_THEME }],
] as unknown as NonNullable<MdxOptions["rehypePlugins"]>;

export const mdx = (): Plugin =>
  init({
    providerImportSource: "@mdx-js/react",
    remarkPlugins,
    rehypePlugins,
  });
