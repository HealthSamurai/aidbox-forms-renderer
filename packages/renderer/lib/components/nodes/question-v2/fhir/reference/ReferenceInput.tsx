import type { Reference } from "fhir/r5";
import { useTheme } from "../../../../../ui/theme.tsx";

export type ReferenceInputProps = {
  value: Reference | null;
  onChange: (value: Reference | null) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function ReferenceInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
}: ReferenceInputProps) {
  const { ReferenceInput: ThemedReferenceInput } = useTheme();
  const reference = value ?? {};
  const setField = (field: keyof Reference, nextValue: string) => {
    const draft: Reference = {
      ...reference,
      [field]: nextValue || undefined,
    };
    onChange(pruneReference(draft));
  };

  return (
    <ThemedReferenceInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      reference={reference.reference ?? ""}
      display={reference.display ?? ""}
      onChangeReference={(next) => setField("reference", next)}
      onChangeDisplay={(next) => setField("display", next)}
      disabled={disabled}
      referencePlaceholder={placeholder ?? "Resource/type/id"}
      displayPlaceholder="Display label"
    />
  );
}

function pruneReference(value: Reference): Reference | null {
  const next: Reference = { ...value };
  (Object.keys(next) as (keyof Reference)[]).forEach((key) => {
    if (next[key] === undefined || next[key] === null || next[key] === "") {
      delete next[key];
    }
  });
  return Object.keys(next).length > 0 ? next : null;
}
