import { observer } from "mobx-react-lite";
import type { ValueControlProperties } from "../../../types.ts";
import { getNumericValue, getSliderStepValue } from "../../../utilities.ts";
import { useTheme } from "../../../ui/theme.tsx";
import { useCallback } from "react";

export const NumberSliderControl = observer(function SliderControl({
  answer,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"integer" | "decimal">) {
  const { SliderInput } = useTheme();
  const { min, max } = answer.bounds;
  const step =
    getSliderStepValue(answer.question.template) ??
    (answer.question.type === "integer" ? 1 : 0.1);

  const onChange = useCallback(
    (next: number | undefined) => {
      if (answer.question.type === "integer") {
        answer.setValueByUser(next == undefined ? undefined : Math.round(next));
        return;
      }

      answer.setValueByUser(next);
    },
    [answer],
  );

  return (
    <SliderInput
      value={getNumericValue(answer.value)}
      onChange={onChange}
      min={getNumericValue(min) ?? undefined}
      max={getNumericValue(max) ?? undefined}
      step={step}
      disabled={answer.question.readOnly}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      lowerLabel={answer.question.lower}
      upperLabel={answer.question.upper}
      unitLabel={answer.question.unitDisplay}
    />
  );
});
