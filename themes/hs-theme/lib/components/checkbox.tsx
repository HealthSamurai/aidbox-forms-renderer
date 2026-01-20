import { styled } from "@linaria/react";
import type { CheckboxProperties } from "@formbox/theme";

export function Checkbox({
  id,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: CheckboxProperties) {
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
