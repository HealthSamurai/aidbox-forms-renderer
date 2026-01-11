import type { Reference } from "fhir/r5";
import { useTheme } from "../../../../ui/theme.tsx";
import { strings } from "../../../../strings.ts";
import { buildId } from "../../../../utilities.ts";

export type ReferenceInputProperties = {
  value: Reference | undefined;
  onChange: (value: Reference | undefined) => void;
  id: string;
  ariaLabelledBy: string;
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
}: ReferenceInputProperties) {
  const { InputGroup, TextInput } = useTheme();
  const reference = value ?? {};
  const setField = (field: keyof Reference, nextValue: string) => {
    const draft: Reference = {
      ...reference,
      [field]: nextValue || undefined,
    };
    onChange(pruneReference(draft));
  };

  return (
    <InputGroup layout="grid">
      <TextInput
        id={id}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={reference.reference ?? ""}
        onChange={(next) => setField("reference", next)}
        disabled={disabled}
        placeholder={placeholder ?? strings.inputs.referencePlaceholder}
      />
      <TextInput
        id={buildId(id, "display")}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={reference.display ?? ""}
        onChange={(next) => setField("display", next)}
        disabled={disabled}
        placeholder={strings.inputs.referenceDisplayPlaceholder}
      />
    </InputGroup>
  );
}

function pruneReference(value: Reference): Reference | undefined {
  const next: Reference = { ...value };
  (Object.keys(next) as (keyof Reference)[]).forEach((key) => {
    if (
      next[key] === undefined ||
      next[key] === undefined ||
      next[key] === ""
    ) {
      delete next[key];
    }
  });
  return Object.keys(next).length > 0 ? next : undefined;
}
