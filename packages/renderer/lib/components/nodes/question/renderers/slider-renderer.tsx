import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IAnswerInstance, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";
import { getNumericBounds, getSliderStepValue } from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";

type NumericType = "integer" | "decimal" | "quantity";

function isQuantityAnswer(
  answer: IAnswerInstance<NumericType>,
): answer is IAnswerInstance<"quantity"> {
  return answer.question.type === "quantity";
}

function getNumericValue(answer: IAnswerInstance<NumericType>): number | null {
  if (isQuantityAnswer(answer)) {
    return answer.value?.value ?? null;
  }

  return answer.value ?? null;
}

export const SliderRenderer = observer(function SliderRenderer({
  node,
}: {
  node: IQuestionNode<NumericType>;
}) {
  const { SliderInput } = useTheme();
  const bounds = getNumericBounds(node.template);
  const sliderStep =
    getSliderStepValue(node.template) ?? (node.type === "integer" ? 1 : 0.1);

  const renderRow = useMemo((): AnswerRowRenderer<NumericType> => {
    return (rowProps) => {
      const isQuantity = isQuantityAnswer(rowProps.answer);
      const value = getNumericValue(rowProps.answer);

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
        <SliderInput
          value={value}
          onChange={handleChange}
          min={bounds.min}
          max={bounds.max}
          step={sliderStep}
          disabled={node.readOnly}
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          lowerLabel={node.lower}
          upperLabel={node.upper}
          unitLabel={node.unitDisplay}
        />
      );
    };
  }, [SliderInput, bounds.max, bounds.min, node, sliderStep]);

  return (
    <QuestionScaffold
      node={node}
      children={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
