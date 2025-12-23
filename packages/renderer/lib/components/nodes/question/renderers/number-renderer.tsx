import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { IntegerInput } from "../fhir/integer/IntegerInput.tsx";
import { getNumericBounds, getSliderStepValue } from "../../../../utils.ts";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";
import { useTheme } from "../../../../ui/theme.tsx";

export const NumberRenderer = observer(function NumberRenderer({
  node,
}: {
  node: IQuestionNode<"integer">;
}) {
  const { SliderInput, SpinnerInput } = useTheme();
  const bounds = getNumericBounds(node.template);
  const sliderStep =
    getSliderStepValue(node.template) ?? (node.type === "integer" ? 1 : 0.1);

  const renderRow = useMemo((): AnswerRowRenderer<"integer"> => {
    if (node.control === "slider") {
      return (rowProps) => (
        <SliderInput
          value={rowProps.value ?? null}
          onChange={(next: number | null) =>
            rowProps.setValue(next != null ? Math.round(next) : null)
          }
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
    }

    if (node.control === "spinner") {
      return (rowProps) => (
        <SpinnerInput
          value={rowProps.value ?? null}
          onChange={(next: number | null) =>
            rowProps.setValue(next != null ? Math.round(next) : null)
          }
          min={bounds.min}
          max={bounds.max}
          step={sliderStep}
          disabled={node.readOnly}
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          placeholder={node.placeholder}
          unitLabel={node.unitDisplay}
        />
      );
    }

    return (rowProps) => (
      <IntegerInput
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
    <QuestionScaffold
      node={node}
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
