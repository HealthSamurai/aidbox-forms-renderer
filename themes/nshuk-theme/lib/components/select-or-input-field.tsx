import type { SelectOrInputFieldProps } from "@aidbox-forms/theme";

export function SelectOrInputField({
  select,
  input,
  inputFooter,
}: SelectOrInputFieldProps) {
  if (select && input) {
    return (
      <div className="nhsuk-form-group">
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-one-third">{select}</div>
          <div className="nhsuk-grid-column-two-thirds">
            {input}
            {inputFooter ? (
              <div className="nhsuk-u-margin-top-2">{inputFooter}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (select) {
    return <div className="nhsuk-form-group">{select}</div>;
  }

  if (input) {
    return (
      <div className="nhsuk-form-group">
        {input}
        {inputFooter ? (
          <div className="nhsuk-u-margin-top-2">{inputFooter}</div>
        ) : null}
      </div>
    );
  }

  return null;
}
