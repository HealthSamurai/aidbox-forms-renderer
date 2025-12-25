import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import type { AnswerRenderCallback } from "../answers/answer-renderer.tsx";
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

  const render = useMemo((): AnswerRenderCallback<
    "integer" | "decimal" | "quantity"
  > => {
    return ({ answer, describedById, labelId, setValue }) => {
      const value = getNumericValue(answer.value);
      const { min, max } = answer.bounds;

      const handleChange = (next: number | null) => {
        if (answer.question.type === "quantity") {
          answer.quantity.handleNumberInput(next == null ? "" : String(next));
          return;
        }

        if (answer.question.type === "integer") {
          setValue(next != null ? Math.round(next) : null);
          return;
        }

        setValue(next);
      };

      return (
        <SliderInput
          value={value}
          onChange={handleChange}
          min={getNumericValue(min) ?? undefined}
          max={getNumericValue(max) ?? undefined}
          step={sliderStep}
          disabled={node.readOnly}
          ariaLabelledBy={labelId}
          ariaDescribedBy={describedById}
          lowerLabel={node.lower}
          upperLabel={node.upper}
          unitLabel={node.unitDisplay}
        />
      );
    };
  }, [SliderInput, node, sliderStep]);

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} render={render} />
    </QuestionScaffold>
  );
});
