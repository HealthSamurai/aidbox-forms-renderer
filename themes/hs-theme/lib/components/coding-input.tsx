import { styled } from "@linaria/react";
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
  const systemId = inputId;
  const codeId = inputId ? `${inputId}-code` : undefined;
  const displayId = inputId ? `${inputId}-display` : undefined;

  return (
    <Fields>
      <TextInput
        id={systemId}
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={system}
        onChange={onChangeSystem}
        disabled={disabled}
        placeholder="System (e.g. http://loinc.org)"
      />
      <TextInput
        id={codeId}
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={code}
        onChange={onChangeCode}
        disabled={disabled}
        placeholder="Code"
      />
      <TextInput
        id={displayId}
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={display}
        onChange={onChangeDisplay}
        disabled={disabled}
        placeholder="Display"
      />
    </Fields>
  );
}

const Fields = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
`;
