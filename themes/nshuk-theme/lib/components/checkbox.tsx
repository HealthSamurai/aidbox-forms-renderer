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
  const labelContent = label ?? "";
  const labelNode = hideLabel ? (
    <span className="nhsuk-u-visually-hidden">{labelContent}</span>
  ) : (
    labelContent
  );

  return (
    <div className="nhsuk-checkboxes">
      <div className="nhsuk-checkboxes__item">
        <input
          className="nhsuk-checkboxes__input"
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          onChange={onChange}
        />
        <label
          className="nhsuk-label nhsuk-checkboxes__label"
          htmlFor={inputId}
        >
          {labelNode}
        </label>
      </div>
    </div>
  );
}
