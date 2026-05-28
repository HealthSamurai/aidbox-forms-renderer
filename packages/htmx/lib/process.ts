import type {
  Attachment,
  Coding,
  Quantity,
  Reference,
  Signature,
} from "@formbox/fhir";
import {
  isGroupNode,
  isGroupListStore,
  isQuestionNode,
  ANSWER_TYPE_TO_DATA_TYPE,
  getValue,
  prepareSignatureFromDataUrl,
  type AnswerType,
  type IAnswer,
  type IForm,
  type IGroupList,
  type IGroupNode,
  type IPresentableNode,
  type IQuestionNode,
} from "@formbox/renderer";

import {
  parseAction,
  parseNonNegativeInteger,
  withLastIndex,
  withoutLastIndex,
} from "./path.ts";
import { waitForQuestionOptions } from "./async-options.ts";
import { dateTimeLocalInputValue } from "./date-time.ts";
import {
  ACTION_FIELD,
  LANGUAGE_FIELD,
  PAGE_FIELD,
  calculatedName,
  countName,
  customUnitFormName,
  expandedName,
  optionValueName,
  readOnlyName,
  searchName,
  selectedName,
  signatureName,
  tabName,
  unitValueName,
  unitValueNamePrefix,
  valueName,
} from "./template.ts";
import { setActiveTab } from "./tab-state.ts";
import type { AnswerValue, PathSegment, ProcessResult } from "./types.ts";

type SubmittedAnswerOptionValue = {
  readonly token: string;
  readonly value: AnswerValue | undefined;
  readonly preserved: boolean;
  readonly custom: boolean;
};

export function processStoreFormData(
  store: IForm,
  formData: FormData,
): Promise<ProcessResult> {
  return processStoreFormDataAsync(store, formData);
}

async function processStoreFormDataAsync(
  store: IForm,
  formData: FormData,
): Promise<ProcessResult> {
  await applySubmittedState(store, formData);
  const actions = getActions(formData);
  actions.forEach((action) => applyAction(store, action));

  if (actions.includes("submit")) {
    return {
      submitted: true,
      valid: store.validateAll(),
    };
  }

  return { submitted: false };
}

async function applySubmittedState(
  store: IForm,
  formData: FormData,
): Promise<void> {
  applyLanguageState(store, formData);
  applyPageState(store, formData);
  applyExpandedState(store, formData);
  applyTabState(store, formData);
  applySearchState(store, formData);
  applySubmittedCounts(store, formData);
  await applySubmittedReadOnlyMirrors(store, formData);
  await applyRepeatedAggregateAnswers(store, formData);
  await applySubmittedAnswers(store, formData);
  applySubmittedSignatures(store, formData);
}

function applyLanguageState(store: IForm, formData: FormData): void {
  const language = normalizeString(getLastString(formData, LANGUAGE_FIELD));
  if (language !== undefined) {
    store.setLanguage(language);
  }
}

function applySearchState(store: IForm, formData: FormData): void {
  store.walkNodes({
    question(node, path) {
      const query = getLastString(formData, searchName(path));
      if (query !== undefined) {
        node.answerOption.select.setSearchQuery(query);
      }
    },
  });
}

function applySubmittedCounts(store: IForm, formData: FormData): void {
  store.walkNodes({
    groupList(node, path) {
      const submittedCount = readCount(formData, path);
      if (submittedCount !== undefined) {
        resizeGroupList(node, submittedCount);
      }
    },
    question(node, path) {
      if (node.repeats) {
        const count = readCount(formData, path);
        if (count !== undefined) {
          resizeQuestion(node, count);
          return;
        }

        if (node.readOnly && node.isEnabled) {
          const readOnlyCount = readReadOnlyMirrorCount(path, formData);
          if (readOnlyCount !== undefined) {
            node.setAnswersBySystem(
              Array.from<undefined>({ length: readOnlyCount }),
            );
            return;
          }
        }

        const rawValues = readRepeatedAggregateRawValues(path, formData);
        if (rawValues !== undefined) {
          resizeQuestion(
            node,
            normalizeRepeatedAggregateRawValues(node, path, rawValues, formData)
              .length,
          );
        }
      }
    },
  });
}

async function applyRepeatedAggregateAnswers(
  store: IForm,
  formData: FormData,
): Promise<void> {
  const entries: Array<{
    readonly node: IQuestionNode;
    readonly path: readonly PathSegment[];
    readonly rawValues: readonly string[];
  }> = [];

  store.walkNodes({
    question(node, path) {
      if (
        (!node.isEnabled && !node.readOnly) ||
        !node.repeats ||
        readCount(formData, path) !== undefined
      ) {
        return;
      }

      const rawValues = readRepeatedAggregateRawValues(path, formData);
      if (rawValues === undefined) {
        return;
      }

      entries.push({
        node,
        path,
        rawValues: normalizeRepeatedAggregateRawValues(
          node,
          path,
          rawValues,
          formData,
        ),
      });
    },
  });

  for (const { node, path, rawValues } of entries) {
    await waitForQuestionOptions(node);

    if (
      await applyRepeatedCustomOptionSelection(node, path, rawValues, formData)
    ) {
      continue;
    }

    if (applyRepeatedOptionSelection(node, path, rawValues, formData)) {
      continue;
    }

    for (const [index, rawValue] of rawValues.entries()) {
      const answer = node.answers[index];
      if (answer) {
        const value = await readRepeatedAggregateValue(
          node,
          answer,
          path,
          rawValue,
        );
        setSubmittedAnswerValue(node, answer, value);
      }
    }
  }
}

