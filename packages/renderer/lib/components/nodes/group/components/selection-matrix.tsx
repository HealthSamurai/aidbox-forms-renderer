import { useMemo } from "react";
import type { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import type {
  AnswerOptionEntry,
  AnswerType,
  IQuestionNode,
} from "../../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  areValuesEqual,
  cloneValue,
  getNodeDescribedBy,
  getNodeLabelId,
  sanitizeForId,
  stringifyValue,
} from "../../../../utils.ts";
import { NodeHelp } from "../../../form/node-help.tsx";
import { NodeLegal } from "../../../form/node-legal.tsx";
import { NodeFlyover } from "../../../form/node-flyover.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { NodesList } from "../../../form/node-list.tsx";
import { AnswerErrors } from "../../question/validation/answer-errors.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNodeLabelParts } from "../../../form/node-text.tsx";

export type SelectionMatrixProps = {
  questions: IQuestionNode[];
};

export const SelectionMatrixTable = observer(function SelectionMatrixTable({
  questions,
}: SelectionMatrixProps) {
  const { SelectionMatrix, EmptyState } = useTheme();
  const model = useMemo(() => buildMatrixModel(questions), [questions]);

  if (questions.length === 0) {
    return <EmptyState>No choice questions available.</EmptyState>;
  }

  if (model.columns.length === 0) {
    return (
      <EmptyState>No answer options available for table layout.</EmptyState>
    );
  }

  const rows = model.rows.map((row) => {
    const labelId = getNodeLabelId(row.question);
    const describedBy = getNodeDescribedBy(row.question);
    const inputName = sanitizeForId(`${row.question.key}-matrix`);
    const detailContentNeeded = hasMatrixDetails(row.question);
    return {
      key: row.question.key,
      header: <MatrixRowHeader question={row.question} />,
      loading: row.question.options.loading,
      cells: model.columns.map((column) => {
        const entry = row.optionMap.get(column.key);
        const cell = buildMatrixCell({
          question: row.question,
          entry,
          inputName,
          columnHeaderId: column.headerId,
          rowHeaderId: labelId,
          describedById: describedBy,
        });
        return {
          key: `${row.question.key}-${column.key}`,
          content: cell.content,
          selected: cell.selected,
          disabled: cell.disabled,
        };
      }),
      details: detailContentNeeded ? (
        <MatrixQuestionDetails question={row.question} />
      ) : null,
    };
  });

  return (
    <SelectionMatrix
      orientation="vertical"
      columns={model.columns.map((column) => ({
        key: column.key,
        headerId: column.headerId,
        label: column.label,
      }))}
      rows={rows}
    />
  );
});

export const SelectionMatrixHorizontalTable = observer(
  function SelectionMatrixHorizontalTable({ questions }: SelectionMatrixProps) {
    const { SelectionMatrix, EmptyState } = useTheme();
    const model = useMemo(() => buildMatrixModel(questions), [questions]);

    if (questions.length === 0) {
      return (
        <EmptyState>
          No choice questions available for horizontal table.
        </EmptyState>
      );
    }

    if (model.columns.length === 0) {
      return (
        <EmptyState>
          No answer options available for horizontal table layout.
        </EmptyState>
      );
    }

    const detailsPresent = questions.some((question) =>
      hasMatrixDetails(question),
    );

    const rows = model.columns.map((column) => ({
      key: column.key,
      header: column.label,
      cells: model.rows.map((row) => {
        const describedBy = getNodeDescribedBy(row.question);
        const cell = buildMatrixCell({
          question: row.question,
          entry: row.optionMap.get(column.key),
          inputName: sanitizeForId(`${row.question.key}-matrix`),
          columnHeaderId: getNodeLabelId(row.question),
          rowHeaderId: column.headerId,
          describedById: describedBy,
        });
        return {
          key: `${row.question.key}-${column.key}`,
          content: cell.content,
          selected: cell.selected,
          disabled: cell.disabled,
        };
      }),
    }));

    const detailsGrid = detailsPresent
      ? model.rows.map((row) => (
          <MatrixQuestionDetails
            key={`${row.question.key}-details`}
            question={row.question}
          />
        ))
      : undefined;

    return (
      <SelectionMatrix
        orientation="horizontal"
        columns={model.rows.map((row) => ({
          key: row.question.key,
          headerId: getNodeLabelId(row.question),
          label: <MatrixRowHeader question={row.question} />,
        }))}
        rows={rows}
        detailsGrid={detailsGrid}
      />
    );
  },
);

type MatrixOptionColumn = {
  key: string;
  label: string;
  headerId: string;
};

type MatrixRow = {
  question: IQuestionNode;
  optionMap: Map<string, AnswerOptionEntry<AnswerType>>;
};

type MatrixModel = {
  columns: MatrixOptionColumn[];
  rows: MatrixRow[];
};

function buildMatrixModel(questions: IQuestionNode[]): MatrixModel {
  const columns: MatrixOptionColumn[] = [];
  const columnMap = new Map<string, MatrixOptionColumn>();
  const rows: MatrixRow[] = [];

  questions.forEach((question, rowIndex) => {
    const optionMap = new Map<string, AnswerOptionEntry<AnswerType>>();
    question.options.entries.forEach((entry, colIndex) => {
      const key = getOptionSignature(question, entry);
      if (!columnMap.has(key)) {
        const headerId = sanitizeForId(
          `af-matrix-col-${rowIndex}-${colIndex}-${columns.length}`,
        );
        const column: MatrixOptionColumn = {
          key,
          label: entry.label,
          headerId,
        };
        columnMap.set(key, column);
        columns.push(column);
      }
      optionMap.set(key, entry);
    });
    rows.push({ question, optionMap });
  });

  return { columns, rows };
}

