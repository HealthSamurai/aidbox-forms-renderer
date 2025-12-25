import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IAnswerInstance, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";
import { getNumericValue, getSliderStepValue } from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";

type NumericType = "integer" | "decimal" | "quantity";

function isQuantityAnswer(
  answer: IAnswerInstance<NumericType>,
): answer is IAnswerInstance<"quantity"> {
  return answer.question.type === "quantity";
}

export const SpinnerRenderer = observer(function SpinnerRenderer({
  node,
}: {
  node: IQuestionNode<NumericType>;
}) {
  const { SpinnerInput } = useTheme();
  const spinnerStep =
    getSliderStepValue(node.template) ?? (node.type === "integer" ? 1 : 0.1);

  const renderRow = useMemo((): AnswerRowRenderer<NumericType> => {
    return (rowProps) => {
      const isQuantity = isQuantityAnswer(rowProps.answer);
      const value = getNumericValue(rowProps.answer.value);
      const { min, max } = rowProps.answer.bounds;
      const minValue = getNumericValue(min) ?? undefined;
      const maxValue = getNumericValue(max) ?? undefined;

      const handleChange = (next: number | null) => {
        if (isQuantity) {
          rowProps.answer.quantity.handleNumberInput(
            next == null ? "" : String(next),
          );
          return;
        }

        if (rowProps.answer.question.type === "integer") {
          rowProps.setValue(next != null ? Math.round(next) : null);
          return;
        }

        rowProps.setValue(next);
      };

      return (
        <SpinnerInput
          value={value}
          onChange={handleChange}
          min={minValue}
          max={maxValue}
          step={spinnerStep}
          disabled={node.readOnly}
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          placeholder={node.placeholder}
          unitLabel={node.unitDisplay}
        />
      );
    };
  }, [SpinnerInput, node, spinnerStep]);

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} renderRow={renderRow} />
    </QuestionScaffold>
  );
});
