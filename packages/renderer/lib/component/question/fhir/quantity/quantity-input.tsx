import { observer } from "mobx-react-lite";
import { useStrings, type NodePath } from "@formbox/theme";

import type { IAnswer } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { buildId } from "../../../../utilities.ts";
import { QuantityUnitInput } from "./quantity-unit-input.tsx";

export type QuantityInputProperties = {
  answer: IAnswer<"quantity">;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  path?: NodePath | undefined;
};

// todo: avoid direct access to answer
export const QuantityInput = observer(function QuantityInput({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  path,
}: QuantityInputProperties) {
  const strings = useStrings();
  const { InputGroup, NumberInput } = useTheme();
  const { min, max } = answer.bounds;

  const handleValueChange = (nextValue: number | undefined) => {
    answer.quantity.handleNumberInput(
      nextValue === undefined ? "" : String(nextValue),
    );
  };

  return (
    <InputGroup spans={[8, 4]}>
      <NumberInput
        id={id}
        path={path}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={answer.value?.value ?? undefined}
        onChange={handleValueChange}
        disabled={disabled}
        placeholder={placeholder ?? strings.inputs.quantityValuePlaceholder}
        step="any"
        min={min?.value}
        max={max?.value}
      />
      <QuantityUnitInput
        answer={answer}
        id={buildId(id, "unit")}
        path={path}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        disabled={disabled}
      />
    </InputGroup>
  );
});
