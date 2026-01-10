import { styled } from "@linaria/react";
import type { CheckboxProps } from "@aidbox-forms/theme";

export function Checkbox({
  id,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: CheckboxProps) {
  return (
    <CheckboxLabel>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onChange={onChange}
      />
      {Boolean(label) && <span>{label}</span>}
    </CheckboxLabel>
  );
}

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;
