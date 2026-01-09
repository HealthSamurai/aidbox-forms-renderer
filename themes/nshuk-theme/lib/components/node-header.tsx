import type { NodeHeaderProps } from "@aidbox-forms/theme";

export function NodeHeader({
  label,
  ariaLabelledBy,
  htmlFor,
  required,
  help,
  legal,
  flyover,
  as = "label",
}: NodeHeaderProps) {
  if (as === "legend") {
    return (
      <div className="nhsuk-label nhsuk-label--xl">
        <div id={ariaLabelledBy}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </div>
        {help}
        {legal}
        {flyover}
      </div>
    );
  }

  const labelFor = as === "label" ? htmlFor : undefined;

  return (
    <div className="nhsuk-form-group">
      <div className="nhsuk-label-wrapper">
        {as === "label" ? (
          <label
            className="nhsuk-label nhsuk-label--m"
            id={ariaLabelledBy}
            htmlFor={labelFor}
          >
            {label}
            {required ? <span aria-hidden="true"> *</span> : null}
          </label>
        ) : (
          <div className="nhsuk-label nhsuk-label--m" id={ariaLabelledBy}>
            {label}
            {required ? <span aria-hidden="true"> *</span> : null}
          </div>
        )}
        {help}
        {legal}
        {flyover}
      </div>
    </div>
  );
}
