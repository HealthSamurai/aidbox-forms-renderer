import type { Coding } from "fhir/r5";
import { useTheme } from "../../../../../ui/theme.tsx";

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
  const { CodingInput: ThemedCodingInput } = useTheme();
  const coding = value ?? {};
  const handleChange = (field: keyof Coding, nextValue: string) => {
    const draft: Coding = {
      ...coding,
      [field]: nextValue || undefined,
    };
    onChange(pruneCoding(draft));
  };

  return (
    <ThemedCodingInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      system={coding.system ?? ""}
      code={coding.code ?? ""}
      display={coding.display ?? ""}
      onChangeSystem={(next) => handleChange("system", next)}
      onChangeCode={(next) => handleChange("code", next)}
      onChangeDisplay={(next) => handleChange("display", next)}
      disabled={disabled}
    />
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
