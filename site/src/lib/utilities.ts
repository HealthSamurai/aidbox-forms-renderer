import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

type ClassValue = Parameters<typeof classNames>[number];

export function cn(...inputs: ClassValue[]) {
  return twMerge(classNames(...inputs));
}

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, "")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-");
};

const extractText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => extractText(child)).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    const element = node as { props?: { children?: ReactNode } };
    return extractText(element.props?.children);
  }
  return "";
};

export const resolveHeadingId = (
  rawId: string | undefined,
  fallback?: ReactNode,
) => {
  const normalized = rawId?.trim() ?? "";
  if (normalized) return normalized;
  const text = fallback ? extractText(fallback) : "";
  const candidate = slugify(text);
  return candidate.length > 0 ? candidate : undefined;
};