async function applyRepeatedCustomOptionSelection(
  node: IQuestionNode,
  path: readonly PathSegment[],
  rawValues: readonly string[],
  formData: FormData,
): Promise<boolean> {
  if (
    node.answerOption.inherentOptions.length === 0 ||
    !rawValues.some((value) => isSpecifyOtherOptionToken(node, value))
  ) {
    return false;
  }

  if (node.readOnly && node.isEnabled) {
    return true;
  }

  const submittedValues = rawValues.filter(
    (value) => !isSpecifyOtherOptionToken(node, value),
  );
  resizeQuestion(node, Math.max(submittedValues.length, 1));

  if (submittedValues.length === 0) {
    node.answerOption.select.selectOption(
      node.answerOption.select.specifyOtherToken,
    );
    return true;
  }

  for (const [index, rawValue] of submittedValues.entries()) {
    const answer = node.answers[index];
    if (!answer) {
      continue;
    }

    const option = readAnswerOptionValue(node, path, rawValue, formData);
    if (option) {
      applySubmittedOptionValue(node, answer, option);
      continue;
    }

    node.answerOption.select.selectOptionForAnswer(
      answer,
      node.answerOption.select.specifyOtherToken,
    );
    const value = await readRepeatedAggregateValue(
      node,
      answer,
      path,
      rawValue,
    );
    setSubmittedAnswerValue(node, answer, value);
  }

  return true;
}

async function applySubmittedReadOnlyMirrors(
  store: IForm,
  formData: FormData,
): Promise<void> {
  const entries: Array<{
    readonly question: IQuestionNode;
    readonly answer: IAnswer;
    readonly path: readonly PathSegment[];
  }> = [];

  store.walkNodes({
    answer(question, answer, path) {
      if (
        answer.value === undefined &&
        hasSubmittedReadOnlyMirror(path, formData)
      ) {
        entries.push({ question, answer, path });
      }
    },
  });

  for (const { question, answer, path } of entries) {
    const raw = getSubmittedReadOnlyMirror(path, formData);
    if (raw === undefined) {
      continue;
    }

    const mirrorFormData = new FormData();
    mirrorFormData.set(valueName(path, "value"), raw);
    const value = await readSubmittedValue(
      question,
      answer,
      path,
      mirrorFormData,
    );
    answer.setValueBySystem(value);
  }
}

async function applySubmittedAnswers(
  store: IForm,
  formData: FormData,
): Promise<void> {
  const processedPaths = new Set<string>();
  let processedInPass = false;

  do {
    processedInPass = false;
    const entries: Array<{
      readonly question: IQuestionNode;
      readonly answer: IAnswer;
      readonly path: readonly PathSegment[];
    }> = [];

    store.walkNodes({
      answer(question, answer, path) {
        entries.push({ question, answer, path });
      },
    });

    for (const { question, answer, path } of entries) {
      const pathKey = valueName(path, "value");
      const submittedPath = submittedAnswerPath(question, path, formData);
      if (
        processedPaths.has(pathKey) ||
        (!question.isEnabled && !question.readOnly) ||
        !hasSubmittedValueAtPath(question, submittedPath, formData)
      ) {
        continue;
      }

      processedPaths.add(pathKey);
      processedInPass = true;
      await waitForQuestionOptions(question);

      if (
        applySubmittedAnswerOptionSelection(
          question,
          answer,
          submittedPath,
          formData,
        )
      ) {
        continue;
      }

      const value = await readSubmittedValue(
        question,
        answer,
        submittedPath,
        formData,
      );
      if (submittedCalculatedBaselineMatches(submittedPath, value, formData)) {
        continue;
      }

      setSubmittedAnswerValue(question, answer, value);
    }
  } while (processedInPass);
}

function submittedCalculatedBaselineMatches(
  path: readonly PathSegment[],
  value: AnswerValue | undefined,
  formData: FormData,
): boolean {
  const rawBaseline = getLastString(formData, calculatedName(path));
  if (rawBaseline === undefined) {
    return false;
  }

  return JSON.stringify(value) === JSON.stringify(parseBaseline(rawBaseline));
}

function hasSubmittedReadOnlyMirror(
  path: readonly PathSegment[],
  formData: FormData,
): boolean {
  return getSubmittedReadOnlyMirror(path, formData) !== undefined;
}

function getSubmittedReadOnlyMirror(
  path: readonly PathSegment[],
  formData: FormData,
): string | undefined {
  const raw = getLastString(formData, readOnlyName(path));
  if (raw === undefined) {
    return undefined;
  }

  return getStrings(formData, valueName(path, "baseline")).includes(raw)
    ? raw
    : undefined;
}

function parseBaseline(value: string): AnswerValue | undefined {
  if (value.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(value) as AnswerValue;
  } catch {
    return normalizeString(value);
  }
}

