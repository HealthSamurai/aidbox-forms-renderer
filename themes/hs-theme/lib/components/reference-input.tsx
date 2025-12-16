import { styled } from "@linaria/react";
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
    <Fields>
      <TextInput
        id={inputId}
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={reference}
        onChange={onChangeReference}
        disabled={disabled}
        placeholder={referencePlaceholder}
      />
      <TextInput
        id={displayId}
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={display}
        onChange={onChangeDisplay}
        disabled={disabled}
        placeholder={displayPlaceholder}
      />
    </Fields>
  );
}

const Fields = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
`;
