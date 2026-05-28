import type { Coding, Quantity } from "@formbox/fhir";
import {
  Form,
  ThemeProvider,
  CustomQuestionnaireExtensionsProvider,
  EXT,
  StringsContext,
  getIssueMessage,
  isGroupListStore,
  isGroupNode,
  isQuestionNode,
  prepareDataUrlFromSignature,
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  type IAnswer,
  type AnswerType,
  type IForm,
  type IGroupNode,
  type IPresentableNode,
  type IQuestionNode,
} from "@formbox/renderer";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server.node";

import { appendPath, withLastIndex } from "./path.ts";
import {
  calculatedName,
  countName,
  customUnitFormName,
  optionValueName,
  readOnlyName,
  signatureName,
  unitValueName,
  valueName,
} from "./template.ts";
import { getActiveTab } from "./tab-state.ts";
import {
  HtmlProvider,
  HtmxThemeProvider,
  createTheme,
  stripHtmlTag,
  type HtmxThemeValue,
} from "./theme/index.ts";
import type { RequiredTemplates } from "./template.ts";
import type { AnswerValue, PathSegment } from "./types.ts";

export function renderStoreFields(
  store: IForm,
  templates: RequiredTemplates,
  action: string | undefined,
): string {
  ensureServerRenderableRepeatQuestions(store);
  const activeTab = (path: readonly PathSegment[], total: number) =>
    getActiveTab(store, path, total);
  const theme = createTheme();
  const htmxTheme = {
    templates,
    hiddenFields: renderHiddenFieldsForStore(store),
    activeTabValue: activeTab,
    action,
  } satisfies HtmxThemeValue;
  const renderHtml = (node: ReactNode): string =>
    renderReactNode(store, theme, htmxTheme, renderHtml, node);

  return renderHtml(
    createElement(Form, {
      store,
      onLanguageChange: (language: string) => store.setLanguage(language),
    }),
  );
}

function renderReactNode(
  store: IForm,
  theme: ReturnType<typeof createTheme>,
  htmxTheme: HtmxThemeValue,
  renderHtml: (node: ReactNode) => string,
  node: ReactNode,
): string {
  return stripHtmlTag(
    renderToStaticMarkup(
      createElement(
        HtmxThemeProvider,
        { value: htmxTheme },
        createElement(
          ThemeProvider,
          { theme },
          createElement(
            CustomQuestionnaireExtensionsProvider,
            { value: store.customExtensions },
            createElement(
              StringsContext.Provider,
              { value: store.strings },
              createElement(HtmlProvider, { renderHtml }, node),
            ),
          ),
        ),
      ),
    ),
  );
}

function ensureServerRenderableRepeatQuestions(store: IForm): void {
  store.walkNodes({
    question(node) {
      if (node.repeats && node.answers.length === 0 && node.canAdd) {
        node.addAnswer();
      }
    },
  });
}

function renderHiddenFieldsForStore(store: IForm): string {
  const renderedNodes = new Set([
    ...store.headerNodes,
    ...store.contentNodes,
    ...store.footerNodes,
  ]);

  return [
    store.nodes
      .map((node) =>
        renderHiddenFieldsForNode(node, [], renderedNodes.has(node)),
      )
      .join(""),
    renderHiddenNodeIssues(store),
  ].join("");
}

function renderHiddenNodeIssues(store: IForm): string {
  const messages: string[] = [];

  store.walkNodes({
    node(node) {
      if (!node.hidden) {
        return;
      }

      hiddenNodeIssues(node)
        .map((issue) => getIssueMessage(issue))
        .filter((message): message is string => message !== undefined)
        .forEach((message) => messages.push(message));
    },
  });

  return messages.length === 0
    ? ""
    : `<ul class="fb-errors">${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>`;
}

function hiddenNodeIssues(node: IPresentableNode) {
  if (node.issues.length > 0) {
    return node.issues;
  }

  if (isGroupNode(node) || isQuestionNode(node)) {
    return [
      ...node.expressionRegistry.registrationIssues,
      ...node.expressionRegistry.slotsIssues,
    ];
  }

  return [];
}

