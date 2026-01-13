import { computed, makeObservable } from "mobx";
import type {
  AnswerOption,
  AnswerType,
  IGroupNode,
  IQuestionNode,
  ITable,
  OptionAxisItem,
  OptionToken,
  TableCellState,
} from "../../../types.ts";
import { areValuesEqual } from "../../../utilities.ts";
import { isQuestionNode } from "../../question/question-store.ts";

export class TableStore implements ITable {
  private readonly group: IGroupNode;

  constructor(group: IGroupNode) {
    this.group = group;
    makeObservable(this);
  }

  @computed
  get questions(): IQuestionNode[] {
    return this.group.visibleNodes.filter((node) => isQuestionNode(node));
  }

  @computed
  get optionAxis(): OptionAxisItem[] {
    const optionAxisItems: OptionAxisItem[] = [];
    const seen = new Set<OptionToken>();

    this.questions.forEach((question) => {
      question.answerOption.inherentOptions.forEach((option) => {
        if (!seen.has(option.token)) {
          seen.add(option.token);
          optionAxisItems.push({
            token: option.token,
            answerType: question.type,
            value: option.value,
          });
        }
      });
    });

    return optionAxisItems;
  }

  getCellState(
    question: IQuestionNode,
    optionToken: OptionToken,
  ): TableCellState | undefined {
    const option = this.lookup.get(question.token)?.get(optionToken);
    if (!option) {
      return undefined;
    }

    const selectedAnswer = question.answers.find((answer) => {
      return areValuesEqual(question.dataType, answer.value, option.value);
    });
    const isSelected = Boolean(selectedAnswer);
    const isReadOnly =
      question.readOnly || question.answerOption.select.isLoading;
    const disableNewSelection =
      !isSelected &&
      (option.disabled || (question.repeats && !question.canAdd));

    return {
      selected: isSelected,
      disabled: isReadOnly || disableNewSelection,
    };
  }

  toggleCell(question: IQuestionNode, optionToken: OptionToken): void {
    const option = this.lookup.get(question.token)?.get(optionToken);
    if (!option) return;

    const selectedAnswer = question.answers.find((answer) => {
      return areValuesEqual(question.dataType, answer.value, option.value);
    });

    const isReadOnly =
      question.readOnly || question.answerOption.select.isLoading;
    const disableNewSelection =
      !selectedAnswer &&
      (option.disabled || (question.repeats && !question.canAdd));

    if (isReadOnly || disableNewSelection) {
      return;
    }

    if (question.repeats) {
      if (selectedAnswer) {
        question.removeAnswer(selectedAnswer);
        return;
      }

      if (!question.canAdd) return;
      question.addAnswer(structuredClone(option.value));
      return;
    }

    const target = question.answers[0];
    if (target) target.setValueByUser(structuredClone(option.value));
  }

  @computed
  private get lookup(): Map<
    IQuestionNode["token"],
    Map<OptionToken, AnswerOption<AnswerType>>
  > {
    return new Map(
      this.questions.map((question) => [
        question.token,
        new Map(
          question.answerOption.inherentOptions.map((option) => [
            option.token,
            option,
          ]),
        ),
      ]),
    );
  }
}
