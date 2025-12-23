import type { CodingInputProps } from "@aidbox-forms/theme";
import { TextInput } from "./text-input.tsx";

export function CodingInput({
  system,
  code,
  display,
  onChangeSystem,
  onChangeCode,
  onChangeDisplay,
  inputId,
  labelId,
  describedById,
  disabled,
}: CodingInputProps) {
  const codeId = inputId ? `${inputId}-code` : undefined;
  const displayId = inputId ? `${inputId}-display` : undefined;

  return (
    <div className="nhsuk-form-group">
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-one-third">
          <TextInput
            id={inputId}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={system}
            onChange={onChangeSystem}
            disabled={disabled}
            placeholder="System (e.g. http://loinc.org)"
          />
        </div>
        <div className="nhsuk-grid-column-one-third">
          <TextInput
            id={codeId}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={code}
            onChange={onChangeCode}
            disabled={disabled}
            placeholder="Code"
          />
        </div>
        <div className="nhsuk-grid-column-one-third">
          <TextInput
            id={displayId}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={display}
            onChange={onChangeDisplay}
            disabled={disabled}
            placeholder="Display"
          />
        </div>
      </div>
    </div>
  );
}
