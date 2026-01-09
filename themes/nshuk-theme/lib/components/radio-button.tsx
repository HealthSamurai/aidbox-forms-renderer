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
    <div className="nhsuk-radios">
      <label className="nhsuk-radios__item">
        <input
          className="nhsuk-radios__input"
          type="radio"
          name={groupName}
          value={value}
          id={id}
          checked={checked}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          onChange={onChange}
        />
        {label ? (
          <span className="nhsuk-label nhsuk-radios__label">{label}</span>
        ) : null}
      </label>
    </div>
  );
}