function readRepeatedAggregateRawValues(
  path: readonly PathSegment[],
  formData: FormData,
): string[] | undefined {
  const name = valueName(path, "value");
  const submittedValues = getStrings(formData, name);
  if (submittedValues.length === 0) {
    return undefined;
  }

  return submittedValues.filter((value) => value.length > 0);
}

function normalizeRepeatedAggregateRawValues(
  node: IQuestionNode,
  path: readonly PathSegment[],
  rawValues: readonly string[],
  formData: FormData,
): string[] {
  if (
    node.answerOption.inherentOptions.length === 0 ||
    getStrings(formData, selectedName(path)).length === 0
  ) {
    return [...rawValues];
  }

  return [...new Set(rawValues)];
}

async function readRepeatedAggregateValue(
  question: IQuestionNode,
  answer: IAnswer,
  path: readonly PathSegment[],
  rawValue: string,
): Promise<AnswerValue | undefined> {
  const singleValueFormData = new FormData();
  singleValueFormData.set(valueName(path, "value"), rawValue);
  return await readSubmittedValue(question, answer, path, singleValueFormData);
}

function setSubmittedAnswerValue(
  question: IQuestionNode,
  answer: IAnswer,
  value: AnswerValue | undefined,
): void {
  if (question.readOnly && question.isEnabled) {
    return;
  }

  if (question.readOnly) {
    answer.setValueBySystem(value);
  } else {
    answer.setValueByUser(value);
  }
}

function applySubmittedSignatures(store: IForm, formData: FormData): void {
  const rootSignatureName = signatureName([]);
  if (formData.has(rootSignatureName)) {
    store.setSignature(readSignature(formData, rootSignatureName));
  }

  store.walkNodes({
    group(node, path) {
      setNodeSignature(node, path, formData);
    },
    question(node, path) {
      setNodeSignature(node, path, formData);
    },
  });
}

function setNodeSignature(
  node: IGroupNode | IQuestionNode,
  path: readonly PathSegment[],
  formData: FormData,
): void {
  const name = signatureName(path);
  if (!formData.has(name)) {
    return;
  }

  if (node.readOnly && node.isEnabled) {
    return;
  }

  node.setSignature(readSignature(formData, name));
}

function readSignature(
  formData: FormData,
  name: string,
): Signature | undefined {
  const raw = normalizeString(getLastString(formData, name));
  return raw ? prepareSignatureFromDataUrl(raw) : undefined;
}

function applyPageState(store: IForm, formData: FormData): void {
  const current = parsePositiveInteger(getLastString(formData, PAGE_FIELD));
  const pagination = store.pagination;
  if (!pagination || current === undefined) {
    return;
  }

  const target = Math.min(current, pagination.total);
  while (store.pagination && store.pagination.current < target) {
    const previous = store.pagination.current;
    store.pagination.onNext();
    if (!store.pagination || store.pagination.current === previous) {
      return;
    }
  }
}

function applyExpandedState(store: IForm, formData: FormData): void {
  store.walkNodes({
    group(node, path) {
      applyNodeExpandedState(node, path, formData);
    },
    question(node, path) {
      applyNodeExpandedState(node, path, formData);
    },
  });
}

function applyTabState(store: IForm, formData: FormData): void {
  store.walkNodes({
    group(node, path) {
      if (node.control !== "tab-container") {
        return;
      }

      const index = parseNonNegativeInteger(
        getLastString(formData, tabName(path)),
      );
      if (index !== undefined) {
        setActiveTab(store, path, index, node.visibleNodes.length);
      }
    },
  });
}

function applyNodeExpandedState(
  node: IPresentableNode,
  path: readonly PathSegment[],
  formData: FormData,
): void {
  if (!node.isExpandable) {
    return;
  }

  const raw = getLastString(formData, expandedName(path));
  if (raw === undefined) {
    return;
  }

  const expanded = raw === "true";
  if (node.isExpanded !== expanded) {
    node.toggleExpanded();
  }
}

function applyAction(store: IForm, action: string): void {
  if (action === "submit") {
    return;
  }

  if (action === "page-prev") {
    store.pagination?.onPrev();
    return;
  }

  if (action === "page-next") {
    store.pagination?.onNext();
    return;
  }

  if (action === "submit-custom") {
    submitCustomOptionForms(store);
    return;
  }

  if (action === "cancel-custom") {
    cancelCustomOptionForms(store);
    return;
  }

  const parsed = parseAction(action);
  if (!parsed) {
    return;
  }

  switch (parsed.kind) {
    case "add-group": {
      const target = store.findNodeByPath(parsed.path);
      if (isGroupListStore(target)) {
        target.addNode();
      }
      return;
    }
    case "remove-group": {
      const last = parsed.path.at(-1);
      if (last?.index === undefined) {
        return;
      }
      const index = last.index;
      const listPath = withoutLastIndex(parsed.path);
      const list = store.findNodeByPath(listPath);
      if (isGroupListStore(list)) {
        const group = list.nodes[index];
        if (group) {
          list.removeNode(group);
        }
      }
      return;
    }
    case "add-answer": {
      const target = store.findNodeByPath(parsed.path);
      if (isQuestionNode(target)) {
        target.addAnswer();
      }
      return;
    }
    case "remove-answer": {
      const last = parsed.path.at(-1);
      if (last?.index === undefined) {
        return;
      }
      const index = last.index;
      const questionPath = withoutLastIndex(parsed.path);
      const question = store.findNodeByPath(questionPath);
      if (isQuestionNode(question)) {
        const answer = question.answers[index];
        if (answer) {
          question.removeAnswer(answer);
        }
      }
      return;
    }
    case "toggle-expanded": {
      const target = store.findNodeByPath(parsed.path);
      if (target?.isExpandable) {
        target.toggleExpanded();
      }
      return;
    }
    case "select-tab": {
      const last = parsed.path.at(-1);
      if (last?.index === undefined) {
        return;
      }

      const path = withoutLastIndex(parsed.path);
      const target = store.findNodeByPath(path);
      if (isGroupNode(target) && target.control === "tab-container") {
        setActiveTab(store, path, last.index, target.visibleNodes.length);
      }
      return;
    }
  }
}

