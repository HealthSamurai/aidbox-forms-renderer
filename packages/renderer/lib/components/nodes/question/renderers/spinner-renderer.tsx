import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import type { AnswerRenderCallback } from "../answers/answer-renderer.tsx";
import { getNumericValue, getSliderStepValue } from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export const SpinnerRenderer = observer(function SpinnerRenderer({
  node,
}: {
  node: IQuestionNode<"integer" | "decimal" | "quantity">;
}) {
  const { SpinnerInput } = useTheme();
  const step =
    getSliderStepValue(node.template) ?? (node.type === "integer" ? 1 : 0.1);

  const render = useMemo((): AnswerRenderCallback<
    "integer" | "decimal" | "quantity"
  > => {
    return ({ answer, describedById, labelId, setValue }) => {
      const value = getNumericValue(answer.value);
      const { min, max } = answer.bounds;
      const minValue = getNumericValue(min) ?? undefined;
      const maxValue = getNumericValue(max) ?? undefined;

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
        <SpinnerInput
          value={value}
          onChange={handleChange}
          min={minValue}
          max={maxValue}
          step={step}
          disabled={node.readOnly}
          ariaLabelledBy={labelId}
          ariaDescribedBy={describedById}
          placeholder={node.placeholder}
          unitLabel={node.unitDisplay}
        />
      );
    };
  }, [SpinnerInput, node, step]);

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} render={render} />
    </QuestionScaffold>
  );
});
