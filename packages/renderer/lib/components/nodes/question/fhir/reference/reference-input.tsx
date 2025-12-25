import type { Reference } from "fhir/r5";
import { useTheme } from "../../../../../ui/theme.tsx";

export type ReferenceInputProps = {
  value: Reference | null;
  onChange: (value: Reference | null) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function ReferenceInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: ReferenceInputProps) {
  const { InputGroup, TextInput } = useTheme();
  const reference = value ?? {};
  const setField = (field: keyof Reference, nextValue: string) => {
    const draft: Reference = {
      ...reference,
      [field]: nextValue || undefined,
    };
    onChange(pruneReference(draft));
  };

  const referenceId = id;
  const displayId = id ? `${id}-display` : undefined;

  return (
    <InputGroup layout="grid">
      <TextInput
        id={referenceId}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={reference.reference ?? ""}
        onChange={(next) => setField("reference", next)}
        disabled={disabled}
        placeholder={placeholder ?? "Resource/type/id"}
      />
      <TextInput
        id={displayId}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={reference.display ?? ""}
        onChange={(next) => setField("display", next)}
        disabled={disabled}
        placeholder="Display label"
      />
    </InputGroup>
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