function submitCustomOptionForms(store: IForm): void {
  store.walkNodes({
    question(node) {
      const state = node.answerOption.select.customOptionFormState;
      if (state?.canSubmit === true && !node.readOnly) {
        node.answerOption.select.submitCustomOptionForm();
      }
    },
    answer(node, answer) {
      if (node.type === "quantity") {
        (
          answer as IAnswer<"quantity">
        ).quantity.unitSelection.submitCustomForm();
      }
    },
  });
}

function cancelCustomOptionForms(store: IForm): void {
  store.walkNodes({
    question(node) {
      node.answerOption.select.cancelCustomOptionForm();
    },
    answer(node, answer) {
      if (node.type === "quantity") {
        (
          answer as IAnswer<"quantity">
        ).quantity.unitSelection.cancelCustomForm();
      }
    },
  });
}

function resizeGroupList(node: IGroupList, count: number): void {
  while (node.nodes.length < count && node.canAdd) {
    node.addNode();
  }

  while (node.nodes.length > count && node.canRemove) {
    const last = node.nodes.at(-1);
    if (!last) {
      return;
    }
    node.removeNode(last);
  }
}

function resizeQuestion(node: IQuestionNode, count: number): void {
  while (node.answers.length < count && node.canAdd) {
    const added = node.addAnswer();
    if (!added) {
      return;
    }
  }

  while (node.answers.length > count && node.canRemove) {
    const last = node.answers.at(-1);
    if (!last) {
      return;
    }
    node.removeAnswer(last);
  }
}

async function readSubmittedValue(
  node: IQuestionNode,
  answer: IAnswer,
  path: readonly PathSegment[],
  formData: FormData,
): Promise<AnswerValue | undefined> {
  const raw = getLastString(formData, valueName(path, "value"));
  const option = readAnswerOptionValue(node, path, raw, formData);
  if (option) {
    return option.value;
  }

  if (node.answerOption.constraint === "optionsOrString") {
    return normalizeString(raw);
  }

  switch (node.type) {
    case "string": {
      return normalizeString(raw);
    }
    case "text": {
      return normalizeString(raw);
    }
    case "url": {
      return normalizeString(raw);
    }
    case "date": {
      return normalizeString(raw);
    }
    case "dateTime": {
      return readDateTime(path, raw, formData);
    }
    case "time": {
      return normalizeString(raw);
    }
    case "integer": {
      return parseInteger(raw);
    }
    case "decimal": {
      return parseDecimal(raw);
    }
    case "boolean": {
      return readBoolean(path, formData);
    }
    case "coding": {
      return readCoding(node as IQuestionNode<"coding">, path, formData);
    }
    case "quantity": {
      return readQuantity(answer as IAnswer<"quantity">, path, formData);
    }
    case "reference": {
      return readReference(path, formData);
    }
    case "attachment": {
      return await readAttachment(path, formData);
    }
    default: {
      const exhaustive: never = node.type;
      return exhaustive;
    }
  }
}

function readDateTime(
  path: readonly PathSegment[],
  raw: string | undefined,
  formData: FormData,
): string | undefined {
  const value = normalizeString(raw);
  const baseline = normalizeString(
    getLastString(formData, valueName(path, "baseline")),
  );
  if (
    value !== undefined &&
    baseline !== undefined &&
    dateTimeLocalInputValue(baseline) === value
  ) {
    return baseline;
  }

  return value;
}

function applySubmittedAnswerOptionSelection(
  node: IQuestionNode,
  answer: IAnswer,
  path: readonly PathSegment[],
  formData: FormData,
): boolean {
  if (node.answerOption.inherentOptions.length === 0) {
    return false;
  }

  const submittedValues = getStrings(formData, valueName(path, "value"));
  const raw = submittedValues.at(-1);
  if (raw === undefined) {
    return false;
  }

  if (
    !isSpecifyOtherOptionToken(node, raw) &&
    submittedValues.some((value) => isSpecifyOtherOptionToken(node, value))
  ) {
    if (!node.readOnly || !node.isEnabled) {
      node.answerOption.select.selectOptionForAnswer(
        answer,
        node.answerOption.select.specifyOtherToken,
      );
    }
    return false;
  }

  if (isSpecifyOtherOptionToken(node, raw)) {
    if (node.readOnly && node.isEnabled) {
      return true;
    }

    node.answerOption.select.selectOptionForAnswer(
      answer,
      node.answerOption.select.specifyOtherToken,
    );
    return true;
  }

  const option =
    raw.length === 0
      ? {
          token: "",
          value: undefined,
          preserved: false,
          custom: false,
        }
      : readAnswerOptionValue(node, path, raw, formData);
  if (!option) {
    if (
      isNativeBooleanSubmission(node, raw) ||
      isPreservedOptionValue(path, raw, formData) ||
      matchesSelectedOptionValue(node, raw)
    ) {
      return false;
    }

    if (node.answerOption.constraint !== "optionsOnly") {
      return false;
    }

    if (node.readOnly && node.isEnabled) {
      return true;
    }

    node.answerOption.select.selectOptionForAnswer(
      answer,
      raw.length > 0 ? undefined : raw,
    );
    return true;
  }

  if (submittedCalculatedBaselineMatches(path, option.value, formData)) {
    return true;
  }

  if (node.readOnly && node.isEnabled) {
    return true;
  }

  applySubmittedOptionValue(node, answer, option);
  return true;
}

