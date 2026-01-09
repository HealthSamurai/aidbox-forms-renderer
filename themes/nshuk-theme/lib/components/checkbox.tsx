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
    <div className="nhsuk-checkboxes">
      <label className="nhsuk-checkboxes__item">
        <input
          className="nhsuk-checkboxes__input"
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          onChange={onChange}
        />
        {label ? (
          <span className="nhsuk-label nhsuk-checkboxes__label">{label}</span>
        ) : null}
      </label>
    </div>
  );
}
