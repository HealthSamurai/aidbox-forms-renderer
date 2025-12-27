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
  const labelContent = label ?? "";
  const labelNode = hideLabel ? (
    <span className="nhsuk-u-visually-hidden">{labelContent}</span>
  ) : (
    labelContent
  );

  return (
    <div className="nhsuk-radios">
      <div className="nhsuk-radios__item">
        <input
          className="nhsuk-radios__input"
          type="radio"
          name={groupName}
          value={value}
          id={inputId}
          checked={checked}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          onChange={onChange}
        />
        <label className="nhsuk-label nhsuk-radios__label" htmlFor={inputId}>
          {labelNode}
        </label>
      </div>
    </div>
  );
}
