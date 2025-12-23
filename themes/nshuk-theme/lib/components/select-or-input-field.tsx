import type { SelectOrInputFieldProps } from "@aidbox-forms/theme";

export function SelectOrInputField({ select, input }: SelectOrInputFieldProps) {
  return (
    <div className="nhsuk-form-group">
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-one-third">{select}</div>
        <div className="nhsuk-grid-column-two-thirds">{input}</div>
      </div>
    </div>
  );
}