function isSpecifyOtherOptionToken(
  node: IQuestionNode,
  value: string,
): boolean {
  return (
    value === node.answerOption.select.specifyOtherToken ||
    value.endsWith("__specify_other")
  );
}

function applyRepeatedOptionSelection(
  node: IQuestionNode,
  path: readonly PathSegment[],
  rawValues: readonly string[],
  formData: FormData,
): boolean {
  if (node.answerOption.inherentOptions.length === 0) {
    return false;
  }

  let selectedTokens = resolveSubmittedOptionTokens(
    node,
    path,
    rawValues,
    formData,
  );
  let optionValues = selectedTokens.map((value) =>
    readAnswerOptionValue(node, path, value, formData),
  );
  if (optionValues.includes(undefined)) {
    if (
      rawValues.some(
        (value) =>
          isPreservedOptionValue(path, value, formData) ||
          matchesSelectedOptionValue(node, value),
      )
    ) {
      return false;
    }

    if (node.answerOption.constraint !== "optionsOnly") {
      return false;
    }

    const validTokens: string[] = [];
    const validValues: SubmittedAnswerOptionValue[] = [];
    selectedTokens.forEach((token) => {
      const option = readAnswerOptionValue(node, path, token, formData);
      if (option) {
        validTokens.push(option.token);
        validValues.push(option);
      }
    });
    selectedTokens = validTokens;
    optionValues = validValues;
  }
  selectedTokens = optionValues.map((option) => option?.token ?? "");

  if (node.readOnly && node.isEnabled) {
    return true;
  }

  if (node.readOnly) {
    node.setAnswersBySystem(optionValues.map((option) => option?.value));
    return true;
  }

  if (optionValues.some((option) => option?.preserved === true)) {
    resizeQuestion(node, optionValues.length);
    optionValues.forEach((option, index) => {
      const answer = node.answers[index];
      if (answer && option) {
        applySubmittedOptionValue(node, answer, option);
      }
    });
    return true;
  }

  const submittedTokens = new Set(selectedTokens);
  node.answerOption.select.selectedOptions
    .filter((option) => !submittedTokens.has(option.token))
    .forEach((option) => node.answerOption.select.deselectOption(option.token));

  selectedTokens.forEach((token) => {
    if (
      !node.answerOption.select.selectedOptions.some(
        (option) => option.token === token,
      )
    ) {
      node.answerOption.select.selectOption(token);
    }
  });

  return true;
}

function resolveSubmittedOptionTokens(
  node: IQuestionNode,
  path: readonly PathSegment[],
  rawValues: readonly string[],
  formData: FormData,
): string[] {
  const previousValues = getStrings(formData, selectedName(path));
  if (previousValues.length === 0) {
    return [...rawValues];
  }

  const rawTokens = new Set(rawValues);
  const selected = previousValues.filter((token) => rawTokens.has(token));
  const additions = rawValues.filter(
    (token) => !previousValues.includes(token),
  );

  additions.forEach((token) => {
    if (isExclusiveOptionToken(node, token)) {
      selected.splice(0, selected.length, token);
      return;
    }

    for (let index = selected.length - 1; index >= 0; index -= 1) {
      const selectedToken = selected[index];
      if (
        selectedToken !== undefined &&
        isExclusiveOptionToken(node, selectedToken)
      ) {
        selected.splice(index, 1);
      }
    }
    selected.push(token);
  });

  return selected;
}

function isExclusiveOptionToken(node: IQuestionNode, token: string): boolean {
  return node.answerOption.inherentOptions.some(
    (option) => option.token === token && option.exclusive === true,
  );
}

function readAnswerOptionValue(
  node: IQuestionNode,
  path: readonly PathSegment[],
  raw: string | undefined,
  formData: FormData,
): SubmittedAnswerOptionValue | undefined {
  if (raw === undefined) {
    return undefined;
  }

  const options = [
    ...node.answerOption.select.filteredOptions,
    ...node.answerOption.inherentOptions,
    ...node.answerOption.select.selectedOptions,
  ];
  const option = options.find(
    (entry) =>
      entry.token === raw ||
      (node.answerOption.constraint === "optionsOnly" &&
        entry.value !== undefined &&
        submittedOptionValue(entry.value) === raw),
  );
  if (option) {
    return {
      token: option.token,
      value: option.value as AnswerValue | undefined,
      preserved: false,
      custom: false,
    };
  }

  return readPreservedAnswerOptionValue(node, path, raw, formData);
}