function renderHiddenFieldsForNode(
  node: IPresentableNode,
  parentPath: readonly PathSegment[],
  rendered: boolean,
): string {
  if (!rendered) {
    return canRenderHiddenNode(node) ? renderHiddenNode(node, parentPath) : "";
  }

  if (node.hidden) {
    return canRenderHiddenNode(node) &&
      node.hasResponseContent &&
      !isHiddenByUsageMode(node)
      ? renderHiddenNode(node, parentPath)
      : "";
  }

  if (node.isExpandable && !node.isExpanded) {
    return renderHiddenNode(node, parentPath);
  }

  if (isGroupListStore(node)) {
    return node.nodes
      .map((group, index) =>
        renderHiddenFieldsForNode(
          group,
          [...parentPath, { linkId: node.linkId, index }],
          !group.hidden,
        ),
      )
      .join("");
  }

  if (isGroupNode(node)) {
    const groupPath = appendPath(parentPath, node.linkId);
    const activeTabNode =
      node.control === "tab-container"
        ? node.visibleNodes[
            getActiveTab(node.form, groupPath, node.visibleNodes.length)
          ]
        : undefined;
    return node.nodes
      .map((child) =>
        renderHiddenFieldsForNode(
          child,
          groupPath,
          !child.hidden && (!activeTabNode || child === activeTabNode),
        ),
      )
      .join("");
  }

  if (isQuestionNode(node)) {
    const questionPath = [...parentPath, { linkId: node.linkId }];
    const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
    return [
      renderSelectedOptionValues(node, questionPath),
      ...answers.map((answer, index) => {
        const answerPath = node.repeats
          ? withLastIndex(questionPath, index)
          : questionPath;
        return [
          renderVisibleAnswerHiddenFields(node, answer, answerPath),
          answer.nodes
            .map((child) =>
              renderHiddenFieldsForNode(child, answerPath, !child.hidden),
            )
            .join(""),
        ].join("");
      }),
    ].join("");
  }

  return "";
}

function canRenderHiddenNode(
  node: IPresentableNode,
  insideQuestionnaireHidden = false,
): boolean {
  if (insideQuestionnaireHidden && !node.isEnabled && !node.readOnly) {
    return false;
  }

  return (
    node.isEnabled ||
    node.readOnly ||
    (!isHiddenByUsageMode(node) && !isQuestionnaireHidden(node))
  );
}

function isQuestionnaireHidden(node: IPresentableNode): boolean {
  return (
    node.template.extension?.some(
      (extension) =>
        extension.url === EXT.HIDDEN && extension.valueBoolean === true,
    ) === true
  );
}

function isHiddenByUsageMode(node: IPresentableNode): boolean {
  const usageMode = node.template.extension?.find(
    (extension) => extension.url === EXT.USAGE_MODE,
  )?.valueCode;

  return (
    (usageMode === "capture" && node.form.mode !== "capture") ||
    (usageMode === "display" && node.form.mode !== "display") ||
    (usageMode === "display-non-empty" && node.form.mode !== "display")
  );
}

function renderVisibleAnswerHiddenFields(
  node: IQuestionNode,
  answer: IAnswer,
  answerPath: readonly PathSegment[],
): string {
  const calculated = renderCalculatedBaseline(node, answer, answerPath);
  const readOnly = renderReadOnlyMirror(node, answer, answerPath);
  const baseline = renderValueBaseline(
    node,
    answerPath,
    answer.value as AnswerValue | undefined,
  );
  const optionValues = node.repeats
    ? renderSelectedOptionValues(node, answerPath, answer)
    : "";

  if (node.type !== "quantity") {
    return [calculated, readOnly, baseline, optionValues].join("");
  }

  const value = answer.value as Quantity | undefined;
  return [
    calculated,
    readOnly,
    baseline,
    optionValues,
    renderCustomUnitFormState(answer as IAnswer<"quantity">, answerPath),
    renderUnitValues(answer as IAnswer<"quantity">, answerPath),
    value?.system
      ? `<input type="hidden" ${fieldAttributes(node.linkId, "system", valueName(answerPath, "system"))} value="${escapeAttribute(value.system)}">`
      : "",
    value?.code
      ? `<input type="hidden" ${fieldAttributes(node.linkId, "code", valueName(answerPath, "code"))} value="${escapeAttribute(value.code)}">`
      : "",
    value?.unit
      ? `<input type="hidden" ${fieldAttributes(node.linkId, "display", valueName(answerPath, "display"))} value="${escapeAttribute(value.unit)}">`
      : "",
  ].join("");
}

