import "./choice-matrix.css";
import { Fragment, useMemo } from "react";
import { observer } from "mobx-react-lite";
import type {
  AnswerOptionEntry,
  AnswerType,
  IQuestionNode,
} from "../../../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  areValuesEqual,
  cloneValue,
  getNodeDescribedBy,
  getNodeLabelId,
  sanitizeForId,
  stringifyValue,
} from "../../../../../utils.ts";
import { NodeHelp } from "../../../../form/node-help.tsx";
import { NodeLegal } from "../../../../form/node-legal.tsx";
import { NodeFlyover } from "../../../../form/node-flyover.tsx";
import { NodeErrors } from "../../../../form/node-errors.tsx";
import { NodesList } from "../../../../form/node-list.tsx";
import { AnswerErrors } from "../../../question/shared/answer-errors.tsx";

export type ChoiceMatrixProps = {
  questions: IQuestionNode[];
};

export const ChoiceMatrixTable = observer(function ChoiceMatrixTable({
  questions,
}: ChoiceMatrixProps) {
  const model = useMemo(() => buildMatrixModel(questions), [questions]);

  if (questions.length === 0) {
    return (
      <p className="af-choice-matrix__empty">No choice questions available.</p>
    );
  }

  if (model.columns.length === 0) {
    return (
      <p className="af-choice-matrix__empty">
        No answer options available for table layout.
      </p>
    );
  }

  return (
    <div className="af-choice-matrix">
      <table className="af-choice-matrix__table">
        <thead>
          <tr>
            <th scope="col" className="af-choice-matrix__question-header">
              Question
            </th>
            {model.columns.map((column) => (
              <th key={column.key} id={column.headerId} scope="col">
                <span>{column.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {model.rows.map((row) => {
            const labelId = getNodeLabelId(row.question);
            const describedBy = getNodeDescribedBy(row.question);
            const detailContentNeeded = hasMatrixDetails(row.question);
            return (
              <Fragment key={row.question.key}>
                <tr data-loading={row.question.options.loading || undefined}>
                  <th scope="row" id={labelId}>
                    <MatrixRowHeader question={row.question} />
                  </th>
                  {model.columns.map((column) => {
                    return (
                      <td key={`${row.question.key}-${column.key}`}>
                        <MatrixChoiceCell
                          question={row.question}
                          entry={row.optionMap.get(column.key)}
                          inputName={sanitizeForId(
                            `${row.question.key}-matrix`,
                          )}
                          columnHeaderId={column.headerId}
                          rowHeaderId={labelId}
                          describedById={describedBy}
                        />
                      </td>
                    );
                  })}
                </tr>
                {detailContentNeeded ? (
                  <tr className="af-choice-matrix__details-row">
                    <td colSpan={model.columns.length + 1}>
                      <MatrixQuestionDetails question={row.question} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export const ChoiceMatrixHorizontalTable = observer(
  function ChoiceMatrixHorizontalTable({ questions }: ChoiceMatrixProps) {
    const model = useMemo(() => buildMatrixModel(questions), [questions]);

    if (questions.length === 0) {
      return (
        <p className="af-choice-matrix__empty">
          No choice questions available for horizontal table.
        </p>
      );
    }

    if (model.columns.length === 0) {
      return (
        <p className="af-choice-matrix__empty">
          No answer options available for horizontal table layout.
        </p>
      );
    }

    const detailsPresent = questions.some((question) =>
      hasMatrixDetails(question),
    );

    return (
      <div className="af-choice-matrix af-choice-matrix--horizontal">
        <table className="af-choice-matrix__table">
          <thead>
            <tr>
              <th scope="col">Answer option</th>
              {model.rows.map((row) => (
                <th
                  key={row.question.key}
                  id={getNodeLabelId(row.question)}
                  scope="col"
                >
                  <MatrixRowHeader question={row.question} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.columns.map((column) => (
              <tr key={column.key}>
                <th scope="row" id={column.headerId}>
                  {column.label}
                </th>
                {model.rows.map((row) => {
                  const describedBy = getNodeDescribedBy(row.question);
                  const describedByProps = describedBy
                    ? { describedById: describedBy }
                    : {};
                  return (
                    <td key={`${row.question.key}-${column.key}`}>
                      <MatrixChoiceCell
                        question={row.question}
                        entry={row.optionMap.get(column.key)}
                        inputName={sanitizeForId(`${row.question.key}-matrix`)}
                        columnHeaderId={getNodeLabelId(row.question)}
                        rowHeaderId={column.headerId}
                        {...describedByProps}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {detailsPresent ? (
          <div className="af-choice-matrix__details-grid">
            {model.rows.map((row) => (
              <div key={`${row.question.key}-details`}>
                <MatrixQuestionDetails question={row.question} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
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
  return (
    <div className="af-choice-matrix__row-header">
      <div className="af-choice-matrix__row-title">
        {question.prefix ? (
          <span className="af-prefix">{question.prefix} </span>
        ) : null}
        <span>{question.text ?? question.linkId}</span>
        {question.required ? (
          <span className="af-required" aria-hidden="true">
            *
          </span>
        ) : null}
      </div>
      <div className="af-choice-matrix__row-tools">
        <NodeHelp node={question} />
        <NodeLegal node={question} />
        <NodeFlyover node={question} />
      </div>
    </div>
  );
});

const MatrixChoiceCell = observer(function MatrixChoiceCell({
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
}) {
  if (!entry) {
    return (
      <div className="af-choice-matrix__cell af-choice-matrix__cell--empty">
        —
      </div>
    );
  }

  const dataType = ANSWER_TYPE_TO_DATA_TYPE[question.type];
  const selectedIndex = question.answers.findIndex((answer) => {
    if (answer.value == null) {
      return false;
    }
    return areValuesEqual(dataType, answer.value, entry.value);
  });
  const isSelected = selectedIndex >= 0;
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
      if (isSelected) {
        question.removeAnswer(selectedIndex);
        return;
      }

      if (!question.canAdd) {
        return;
      }
      question.addAnswer(cloneValue(entry.value));
      return;
    }

    question.setAnswer(0, cloneValue(entry.value));
  };

  return (
    <div
      className="af-choice-matrix__cell"
      data-selected={isSelected || undefined}
      data-disabled={(disableNewSelection && !isSelected) || undefined}
    >
      <label className="af-choice-matrix__control">
        <input
          type={inputType}
          id={inputId}
          name={inputName}
          checked={isSelected}
          disabled={disableNewSelection && !isSelected}
          aria-labelledby={`${rowHeaderId} ${columnHeaderId}`}
          aria-describedby={describedById}
          onChange={toggleSelection}
        />
        <span className="af-choice-matrix__mark" aria-hidden="true" />
        <span className="sr-only">{entry.label}</span>
      </label>
    </div>
  );
});

const MatrixQuestionDetails = observer(function MatrixQuestionDetails({
  question,
}: {
  question: IQuestionNode;
}) {
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

  return (
    <div className="af-choice-matrix__details">
      {showStatus ? <MatrixOptionStatus question={question} /> : null}
      <NodeErrors node={question} />
      {answers.map((answer) =>
        answer.nodes.length > 0 ? (
          <div
            key={`${answer.key}-children`}
            className="af-choice-matrix__answer-children"
          >
            <NodesList nodes={answer.nodes} />
          </div>
        ) : null,
      )}
      {answers.map((answer) =>
        answer.issues.length > 0 ? (
          <AnswerErrors key={`${answer.key}-errors`} answer={answer} />
        ) : null,
      )}
    </div>
  );
});

const MatrixOptionStatus = observer(function MatrixOptionStatus({
  question,
}: {
  question: IQuestionNode;
}) {
  if (question.options.loading) {
    return (
      <div
        className="af-choice-matrix__status"
        role="status"
        aria-live="polite"
      >
        Loading options…
      </div>
    );
  }

  if (question.options.error) {
    return (
      <div
        className="af-choice-matrix__status af-choice-matrix__status--error"
        role="alert"
      >
        Failed to load options: {question.options.error}
      </div>
    );
  }

  return null;
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
