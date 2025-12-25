import type { NodeHeaderProps } from "@aidbox-forms/theme";

export function NodeHeader({
  label,
  ariaLabelledBy,
  htmlFor,
  required,
  help,
  legal,
  flyover,
}: NodeHeaderProps) {
  return (
    <div className="nhsuk-form-group">
      <div className="nhsuk-label-wrapper">
        <label
          className="nhsuk-label nhsuk-label--m"
          id={ariaLabelledBy}
          htmlFor={htmlFor}
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {help}
        {legal}
        {flyover}
      </div>
    </div>
  );
}