function readPreservedAnswerOptionValue(
  node: IQuestionNode,
  path: readonly PathSegment[],
  token: string,
  formData: FormData,
): SubmittedAnswerOptionValue | undefined {
  if (!isPreservedAnswerOptionToken(token)) {
    return undefined;
  }

  const envelope = parseJsonObject<{
    readonly answerType?: unknown;
    readonly value?: unknown;
  }>(normalizeString(getLastString(formData, optionValueName(path, token))));
  if (!isAnswerType(envelope?.answerType)) {
    return undefined;
  }

  const expectedAnswerType = token.includes("__custom__")
    ? node.answerOption.select.customType
    : node.type;
  if (envelope.answerType !== expectedAnswerType) {
    return undefined;
  }

  const value = getValue(
    ANSWER_TYPE_TO_DATA_TYPE[envelope.answerType],
    envelope.value as never,
  ) as AnswerValue | undefined;
  if (value === undefined) {
    return undefined;
  }

  return {
    token,
    value,
    preserved: true,
    custom: token.includes("__custom__"),
  };
}

function isAnswerType(value: unknown): value is AnswerType {
  return typeof value === "string" && value in ANSWER_TYPE_TO_DATA_TYPE;
}

function isPreservedAnswerOptionToken(token: string): boolean {
  return token.includes("__custom__") || token.includes("__legacy__");
}

function applySubmittedOptionValue(
  node: IQuestionNode,
  answer: IAnswer,
  option: SubmittedAnswerOptionValue,
): void {
  if (option.token.length === 0) {
    node.answerOption.select.selectOptionForAnswer(answer);
    return;
  }

  if (option.custom) {
    node.answerOption.select.selectOptionForAnswer(
      answer,
      node.answerOption.select.specifyOtherToken,
    );
    setSubmittedAnswerValue(node, answer, option.value);
    node.answerOption.select.submitCustomOptionForm();
    return;
  }

  if (option.preserved) {
    setSubmittedAnswerValue(node, answer, option.value);
    return;
  }

  node.answerOption.select.selectOptionForAnswer(answer, option.token);
}

function isNativeBooleanSubmission(node: IQuestionNode, raw: string): boolean {
  return node.type === "boolean" && (raw === "true" || raw === "false");
}

function matchesSelectedOptionValue(node: IQuestionNode, raw: string): boolean {
  return node.answerOption.select.selectedOptions.some(
    (option) =>
      option.value !== undefined && submittedOptionValue(option.value) === raw,
  );
}

function isPreservedOptionValue(
  path: readonly PathSegment[],
  raw: string,
  formData: FormData,
): boolean {
  return getStrings(formData, valueName(path, "baseline")).includes(raw);
}

function submittedOptionValue(value: unknown): string {
  return typeof value === "object" && value !== null
    ? JSON.stringify(value)
    : String(value);
}

function submittedAnswerPath(
  node: IQuestionNode,
  path: readonly PathSegment[],
  formData: FormData,
): readonly PathSegment[] {
  if (hasSubmittedValueAtPath(node, path, formData)) {
    return path;
  }

  if (node.repeats || !formData.has(countName(path))) {
    return path;
  }

  const firstSubmittedRepeatPath = withLastIndex(path, 0);
  return hasSubmittedValueAtPath(node, firstSubmittedRepeatPath, formData)
    ? firstSubmittedRepeatPath
    : path;
}

function hasSubmittedValueAtPath(
  node: IQuestionNode,
  path: readonly PathSegment[],
  formData: FormData,
): boolean {
  if (formData.has(valueName(path, "value"))) {
    return true;
  }

  if (node.type === "quantity") {
    return formData.has(valueName(path, "unit"));
  }

  if (node.type === "reference" || node.type === "coding") {
    return (
      formData.has(valueName(path, "system")) ||
      formData.has(valueName(path, "display"))
    );
  }

  return false;
}

function readCoding(
  node: IQuestionNode<"coding">,
  path: readonly PathSegment[],
  formData: FormData,
): Coding | undefined {
  const baseline = parseJsonObject<Coding>(
    normalizeString(getLastString(formData, valueName(path, "baseline"))),
  );
  const raw = normalizeString(
    getLastString(formData, valueName(path, "value")),
  );
  const fromJson = parseJsonObject<Coding>(raw);
  if (fromJson) {
    return fromJson;
  }

  const selectedOption = node.answerOption.inherentOptions.find(
    (option) => option.token === raw,
  );
  if (selectedOption?.value) {
    return selectedOption.value;
  }

  const system = normalizeString(
    getLastString(formData, valueName(path, "system")),
  );
  const display = normalizeString(
    getLastString(formData, valueName(path, "display")),
  );
  if (!raw && !system && !display && baseline === undefined) {
    return undefined;
  }

  if (!raw && !system && !display) {
    return nonEmptyObject(
      compactObject({
        ...baseline,
        system,
        version: undefined,
        code: raw,
        display,
      }),
    );
  }

  return nonEmptyObject(
    compactObject({
      ...baseline,
      system,
      code: raw,
      display,
    }),
  );
}

