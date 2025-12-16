import type { ReferenceInputProps } from "@aidbox-forms/theme";
import { TextInput } from "./text-input.tsx";

export function ReferenceInput({
  reference,
  display,
  onChangeReference,
  onChangeDisplay,
  inputId,
  labelId,
  describedById,
  disabled,
  referencePlaceholder = "Resource/type/id",
  displayPlaceholder = "Display label",
}: ReferenceInputProps) {
  const displayId = inputId ? `${inputId}-display` : undefined;

  return (
    <div className="nhsuk-form-group">
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-one-third">
          <TextInput
            id={inputId}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={reference}
            onChange={onChangeReference}
            disabled={disabled}
            placeholder={referencePlaceholder}
            withFormGroup={false}
          />
        </div>
        <div className="nhsuk-grid-column-two-thirds">
          <TextInput
            id={displayId}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={display}
            onChange={onChangeDisplay}
            disabled={disabled}
            placeholder={displayPlaceholder}
            withFormGroup={false}
          />
        </div>
      </div>
    </div>
  );
}
