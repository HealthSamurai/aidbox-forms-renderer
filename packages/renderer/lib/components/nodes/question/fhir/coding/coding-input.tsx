import type { Coding } from "fhir/r5";
import { useTheme } from "../../../../../ui/theme.tsx";
import { strings } from "../../../../../strings.ts";
import { buildId } from "../../../../../utils.ts";

export type CodingInputProps = {
  value: Coding | null;
  onChange: (value: Coding | null) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

export function CodingInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: CodingInputProps) {
  const { InputGroup, TextInput } = useTheme();
  const coding = value ?? {};
  const handleChange = (field: keyof Coding, nextValue: string) => {
    const draft: Coding = {
      ...coding,
      [field]: nextValue || undefined,
    };
    onChange(pruneCoding(draft));
  };

  return (
    <InputGroup layout="grid">
      <TextInput
        id={id}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={coding.system ?? ""}
        onChange={(next) => handleChange("system", next)}
        disabled={disabled}
        placeholder={strings.inputs.codingSystemPlaceholder}
      />
      <TextInput
        id={id ? buildId(id, "code") : undefined}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={coding.code ?? ""}
        onChange={(next) => handleChange("code", next)}
        disabled={disabled}
        placeholder={strings.inputs.codingCodePlaceholder}
      />
      <TextInput
        id={id ? buildId(id, "display") : undefined}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={coding.display ?? ""}
        onChange={(next) => handleChange("display", next)}
        disabled={disabled}
        placeholder={strings.inputs.codingDisplayPlaceholder}
      />
    </InputGroup>
  );
}

function pruneCoding(value: Coding): Coding | null {
  const next: Coding = { ...value };
  (["system", "code", "display", "version"] as const).forEach((key) => {
    if (!next[key]) {
      delete next[key];
    }
  });
  return Object.keys(next).length > 0 ? next : null;
}
