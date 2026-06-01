import {
  createContext,
  createElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";

import type { NodePath } from "@formbox/theme";

import type {
  InputGroupState,
  RenderHtml,
  RequiredTemplates,
  Template,
  TemplateProperties,
} from "./template.ts";

export type ActiveTabValue = (path: NodePath, total: number) => number;

export type HtmxThemeValue = {
  readonly templates: RequiredTemplates;
  readonly token: string;
  readonly hiddenFields: string;
  readonly activeTabValue: ActiveTabValue;
  readonly action: string | undefined;
};

const HTML_TAG = "x-html";

const HtmxThemeContext = createContext<HtmxThemeValue | undefined>(undefined);
const HtmlContext = createContext<RenderHtml | undefined>(undefined);
const InputGroupContext = createContext<InputGroupState | undefined>(undefined);

export function HtmxThemeProvider({
  value,
  children,
}: {
  readonly value: HtmxThemeValue;
  readonly children?: ReactNode | undefined;
}) {
  return createElement(HtmxThemeContext.Provider, { value }, children);
}

export function HtmlProvider({
  renderHtml,
  children,
}: {
  readonly renderHtml: RenderHtml;
  readonly children?: ReactNode | undefined;
}) {
  return createElement(HtmlContext.Provider, { value: renderHtml }, children);
}

export function InputGroupProvider({
  value,
  children,
}: {
  readonly value: InputGroupState;
  readonly children?: ReactNode | undefined;
}) {
  return createElement(InputGroupContext.Provider, { value }, children);
}

export function useHtmxTheme(): HtmxThemeValue {
  const value = useContext(HtmxThemeContext);
  if (value === undefined) {
    throw new Error("HTMX theme context is required");
  }

  return value;
}

export function useHtml(): RenderHtml {
  return (
    useContext(HtmlContext) ??
    ((node) =>
      node === undefined || node === null || typeof node === "boolean"
        ? ""
        : String(node))
  );
}

export function useInputGroup(): InputGroupState | undefined {
  return useContext(InputGroupContext);
}

export function renderTemplate<TProperties extends TemplateProperties>(
  template: Template<TProperties>,
  properties: TProperties,
): ReactElement {
  return createElement(HTML_TAG, {
    dangerouslySetInnerHTML: { __html: template(properties) },
  });
}

export function stripHtmlTag(ssr: string): string {
  return ssr.replaceAll(/<x-html\b[^>]*>/gu, "").replaceAll("</x-html>", "");
}
