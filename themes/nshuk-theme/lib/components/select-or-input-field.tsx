import type { SelectOrInputFieldProps } from "@aidbox-forms/theme";

export function SelectOrInputField({
  input,
  inputFooter,
}: SelectOrInputFieldProps) {
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
