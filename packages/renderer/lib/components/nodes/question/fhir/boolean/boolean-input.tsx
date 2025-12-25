import { useTheme } from "../../../../../ui/theme.tsx";

export type BooleanInputProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

const BOOLEAN_OPTIONS = [
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" },
  { key: "unanswered", label: "Unanswered" },
];

export function BooleanInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: BooleanInputProps) {
  const { RadioButtonList } = useTheme();
  const selectedKey =
    value === true ? "yes" : value === false ? "no" : "unanswered";
  const fallbackInputId = id ?? "boolean";
  const fallbackAriaLabelledBy = ariaLabelledBy ?? fallbackInputId;

  return (
    <RadioButtonList
      options={BOOLEAN_OPTIONS}
      value={selectedKey}
      onChange={(key) => {
        if (key === "yes") {
          onChange(true);
        } else if (key === "no") {
          onChange(false);
        } else {
          onChange(null);
        }
      }}
      legacyOption={null}
      id={fallbackInputId}
      ariaLabelledBy={fallbackAriaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={Boolean(disabled)}
    />
  );
}
