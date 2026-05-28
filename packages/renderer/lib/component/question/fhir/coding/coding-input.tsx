import type { Coding } from "@formbox/fhir";
import { useStrings, type NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";
import { buildId } from "../../../../utilities.ts";

export type CodingInputProperties = {
  value: Coding | undefined;
  onChange: (value: Coding | undefined) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  supplementalSystem?: string | undefined;
  path?: NodePath | undefined;
};

export function CodingInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  supplementalSystem,
  path,
}: CodingInputProperties) {
  const strings = useStrings();
  const { InputGroup, TextInput } = useTheme();
  const coding = value ?? {};
  const handleChange = (field: keyof Coding, nextValue: string) => {
    if (field === "system" && supplementalSystem != undefined) {
      return;
    }

    const draft: Coding = {
      ...coding,
      [field]: nextValue || undefined,
    };
    if (supplementalSystem != undefined) {
      draft.system = supplementalSystem;
    }
    onChange(pruneCoding(draft));
  };

  return (
    <InputGroup spans={[4, 4, 4]}>
      <TextInput
        id={id}
        path={path}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={coding.system ?? ""}
        onChange={(next) => handleChange("system", next)}
        disabled={Boolean(disabled) || supplementalSystem != undefined}
        placeholder={strings.inputs.codingSystemPlaceholder}
      />
      <TextInput
        id={buildId(id, "code")}
        path={path}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={coding.code ?? ""}
        onChange={(next) => handleChange("code", next)}
        disabled={disabled}
        placeholder={strings.inputs.codingCodePlaceholder}
      />
      <TextInput
        id={buildId(id, "display")}
        path={path}
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

function pruneCoding(value: Coding): Coding | undefined {
  const next: Coding = { ...value };
  (["system", "code", "display", "version"] as const).forEach((key) => {
    if (!next[key]) {
      delete next[key];
    }
  });
  return Object.keys(next).length > 0 ? next : undefined;
}