function renderValueBaseline(
  node: IQuestionNode,
  path: readonly PathSegment[],
  value: AnswerValue | undefined,
): string {
  if (
    value === undefined ||
    (node.type !== "coding" &&
      node.type !== "quantity" &&
      node.type !== "reference")
  ) {
    return "";
  }

  return `<input type="hidden" ${fieldAttributes(node.linkId, "baseline", valueName(path, "baseline"))} value="${escapeAttribute(serializeComplex(value))}">`;
}

function renderReadOnlyMirror(
  node: IQuestionNode,
  answer: IAnswer,
  path: readonly PathSegment[],
): string {
  if (!node.readOnly || answer.value === undefined) {
    return "";
  }

  const value = stringValue(answer.value);
  return [
    `<input type="hidden" ${fieldAttributes(node.linkId, "baseline", valueName(path, "baseline"))} value="${escapeAttribute(value)}">`,
    `<input type="hidden" name="${escapeAttribute(readOnlyName(path))}" value="${escapeAttribute(value)}">`,
  ].join("");
}

function renderHiddenControl(
  node: IQuestionNode,
  answer: IAnswer,
  answerPath: readonly PathSegment[],
): string {
  return [
    renderCalculatedBaseline(node, answer, answerPath),
    node.repeats ? renderSelectedOptionValues(node, answerPath, answer) : "",
    node.type === "quantity"
      ? [
          renderCustomUnitFormState(answer as IAnswer<"quantity">, answerPath),
          renderUnitValues(answer as IAnswer<"quantity">, answerPath),
        ].join("")
      : "",
    renderHiddenValue(
      node,
      answerPath,
      answer.value as AnswerValue | undefined,
    ),
  ].join("");
}

function renderUnitValues(
  answer: IAnswer<"quantity">,
  path: readonly PathSegment[],
): string {
  const rendered = new Set<string>();

  return answer.quantity.unitSelection.entries
    .map((entry) => ({
      name: unitValueName(path, entry.token),
      value: serializeUnitValue(entry.coding),
    }))
    .filter((value) => {
      const key = `${value.name}:${value.value}`;
      if (rendered.has(key)) {
        return false;
      }
      rendered.add(key);
      return true;
    })
    .map(
      ({ name, value }) =>
        `<input type="hidden" name="${escapeAttribute(name)}" value="${escapeAttribute(value)}">`,
    )
    .join("");
}

function renderCustomUnitFormState(
  answer: IAnswer<"quantity">,
  path: readonly PathSegment[],
): string {
  return answer.quantity.unitSelection.customFormActive
    ? `<input type="hidden" name="${escapeAttribute(customUnitFormName(path))}" value="true">`
    : "";
}

function serializeUnitValue(coding: Coding): string {
  return JSON.stringify(coding);
}

