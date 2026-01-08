import { styled } from "@linaria/react";
import { useId } from "react";
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
  hideLabel,
}: RadioButtonProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const hasLabel = label != null;
  const hideText = Boolean(hideLabel);
  const noLabel = !hasLabel || hideText;

  return (
    <RadioLabel data-no-label={noLabel ? "true" : undefined}>
      <input
        id={inputId}
        name={groupName}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onChange={onChange}
      />
      {hasLabel ? (
        <LabelText data-hidden={hideText ? "true" : undefined}>
          {label}
        </LabelText>
      ) : null}
    </RadioLabel>
  );
}

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &[data-no-label="true"] {
    gap: 0;
  }
`;

const LabelText = styled.span`
  &[data-hidden="true"] {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }
`;