function getOptionSignature(
  question: IQuestionNode,
  entry: AnswerOptionEntry<AnswerType>,
): string {
  const type = ANSWER_TYPE_TO_DATA_TYPE[question.type];
  const valueLabel = stringifyValue(type, entry.value, entry.label);
  let encodedValue = entry.label;
  try {
    encodedValue = JSON.stringify(entry.value ?? entry.label);
  } catch {
    encodedValue = entry.label;
  }
  return `${type}::${valueLabel}::${encodedValue}`;
}

const MatrixRowHeader = observer(function MatrixRowHeader({
  question,
}: {
  question: IQuestionNode;
}) {
  const { NodeHeader } = useTheme();
  const { labelText, labelId } = getNodeLabelParts(question);
  return (
    <NodeHeader
      label={labelText}
      labelId={labelId}
      required={question.required}
      help={<NodeHelp node={question} />}
      legal={<NodeLegal node={question} />}
      flyover={<NodeFlyover node={question} />}
    />
  );
});

type MatrixCellView = {
  content: ReactNode;
  selected: boolean;
  disabled: boolean;
};

function buildMatrixCell({
  question,
  entry,
  inputName,
  columnHeaderId,
  rowHeaderId,
  describedById,
}: {
  question: IQuestionNode;
  entry: AnswerOptionEntry<AnswerType> | undefined;
  inputName: string;
  columnHeaderId: string;
  rowHeaderId: string;
  describedById?: string | undefined;
}): MatrixCellView {
  if (!entry) {
    return {
      content: "—",
      selected: false,
      disabled: false,
    };
  }

  const dataType = ANSWER_TYPE_TO_DATA_TYPE[question.type];
  const selectedAnswer = question.answers.find((answer) => {
    if (answer.value == null) {
      return false;
    }
    return areValuesEqual(dataType, answer.value, entry.value);
  });
  const isSelected = Boolean(selectedAnswer);
  const inputType = question.repeats ? "checkbox" : "radio";
  const disableNewSelection =
    question.readOnly ||
    question.options.loading ||
    (!isSelected && (entry.disabled || (question.repeats && !question.canAdd)));

  const inputId = sanitizeForId(`${inputName}-${entry.key}`);

  const toggleSelection = () => {
    if (disableNewSelection && !isSelected) {
      return;
    }

    if (question.repeats) {
      if (selectedAnswer) {
        question.removeAnswer(selectedAnswer);
        return;
      }

      if (!question.canAdd) return;
      question.addAnswer(cloneValue(entry.value));
      return;
    }

    const target = question.answers[0];
    if (target) target.setValueByUser(cloneValue(entry.value));
  };

  const ariaLabel = entry.label;

  return {
    content: (
      <input
        type={inputType}
        id={inputId}
        name={inputName}
        checked={isSelected}
        disabled={disableNewSelection && !isSelected}
        aria-labelledby={`${rowHeaderId} ${columnHeaderId}`}
        aria-describedby={describedById}
        aria-label={ariaLabel}
        onChange={toggleSelection}
      />
    ),
    selected: isSelected,
    disabled: disableNewSelection && !isSelected,
  };
}

const MatrixQuestionDetails = observer(function MatrixQuestionDetails({
  question,
}: {
  question: IQuestionNode;
}) {
  const { NodeList, OptionsState } = useTheme();
  const showStatus =
    question.options.loading || Boolean(question.options.error);
  const answers = getVisibleAnswers(question);
  const hasAnswerChildren = answers.some((answer) => answer.nodes.length > 0);
  const hasAnswerIssues = answers.some((answer) => answer.issues.length > 0);

  if (
    !showStatus &&
    !question.hasErrors &&
    !hasAnswerChildren &&
    !hasAnswerIssues
  ) {
    return null;
  }

  const details = [
    showStatus ? (
      <OptionsState
        key={`${question.key}-status`}
        loading={question.options.loading}
        error={question.options.error ?? undefined}
      />
    ) : null,
    <NodeErrors key={`${question.key}-errors`} node={question} />,
    ...answers
      .filter((answer) => answer.nodes.length > 0)
      .map((answer) => (
        <NodesList key={`${answer.key}-children`} nodes={answer.nodes} />
      )),
    ...answers
      .filter((answer) => answer.issues.length > 0)
      .map((answer) => (
        <AnswerErrors key={`${answer.key}-issues`} answer={answer} />
      )),
  ].filter(Boolean);

  if (details.length === 0) {
    return null;
  }

  return <NodeList>{details}</NodeList>;
});

function hasMatrixDetails(question: IQuestionNode): boolean {
  if (
    question.hasErrors ||
    question.options.loading ||
    question.options.error
  ) {
    return true;
  }

  return getVisibleAnswers(question).some(
    (answer) => answer.nodes.length > 0 || answer.issues.length > 0,
  );
}

function getVisibleAnswers(question: IQuestionNode) {
  return question.repeats ? question.answers : question.answers.slice(0, 1);
}