function renderHiddenNode(
  node: IPresentableNode,
  parentPath: readonly PathSegment[],
  insideQuestionnaireHidden = false,
): string {
  if (!canRenderHiddenNode(node, insideQuestionnaireHidden)) {
    return "";
  }

  const childInsideQuestionnaireHidden =
    insideQuestionnaireHidden || isQuestionnaireHidden(node);

  if (isGroupListStore(node)) {
    const listPath = [...parentPath, { linkId: node.linkId }];
    return [
      `<input type="hidden" name="${escapeAttribute(countName(listPath))}" value="${escapeAttribute(String(node.nodes.length))}">`,
      node.nodes
        .map((group, index) =>
          renderHiddenNode(
            group,
            [...parentPath, { linkId: node.linkId, index }],
            childInsideQuestionnaireHidden,
          ),
        )
        .join(""),
    ].join("");
  }

  if (isGroupNode(node)) {
    const groupPath = appendPath(parentPath, node.linkId);
    return [
      renderHiddenSignature(node, groupPath),
      node.nodes
        .map((child) =>
          renderHiddenNode(child, groupPath, childInsideQuestionnaireHidden),
        )
        .join(""),
    ].join("");
  }

  if (isQuestionNode(node)) {
    const questionPath = [...parentPath, { linkId: node.linkId }];
    const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
    return [
      renderHiddenSignature(node, questionPath),
      renderSelectedOptionValues(node, questionPath),
      node.repeats
        ? `<input type="hidden" name="${escapeAttribute(countName(questionPath))}" value="${escapeAttribute(String(answers.length))}">`
        : "",
      ...answers.map((answer, index) => {
        const answerPath = node.repeats
          ? withLastIndex(questionPath, index)
          : questionPath;
        return [
          renderHiddenControl(node, answer, answerPath),
          answer.nodes
            .map((child) =>
              renderHiddenNode(
                child,
                answerPath,
                childInsideQuestionnaireHidden,
              ),
            )
            .join(""),
        ].join("");
      }),
    ].join("");
  }

  return "";
}

function renderSelectedOptionValues(
  node: IQuestionNode,
  path: readonly PathSegment[],
  answer?: IAnswer | undefined,
): string {
  return node.answerOption.select.selectedOptions
    .filter(
      (option) =>
        (answer === undefined || option.answer === answer) &&
        option.value !== undefined &&
        isPreservedOptionToken(option.token),
    )
    .map((option) => {
      const value = serializeSelectedOptionValue(
        option.answerType,
        option.value as AnswerValue,
      );
      return value
        ? `<input type="hidden" name="${escapeAttribute(optionValueName(path, option.token))}" value="${escapeAttribute(value)}">`
        : "";
    })
    .join("");
}

function isPreservedOptionToken(token: string): boolean {
  return token.includes("__custom__") || token.includes("__legacy__");
}

function serializeSelectedOptionValue(
  answerType: AnswerType,
  value: AnswerValue,
): string | undefined {
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[answerType];
  if (value === undefined) {
    return undefined;
  }

  return JSON.stringify({
    answerType,
    value: asAnswerFragment(dataType, value as never),
  });
}

function renderHiddenSignature(
  node: IGroupNode | IQuestionNode,
  path: readonly PathSegment[],
): string {
  const value = prepareDataUrlFromSignature(node.signature);
  if (!node.signatureRequired || value === undefined) {
    return "";
  }

  return `<input type="hidden" ${fieldAttributes(node.linkId, "signature", signatureName(path))} value="${escapeAttribute(value)}">`;
}

function renderHiddenValue(
  node: IQuestionNode,
  path: readonly PathSegment[],
  value: AnswerValue | undefined,
): string {
  if (value === undefined) {
    return "";
  }

  if (
    node.type === "quantity" ||
    node.type === "reference" ||
    node.type === "coding" ||
    node.type === "attachment"
  ) {
    return `<input type="hidden" ${fieldAttributes(node.linkId, "value", valueName(path, "value"))} value="${escapeAttribute(serializeComplex(value))}">`;
  }

  return `<input type="hidden" ${fieldAttributes(node.linkId, "value", valueName(path, "value"))} value="${escapeAttribute(stringValue(value))}">`;
}

function renderCalculatedBaseline(
  node: IQuestionNode,
  answer: IAnswer,
  path: readonly PathSegment[],
): string {
  if (node.expressionRegistry.calculated === undefined) {
    return "";
  }

  return `<input type="hidden" name="${escapeAttribute(calculatedName(path))}" value="${escapeAttribute(serializeBaseline(answer.value))}">`;
}

function serializeBaseline(value: unknown): string {
  return value === undefined ? "" : JSON.stringify(value);
}

function fieldAttributes(linkId: string, field: string, name: string): string {
  return `data-fb-link-id="${escapeAttribute(linkId)}" data-fb-field="${escapeAttribute(field)}" name="${escapeAttribute(name)}" hx-include="closest form"`;
}

function serializeComplex(value: unknown): string {
  return value === undefined ? "" : JSON.stringify(value);
}

function stringValue(value: unknown): string {
  if (value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return serializeComplex(value);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
