import { useStrings } from "@formbox/renderer";
import type { FormProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  formFieldsTemplate,
  pageHiddenField,
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
  const submitLabel = strings.form.submit;
  const children = renderHtml(properties.children);
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
  const titleHtml = properties.title
    ? templates.FormTitle({ title: properties.title })
    : undefined;
  const descriptionHtml = properties.description
    ? templates.FormDescription({
        description: properties.description,
      })
    : undefined;
  const paginationHtml = pagination
    ? templates.Pagination({
        ...pagination,
        actionName: ACTION_FIELD,
        previousAction: "page-prev",
        nextAction: "page-next",
        navigationLabel: strings.pagination.navigation,
        currentLabel: formatPageString(
          strings.pagination.pageLabel,
          pagination.current,
        ),
        previousTargetLabel: formatPageString(
          strings.pagination.previousTargetPage,
          Math.max(pagination.current - 1, 1),
        ),
        nextTargetLabel: formatPageString(
          strings.pagination.nextTargetPage,
          Math.min(pagination.current + 1, pagination.total),
        ),
      })
    : undefined;
  const submitButton = templates.SubmitButton({
    id: stableId(id, "submit"),
    actionName: ACTION_FIELD,
    value: "submit",
    label: submitLabel,
  });
  const rendererHiddenFields = [
    hiddenFields,
    pageHiddenField(pagination?.current),
  ]
    .filter(Boolean)
    .join("");
  const shortTextStyle = children.includes("data-fb-label-short")
    ? templates.ShortTextStyle({})
    : "";
  const formProperties = {
    id,
    title: properties.title,
    description: properties.description,
    customExtensions: properties.customExtensions,
    hiddenFields: rendererHiddenFields,
    titleHtml,
    descriptionHtml,
    after: renderHtml(properties.after),
    before: renderHtml(properties.before),
    children,
    errors: renderHtml(properties.errors),
    languageSelector: renderHtml(properties.languageSelector),
    pagination,
    paginationHtml,
    shortTextStyle,
    signature: renderHtml(properties.signature),
    submitLabel,
    submitButton,
  } satisfies Omit<FormTemplateProperties, "attributes" | "fields">;
  const fields = formFieldsTemplate(formProperties);
  return renderTemplate(templates.Form, {
    ...formProperties,
    attributes: { id, ...defaultAttributes(action) },
    fields,
  } satisfies FormTemplateProperties);
}

function formatPageString(template: string, page: number): string {
  return template.replaceAll("{page}", String(page));
}
