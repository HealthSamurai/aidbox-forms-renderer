import { Children, createElement } from "react";
import type { InputGroupProperties } from "@formbox/theme";

import { type InputGroupTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { InputGroupProvider, useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function InputGroup(properties: InputGroupProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const children = Children.toArray(properties.children);
  const renderedChildren = children
    .map((child, index) =>
      renderHtml(
        createElement(
          InputGroupProvider,
          { value: { size: children.length, index } },
          child,
        ),
      ),
    )
    .join("");

  return renderTemplate(templates.InputGroup, {
    spans: properties.spans,
    children: renderedChildren,
  } satisfies InputGroupTemplateProperties);
}
