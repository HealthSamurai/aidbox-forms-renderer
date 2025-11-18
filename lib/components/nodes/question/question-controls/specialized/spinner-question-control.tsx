import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../../types.ts";
import type { RowRenderProps } from "../../shared/answer.tsx";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { SpinnerInput } from "../../../../controls/spinner-input.tsx";
import { getNumericBounds, getSliderStepValue } from "../../../../../utils.ts";
import { withInlineUnit } from "./shared.tsx";

type NumericAnswerType = Extract<AnswerType, "integer" | "decimal">;

export const SpinnerQuestionControl = observer(function SpinnerQuestionControl({
  node,
}: {
  node: IQuestionNode<NumericAnswerType>;
}) {
  const bounds = getNumericBounds(node.template);
  const spinnerStep =
    getSliderStepValue(node.template) ?? (node.type === "integer" ? 1 : 0.1);

  const renderRow = (rowProps: RowRenderProps<NumericAnswerType>) => {
    const handleChange =
      node.type === "integer"
        ? (next: number | null) =>
            rowProps.setValue(next != null ? Math.round(next) : null)
        : rowProps.setValue;

    return withInlineUnit(
      node.unitDisplay,
      <SpinnerInput
        value={rowProps.value ?? null}
        onChange={handleChange}
        min={bounds.min}
        max={bounds.max}
        step={spinnerStep}
        disabled={node.readOnly}
        ariaLabelledBy={rowProps.labelId}
        ariaDescribedBy={rowProps.describedById}
        placeholder={node.placeholder}
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
