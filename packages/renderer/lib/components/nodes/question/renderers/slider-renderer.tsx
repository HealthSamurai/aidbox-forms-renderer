import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";
import { getNumericValue, getSliderStepValue } from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export const SliderRenderer = observer(function SliderRenderer({
  node,
}: {
  node: IQuestionNode<"integer" | "decimal" | "quantity">;
}) {
  const { SliderInput } = useTheme();
  const sliderStep =
    getSliderStepValue(node.template) ?? (node.type === "integer" ? 1 : 0.1);

  const renderRow = useMemo((): AnswerRowRenderer<
    "integer" | "decimal" | "quantity"
  > => {
    return (rowProps) => {
      const isQuantity = rowProps.answer.question.type === "quantity";
      const value = getNumericValue(rowProps.answer.value);
      const { min, max } = rowProps.answer.bounds;

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
          min={getNumericValue(min) ?? undefined}
          max={getNumericValue(max) ?? undefined}
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
  }, [SliderInput, node, sliderStep]);

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} renderRow={renderRow} />
    </QuestionScaffold>
  );
});
