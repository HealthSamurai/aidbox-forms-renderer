import type { Coding } from "fhir/r5";
import { useTheme } from "../../../../ui/theme.tsx";

export type CodingInputProps = {
  value: Coding | null;
  onChange: (value: Coding | null) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  disabled?: boolean | undefined;
};

export function CodingInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  disabled,
}: CodingInputProps) {
  const { TextInput } = useTheme();
  const coding = value ?? {};
  const handleChange = (field: keyof Coding, nextValue: string) => {
    const draft: Coding = {
      ...coding,
      [field]: nextValue || undefined,
    };
    onChange(pruneCoding(draft));
  };

  return (
    <div className="af-coding-input">
      <TextInput
        id={inputId}
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={coding.system ?? ""}
        onChange={(next) => handleChange("system", next)}
        disabled={disabled}
        placeholder="System (e.g. http://loinc.org)"
        withFormGroup={false}
      />
      <TextInput
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={coding.code ?? ""}
        onChange={(next) => handleChange("code", next)}
        disabled={disabled}
        placeholder="Code"
        withFormGroup={false}
      />
      <TextInput
        ariaLabelledBy={labelId}
        ariaDescribedBy={describedById}
        value={coding.display ?? ""}
        onChange={(next) => handleChange("display", next)}
        disabled={disabled}
        placeholder="Display"
        withFormGroup={false}
      />
    </div>
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
