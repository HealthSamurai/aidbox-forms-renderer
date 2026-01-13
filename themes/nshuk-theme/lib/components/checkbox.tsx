import type { CheckboxProperties } from "@aidbox-forms/theme";

export function Checkbox({
  id,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: CheckboxProperties) {
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

  return (
    <div className="nhsuk-checkboxes nhsuk-checkboxes--small" role="group">
      <div className="nhsuk-checkboxes__item">
        <input
          className="nhsuk-checkboxes__input"
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          onChange={onChange}
        />
        {label && (
          <label className="nhsuk-label nhsuk-checkboxes__label" htmlFor={id}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
}
