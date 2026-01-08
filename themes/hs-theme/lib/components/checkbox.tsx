import { styled } from "@linaria/react";
import { useId } from "react";
import type { CheckboxProps } from "@aidbox-forms/theme";

export function Checkbox({
  id,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
  hideLabel,
}: CheckboxProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const hasLabel = label != null;
  const hideText = Boolean(hideLabel);
  const noLabel = !hasLabel || hideText;

  return (
    <CheckboxLabel data-no-label={noLabel ? "true" : undefined}>
      <input
        id={inputId}
        type="checkbox"
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
    </CheckboxLabel>
  );
}

const CheckboxLabel = styled.label`
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
