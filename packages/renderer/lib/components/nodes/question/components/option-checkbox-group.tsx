import "./option-status.css";
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
} from "../../../../utils.ts";
import { AnswerErrors } from "../answer-errors.tsx";

type OptionCheckboxGroupProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  isLoading?: boolean;
};

export const OptionCheckboxGroup = observer(function OptionCheckboxGroup<
  T extends AnswerType,
>({ node, options, isLoading = false }: OptionCheckboxGroupProps<T>) {
  const labelId = getNodeLabelId(node);
  const describedBy = getNodeDescribedBy(node);
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[node.type];

  const findAnswer = (option: AnswerOptionEntry<T>) =>
    node.answers.find(
      (answer) =>
        answer.value && areValuesEqual(dataType, answer.value, option.value),
    );

  const toggleOption = (option: AnswerOptionEntry<T>) => {
    if (node.readOnly || isLoading) return;
    const existing = findAnswer(option);
    if (existing) {
      node.removeAnswer(existing);
      return;
    }
    node.addAnswer(cloneValue(option.value));
  };

  return (
    <div
      className="af-checkbox-control"
      data-readonly={node.readOnly}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => {
        const optionId = sanitizeForId(`${node.key}-option-${index}`);
        const answer = findAnswer(option);
        const isChecked = Boolean(answer);
        const disableNewSelection =
          node.readOnly ||
          isLoading ||
          (!isChecked && (!node.canAdd || option.disabled));

        return (
          <div className="af-checkbox-option" key={option.key}>
            <label className="af-checkbox-option__label">
              <input
                type="checkbox"
                checked={isChecked}
                disabled={disableNewSelection}
                aria-labelledby={`${labelId} ${optionId}`}
                aria-describedby={describedBy}
                onChange={() => toggleOption(option)}
              />
              <span id={optionId}>{option.label}</span>
            </label>
            {answer && <AnswerErrors answer={answer} />}
          </div>
        );
      })}
      {isLoading ? (
        <div className="af-option-status" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
});
