import { styled } from "@linaria/react";
import type { RadioButtonProperties } from "@formbox/theme";

export function RadioButton({
  id,
  groupName,
  value,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: RadioButtonProperties) {
  return (
    <RadioLabel>
      <input
        id={id}
        name={groupName}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onChange={onChange}
      />
      {Boolean(label) && <span>{label}</span>}
    </RadioLabel>
  );
}

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;
