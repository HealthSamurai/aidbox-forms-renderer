import type { Reference } from "fhir/r5";
import { useTheme } from "../../../../ui/theme.tsx";

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
  const { TextInput } = useTheme();
  const reference = value ?? {};
  const setField = (field: keyof Reference, nextValue: string) => {
    const draft: Reference = {
      ...reference,
      [field]: nextValue || undefined,
    };
    onChange(pruneReference(draft));
  };

  return (
    <div className="af-reference-input">
      <TextInput
        id={inputId}
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={reference.reference ?? ""}
        onChange={(next) => setField("reference", next)}
        disabled={disabled}
        placeholder={placeholder ?? "Resource/type/id"}
      />
      <TextInput
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={reference.display ?? ""}
        onChange={(next) => setField("display", next)}
        disabled={disabled}
        placeholder="Display label"
      />
    </div>
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
