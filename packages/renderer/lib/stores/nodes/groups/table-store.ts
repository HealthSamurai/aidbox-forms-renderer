import { computed, makeObservable } from "mobx";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IGroupNode,
  IQuestionNode,
  ITableStore,
  OptionAxisItem,
  QuestionAxisEntry,
  QuestionAxisItem,
  QuestionAxisSelection,
  ResolvedAnswerOption,
  TableAxisModel,
  TableCellState,
} from "../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  areValuesEqual,
  getNodeDescribedBy,
  getNodeLabelId,
  tokenify,
} from "../../../utils.ts";
import { isQuestionNode } from "../questions/question-store.ts";

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
  get optionAxis(): OptionAxisItem[] {
    return this.model.optionAxis;
  }

  @computed
  get questionAxis(): QuestionAxisItem[] {
    return this.model.questionAxis.map((entry) => {
      const question = entry.question;
      const ariaLabelledBy = getNodeLabelId(question);
      const ariaDescribedBy = getNodeDescribedBy(question);

      const visibleAnswers = question.repeats
        ? question.answers
        : question.answers.slice(0, 1);
      const hasDetails = visibleAnswers.some(
        (answer) => answer.nodes.length > 0 || answer.issues.length > 0,
      );

      return {
        token: question.token,
        question,
        ariaLabelledBy,
        ariaDescribedBy,
        hasDetails,
      };
    });
  }

  @computed
  get detailQuestions(): IQuestionNode[] {
    return this.questionAxis
      .filter((questionAxis) => questionAxis.hasDetails)
      .map((questionAxis) => questionAxis.question);
  }

  getQuestionSelection(questionToken: string): QuestionAxisSelection {
    const entry = this.questionByToken.get(questionToken);
    if (!entry) {
      return { selectedTokens: new Set(), selectedToken: "" };
    }

    const dataType = ANSWER_TYPE_TO_DATA_TYPE[entry.question.type];
    const selectedTokens = new Set<string>();
    let selectedToken = "";

    this.optionAxis.forEach((option) => {
      const optionEntry = entry.optionMap.get(option.token);
      if (!optionEntry) {
        return;
      }
      const selectedAnswer = entry.question.answers.find((answer) => {
        if (answer.value == null || optionEntry.value == null) {
          return false;
        }
        return areValuesEqual(dataType, answer.value, optionEntry.value);
      });
      if (selectedAnswer) {
        selectedTokens.add(option.token);
        selectedToken = option.token;
      }
    });

    return { selectedTokens, selectedToken };
  }

  getCellState(questionToken: string, optionToken: string): TableCellState {
    const entry = this.questionByToken.get(questionToken);
    if (!entry) {
      return { hasOption: false, selected: false, disabled: false };
    }

    const optionEntry = entry.optionMap.get(optionToken);
    if (!optionEntry) {
      return { hasOption: false, selected: false, disabled: false };
    }

    const dataType = ANSWER_TYPE_TO_DATA_TYPE[entry.question.type];
    const selectedAnswer = entry.question.answers.find((answer) => {
      if (answer.value == null || optionEntry.value == null) {
        return false;
      }
      return areValuesEqual(dataType, answer.value, optionEntry.value);
    });
    const isSelected = Boolean(selectedAnswer);
    const disableNewSelection =
      entry.question.readOnly ||
      entry.question.options.loading ||
      (!isSelected &&
        (optionEntry.disabled ||
          (entry.question.repeats && !entry.question.canAdd)));

    return {
      hasOption: true,
      selected: isSelected,
      disabled: disableNewSelection && !isSelected,
    };
  }

  toggleCell(questionToken: string, optionToken: string): void {
    const entry = this.questionByToken.get(questionToken);
    if (!entry) return;

    const optionEntry = entry.optionMap.get(optionToken);
    if (!optionEntry) return;

    const dataType = ANSWER_TYPE_TO_DATA_TYPE[entry.question.type];
    const selectedAnswer = entry.question.answers.find((answer) => {
      if (answer.value == null || optionEntry.value == null) {
        return false;
      }
      return areValuesEqual(dataType, answer.value, optionEntry.value);
    });
    const isSelected = Boolean(selectedAnswer);
    const disableNewSelection =
      entry.question.readOnly ||
      entry.question.options.loading ||
      (!isSelected &&
        (optionEntry.disabled ||
          (entry.question.repeats && !entry.question.canAdd)));

    if (disableNewSelection && !isSelected) {
      return;
    }

    if (entry.question.repeats) {
      if (selectedAnswer) {
        entry.question.removeAnswer(selectedAnswer);
        return;
      }

      if (!entry.question.canAdd) return;
      entry.question.addAnswer(structuredClone(optionEntry.value));
      return;
    }

    const target = entry.question.answers[0];
    if (target) target.setValueByUser(structuredClone(optionEntry.value));
  }

  @computed
  private get model(): TableAxisModel {
    const optionAxis: OptionAxisItem[] = [];
    const optionMap = new Map<string, OptionAxisItem>();
    const questionAxis: QuestionAxisEntry[] = [];

    this.questions.forEach((question) => {
      const optionEntryMap = new Map<
        string,
        ResolvedAnswerOption<AnswerType>
      >();
      question.options.resolvedOptions.forEach((entry) => {
        if (entry.value == null) {
          return;
        }
        const type = ANSWER_TYPE_TO_DATA_TYPE[question.type];
        const token = tokenify(type, entry.value);

        if (!optionMap.has(token)) {
          const option: OptionAxisItem = {
            token,
            type: question.type,
            value: entry.value as DataTypeToType<
              AnswerTypeToDataType<AnswerType>
            >,
          };
          optionMap.set(token, option);
          optionAxis.push(option);
        }
        optionEntryMap.set(token, entry);
      });
      questionAxis.push({ question, optionMap: optionEntryMap });
    });

    return { optionAxis, questionAxis };
  }

  @computed
  private get questionByToken(): Map<string, QuestionAxisEntry> {
    const map = new Map<string, QuestionAxisEntry>();
    this.model.questionAxis.forEach((entry) =>
      map.set(entry.question.token, entry),
    );
    return map;
  }
}
