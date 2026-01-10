import { observer } from "mobx-react-lite";
import type { ValueControlProperties } from "../../../../types.ts";
import { getNumericValue } from "../../../../utilities.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { useCallback } from "react";

export const NumberSpinnerControl = observer(function SpinnerControl({
  answer,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"integer" | "decimal">) {
  const { SpinnerInput } = useTheme();
  const { min, max } = answer.bounds;

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
    <SpinnerInput
      value={getNumericValue(answer.value)}
      onChange={onChange}
      min={getNumericValue(min) ?? undefined}
      max={getNumericValue(max) ?? undefined}
      step={answer.question.type === "integer" ? 1 : 0.1}
      disabled={answer.question.readOnly}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      unitLabel={answer.question.unitDisplay}
    />
  );
});