function readQuantity(
  answer: IAnswer<"quantity">,
  path: readonly PathSegment[],
  formData: FormData,
): Quantity | undefined {
  const baseline = parseJsonObject<Quantity>(
    normalizeString(getLastString(formData, valueName(path, "baseline"))),
  );
  const raw = normalizeString(
    getLastString(formData, valueName(path, "value")),
  );
  const fromJson = parseJsonObject<Quantity>(raw);
  if (fromJson) {
    return fromJson;
  }

  const readOnlyMirrorRaw = normalizeString(
    getSubmittedReadOnlyMirror(path, formData),
  );
  const readOnlyMirror = parseJsonObject<Quantity>(readOnlyMirrorRaw);
  if (raw === undefined && readOnlyMirror) {
    return readOnlyMirror;
  }

  const value = parseDecimal(raw);
  const rawUnitValues = getStrings(formData, valueName(path, "unit"));
  const submittedSpecifyOtherUnit = rawUnitValues.some((value) =>
    isSpecifyOtherUnitToken(answer, value),
  );
  const unitRaw = normalizeString(rawUnitValues.at(-1));
  rememberSubmittedUnitValues(answer, path, formData);
  const selectedUnit =
    answer.quantity.unitSelection.entries.find(
      (entry) => entry.token === unitRaw,
    )?.coding ?? readSubmittedUnitValue(answer, path, unitRaw, formData);
  const hiddenSystem = normalizeString(
    getLastString(formData, valueName(path, "system")),
  );
  const hiddenCode = normalizeString(
    getLastString(formData, valueName(path, "code")),
  );
  const hiddenDisplay = normalizeString(
    getLastString(formData, valueName(path, "display")),
  );
  const submittedCustomUnitForm = formData.has(customUnitFormName(path));
  const allowCustomUnit =
    answer.question.unitOption.effectiveUnitOpen !== "optionsOnly";
  const supplementalSystem = answer.question.unitOption.supplementalSystem;
  const allowCustomCoding =
    allowCustomUnit &&
    (supplementalSystem === undefined || hiddenSystem === supplementalSystem);
  const isSpecifyOtherUnit = isSpecifyOtherUnitToken(answer, unitRaw);
  const customUnitRaw = isSpecifyOtherUnit ? undefined : unitRaw;
  const hasCustomUnitCoding =
    submittedCustomUnitForm &&
    allowCustomCoding &&
    (hiddenSystem !== undefined ||
      hiddenCode !== undefined ||
      hiddenDisplay !== undefined);
  const preserveSubmittedUnitCoding =
    !submittedCustomUnitForm &&
    selectedUnit === undefined &&
    customUnitRaw !== undefined &&
    hiddenDisplay === customUnitRaw &&
    (hiddenSystem !== undefined || hiddenCode !== undefined);
  const hasUnitCoding = hasCustomUnitCoding || preserveSubmittedUnitCoding;

  if (submittedSpecifyOtherUnit) {
    const unitSelection = answer.quantity.unitSelection;
    unitSelection.select(unitSelection.specifyOtherToken);
    if (hasCustomUnitCoding) {
      unitSelection.setCustomCoding(
        compactObject({
          system: hiddenSystem,
          code: hiddenCode,
          display: hiddenDisplay,
        }),
      );
    } else if (!isSpecifyOtherUnit && customUnitRaw) {
      unitSelection.setCustomText(customUnitRaw);
    }
  }

  const unit = selectedUnit
    ? (selectedUnit.display ?? selectedUnit.code)
    : allowCustomUnit
      ? hasCustomUnitCoding
        ? (hiddenDisplay ?? customUnitRaw ?? hiddenCode)
        : customUnitRaw
      : undefined;
  const system =
    selectedUnit?.system ?? (hasUnitCoding ? hiddenSystem : undefined);
  const code = selectedUnit?.code ?? (hasUnitCoding ? hiddenCode : undefined);

  if (
    value === undefined &&
    unit === undefined &&
    system === undefined &&
    code === undefined &&
    baseline === undefined
  ) {
    return undefined;
  }

  return nonEmptyObject(
    compactObject({
      ...baseline,
      value,
      unit,
      system,
      code,
    }),
  );
}

function rememberSubmittedUnitValues(
  answer: IAnswer<"quantity">,
  path: readonly PathSegment[],
  formData: FormData,
): void {
  readSubmittedUnitValues(answer, path, formData).forEach((coding) => {
    answer.question.unitOption.rememberCustomOption(coding);
  });
}

function readSubmittedUnitValue(
  answer: IAnswer<"quantity">,
  path: readonly PathSegment[],
  token: string | undefined,
  formData: FormData,
): Coding | undefined {
  if (token === undefined) {
    return undefined;
  }

  const coding = parseJsonObject<Coding>(
    normalizeString(getLastString(formData, unitValueName(path, token))),
  );
  return coding && canUseSubmittedUnitValue(answer, coding)
    ? coding
    : undefined;
}

