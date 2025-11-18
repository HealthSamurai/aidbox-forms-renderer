import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../../types.ts";
import type { RowRenderProps } from "../../shared/answer.tsx";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { SliderInput } from "../../../../controls/slider-input.tsx";
import { getNumericBounds, getSliderStepValue } from "../../../../../utils.ts";
import { withInlineUnit } from "./shared.tsx";

type NumericAnswerType = Extract<AnswerType, "integer" | "decimal">;

export const SliderQuestionControl = observer(function SliderQuestionControl({
  node,
}: {
  node: IQuestionNode<NumericAnswerType>;
}) {
  const bounds = getNumericBounds(node.template);
  const sliderStep =
    getSliderStepValue(node.template) ?? (node.type === "integer" ? 1 : 0.1);

  const renderRow = (rowProps: RowRenderProps<NumericAnswerType>) => {
    const handleChange =
      node.type === "integer"
        ? (next: number | null) =>
            rowProps.setValue(next != null ? Math.round(next) : null)
        : rowProps.setValue;

    return withInlineUnit(
      node.unitDisplay,
      <SliderInput
        value={rowProps.value ?? null}
        onChange={handleChange}
        min={bounds.min}
        max={bounds.max}
        step={sliderStep}
        disabled={node.readOnly}
        ariaLabelledBy={rowProps.labelId}
        ariaDescribedBy={rowProps.describedById}
        lowerLabel={node.lower}
        upperLabel={node.upper}
      />,
    );
  };

  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
