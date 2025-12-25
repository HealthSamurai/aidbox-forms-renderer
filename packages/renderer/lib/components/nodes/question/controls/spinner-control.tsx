import { observer } from "mobx-react-lite";
import type { ValueControlProps } from "../../../../types.ts";
import { getNumericValue } from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { useCallback } from "react";

export const SpinnerControl = observer(function SpinnerControl({
  answer,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"integer" | "decimal" | "quantity">) {
  const { SpinnerInput } = useTheme();
  const { min, max } = answer.bounds;

  const onChange = useCallback(
    (next: number | null) => {
      if (answer.question.type === "quantity") {
        answer.quantity.handleNumberInput(next == null ? "" : String(next));
        return;
      }

      if (answer.question.type === "integer") {
        answer.setValueByUser(next != null ? Math.round(next) : null);
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