function readSubmittedUnitValues(
  answer: IAnswer<"quantity">,
  path: readonly PathSegment[],
  formData: FormData,
): Coding[] {
  const prefix = `${unitValueNamePrefix(path)}[`;
  const codings: Coding[] = [];
  for (const [name, value] of formData.entries()) {
    if (typeof value !== "string" || !name.startsWith(prefix)) {
      continue;
    }

    const coding = parseJsonObject<Coding>(normalizeString(value));
    if (coding && canUseSubmittedUnitValue(answer, coding)) {
      codings.push(coding);
    }
  }
  return codings;
}

function canUseSubmittedUnitValue(
  answer: IAnswer<"quantity">,
  coding: Coding,
): boolean {
  switch (answer.question.unitOption.effectiveUnitOpen) {
    case "optionsOnly": {
      return false;
    }
    case "optionsOrType": {
      const supplementalSystem = answer.question.unitOption.supplementalSystem;
      return (
        supplementalSystem === undefined || coding.system === supplementalSystem
      );
    }
    case "optionsOrString": {
      if (coding.system !== undefined || coding.code !== undefined) {
        return (
          !answer.question.unitOption.hasOptions &&
          answer.question.unitOption.unitOpen === undefined
        );
      }

      return coding.display !== undefined;
    }
  }
}

function isSpecifyOtherUnitToken(
  answer: IAnswer<"quantity">,
  value: string | undefined,
): value is string {
  return (
    value !== undefined &&
    (value === answer.quantity.unitSelection.specifyOtherToken ||
      value.endsWith("__specify_other_unit"))
  );
}

function readReference(
  path: readonly PathSegment[],
  formData: FormData,
): Reference | undefined {
  const baseline = parseJsonObject<Reference>(
    normalizeString(getLastString(formData, valueName(path, "baseline"))),
  );
  const raw = normalizeString(
    getLastString(formData, valueName(path, "value")),
  );
  const fromJson = parseJsonObject<Reference>(raw);
  if (fromJson) {
    return fromJson;
  }

  const display = normalizeString(
    getLastString(formData, valueName(path, "display")),
  );
  if (!raw && !display && baseline === undefined) {
    return undefined;
  }

  if (!raw && !display) {
    return nonEmptyObject(
      compactObject({
        ...baseline,
        reference: raw,
        display,
      }),
    );
  }

  return nonEmptyObject(
    compactObject({
      ...baseline,
      reference: raw,
      display,
    }),
  );
}

async function readAttachment(
  path: readonly PathSegment[],
  formData: FormData,
): Promise<Attachment | undefined> {
  const name = valueName(path, "value");
  const file = getFiles(formData, name).findLast((entry) =>
    isSubmittedFile(entry),
  );
  if (file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return compactObject({
      data: encodeBase64(bytes),
      contentType: normalizeString(file.type),
      size: file.size,
      title: normalizeString(file.name),
    });
  }

  const raw = normalizeString(getLastString(formData, name));
  return parseJsonObject<Attachment>(raw);
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 32_768;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCodePoint(
      ...bytes.subarray(offset, offset + chunkSize),
    );
  }

  return btoa(binary);
}

function readBoolean(
  path: readonly PathSegment[],
  formData: FormData,
): boolean | undefined {
  const values = getStrings(formData, valueName(path, "value"));
  if (values.some((value) => /^true$/iu.test(value))) {
    return true;
  }
  if (values.some((value) => /^false$/iu.test(value))) {
    return false;
  }
  return undefined;
}

function getActions(formData: FormData): string[] {
  return formData
    .getAll(ACTION_FIELD)
    .filter((value): value is string => typeof value === "string");
}

function getLastString(formData: FormData, name: string): string | undefined {
  return getStrings(formData, name).at(-1);
}

function getStrings(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string");
}

function getFiles(formData: FormData, name: string): File[] {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File);
}

function isSubmittedFile(file: File): boolean {
  return file.name.length > 0 || file.size > 0;
}

function readCount(
  formData: FormData,
  path: readonly PathSegment[],
): number | undefined {
  return parseNonNegativeInteger(getLastString(formData, countName(path)));
}

function readReadOnlyMirrorCount(
  path: readonly PathSegment[],
  formData: FormData,
): number | undefined {
  const base = `${readOnlyName(path)}[i:`;
  let highest = -1;

  for (const name of formData.keys()) {
    if (!name.startsWith(base)) {
      continue;
    }

    const end = name.indexOf("]", base.length);
    const index = parseNonNegativeInteger(
      end === -1 ? undefined : name.slice(base.length, end),
    );
    if (index !== undefined) {
      highest = Math.max(highest, index);
    }
  }

  return highest === -1 ? undefined : highest + 1;
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/u.test(value)) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseInteger(value: string | undefined): number | undefined {
  const parsed = parseDecimal(value);
  return parsed === undefined ? undefined : Math.round(parsed);
}

function parseDecimal(value: string | undefined): number | undefined {
  const normalized = normalizeString(value);
  if (normalized === undefined) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function normalizeString(value: string | undefined): string | undefined {
  return value === undefined || value.length === 0 ? undefined : value;
}

function compactObject<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

function nonEmptyObject<T extends object>(value: T): T | undefined {
  return Object.keys(value).length === 0 ? undefined : value;
}

function parseJsonObject<T extends object>(
  value: string | undefined,
): T | undefined {
  if (!value?.startsWith("{")) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as T)
      : undefined;
  } catch {
    return undefined;
  }
}
