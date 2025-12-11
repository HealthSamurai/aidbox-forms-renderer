import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { DecimalInput } from "../inputs/decimal-input.tsx";
import { withInlineUnit } from "../shared.tsx";
import { getNumericBounds, getSliderStepValue } from "../../../../utils.ts";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";
import { useTheme } from "../../../../ui/theme.tsx";

export const DecimalWidget = observer(function DecimalWidget({
  node,
}: {
  node: IQuestionNode<"decimal">;
}) {
  const { SliderInput, SpinnerInput } = useTheme();
  const bounds = getNumericBounds(node.template);
  const sliderStep = getSliderStepValue(node.template) ?? 0.1;

  const renderRow = useMemo((): AnswerRowRenderer<"decimal"> => {
    if (node.control === "slider") {
      return (rowProps) =>
        withInlineUnit(
          node.unitDisplay,
          <SliderInput
            value={rowProps.value ?? null}
            onChange={rowProps.setValue}
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
    }

    if (node.control === "spinner") {
      return (rowProps) =>
        withInlineUnit(
          node.unitDisplay,
          <SpinnerInput
            value={rowProps.value ?? null}
            onChange={rowProps.setValue}
            min={bounds.min}
            max={bounds.max}
            step={sliderStep}
            disabled={node.readOnly}
            ariaLabelledBy={rowProps.labelId}
            ariaDescribedBy={rowProps.describedById}
            placeholder={node.placeholder}
          />,
        );
    }

    return (rowProps) => (
      <DecimalInput
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        placeholder={node.placeholder}
        value={rowProps.value ?? null}
        onChange={rowProps.setValue}
        disabled={node.readOnly}
        unitLabel={node.unitDisplay}
        list={rowProps.list}
      />
    );
  }, [SliderInput, SpinnerInput, bounds.max, bounds.min, node, sliderStep]);

  return (
    <WidgetScaffold
      node={node}
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
