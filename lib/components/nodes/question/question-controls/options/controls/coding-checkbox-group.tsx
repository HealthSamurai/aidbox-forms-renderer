import "./coding-checkbox-group.css";
import "./option-status.css";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../../types.ts";
import type { AnswerOptionEntry } from "../../../../../../types.ts";
import { NodesList } from "../../../../../form/node-list.tsx";
import { AnswerErrors } from "../../../shared/answer-errors.tsx";
import {
  areValuesEqual,
  cloneValue,
  getNodeDescribedBy,
  getNodeLabelId,
  sanitizeForId,
} from "../../../../../../utils.ts";

export const CodingCheckboxGroup = observer(function CodingCheckboxGroup({
  node,
  options,
  isLoading = false,
}: {
  node: IQuestionNode<"coding">;
  options: ReadonlyArray<AnswerOptionEntry<"coding">>;
  isLoading?: boolean;
}) {
  const labelId = getNodeLabelId(node);
  const describedBy = getNodeDescribedBy(node);

  const findAnswerIndex = (option: AnswerOptionEntry<"coding">) =>
    node.answers.findIndex(
      (answer) =>
        answer.value && areValuesEqual("Coding", answer.value, option.value),
    );

  const toggleOption = (option: AnswerOptionEntry<"coding">) => {
    if (node.readOnly || isLoading) return;
    const currentIndex = findAnswerIndex(option);
    if (currentIndex >= 0) {
      node.removeAnswer(currentIndex);
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
        const answerIndex = findAnswerIndex(option);
        const answer = answerIndex >= 0 ? node.answers[answerIndex] : null;
        const isChecked = answerIndex >= 0;
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
            {answer && answer.nodes.length > 0 && (
              <div className="af-checkbox-option__children">
                <NodesList nodes={answer.nodes} />
              </div>
            )}
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
