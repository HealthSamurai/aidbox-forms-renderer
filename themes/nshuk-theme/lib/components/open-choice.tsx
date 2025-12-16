import type { OpenChoiceFieldProps } from "@aidbox-forms/theme";

export function OpenChoiceField({ select, input }: OpenChoiceFieldProps) {
  return (
    <div className="nhsuk-form-group">
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-one-third">{select}</div>
        <div className="nhsuk-grid-column-two-thirds">{input}</div>
      </div>
    </div>
  );
}
