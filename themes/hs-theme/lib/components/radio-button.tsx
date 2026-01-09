import { styled } from "@linaria/react";
import type { RadioButtonProps } from "@aidbox-forms/theme";

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
}: RadioButtonProps) {
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
      {label && <LabelText>{label}</LabelText>}
    </RadioLabel>
  );
}

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const LabelText = styled.span``;
