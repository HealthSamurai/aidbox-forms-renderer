import type { RadioButtonProperties } from "@aidbox-forms/theme";

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
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

  return (
    <div className="nhsuk-radios nhsuk-radios--small" role="group">
      <div className="nhsuk-radios__item">
        <input
          className="nhsuk-radios__input"
          type="radio"
          name={groupName}
          value={value}
          id={id}
          checked={checked}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          onChange={onChange}
        />
        {label && (
          <label className="nhsuk-label nhsuk-radios__label" htmlFor={id}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
}
