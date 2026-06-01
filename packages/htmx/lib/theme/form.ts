import { useStrings } from "@formbox/renderer";
import type { FormProperties } from "@formbox/theme";

import {
  formFieldsTemplate,
  stableId,
  type FormTemplateProperties,
} from "../template.ts";
import { defaultAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Form(properties: FormProperties) {
  const { action, hiddenFields, templates, token } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const id = properties.id ?? token;
  const pagination = properties.pagination
    ? {
        current: properties.pagination.current,
        total: properties.pagination.total,
        disabledPrev: properties.pagination.disabledPrev,
        disabledNext: properties.pagination.disabledNext,
        nextId: stableId(id, "pagination", "next"),
        nextLabel: strings.pagination.next,
        previousId: stableId(id, "pagination", "previous"),
        previousLabel: strings.pagination.previous,
      }
    : undefined;
  const formProperties = {
    id,
    title: properties.title,
    description: properties.description,
    customExtensions: properties.customExtensions,
    after: renderHtml(properties.after),
    before: renderHtml(properties.before),
    children: renderHtml(properties.children),
    errors: renderHtml(properties.errors),
    languageSelector: renderHtml(properties.languageSelector),
    pagination,
    signature: renderHtml(properties.signature),
    submitLabel: strings.form.submit,
  } satisfies Omit<FormTemplateProperties, "attributes" | "fields">;
  const fields = [hiddenFields, formFieldsTemplate(formProperties)].join("");
  return renderTemplate(templates.Form, {
    ...formProperties,
    attributes: { id, ...defaultAttributes(action) },
    fields,
  } satisfies FormTemplateProperties);
}
