import { observer } from "mobx-react-lite";
import type { OperationOutcomeIssue } from "fhir/r5";
import type { IForm, IPresentableNode } from "../../types.ts";
import { buildId, getIssueMessage } from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";
import type { ErrorSummaryItem } from "@formbox/theme";
import { isGroupListStore } from "../../store/group/group-list-store.ts";
import { isGroupNode } from "../../store/group/group-store.ts";
import { isQuestionNode } from "../../store/question/question-store.ts";

function hasOptions(node: {
  template: { answerOption?: unknown; answerValueSet?: unknown };
  expressionRegistry: { answer?: unknown };
}): boolean {
  return Boolean(
    (Array.isArray(node.template.answerOption) &&
      node.template.answerOption.length > 0) ||
    node.expressionRegistry.answer ||
    node.template.answerValueSet,
  );
}

function isSelectLikeBooleanControl(control: string | undefined): boolean {
  return (
    control === "radio-button" ||
    control === "check-box" ||
    control === "drop-down" ||
    control === "autocomplete" ||
    control === "lookup"
  );
}

function getAnswerControlId(token: string): string {
  return buildId(token, "control");
}

function isMultiSelectQuestion(node: IPresentableNode): boolean {
  if (!isQuestionNode(node)) {
    return false;
  }

  return (
    node.isRepeatingWithoutChildren &&
    (hasOptions(node) ||
      (node.type === "boolean" && isSelectLikeBooleanControl(node.control)))
  );
}

function getQuestionControlId(node: IPresentableNode): string | undefined {
  if (!isQuestionNode(node)) {
    return undefined;
  }

  if (isMultiSelectQuestion(node)) {
    return buildId(node.token, "multi-select");
  }

  const firstAnswer = node.answers.at(0);
  return firstAnswer ? getAnswerControlId(firstAnswer.token) : undefined;
}

function getChildNodes(node: IPresentableNode): IPresentableNode[] {
  if (isGroupListStore(node)) {
    return node.nodes;
  }

  if (isGroupNode(node)) {
    return node.nodes;
  }

  if (isQuestionNode(node)) {
    const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
    return answers.flatMap((answer) => answer.nodes);
  }

  return [];
}

function findFirstControlId(node: IPresentableNode): string | undefined {
  if (node.hidden) {
    return undefined;
  }

  if (isQuestionNode(node)) {
    return getQuestionControlId(node);
  }

  const children = getChildNodes(node);
  for (const child of children) {
    const id = findFirstControlId(child);
    if (id) {
      return id;
    }
  }

  return undefined;
}

function dedupeSummaryItems(items: ErrorSummaryItem[]): ErrorSummaryItem[] {
  const seen = new Set<string>();
  const result: ErrorSummaryItem[] = [];

  for (const item of items) {
    const key = `${item.href ?? ""}::${item.message}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
  }

  return result;
}

function issuesToItems(
  issues: readonly OperationOutcomeIssue[],
  href?: string | undefined,
): ErrorSummaryItem[] {
  return issues
    .filter((issue) => issue.severity === "error" || issue.severity === "fatal")
    .map((issue) => getIssueMessage(issue))
    .filter((message): message is string => message !== undefined)
    .map((message) => ({ message, href }));
}

function collectNodeItems(node: IPresentableNode): ErrorSummaryItem[] {
  if (node.hidden) {
    return [];
  }

  const items: ErrorSummaryItem[] = [];

  const targetControlId = findFirstControlId(node);
  const href = targetControlId ? `#${targetControlId}` : undefined;
  items.push(...issuesToItems(node.issues, href));

  if (isQuestionNode(node)) {
    const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
    const questionHref = (() => {
      const id = getQuestionControlId(node);
      return id ? `#${id}` : undefined;
    })();
    const isMultiSelect = isMultiSelectQuestion(node);

    for (const answer of answers) {
      const answerHref = isMultiSelect
        ? questionHref
        : `#${getAnswerControlId(answer.token)}`;
      items.push(...issuesToItems(answer.issues, answerHref));

      for (const child of answer.nodes) {
        items.push(...collectNodeItems(child));
      }
    }

    return items;
  }

  for (const child of getChildNodes(node)) {
    items.push(...collectNodeItems(child));
  }

  return items;
}

function collectFormItems(store: IForm): ErrorSummaryItem[] {
  const nodes = [
    ...store.headerNodes,
    ...store.contentNodes,
    ...store.footerNodes,
  ];

  return dedupeSummaryItems([
    ...issuesToItems(store.issues),
    ...nodes.flatMap((node) => collectNodeItems(node)),
  ]);
}

export const FormErrors = observer(function FormErrors({
  store,
}: {
  store: IForm;
}) {
  const { ErrorSummary: ThemedErrorSummary } = useTheme();
  const items = collectFormItems(store);
  if (items.length === 0) return;

  return (
    <ThemedErrorSummary
      id={buildId("form", "error-summary")}
      title="There is a problem"
      items={items}
    />
  );
});
