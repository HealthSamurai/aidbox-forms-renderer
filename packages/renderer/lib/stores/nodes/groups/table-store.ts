import { computed, makeObservable } from "mobx";
import type {
  AnswerOptionEntry,
  AnswerType,
  ITableStore,
  IGroupNode,
  IPresentableNode,
  IQuestionNode,
} from "../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  areValuesEqual,
  cloneValue,
  getNodeDescribedBy,
  getNodeLabelId,
  sanitizeForId,
  stringifyValue,
} from "../../../utils.ts";
import { isQuestionNode } from "../questions/question-store.ts";

type TableOptionColumn = {
  key: string;
  label: string;
};

type TableRow = {
  question: IQuestionNode;
  optionMap: Map<string, AnswerOptionEntry<AnswerType>>;
};

type TableModel = {
  columns: TableOptionColumn[];
  rows: TableRow[];
};

export type TableCellState = {
  key: string;
  entry: AnswerOptionEntry<AnswerType> | undefined;
  placeholder?: string;
  selected: boolean;
  disabled: boolean;
  toggleSelection?: () => void;
};

export type TableRowState = {
  key: string;
  question: IQuestionNode;
  labelId: string;
  describedBy?: string | undefined;
  inputName: string;
  selectedKey: string;
  selectedKeys: Set<string>;
  cells: TableCellState[];
  hasDetails: boolean;
};

export class TableStore implements ITableStore {
  private readonly group: IGroupNode;

  constructor(group: IGroupNode) {
    this.group = group;
    makeObservable(this);
  }

  @computed
  get questions(): IQuestionNode[] {
    return this.group.visibleNodes.filter(isQuestionNode);
  }

  @computed
  get others(): IPresentableNode[] {
    return this.group.visibleNodes.filter((node) => !isQuestionNode(node));
  }

  @computed
  get columns(): TableOptionColumn[] {
    return this.model.columns;
  }

  @computed
  get rowStates(): TableRowState[] {
    return this.model.rows.map((row) => {
      const labelId = getNodeLabelId(row.question);
      const describedBy = getNodeDescribedBy(row.question);
      const inputName = sanitizeForId(`${row.question.key}-table`);
      const selectedKeys = new Set<string>();
      let selectedKey = "";

      const cells = this.columns.map((column) => {
        const entry = row.optionMap.get(column.key);
        const cell = (() => {
          if (!entry) {
            return {
              placeholder: "—",
              selected: false,
              disabled: false,
            };
          }

          const dataType = ANSWER_TYPE_TO_DATA_TYPE[row.question.type];
          const selectedAnswer = row.question.answers.find((answer) => {
            if (answer.value == null || entry.value == null) {
              return false;
            }
            return areValuesEqual(dataType, answer.value, entry.value);
          });
          const isSelected = Boolean(selectedAnswer);
          const disableNewSelection =
            row.question.readOnly ||
            row.question.options.loading ||
            (!isSelected &&
              (entry.disabled ||
                (row.question.repeats && !row.question.canAdd)));

          const toggleSelection = () => {
            if (disableNewSelection && !isSelected) {
              return;
            }

            if (row.question.repeats) {
              if (selectedAnswer) {
                row.question.removeAnswer(selectedAnswer);
                return;
              }

              if (!row.question.canAdd) return;
              row.question.addAnswer(cloneValue(entry.value));
              return;
            }

            const target = row.question.answers[0];
            if (target) target.setValueByUser(cloneValue(entry.value));
          };

          const isDisabled = disableNewSelection && !isSelected;

          return {
            selected: isSelected,
            disabled: isDisabled,
            toggleSelection,
          };
        })();
        if (cell.selected) {
          selectedKeys.add(column.key);
          selectedKey = column.key;
        }
        return {
          key: column.key,
          entry,
          ...cell,
        };
      });

      const visibleAnswers = row.question.repeats
        ? row.question.answers
        : row.question.answers.slice(0, 1);
      const hasDetails =
        row.question.hasErrors ||
        row.question.options.loading ||
        Boolean(row.question.options.error) ||
        visibleAnswers.some(
          (answer) => answer.nodes.length > 0 || answer.issues.length > 0,
        );

      return {
        key: row.question.key,
        question: row.question,
        labelId,
        describedBy,
        inputName,
        selectedKey,
        selectedKeys,
        cells,
        hasDetails,
      };
    });
  }

  @computed
  get detailQuestions(): IQuestionNode[] {
    return this.rowStates
      .filter((row) => row.hasDetails)
      .map((row) => row.question);
  }

  @computed
  private get model(): TableModel {
    const columns: TableOptionColumn[] = [];
    const columnMap = new Map<string, TableOptionColumn>();
    const rows: TableRow[] = [];

    this.questions.forEach((question) => {
      const optionMap = new Map<string, AnswerOptionEntry<AnswerType>>();
      question.options.entries.forEach((entry) => {
        const type = ANSWER_TYPE_TO_DATA_TYPE[question.type];
        const valueLabel = stringifyValue(type, entry.value, entry.label);
        let encodedValue = entry.label;
        try {
          encodedValue = JSON.stringify(entry.value ?? entry.label);
        } catch {
          encodedValue = entry.label;
        }
        const key = `${type}::${valueLabel}::${encodedValue}`;

        if (!columnMap.has(key)) {
          const column: TableOptionColumn = {
            key,
            label: entry.label,
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
}
